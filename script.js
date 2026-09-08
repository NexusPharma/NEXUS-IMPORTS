const WHATSAPP='595982747177';
const nav=document.querySelector('.nav');
const menuBtn=document.querySelector('.menu-btn');
const tabs=[...document.querySelectorAll('.catalog-tab')];
const categories=[...document.querySelectorAll('.catalog-category')];
const search=document.querySelector('#catalog-search');
const resultCount=document.querySelector('#result-count');
const emptyState=document.querySelector('#empty-state');
const backTop=document.querySelector('#back-top');
let currentCategory='todos';

function setMenu(open){nav?.classList.toggle('open',open);menuBtn?.setAttribute('aria-expanded',String(open));}
menuBtn?.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
document.querySelectorAll('.nav-link').forEach(link=>link.addEventListener('click',()=>setMenu(false)));

document.addEventListener('click',e=>{
  const link=e.target.closest('[data-filter-link]');
  if(!link)return;
  updateCatalog(link.dataset.filterLink||'todos');
});

function updateCatalog(category=currentCategory,term=search?.value.trim().toLowerCase()||''){
  currentCategory=category;
  tabs.forEach(tab=>{const active=tab.dataset.category===category;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});
  let visible=0;
  categories.forEach(section=>{
    const categoryMatch=category==='todos'||section.dataset.category===category;
    let sectionVisible=0;
    section.querySelectorAll('.catalog-product').forEach(product=>{
      const haystack=`${product.dataset.name||''} ${product.dataset.search||''}`.toLowerCase();
      const show=categoryMatch&&(!term||haystack.includes(term));
      product.hidden=!show;if(show){sectionVisible++;visible++;}
    });
    section.hidden=sectionVisible===0;
  });
  if(resultCount)resultCount.textContent=`${visible} ${visible===1?'produto':'produtos'}`;
  if(emptyState)emptyState.hidden=visible!==0;
}

tabs.forEach(tab=>tab.addEventListener('click',()=>updateCatalog(tab.dataset.category)));
search?.addEventListener('input',()=>updateCatalog());

function openWhatsApp(product){
  const message=encodeURIComponent(`Olá! Gostaria de consultar informações sobre ${product} na NEXUS IMPORTS.`);
  window.open(`https://wa.me/${WHATSAPP}?text=${message}`,'_blank','noopener');
}
document.querySelectorAll('.product-action').forEach(button=>button.addEventListener('click',()=>openWhatsApp(button.dataset.wa||'um produto')));

document.querySelectorAll('.primary-btn,.banner-cta').forEach(link=>link.addEventListener('click',()=>setTimeout(()=>document.querySelector('#catalogo')?.scrollIntoView({behavior:'smooth'}),0)));

window.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search?.focus();document.querySelector('#catalogo')?.scrollIntoView({behavior:'smooth'});}
  if(e.key==='Escape')setMenu(false);
});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.section-head,.category-card,.catalog-category,.trust-strip>div').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});

const sectionIds=['inicio','categorias','catalogo'];
const navLinks=[...document.querySelectorAll('.nav-link')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));}),{rootMargin:'-35% 0px -55% 0px'});
sectionIds.forEach(id=>{const el=document.getElementById(id);if(el)sectionObserver.observe(el);});

const mobileLinks=[...document.querySelectorAll('.mobile-bottom-nav a[href^="#"]')];
const mobileObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)mobileLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));}),{rootMargin:'-45% 0px -45% 0px'});
sectionIds.forEach(id=>{const el=document.getElementById(id);if(el)mobileObserver.observe(el);});

window.addEventListener('scroll',()=>backTop?.classList.toggle('show',window.scrollY>700),{passive:true});
backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

updateCatalog('todos');
