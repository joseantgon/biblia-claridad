import {claridadSupabase} from '../assets/supabase-cuenta.js';
const FIELDS=['notes','favorites','highlights','reading_progress'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const clone=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
export function merge3(base,mine,theirs){
 const conflicts=[];
 function walk(b,l,r,path=[]){
  if(same(l,r))return clone(l);
  if(same(l,b))return clone(r);
  if(same(r,b))return clone(l);
  if(obj(l)&&obj(r)){
   const out={};for(const k of new Set([...Object.keys(obj(b)?b:{}),...Object.keys(l),...Object.keys(r)])){
    if(['__proto__','prototype','constructor'].includes(k))continue;
    const v=walk(obj(b)?b[k]:undefined,l[k],r[k],[...path,k]);if(v!==undefined)out[k]=v;
   }return out;
  }
  conflicts.push({path:path.join('.'),base:clone(b),local:clone(l),remote:clone(r)});
  return clone(l);
 }
 return {value:walk(base,mine,theirs),conflicts};
}
export async function readAccount(){
 const {data:{user},error:e}=await claridadSupabase.auth.getUser();if(e)throw e;if(!user)throw Error('Inicia sesión en esta pestaña.');
 const {data,error}=await claridadSupabase.from('reader_data').select('notes,favorites,highlights,reading_progress,updated_at').eq('user_id',user.id).maybeSingle();
 if(error)throw error;return {user,row:data};
}
export async function saveIfUnchanged(expected,proposed){
 const {user,row}=await readAccount();
 if(expected!==row?.updated_at)throw Error('Conflicto: la nube cambió. Vuelve a leer.');
 const payload={};for(const f of FIELDS)if(Object.prototype.hasOwnProperty.call(proposed,f)){if(!obj(proposed[f]))throw Error('Campo inválido: '+f);payload[f]=proposed[f]}
 if(!Object.keys(payload).length)throw Error('Sin cambios');
 let query=row?claridadSupabase.from('reader_data').update(payload).eq('user_id',user.id).eq('updated_at',expected):claridadSupabase.from('reader_data').insert({user_id:user.id,...payload});
 const {data,error}=await query.select('updated_at').maybeSingle();
 if(error)throw error;if(!data)throw Error('Conflicto de versión: escritura rechazada.');
 return data;
}
export function inspectLocal(storage=localStorage){
 const keys=['claridad-study','claridad-year-plan','claridad-reading-days','claridad-pdf-plans','claridad-position'];
 const result={};for(const key of keys){const raw=storage.getItem(key);if(raw!==null){try{result[key]=JSON.parse(raw)}catch{throw Error('JSON local inválido: '+key)}}}
 return result;
}
// No se aplica automáticamente ni se escribe nada al importar este módulo.
