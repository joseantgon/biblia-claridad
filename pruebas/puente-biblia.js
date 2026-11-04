import {readAccount,saveIfUnchanged,merge3,inspectLocal} from './adaptador-supabase.js';
const KEY='claridad-lab-sync-baseline-v1',FIELDS=['notes','favorites','highlights','reading_progress'];
const safe=x=>x&&typeof x==='object'&&!Array.isArray(x);
function extract(s){const notes={},favorites={},highlights={};for(const [k,v] of Object.entries(s['claridad-study']||{})){if(!/^\d+:\d+:\d+(?:[-–]\d+)?$/.test(k)||!safe(v))continue;if(typeof v.note==='string')notes[k]=v.note;if(typeof v.favorite==='boolean')favorites[k]=v.favorite;if(v.highlight!==undefined)highlights[k]=v.highlight;}const reading_progress={};for(const [k,v] of Object.entries(s))if(k!=='claridad-study')reading_progress[k]=v;return {notes,favorites,highlights,reading_progress};}
const baseline=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
const saveBaseline=x=>localStorage.setItem(KEY,JSON.stringify(x));
const display=(x)=>Object.fromEntries(FIELDS.map(k=>[k,safe(x?.[k])?x[k]:{}]));
export async function preview(){const {user,row}=await readAccount();const local=extract(inspectLocal());const remote=display(row);const previous=baseline();if(previous&&previous.user!==user.id)throw Error('Cuenta distinta: no se mezclan datos.');const base=previous?.data||{};const m=merge3(base,local,remote);return {user,row,local,remote,base,merged:m.value,conflicts:m.conflicts};}
export async function syncWithConfirmation(confirmWrite){
 if(!navigator.onLine)throw Error('Sin conexión. Datos locales intactos. Vuelve a intentar cuando haya internet.');
 const state=await preview();
 if(state.conflicts.length) return {status:'conflict',conflicts:state.conflicts};
 if(!confirmWrite) return {status:'preview',state};
 // Persistir solo cuando se confirmó la escritura explícitamente.
 const result=await saveIfUnchanged(state.row?.updated_at, state.merged);
 saveBaseline({user:state.user.id,data:state.merged,version:result.updated_at});
 return {status:'saved',version:result.updated_at};
}
export function watchConnection(callback){window.addEventListener('offline',()=>callback('Sin conexión: guardado local disponible; no se escribe en Supabase.'));window.addEventListener('online',()=>callback('Conexión restablecida: revisa los cambios antes de sincronizar.'));}
