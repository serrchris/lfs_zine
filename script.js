'use strict';
const TOTAL=22;
const src=n=>`pages/${String(n).padStart(2,'0')}.webp`;
const el=id=>document.getElementById(id);
const spreads=[[null,1],...Array.from({length:10},(_,i)=>[i*2+2,i*2+3]),[22,null]];
const narrow=window.matchMedia('(max-width:750px)');
const pageList=Array.from({length:TOTAL},(_,i)=>i+1);
const images=new Map();
const preload=n=>{if(!n||n<1||n>TOTAL)return Promise.resolve();if(!images.has(n)){const img=new Image();img.decoding='async';img.src=src(n);images.set(n,img);}const img=images.get(n);return img.decode?img.decode().catch(()=>{}):Promise.resolve();};
const remembered=()=>{let n=1;try{n=Number(new URL(location.href).searchParams.get('page'))||Number(localStorage.getItem('lfsZinePage'))||1;}catch{}return Math.max(1,Math.min(TOTAL,n));};
let current=remembered(),spreadIndex=spreads.findIndex(pair=>pair.includes(current)),busy=false,drawerOpen=false,zoomCurrent=1;
const left=el('left'),right=el('right'),leaf=el('leaf'),mobile=el('mobileLayer');
const pair=()=>narrow.matches?[null,current]:spreads[spreadIndex];
function pageMarkup(n){return n?`<img src="${src(n)}" draggable="false" alt="Zine page ${n}">`:'';}
function setPage(node,n){if(node.dataset.page===String(n||0))return;node.dataset.page=String(n||0);node.classList.toggle('empty',!n);node.innerHTML=pageMarkup(n);if(n)node.querySelector('img').addEventListener('click',()=>openZoom(n));}
function nearLoad(){const nums=narrow.matches?[current-2,current-1,current,current+1,current+2]:spreads.slice(Math.max(0,spreadIndex-1),spreadIndex+2).flat();for(const n of nums)preload(n);}
function updateURL(){try{localStorage.setItem('lfsZinePage',String(current));const url=new URL(location.href);url.searchParams.set('page',current);history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}}
function render(){const [a,b]=pair();setPage(left,a);setPage(right,b);el('previous').disabled=narrow.matches?current<=1:spreadIndex<=0;el('next').disabled=narrow.matches?current>=TOTAL:spreadIndex>=spreads.length-1;document.querySelectorAll('.thumb').forEach(t=>t.classList.toggle('active',narrow.matches?Number(t.dataset.page)===current:spreads[spreadIndex].includes(Number(t.dataset.page))));updateURL();nearLoad();}
const playAnimation=(node,className,duration)=>new Promise(resolve=>{let finished=false;const done=()=>{if(finished)return;finished=true;node.removeEventListener('animationend',onEnd);resolve();};const onEnd=e=>{if(e.target===node)done();};node.addEventListener('animationend',onEnd);node.classList.add(className);setTimeout(done,duration);});
async function turn(forward){if(busy||!el('zoom').hidden||drawerOpen)return;const nextCurrent=narrow.matches?current+(forward?1:-1):null;const nextIndex=spreadIndex+(forward?1:-1);if(narrow.matches&&(nextCurrent<1||nextCurrent>TOTAL)||!narrow.matches&&(nextIndex<0||nextIndex>=spreads.length))return;
 busy=true;try{
  if(narrow.matches){await preload(nextCurrent);mobile.innerHTML=pageMarkup(nextCurrent);mobile.className='mobile-layer';void mobile.offsetWidth;await playAnimation(mobile,forward?'slide-from-right':'slide-from-left',380);current=nextCurrent;spreadIndex=spreads.findIndex(s=>s.includes(current));setPage(right,current);mobile.className='mobile-layer';mobile.innerHTML='';}
  else{const [fromL,fromR]=spreads[spreadIndex],[toL,toR]=spreads[nextIndex];await Promise.all([preload(toL),preload(toR),preload(fromL),preload(fromR)]);leaf.className='leaf';leaf.style.display='block';leaf.classList.toggle('reverse',!forward);leaf.querySelector('.front').innerHTML=pageMarkup(forward?fromR:fromL||fromR);leaf.querySelector('.back').innerHTML=pageMarkup(forward?toL||toR:toR);setPage(left,toL);setPage(right,toR);void leaf.offsetWidth;await playAnimation(leaf,forward?'go-forward':'go-back',550);leaf.style.display='none';leaf.className='leaf';leaf.querySelector('.front').innerHTML='';leaf.querySelector('.back').innerHTML='';spreadIndex=nextIndex;current=toL||toR;}
  render();
 }finally{busy=false;}
}
function goTo(n){if(busy)return;current=Math.max(1,Math.min(TOTAL,n));spreadIndex=spreads.findIndex(s=>s.includes(current));render();closeDrawer();}
function openDrawer(){if(busy)return;drawerOpen=true;el('drawer').classList.add('open');el('drawer').setAttribute('aria-hidden','false');el('allPages').setAttribute('aria-expanded','true');el('shade').hidden=false;}
function closeDrawer(){drawerOpen=false;el('drawer').classList.remove('open');el('drawer').setAttribute('aria-hidden','true');el('allPages').setAttribute('aria-expanded','false');el('shade').hidden=true;}
function openZoom(n){if(busy)return;zoomCurrent=n;el('zoom').hidden=false;document.body.style.overflow='hidden';refreshZoom();}
function refreshZoom(){el('zoomImg').src=src(zoomCurrent);el('zoomImg').alt=`Zine page ${zoomCurrent}`;el('zoomPrev').disabled=zoomCurrent===1;el('zoomNext').disabled=zoomCurrent===TOTAL;preload(zoomCurrent+1);preload(zoomCurrent-1);}
function closeZoom(){el('zoom').hidden=true;document.body.style.overflow='';}
el('previous').addEventListener('click',()=>turn(false));el('next').addEventListener('click',()=>turn(true));el('allPages').addEventListener('click',()=>drawerOpen?closeDrawer():openDrawer());el('closeDrawer').addEventListener('click',closeDrawer);el('shade').addEventListener('click',closeDrawer);el('closeZoom').addEventListener('click',closeZoom);el('zoomPrev').addEventListener('click',()=>{zoomCurrent=Math.max(1,zoomCurrent-1);refreshZoom()});el('zoomNext').addEventListener('click',()=>{zoomCurrent=Math.min(TOTAL,zoomCurrent+1);refreshZoom()});
const gallery=el('thumbnails');for(const n of pageList){const b=document.createElement('button');b.className='thumb';b.dataset.page=n;b.setAttribute('aria-label',`Go to page ${n}`);b.innerHTML=`<img src="${src(n)}" loading="lazy" alt="">`;b.addEventListener('click',()=>goTo(n));gallery.appendChild(b);}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!el('zoom').hidden)closeZoom();else if(drawerOpen)closeDrawer();return}if(!['ArrowLeft','ArrowRight'].includes(e.key)||drawerOpen)return;e.preventDefault();if(!el('zoom').hidden){zoomCurrent=Math.max(1,Math.min(TOTAL,zoomCurrent+(e.key==='ArrowRight'?1:-1)));refreshZoom();}else turn(e.key==='ArrowRight')});
let tx=0,ty=0;el('book').addEventListener('touchstart',e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY},{passive:true});el('book').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)turn(dx<0)},{passive:true});
let zx=0;el('zoom').addEventListener('touchstart',e=>{zx=e.changedTouches[0].clientX},{passive:true});el('zoom').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-zx;if(Math.abs(dx)>65){zoomCurrent=Math.max(1,Math.min(TOTAL,zoomCurrent+(dx<0?1:-1)));refreshZoom()}},{passive:true});
narrow.addEventListener('change',()=>{if(!busy){spreadIndex=spreads.findIndex(s=>s.includes(current));render()}});
render();
