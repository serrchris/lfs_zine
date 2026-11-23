"use strict";
const TOTAL=22, pageURL=n=>`pages/${String(n).padStart(2,"0")}.webp`;
const $=id=>document.getElementById(id);
const book=$("book"), left=$("leftPage"), right=$("rightPage"), leaf=$("turningLeaf");
const spreads=[[null,1],...Array.from({length:10},(_,i)=>[2+i*2,3+i*2]),[22,null]];
const isMobile=()=>matchMedia("(max-width:750px)").matches;
let index=0, flipping=false, zoomPage=1, contentsOpen=false;
const pageNames={1:"Cover",2:"The history of LFS",6:"School through the years",7:"Teachers tribute",8:"Letter to my younger self",10:"The best trip",11:"Memories",12:"History of sports",16:"A day in the life",18:"Guess the year",20:"Students of LFS",21:"30th anniversary",22:"Back cover"};
const mobilePages=Array.from({length:TOTAL},(_,i)=>i+1);
function readStored(){const url=new URL(location.href), n=Number(url.searchParams.get("page"))||Number(localStorage.getItem("zinePage"))||1;return Math.max(1,Math.min(TOTAL,n));}
let currentPage=readStored();
function spreadFor(p){return spreads.findIndex(s=>s.includes(p));}
index=spreadFor(currentPage);
function state(){if(isMobile())return [null,currentPage];return spreads[index];}
function htmlPage(n){return n?`<img src="${pageURL(n)}" alt="Page ${n} of ${TOTAL}" draggable="false">`:"";}
function setPage(node,n){node.classList.toggle("empty",!n);node.innerHTML=htmlPage(n);if(n)node.querySelector("img").addEventListener("click",()=>openZoom(n));}
function render(){const [a,b]=state();setPage(left,a);setPage(right,b);const min=a||b,max=b||a;
  $("pageDisplay").textContent=(min===1?"COVER":min===22?"BACK COVER":`PAGES ${min}–${max}`)+` · ${max} / ${TOTAL}`;
  $("rangeLabel").textContent=min===1?"Front cover":min===22?"Back cover":min===max?`Page ${min}`:`Pages ${min}–${max}`;
  $("progressFill").style.width=`${(max/TOTAL)*100}%`;
  const atStart=isMobile()?currentPage===1:index===0,atEnd=isMobile()?currentPage===TOTAL:index===spreads.length-1;
  [$("prev"),$("prevSide")].forEach(b=>b.disabled=atStart);[$("next"),$("nextSide")].forEach(b=>b.disabled=atEnd);
  document.querySelectorAll(".thumb").forEach(el=>{const n=Number(el.dataset.page);el.classList.toggle("active",isMobile()?n===currentPage:spreads[index].includes(n));});
  const url=new URL(location.href);url.searchParams.set("page",currentPage);history.replaceState(null,"",url.pathname+url.search+url.hash);localStorage.setItem("zinePage",String(currentPage));
}
function prepareTurn(forward){const mobile=isMobile(),[fromL,fromR]=state();const target=mobile?(currentPage+(forward?1:-1)):index+(forward?1:-1);
  if(mobile&&(target<1||target>TOTAL)||!mobile&&(target<0||target>=spreads.length))return null;
  const [toL,toR]=mobile?[null,target]:spreads[target];return {mobile,target,fromL,fromR,toL,toR};}
function turn(forward){if(flipping||!$("lightbox").hidden)return;const t=prepareTurn(forward);if(!t)return;flipping=true;
  if(forward){setPage(left,t.toL);setPage(right,t.toR);leaf.className="turning-leaf forward";
    leaf.querySelector(".leaf-front").innerHTML=htmlPage(t.fromR);
    leaf.querySelector(".leaf-back").innerHTML=htmlPage(t.toL||t.toR);
  }else{setPage(left,t.toL);setPage(right,t.toR);leaf.className="turning-leaf backward";
    leaf.querySelector(".leaf-front").innerHTML=htmlPage(t.fromL||t.fromR);
    leaf.querySelector(".leaf-back").innerHTML=htmlPage(t.toR);
  }
  leaf.style.display="block";void leaf.offsetWidth;leaf.classList.add("is-flipping");
  const finish=()=>{if(!flipping)return;flipping=false;leaf.style.display="none";leaf.className="turning-leaf";
    if(t.mobile)currentPage=t.target;else {index=t.target;currentPage=spreads[index][0]||spreads[index][1];}render();};
  leaf.addEventListener("animationend",finish,{once:true});setTimeout(finish,800);
}
function goTo(n){if(flipping)return;currentPage=Math.max(1,Math.min(TOTAL,n));index=spreadFor(currentPage);render();closeContents();}
function openContents(){contentsOpen=true;$("contents").classList.add("open");$("contents").setAttribute("aria-hidden","false");$("contentsBtn").setAttribute("aria-expanded","true");$("backdrop").hidden=false;}
function closeContents(){contentsOpen=false;$("contents").classList.remove("open");$("contents").setAttribute("aria-hidden","true");$("contentsBtn").setAttribute("aria-expanded","false");$("backdrop").hidden=true;}
function openZoom(n){zoomPage=n;$("lightbox").hidden=false;document.body.style.overflow="hidden";refreshZoom();}
function refreshZoom(){$("zoomImage").src=pageURL(zoomPage);$("zoomImage").alt=`Page ${zoomPage} of ${TOTAL}`;$("zoomLabel").textContent=`Page ${zoomPage} of ${TOTAL}`;$("zoomPrev").disabled=zoomPage===1;$("zoomNext").disabled=zoomPage===TOTAL;}
function closeZoom(){$("lightbox").hidden=true;document.body.style.overflow="";}
for(const [id,fn] of [["prev",()=>turn(false)],["next",()=>turn(true)],["prevSide",()=>turn(false)],["nextSide",()=>turn(true)],["contentsBtn",()=>contentsOpen?closeContents():openContents()],["closeContents",closeContents],["backdrop",closeContents],["zoomBtn",()=>openZoom(isMobile()?currentPage:(spreads[index][1]||spreads[index][0]))],["closeZoom",closeZoom],["zoomPrev",()=>{zoomPage=Math.max(1,zoomPage-1);refreshZoom();}],["zoomNext",()=>{zoomPage=Math.min(TOTAL,zoomPage+1);refreshZoom();}]])$(id).addEventListener("click",fn);
const gallery=$("thumbList");for(let n=1;n<=TOTAL;n++){const b=document.createElement("button");b.className="thumb";b.dataset.page=n;b.innerHTML=`<img src="${pageURL(n)}" loading="lazy" alt=""><span>${n}. ${pageNames[n]||"Page "+n}</span>`;b.setAttribute("aria-label",`Go to page ${n}`);b.addEventListener("click",()=>goTo(n));gallery.appendChild(b);}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("lightbox").hidden)closeZoom();else closeContents();return;}if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;if(contentsOpen)return;e.preventDefault();const forward=e.key==="ArrowRight";if(!$("lightbox").hidden){zoomPage=Math.max(1,Math.min(TOTAL,zoomPage+(forward?1:-1)));refreshZoom();}else turn(forward);});
let touchX=0,touchY=0;book.addEventListener("touchstart",e=>{touchX=e.changedTouches[0].screenX;touchY=e.changedTouches[0].screenY;},{passive:true});book.addEventListener("touchend",e=>{const x=e.changedTouches[0].screenX-touchX,y=e.changedTouches[0].screenY-touchY;if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y)*1.3)turn(x<0);},{passive:true});
let touchZoomX=0;$("lightbox").addEventListener("touchstart",e=>{touchZoomX=e.changedTouches[0].screenX;},{passive:true});$("lightbox").addEventListener("touchend",e=>{const dx=e.changedTouches[0].screenX-touchZoomX;if(Math.abs(dx)>65){zoomPage=Math.min(TOTAL,Math.max(1,zoomPage+(dx<0?1:-1)));refreshZoom();}},{passive:true});
matchMedia("(max-width:750px)").addEventListener("change",()=>{index=spreadFor(currentPage);render();});
render();
