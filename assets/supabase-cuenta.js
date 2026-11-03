// Biblia Claridad — módulo experimental de cuenta y sincronización.
// No sustituye la aplicación actual. Integrar solo tras pruebas de regresión.
// La clave publishable es pública; nunca incluir service_role ni contraseñas.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const URL = "https://nrvhdelcaljhsvhplxru.supabase.co";
const KEY = "sb_publishable_H3EWYonjnC4ppa6RsAiwmA_P7UQoIiE";
export const claridadSupabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
export async function enviarEnlaceCorreo(email, redirectTo) {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Correo inválido");
  // redirectTo debe estar registrado en Supabase Auth > URL Configuration.
  const options = redirectTo ? { emailRedirectTo: redirectTo } : undefined;
  const { error } = await claridadSupabase.auth.signInWithOtp({ email, options });
  if (error) throw error;
}
export async function obtenerCuenta() {
  const { data, error } = await claridadSupabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
export async function cerrarSesion() {
  const { error } = await claridadSupabase.auth.signOut();
  if (error) throw error;
}
export async function leerDatos() {
  const user = await obtenerCuenta();
  if (!user) throw new Error("Debes iniciar sesión");
  const { data, error } = await claridadSupabase.from("reader_data")
    .select("notes,favorites,highlights,reading_progress,updated_at")
    .eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data;
}
// Escritura inicial: NO sincronizar automáticamente datos locales sin copia
// de seguridad ni resolución de conflictos entre dispositivos.
// expectedUpdatedAt protege frente a sobrescrituras concurrentes de registros
// ya existentes; una inserción nueva solo ocurre si todavía no hay registro.
export async function guardarDatos(datos, expectedUpdatedAt = null) {
  const user = await obtenerCuenta();
  if (!user) throw new Error("Debes iniciar sesión");
  const campos = ["notes","favorites","highlights","reading_progress"];
  const payload = {};
  for (const campo of campos) {
    if (Object.prototype.hasOwnProperty.call(datos, campo)) {
      const valor = datos[campo];
      if (valor === null || typeof valor !== "object" || Array.isArray(valor)) throw new Error("Formato inválido: " + campo);
      payload[campo] = valor;
    }
  }
  if (!Object.keys(payload).length) throw new Error("No hay datos para guardar");
  if (expectedUpdatedAt) {
    const { data, error } = await claridadSupabase.from("reader_data")
      .update(payload).eq("user_id", user.id).eq("updated_at", expectedUpdatedAt)
      .select("updated_at").maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Conflicto: hay cambios más recientes. Vuelve a leer y combina los datos antes de guardar.");
    return data;
  }
  const { data, error } = await claridadSupabase.from("reader_data")
    .insert({ user_id: user.id, ...payload }).select("updated_at").single();
  if (error?.code === "23505") throw new Error("Ya existen datos en la nube; léelos y combina los cambios antes de guardar.");
  if (error) throw error;
  return data;
}
