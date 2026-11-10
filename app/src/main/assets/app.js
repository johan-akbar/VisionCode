const fileInput=document.getElementById('file'), fileName=document.getElementById('fileName'), go=document.getElementById('generate'), statusBox=document.getElementById('status'), results=document.getElementById('results');
let output={html:'',css:'',js:''}, active='html';
fileInput.addEventListener('change',()=>{const f=fileInput.files[0];fileName.textContent=f?`${f.name} · ${(f.size/1024/1024).toFixed(1)} MB`:'No file selected';});
function showCode(){document.getElementById('codeLabel').textContent=active==='html'?'index.html':active==='css'?'style.css':'script.js';document.getElementById('code').textContent=output[active]||'';document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===active));}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.tab;showCode();}));
go.addEventListener('click',async()=>{
 const f=fileInput.files[0]; if(!f){statusBox.textContent='Pilih gambar atau video dulu.';return;}
 if(f.size>40*1024*1024){statusBox.textContent='Ukuran file maksimal 40 MB.';return;}
 go.disabled=true;statusBox.textContent='Mengunggah dan menganalisis referensi…';
 const data=new FormData();data.append('file',f);data.append('instructions',document.getElementById('instructions').value);
 try{
  const base=(window.APP_CONFIG?.API_BASE_URL||'').replace(/\/$/,'');
  if(!base)throw new Error('Backend URL belum diatur di config.js.');
  const res=await fetch(base+'/generate',{method:'POST',body:data});
  const payload=await res.json();if(!res.ok)throw new Error(payload.detail||'Gagal membuat kode.');
  output=payload;document.getElementById('preview').srcdoc=`<!doctype html><html><head><style>${output.css||''}</style></head><body>${output.html||''}<script>${(output.js||'').replace(/<\/script/gi,'<\\/script')}<\/script></body></html>`;
  active='html';showCode();results.classList.remove('hidden');statusBox.textContent='Selesai! Kode berhasil dibuat.';
 }catch(e){statusBox.textContent=e.message||'Terjadi kesalahan. Periksa koneksi dan backend.';}
 finally{go.disabled=false;}
});
document.getElementById('copy').addEventListener('click',async()=>{await navigator.clipboard.writeText(output[active]||'');document.getElementById('copy').textContent='Copied!';setTimeout(()=>document.getElementById('copy').textContent='Copy code',1200);});
document.getElementById('download').addEventListener('click',()=>{const b=new Blob([JSON.stringify(output,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='visioncode-output.json';a.click();URL.revokeObjectURL(a.href);});
