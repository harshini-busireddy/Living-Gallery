async function loadSiteInfo(){
  const res=await fetch('assets/site.json');if(res.ok){const cfg=await res.json();if(cfg.title)document.getElementById('site-title').textContent=cfg.title;if(cfg.tagline)document.getElementById('site-tagline').textContent=cfg.tagline;}
}
function toYmd(d){try{return d.replace(/[^0-9-]/g,'').slice(0,10);}catch(e){return'';}}
function earliestDateStr(post){const ds=Array.isArray(post.dates)?post.dates.map(x=>x.date||x):[];const clean=ds.map(toYmd).filter(Boolean).sort();return clean[0]||'';}
function computeIds(posts){const groups={};posts.forEach(p=>{const d=earliestDateStr(p);if(!groups[d])groups[d]=[];groups[d].push(p);});for(const d in groups){groups[d].forEach((p,i)=>{if(!p.id){const ymd=d.replace(/-/g,'');const idx=String(i+1).padStart(2,'0');p.id=`HB-LG-${ymd}-${idx}`;}if(!p.slug)p.slug=p.id;});}}
function formatDates(post){return(post.dates||[]).map(x=>new Date(x.date||x).toLocaleDateString()).join(', ');}
function pickExcerpt(post){const src=post.excerpt&&post.excerpt.trim()?post.excerpt:(post.html||'');const txt=src.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();return txt.length>200?txt.slice(0,200)+'…':txt;}

(async function(){
 await loadSiteInfo();
 const res=await fetch('assets/posts.json');if(!res.ok){document.getElementById('grid').innerHTML='<p>No posts yet</p>';return;}
 const posts=await res.json();computeIds(posts);
 const tpl=document.getElementById('card-template');const grid=document.getElementById('grid');
 posts.forEach(post=>{
   const node=tpl.content.cloneNode(true);
   node.querySelector('.card-link').href=`post.html?slug=${encodeURIComponent(post.slug)}`;
   node.querySelector('.card-title').textContent=post.title||'';
   node.querySelector('.card-cats').textContent=(post.categories||[]).join(', ');
   node.querySelector('.card-date').textContent=formatDates(post);
   node.querySelector('.card-excerpt').textContent=pickExcerpt(post);
   const wrap=node.querySelector('.swiper-wrapper');
   (post.images||[]).forEach(src=>{const s=document.createElement('div');s.className='swiper-slide';const i=document.createElement('img');i.src=src;s.appendChild(i);wrap.appendChild(s);});
   grid.appendChild(node);
 });
 document.querySelectorAll('.card .swiper').forEach(el=>{new Swiper(el,{pagination:{el:el.querySelector('.swiper-pagination'),clickable:true},navigation:{nextEl:el.querySelector('.swiper-button-next'),prevEl:el.querySelector('.swiper-button-prev')}})});
})();