'use strict';
function showFatal(msg){
  try{
    const el=document.createElement('div');
    el.style.cssText='position:fixed;bottom:14px;left:14px;right:14px;z-index:999;background:#780D1C;color:#fff;padding:12px 16px;border-radius:10px;font:600 13px Manrope,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4)';
    el.textContent='Something went wrong: '+msg;
    document.body.appendChild(el);
  }catch(e){console.error(msg)}
}
window.addEventListener('error',e=>showFatal(e.message));
window.addEventListener('unhandledrejection',e=>showFatal(String(e.reason&&e.reason.message||e.reason)));

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=p=>p+Math.random().toString(36).slice(2,9);
const now=()=>Date.now();
const MIN=6e4, HOUR=36e5, DAY=864e5;
const money=n=>SET().symbol+(Math.round((Number(n)||0)*100)/100).toFixed(2);
const short$=v=>'$'+(v>=1000?(v/1000).toFixed(1)+'k':Math.round(v));
const fmtD=ts=>new Date(ts).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
const fmtDT=ts=>new Date(ts).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
const dkey=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const ago=ts=>{const m=Math.max(1,Math.round((now()-ts)/MIN));return m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' d ago'};
const ic=(n,c='')=>`<i data-lucide="${n}" class="${c}"></i>`;
const icons=()=>{try{window.lucide&&lucide.createIcons()}catch(e){}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const THEME_KEY='ev_theme';
function getTheme(){let t=null;try{t=localStorage.getItem(THEME_KEY)}catch(e){} if(t==='dark'||t==='light')return t; try{return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){return 'light'}}
function isDark(){return document.documentElement.getAttribute('data-theme')==='dark'}
function applyTheme(t){document.documentElement.setAttribute('data-theme',t)}
applyTheme(getTheme());
const themeBtn=()=>'<button class="icon-btn" data-act="theme-toggle" data-theme-btn aria-label="Switch between dark and light theme" title="Switch theme">'+ic(isDark()?'sun':'moon')+'</button>';
async function hash(pw){
  try{
    if(window.crypto&&crypto.subtle){
      const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('ev-salt-'+pw));
      return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
    }
  }catch(e){}
  let h=5381; const s='ev-salt-'+pw; for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))>>>0;
  return 'x'+h.toString(16);
}

const CONTENT_EXTRA={
  aboutHeroTitle:'Born over ember, raised on flavor.',
  aboutExtra:'We refuse shortcuts. Our stocks simmer overnight, our bread proves for two days, and our grills never see gas.',
  philosophyTitle:'Fire is a language. We speak it fluently.',
  philosophyBody:'Charcoal for depth, wood for perfume, patience for everything else. Our chefs cook by sight, sound and smell — the way it was done for centuries before timers existed.',
  values:[
    {title:'Live fire only',desc:'No gas, no microwaves. Every kitchen runs on charcoal and seasoned wood.'},
    {title:'Sourced close',desc:'Produce from farms within 90 miles, fish from day boats, beef from two family ranches.'},
    {title:'Time as an ingredient',desc:'48-hour doughs, overnight stocks, 28-day dry-ages. Slow where it matters.'},
    {title:'Hospitality first',desc:'Same care in a delivery box as at table 9. If it isn\'t right, we make it right.'}
  ],
  aboutCtaTitle:'The story is better in person.',
  aboutCtaText:'Or just as good, in a box on your table in 35 minutes.',
  branchesTitle:'Four rooms. One fire.',
  branchesSubtitle:'Every branch runs its own live-fire kitchen with the full menu.',
  offersTitle:'Live offers',
  offersSubtitle:'Apply the code at checkout. Terms below each deal.',
  contactTitle:'We answer fast.',
  marquee:'Charcoal grill, 48-hour dough, Dry-aged cuts, Wood-fired oven, Sauces from scratch',
  heroMeta:'Delivery in ~35 min, Live-fire kitchen, 4 branches',
  featuredTitle:'Chef\'s featured plates',
  popularTitle:'Popular right now',
  popularSubtitle:'What the city keeps ordering — updated live from our kitchens.',
  quotesTitle:'From our tables',
  ctaTitle:'Hungry? The fire is already lit.',
  ctaText:'Order delivery to your door, or skip the queue with pickup at any branch.'
};
const LABEL_DEFS=[
  {g:'Navigation',k:'nav_home',label:'Nav: Home',def:'Home'},{g:'Navigation',k:'nav_menu',label:'Nav: Menu',def:'Menu'},{g:'Navigation',k:'nav_branches',label:'Nav: Branches',def:'Branches'},
  {g:'Navigation',k:'nav_offers',label:'Nav: Offers',def:'Offers'},{g:'Navigation',k:'nav_about',label:'Nav: About',def:'About'},{g:'Navigation',k:'nav_contact',label:'Nav: Contact',def:'Contact'},
  {g:'Homepage',k:'hero_btn1',label:'Hero button 1',def:'Order now'},{g:'Homepage',k:'hero_btn2',label:'Hero button 2',def:'Explore menu'},
  {g:'Homepage',k:'k_craft',label:'Story label',def:'Our craft'},{g:'Homepage',k:'k_story_btn',label:'Story button',def:'Read our story'},
  {g:'Homepage',k:'k_featured',label:'Featured label',def:'Signature selection'},{g:'Homepage',k:'k_popular',label:'Popular label',def:'Most loved'},
  {g:'Homepage',k:'k_quotes',label:'Reviews label',def:'Guest words'},{g:'Homepage',k:'k_cta',label:'Bottom banner label',def:'Tonight, let us cook'},
  {g:'Homepage',k:'cta_btn1',label:'Bottom banner button 1',def:'Order now'},{g:'Homepage',k:'cta_btn2',label:'Bottom banner button 2',def:'Find a branch'},
  {g:'Menu page',k:'menu_kicker',label:'Menu page label',def:'The full spread'},{g:'Menu page',k:'menu_title',label:'Menu page title',def:'A menu built on live fire.'},
  {g:'Menu page',k:'menu_sub',label:'Menu page subtitle',def:'Search by name, ingredient or craving. Everything is cooked to order.'},
  {g:'Other pages',k:'branches_kicker',label:'Branches page label',def:'Find us'},{g:'Other pages',k:'offers_kicker',label:'Offers page label',def:'Deals worth staying in for'},
  {g:'Other pages',k:'contact_kicker',label:'Contact page label',def:'Say hello'},{g:'Other pages',k:'about_kicker',label:'About page label',def:'Our story'},
  {g:'Other pages',k:'philosophy_kicker',label:'Philosophy label',def:'The philosophy'},{g:'Other pages',k:'values_kicker',label:'Values label',def:'What we stand for'},
  {g:'Other pages',k:'values_title',label:'Values heading',def:'House values'},{g:'Other pages',k:'about_cta_kicker',label:'About banner label',def:'Taste it yourself'},
  {g:'Footer',k:'foot_explore',label:'Footer column 1 heading',def:'Explore'},{g:'Footer',k:'foot_order',label:'Footer column 2 heading',def:'Order'},{g:'Footer',k:'foot_visit',label:'Footer column 3 heading',def:'Visit us'}
];
function L(k){const d=LABEL_DEFS.find(x=>x.k===k);const v=db&&db.content&&db.content.labels&&db.content.labels[k];return(v!==undefined&&v!=='')?v:(d?d.def:k)}
function socialA(kind){
  const h=((SET().social||{})[kind]||'').trim();
  const base={instagram:'https://instagram.com/',facebook:'https://facebook.com/',twitter:'https://x.com/'}[kind];
  const nm={instagram:'Instagram',facebook:'Facebook',twitter:'Twitter / X'}[kind];
  if(!h)return '<a href="#/contact" aria-label="'+nm+'">'+ic(kind)+'</a>';
  const url=/^https?:/.test(h)?h:base+h.replace(/^@/,'');
  return '<a href="'+esc(url)+'" target="_blank" rel="noopener" aria-label="'+nm+'">'+ic(kind)+'</a>';
}
const PIC_SLOTS=[
  {k:'logo',where:'settings',label:'Logo',hint:'Shown in the top bar, footer and dashboards. A transparent PNG works best.',max:420,png:true,fit:'contain'},
  {k:'favicon',where:'settings',label:'Website icon (favicon)',hint:'Square image shown in the browser tab.',max:128,png:true,fit:'contain'},
  {k:'heroImage',where:'content',label:'Homepage hero picture',hint:'The large picture next to the main headline.',max:900,fit:'cover'},
  {k:'aboutImage1',where:'content',label:'About page — picture 1',hint:'Beside the story text.',max:800,fit:'cover'},
  {k:'aboutImage2',where:'content',label:'About page — picture 2',hint:'Beside the philosophy text.',max:800,fit:'cover'}
];
let _stagedPics={};
let _stagedBranchImage;
function picDefaultHTML(k){
  if(k==='logo')return '<span style="color:#fff;font:700 11px Manrope,sans-serif;text-align:center;padding:6px">Default<br>logo</span>';
  if(k==='favicon')return '<img src="'+DEFAULT_FAVICON+'" style="width:100%;height:100%;object-fit:contain">';
  if(k==='heroImage')return heroBurger();
  if(k==='aboutImage1')return aboutSteakPhoto();
  return dishSVG('pizza');
}
function picImgHTML(src,fit){return '<img src="'+src+'" alt="" style="width:100%;height:100%;object-fit:'+(fit||'cover')+';display:block">'}
function setPicPreview(k,src){
  const el=document.querySelector('[data-pic-preview="'+k+'"]'); if(!el)return;
  const sl=PIC_SLOTS.find(x=>x.k===k);
  el.innerHTML=src?picImgHTML(src,sl&&sl.fit):picDefaultHTML(k);
}
function picSlotHTML(sl){
  const cur=(sl.where==='settings'?SET():db.content)[sl.k];
  return '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:14px 0;border-bottom:1px dashed var(--line)">'
  +'<div data-pic-preview="'+sl.k+'" style="width:84px;height:84px;border-radius:10px;overflow:hidden;background:var(--ink);flex:none;display:flex;align-items:center;justify-content:center">'+(cur?picImgHTML(cur,sl.fit):picDefaultHTML(sl.k))+'</div>'
  +'<div style="flex:1;min-width:200px"><b style="font-size:14px">'+esc(sl.label)+'</b><p class="hint" style="margin:2px 0 8px">'+esc(sl.hint)+'</p>'
  +'<div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn btn-line btn-sm" style="cursor:pointer">'+ic('upload')+'Replace image<input type="file" accept="image/*" data-chg="pic-pick" data-slot="'+sl.k+'" style="display:none"></label>'
  +'<button type="button" class="btn btn-sm" style="color:var(--wine)" data-act="pic-remove" data-slot="'+sl.k+'">'+ic('rotate-ccw')+'Use default</button></div></div></div>';
}
function em2(t){const w=String(t||'').trim().split(' ');if(w.length<2)return esc(t);const last=w.pop();return esc(w.join(' '))+' <em>'+esc(last)+'</em>'}
function listOf(t){return String(t||'').split(',').map(x=>x.trim()).filter(Boolean)}
const DEFAULT_FAVICON='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="%23131215"/><path d="M16 6c2 5-5 6-3 12 1 3 3 4 3 4s-6 0-7-6c-1-5 5-6 7-10zm0 20s6-1 6-7c0-3-2-5-3-6 1 4-4 5-3 9 .4 1.7 1.6 2.9 3 4h-3z" fill="%23E6002B"/></svg>';
function applyFavicon(){
  let link=document.querySelector('link[rel="icon"]');
  if(!link){link=document.createElement('link');link.rel='icon';document.head.appendChild(link);}
  link.href=(db&&db.settings&&db.settings.favicon)||DEFAULT_FAVICON;
}
let _stagedFavicon;
const TYPE_LIST=['burger','pizza','steak','chicken','wings','sandwich','pasta','rice','fries','calamari','bruschetta','lava','cheesecake','tiramisu','lemonade','cooler','espresso'];
const MOD_GROUPS={
  size:{name:'Size',type:'single',opts:[{n:'Regular',p:0},{n:'Large',p:3}]},
  extras:{name:'Extras',type:'multi',opts:[{n:'Extra cheese',p:1.5},{n:'Extra sauce',p:1},{n:'Smoked bacon',p:2.5},{n:'Avocado',p:2}]},
  spice:{name:'Spice level',type:'single',opts:[{n:'Mild',p:0},{n:'Medium',p:0},{n:'Hot',p:0}]}
};
const CAT_MODS={c1:['extras','spice'],c2:['size','extras','spice'],c3:['extras','spice'],c4:['extras'],c5:['extras'],c6:['extras','spice'],c7:['extras'],c8:[],c9:['size']};
function pizzaSizes(p){return (p.sizes&&p.sizes.length)?p.sizes:[{name:'Regular',price:p.price}];}
const ZONES=[
  {n:'City Center',lat:40.7120,lng:-74.0040},{n:'Riverside',lat:40.7310,lng:-73.9920},
  {n:'Northgate',lat:40.7570,lng:-73.9650},{n:'Harbor District',lat:40.7010,lng:-74.0170},
  {n:'Old Quarter',lat:40.7200,lng:-74.0000},{n:'Westfield Heights',lat:40.7420,lng:-74.0100}
];
const FLOW={delivery:['Pending','Confirmed','Preparing','Out for Delivery','Completed'],takeaway:['Pending','Confirmed','Preparing','Ready for Pickup','Completed']};
const STC={'Pending':'#96959A','Confirmed':'#131215','Preparing':'#780D1C','Out for Delivery':'#E6002B','Ready for Pickup':'#E6002B','Completed':'#3E6B4F','Cancelled':'#6B6B6E'};

async function seedDB(){
  const P=(id,cat,name,price,type,prep,rating,desc,ing,featured,popular)=>({id,cat,name,price,type,prep,rating,desc,ing,featured:!!featured,popular:!!popular,available:true});
  const products=[
    P('p1','c1','Margherita di Bufala',16.5,'pizza',18,4.8,'48-hour fermented crust, San Marzano tomato, fior di latte, torn basil and cold-pressed olive oil.','Wheat flour, San Marzano tomato, buffalo mozzarella, basil, olive oil',1,0),
    P('p2','c1','Diavola Piccante',18,'pizza',18,4.7,'Spicy soppressata, Calabrian chili honey and smoked mozzarella on a wood-blistered base.','Soppressata, chili honey, smoked mozzarella, oregano',0,1),
    P('p3','c1','Truffle Funghi',21,'pizza',20,4.9,'Wild mushrooms, black truffle cream, taleggio and thyme. Our most ordered pizza.','Mushrooms, black truffle, taleggio, thyme, mozzarella',1,0),
    P('p4','c2','The Ember Classic',14,'burger',14,4.9,'Charcoal-grilled beef, aged cheddar, house ember sauce and pickles on a toasted brioche.','Beef, aged cheddar, ember sauce, pickle, brioche',1,1),
    P('p5','c2','Smokehouse Bacon',17,'burger',15,4.7,'Hickory bacon, bourbon BBQ glaze, crispy onion and smoked gouda.','Beef, hickory bacon, bourbon BBQ, onion, gouda',0,1),
    P('p6','c2','Black Truffle Burger',22,'burger',16,4.8,'Wagyu blend, truffle aioli, melted gruyere and wild rocket on a charcoal bun.','Wagyu, truffle aioli, gruyere, rocket',0,0),
    P('p7','c3','Charcoal Half Chicken',19,'chicken',25,4.8,'12-hour brine, smoked paprika glaze, charred lemon and grilled herbs.','Chicken, paprika, garlic, lemon, herbs',1,0),
    P('p8','c3','Fire-Glazed Wings (8)',12,'wings',16,4.6,'Calabrian chili glaze, whipped blue cheese, celery hearts.','Chicken wings, Calabrian chili, blue cheese',0,1),
    P('p9','c3','Crispy Chicken Sandwich',13,'sandwich',13,4.5,'Buttermilk-brined thigh, hot honey slaw and pickled jalapeno.','Chicken, buttermilk, hot honey, slaw',0,0),
    P('p10','c4','Wild Mushroom Tagliatelle',18,'pasta',20,4.8,'Hand-cut pasta, porcini cream, pecorino and brown butter.','Tagliatelle, porcini, cream, pecorino',0,1),
    P('p11','c4','Lobster Linguine',28,'pasta',24,4.9,'Butter-poached lobster, light bisque, chili crumbs and lemon.','Lobster, linguine, bisque, chili, lemon',1,0),
    P('p12','c4','Arrabbiata Vera',14,'pasta',17,4.4,'San Marzano, confit garlic, Calabrian chili and fresh basil.','Pasta, tomato, garlic, chili, basil',0,0),
    P('p13','c5','Ribeye 400g',38,'steak',28,4.9,'28-day dry-aged, ember salt, bone-marrow butter over live fire.','Ribeye, ember salt, bone-marrow butter',1,1),
    P('p14','c5','Filet Mignon 250g',42,'steak',26,4.8,'Grass-fed tenderloin, red wine jus, smoked garlic cloves.','Tenderloin, red wine jus, garlic',0,0),
    P('p15','c5','Striploin & Herb Butter',32,'steak',26,4.7,'Pasture-raised striploin, smoked garlic-herb butter, fire-roasted shallot.','Striploin, herb butter, shallot',0,0),
    P('p16','c6','Korean Beef Bibimbap',17,'rice',18,4.7,'Stone-bowl rice, soy-glazed bulgogi, gochujang, farm egg and sesame.','Rice, bulgogi, gochujang, egg, sesame',0,1),
    P('p17','c6','Teriyaki Salmon Bowl',20,'rice',19,4.6,'Glazed salmon, sushi rice, sesame slaw and furikake.','Salmon, rice, teriyaki, slaw, furikake',0,0),
    P('p18','c6','Ayam Goreng Rice',15,'rice',17,4.5,'Crispy fried chicken, sambal, pickles and serunding over jasmine rice.','Chicken, sambal, rice, pickle, coconut',0,0),
    P('p19','c7','Truffle Parmesan Fries',9,'fries',10,4.8,'Hand-cut fries, truffle oil, aged parmesan and chives.','Potato, truffle oil, parmesan, chives',0,1),
    P('p20','c7','Crispy Calamari',12,'calamari',12,4.5,'Light semolina crust, lemon aioli, smoked salt and parsley.','Squid, semolina, lemon aioli',0,0),
    P('p21','c7','Bruschetta Trio',10,'bruschetta',11,4.4,'Heirloom tomato, wild mushroom and whipped ricotta-honey on charred sourdough.','Sourdough, tomato, mushroom, ricotta, honey',0,0),
    P('p22','c8','Molten Chocolate Lava',11,'lava',14,4.9,'70% single-origin chocolate, salted caramel gelato, cocoa nib.','Dark chocolate, butter, egg, caramel gelato',1,1),
    P('p23','c8','Basque Burnt Cheesecake',10,'cheesecake',12,4.7,'Caramelized top, custard center, berry compote.','Cream cheese, egg, cream, berries',0,0),
    P('p24','c8','Tiramisu Classico',11,'tiramisu',10,4.6,'Espresso-soaked savoiardi, mascarpone cream, dark cocoa.','Mascarpone, espresso, savoiardi, cocoa',0,0),
    P('p25','c9','Ember Signature Lemonade',6,'lemonade',5,4.7,'Smoked lemon, rosemary syrup and sparkling water over crushed ice.','Lemon, rosemary, sparkling water',0,1),
    P('p26','c9','Berry Hibiscus Cooler',7,'cooler',5,4.5,'Hibiscus, blackberry, lime and soda. Deep ruby and barely sweet.','Hibiscus, blackberry, lime, soda',0,0),
    P('p27','c9','Double Espresso',4,'espresso',4,4.6,'Dark-roast single origin, pulled short with a hazelnut crema.','Coffee',0,0)
  ];
  products.forEach(p=>{if(p.cat==='c1')p.sizes=[{name:'Regular',price:p.price},{name:'Large',price:+(p.price+3).toFixed(2)}];});
  const branches=[
    {id:'b1',name:'Downtown Flagship',address:'18 Charcoal Row, City Center',phone:'+1 (555) 010-0101',email:'downtown@emberandvine.com',lat:40.7128,lng:-74.0060,open:'11:00',close:'23:00',delivery:true,takeaway:true,radius:5,fee:2.99,status:true},
    {id:'b2',name:'Riverside',address:'42 Millrace Quay, Riverside',phone:'+1 (555) 010-0102',email:'riverside@emberandvine.com',lat:40.7300,lng:-73.9920,open:'12:00',close:'22:30',delivery:true,takeaway:true,radius:4,fee:3.49,status:true},
    {id:'b3',name:'Northgate Mall',address:'7 Ember Lane, Northgate Mall',phone:'+1 (555) 010-0103',email:'northgate@emberandvine.com',lat:40.7550,lng:-73.9700,open:'10:00',close:'22:00',delivery:true,takeaway:true,radius:6,fee:2.49,status:true},
    {id:'b4',name:'Harbor District',address:'91 Saltpier Boulevard, Harbor District',phone:'+1 (555) 010-0104',email:'harbor@emberandvine.com',lat:40.7000,lng:-74.0170,open:'12:00',close:'22:00',delivery:false,takeaway:true,radius:3.5,fee:3.99,status:true}
  ];
  const categories=[
    {id:'c1',name:'Pizza',type:'pizza',status:true,order:1},{id:'c2',name:'Burgers',type:'burger',status:true,order:2},
    {id:'c3',name:'Chicken',type:'chicken',status:true,order:3},{id:'c4',name:'Pasta',type:'pasta',status:true,order:4},
    {id:'c5',name:'Steak',type:'steak',status:true,order:5},{id:'c6',name:'Rice Bowls',type:'rice',status:true,order:6},
    {id:'c7',name:'Appetizers',type:'bruschetta',status:true,order:7},{id:'c8',name:'Desserts',type:'lava',status:true,order:8},
    {id:'c9',name:'Drinks',type:'lemonade',status:true,order:9}
  ];
  const mk=async(id,name,email,phone,role,pw,extra)=>({id,name,email,phone,role,pass:await hash(pw),status:'active',createdAt:now()-200*DAY,...extra});
  const users=[
    await mk('u_admin','Ava Reyes','admin@emberandvine.com','+1 (555) 010-0101','ADMIN','admin123',{address:'18 Charcoal Row, City Center'}),
    await mk('u_mgr1','Marcus Hale','manager@emberandvine.com','+1 (555) 020-0201','MANAGER','manager123',{branchId:'b1'}),
    await mk('u_mgr2','Priya Nair','riverside.manager@emberandvine.com','+1 (555) 020-0202','MANAGER','manager123',{branchId:'b2'}),
    await mk('u_c1','Sophia Laurent','sophia@example.com','+1 (555) 401-1188','CUSTOMER','customer123',{address:'12 Alder Street, Old Quarter'}),
    await mk('u_c2','Daniel Okafor','daniel@example.com','+1 (555) 402-3320','CUSTOMER','customer123',{address:'8 Quayside Drive, Riverside'}),
    await mk('u_c3','Mei Tanaka','mei@example.com','+1 (555) 403-7741','CUSTOMER','customer123',{address:'301 Northgate Avenue, Northgate'}),
    await mk('u_c4','Liam Novak','liam@example.com','+1 (555) 404-9052','CUSTOMER','customer123',{address:'5 Harbor View, Harbor District'})
  ];
  const coupons=[
    {id:'cp1',code:'WELCOME15',type:'pct',value:15,min:20,max:null,starts:now()-30*DAY,expires:now()+60*DAY,limit:500,used:37,active:true,desc:'15% off your first feast'},
    {id:'cp2',code:'EMBER5',type:'fix',value:5,min:30,max:null,starts:now()-10*DAY,expires:now()+30*DAY,limit:200,used:12,active:true,desc:'$5 off orders over $30'},
    {id:'cp3',code:'WEEKEND20',type:'pct',value:20,min:25,max:15,starts:now()-2*DAY,expires:now()+6*DAY,limit:100,used:64,active:true,desc:'20% off — max $15 off'}
  ];
  let seq=1041; const orders=[]; const reviews=[]; let rseq=1;
  function mkOrder(daysAgo,minAgo,cust,br,type,status,items,coupon){
    const c=users.find(u=>u.id===cust), b=branches.find(x=>x.id===br);
    const its=items.map(pair=>{const p=products.find(x=>x.id===pair[0]);return{productId:p.id,name:p.name,unit:p.price,qty:pair[1],sub:+(p.price*pair[1]).toFixed(2),mods:[]}});
    const sub=+its.reduce((s,i)=>s+i.sub,0).toFixed(2);
    let disc=0;
    if(coupon){const cp=coupons.find(x=>x.code===coupon); disc=cp.type==='pct'?sub*cp.value/100:cp.value; if(cp.max&&disc>cp.max)disc=cp.max; disc=Math.round(disc*100)/100; cp.used++;}
    const fee=type==='delivery'?b.fee:0;
    const tax=+((sub-disc)*.05).toFixed(2);
    const total=+(sub-disc+fee+tax).toFixed(2);
    const ts=now()-daysAgo*DAY-(minAgo||0)*MIN;
    const o={id:'o'+(seq),code:'EV-'+(seq++),customerId:cust,branchId:br,type,items:its,subtotal:sub,discount:disc,deliveryFee:fee,tax,total,
      payment:{method:type==='delivery'?'cod':'counter',status:'unpaid'},status,
      address:type==='delivery'?{line:c.address||'12 Alder Street',apt:'',note:'Leave at front desk'}:null,
      name:c.name,phone:c.phone,createdAt:ts,eta:type==='delivery'?35:22,dist:null,pickupAt:'',
      events:[{s:'Pending',ts,by:c.name}]};
    if(status!=='Pending'&&status!=='Cancelled'){const fl=FLOW[type]; const idx=fl.indexOf(status); for(let i=1;i<=idx;i++)o.events.push({s:fl[i],ts:ts+i*11*MIN,by:'Marcus Hale'});}
    if(status==='Cancelled')o.events.push({s:'Cancelled',ts:ts+20*MIN,by:'Ava Reyes'});
    orders.push(o); return o;
  }
  const o4=mkOrder(10,0,'u_c1','b2','delivery','Completed',[['p10',1],['p22',2]]);
  const o7=mkOrder(7,0,'u_c1','b3','delivery','Completed',[['p4',1],['p9',1],['p26',1]],'WELCOME15');
  mkOrder(13,0,'u_c2','b1','delivery','Completed',[['p4',2],['p19',1]]);
  mkOrder(12,0,'u_c3','b3','takeaway','Completed',[['p1',1],['p25',2]]);
  mkOrder(11,0,'u_c4','b1','delivery','Completed',[['p13',1],['p21',1],['p27',1]]);
  mkOrder(9,0,'u_c2','b4','takeaway','Completed',[['p8',2],['p25',1]]);
  mkOrder(8,0,'u_c3','b1','delivery','Cancelled',[['p2',1]]);
  mkOrder(6,0,'u_c4','b2','takeaway','Completed',[['p17',1],['p23',1]]);
  mkOrder(5,0,'u_c2','b1','delivery','Completed',[['p14',1],['p19',2]]);
  const o10=mkOrder(4,0,'u_c3','b1','delivery','Completed',[['p11',1],['p24',2]]);
  const o11=mkOrder(3,0,'u_c1','b2','delivery','Completed',[['p13',1],['p20',1],['p25',2]]);
  mkOrder(2,0,'u_c4','b3','takeaway','Completed',[['p5',1],['p19',1]]);
  mkOrder(1,0,'u_c2','b1','delivery','Completed',[['p16',1],['p22',1],['p27',2]]);
  mkOrder(0,320,'u_c3','b1','delivery','Completed',[['p4',1],['p24',1]]);
  mkOrder(0,26,'u_c1','b1','takeaway','Pending',[['p10',1],['p19',1]]);
  mkOrder(0,19,'u_c4','b1','delivery','Preparing',[['p13',1],['p8',1]]);
  mkOrder(0,42,'u_c2','b2','takeaway','Ready for Pickup',[['p22',2],['p25',1]]);
  mkOrder(0,12,'u_c3','b3','delivery','Confirmed',[['p1',1],['p20',1]]);
  mkOrder(0,55,'u_c1','b1','delivery','Out for Delivery',[['p7',1],['p27',1]]);
  const R=(oid,cust,prd,stars,txt,ts)=>reviews.push({id:'r'+(rseq++),orderId:oid,customerId:cust,productId:prd,rating:stars,comment:txt,ts,hidden:false});
  R('o4','u_c1','p10',5,'The tagliatelle is silk. Porcini cream done properly — you can taste the patience.',o4.createdAt+2*HOUR);
  R('o7','u_c1','p4',4,'Ember Classic deserves the hype. Brioche held up, sauce is dangerous.',o7.createdAt+3*HOUR);
  R('o10','u_c3','p11',5,'Lobster linguine is worth every cent. Chili crumbs are a masterstroke.',o10.createdAt+HOUR);
  R('o11','u_c1','p13',5,'Ribeye arrived mid-rare exactly as asked. Ember salt is genius.',o11.createdAt+2*HOUR);
  R('o6','u_c2','p8',4,'Wings were sticky, spicy, perfect. Blue cheese dip is a must.',now()-9*DAY);
  const favorites=[{userId:'u_c1',productId:'p4'},{userId:'u_c1',productId:'p13'},{userId:'u_c1',productId:'p22'},{userId:'u_c3',productId:'p1'},{userId:'u_c2',productId:'p8'}];
  const addresses=[
    {id:'a1',userId:'u_c1',label:'Home',line:'12 Alder Street, Old Quarter',apt:'Apt 4B',note:'Ring the bell twice'},
    {id:'a2',userId:'u_c1',label:'Office',line:'400 Commerce Tower, City Center',apt:'Floor 9',note:'Reception accepts deliveries'},
    {id:'a3',userId:'u_c2',label:'Home',line:'8 Quayside Drive, Riverside',apt:'',note:''}
  ];
  const N=(id,to,title,body,ts,read,link)=>({id,to,title,body,ts,read:!!read,link:link||''});
  const notifications=[
    N('n1','user:u_c1','Order delivered','Your order EV-1051 was completed. Enjoy! We would love your review.',now()-55*MIN,true),
    N('n2','user:u_c1','Out for delivery','Order EV-1051 has left the Downtown Flagship kitchen.',now()-58*MIN,false),
    N('n3','role:MANAGER','New takeaway order','EV-1056 · Sophia Laurent · 2 items · Riverside.',now()-42*MIN,false),
    N('n4','role:MANAGER','New takeaway order','EV-1054 · Sophia Laurent · 2 items at Downtown Flagship.',now()-26*MIN,false),
    N('n5','role:ADMIN','New order EV-1054','Sophia Laurent · Takeaway · Downtown Flagship.',now()-26*MIN,false),
    N('n6','role:ADMIN','Weekly report ready','Revenue is up 12% versus last week.',now()-6*HOUR,true),
    N('n7','user:u_c3','Order confirmed','EV-1057 has been confirmed by Northgate Mall.',now()-12*MIN,false)
  ];
  return {
    seq,users,branches,categories,products,orders,coupons,reviews,favorites,addresses,notifications,
    messages:[],resetCodes:{},
    auditLogs:[
      {id:uid('al'),user:'Ava Reyes',action:'Updated price of Black Truffle Burger from $20.00 to $22.00',ts:now()-3*DAY},
      {id:uid('al'),user:'Ava Reyes',action:'Activated coupon WEEKEND20',ts:now()-2*DAY},
      {id:uid('al'),user:'Marcus Hale',action:'Moved order EV-1049 to Preparing',ts:now()-19*MIN}
    ],
    settings:{name:'Ember & Vine',symbol:'$',taxRate:5,freeOver:60,currency:'USD',
      phone:'+1 (555) 010-0100',email:'hello@emberandvine.com',address:'18 Charcoal Row, City Center',
      hours:'Daily · 10:00 – 23:00',est:'2014',
      social:{instagram:'@emberandvine',facebook:'emberandvine',twitter:'@embervine'}},
    content:{
      heroTag:'Fire-kissed kitchen · Est. 2014',
      heroTitle:'Exceptional Taste. Crafted for Every Moment.',
      heroDesc:'From our charcoal hearth to your table — dry-aged cuts, wood-fired dough and sauces that take days, not minutes. Cooked over live fire, delivered with intent.',
      storyTitle:'Where bold flavor meets thoughtful craftsmanship',
      storyBody:'Ember & Vine began in 2014 with a single wood-fired oven and a stubborn belief: that fast food and fine food never have to be opposites. Today our four kitchens still cook over live fire — every steak seared over embers, every dough given 48 slow hours, every sauce built from scratch each morning.',
      offerTitle:'Weekend Signature Deal',
      offerDesc:'Twenty percent off every weekend order over $25. Charcoal classics, fire-glazed wings and molten lava cake included. Max discount $15.',
      footerNote:'Cooked over live fire since 2014.',
      ...CONTENT_EXTRA
    }
  };
}
const DBKEY='ember_vine_v2';
const CLOUD_TOKEN_KEY='ev_netlify_storage_token';
const CLOUD_FIELDS=['settings','content','categories','products','branches','coupons','reviews'];
let db=null, remoteSiteState=null, cloudLastSyncAt=0, cloudLastError='', cloudSaveQueue=Promise.resolve();
const cloudToken=()=>{try{return sessionStorage.getItem(CLOUD_TOKEN_KEY)||''}catch(e){return ''}};
function cloudPublicData(){
  return CLOUD_FIELDS.reduce((out,key)=>{out[key]=db[key];return out;},{});
}
function mergeCloudPublicData(data){
  if(!db||!data)return;
  CLOUD_FIELDS.forEach(key=>{if(Object.prototype.hasOwnProperty.call(data,key))db[key]=data[key];});
  db.content=Object.assign({},CONTENT_EXTRA,db.content||{});
}
async function loadDB(){
  let loaded=false;
  try{
    const raw=localStorage.getItem(DBKEY);
    if(raw){const parsed=JSON.parse(raw); if(parsed&&parsed.settings&&parsed.users){parsed.content=Object.assign({},CONTENT_EXTRA,parsed.content||{}); db=parsed; loaded=true;}}
  }catch(e){}
  try{
    const response=await fetch('/.netlify/functions/site-data',{headers:{accept:'application/json'},cache:'no-store'});
    if(response.ok){
      const payload=await response.json();
      if(payload&&payload.data){remoteSiteState=payload.data;if(db){mergeCloudPublicData(remoteSiteState);localStorage.setItem(DBKEY,JSON.stringify(db));}}
    }
  }catch(e){}
  return loaded;
}
function imageKey(value){return String(value||'').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,140);}
async function persistImageData(value,key,token){
  if(typeof value!=='string'||!/^data:image\/(?:png|jpeg|webp);base64,/i.test(value))return value;
  const blob=await (await fetch(value)).blob();
  const response=await fetch('/.netlify/functions/media?key='+encodeURIComponent(imageKey(key)),{
    method:'PUT',headers:{authorization:'Bearer '+token,'content-type':blob.type},body:blob
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||'Image upload failed.');
  return result.url;
}
async function persistSiteImages(token){
  for(const slot of PIC_SLOTS){
    const target=slot.where==='settings'?db.settings:db.content;
    target[slot.k]=await persistImageData(target[slot.k],'site-'+slot.k,token);
  }
  for(const product of db.products||[])product.image=await persistImageData(product.image,'product-'+product.id,token);
  for(const item of db.branches||[])item.image=await persistImageData(item.image,'branch-'+item.id,token);
}
async function syncCloudSiteState(){
  const token=cloudToken();
  if(!token)throw new Error('Connect cloud storage before publishing shared site content.');
  await persistSiteImages(token);
  const response=await fetch('/.netlify/functions/site-data',{
    method:'PUT',headers:{authorization:'Bearer '+token,'content-type':'application/json'},
    body:JSON.stringify({data:cloudPublicData()})
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||'Cloud content could not be saved.');
  remoteSiteState=result.data||cloudPublicData();
  cloudLastSyncAt=Date.now();
  cloudLastError='';
}
async function saveDB(){
  try{localStorage.setItem(DBKEY,JSON.stringify(db));}
  catch(e){console.warn('storage full',e);toast('Could not save — this browser storage is full.','err');}
  if(cloudToken()){
    cloudSaveQueue=cloudSaveQueue.catch(()=>{}).then(syncCloudSiteState);
    try{await cloudSaveQueue;localStorage.setItem(DBKEY,JSON.stringify(db));}
    catch(e){cloudLastSyncAt=0;cloudLastError=e.message;console.warn('Netlify storage sync failed',e);toast('Saved in this browser, but cloud sync failed: '+e.message,'err');}
  }else{cloudLastSyncAt=0;cloudLastError='';}
}
function siteSaveToast(sharedMessage){
  if(cloudLastSyncAt)toast(sharedMessage,'ok');
  else if(!cloudLastError)toast('Saved in this browser only. Connect cloud storage to share it with visitors.','info');
}
const SET=()=>db.settings;
const me=()=>db?db.users.find(u=>u.id===(session&&session.uid))||null:null;
const prod=id=>db.products.find(p=>p.id===id);
const branch=id=>db.branches.find(b=>b.id===id);
const catName=id=>{const c=db.categories.find(c=>c.id===id);return c?c.name:'—'};
const userById=id=>db.users.find(u=>u.id===id);
const visibleCats=()=>db.categories.filter(c=>c.status).sort((a,b)=>a.order-b.order);
const catProducts=catId=>db.products.filter(p=>p.cat===catId);
function audit(action){const u=me(); db.auditLogs.unshift({id:uid('al'),user:u?u.name:'System',action,ts:now()}); if(db.auditLogs.length>300)db.auditLogs.length=300;}
function notify(to,title,body,link){db.notifications.unshift({id:uid('n'),to,title,body,ts:now(),read:false,link:link||''});}
function myNotifs(){const u=me(); if(!u)return[]; const t='user:'+u.id, r='role:'+u.role; return db.notifications.filter(n=>n.to===t||n.to===r);}
function unreadCount(){return myNotifs().filter(n=>!n.read).length;}
function isOpen(b){const d=new Date();const cur=d.getHours()*60+d.getMinutes();const oh=b.open.split(':'),ch=b.close.split(':');const o=+oh[0]*60+ +oh[1],c=+ch[0]*60+ +ch[1];return cur>=o&&cur<=c;}
function distKm(a,b){const R=6371,dLa=(b.lat-a.lat)*Math.PI/180,dLo=(b.lng-a.lng)*Math.PI/180,x=Math.sin(dLa/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
const cartKey=()=>'ev_cart_'+(me()?me().id:'guest');
const cartGet=()=>{try{return JSON.parse(localStorage.getItem(cartKey())||'[]')}catch(e){return[]}};
const cartSet=c=>{try{localStorage.setItem(cartKey(),JSON.stringify(c))}catch(e){}};
function cartCount(){return cartGet().reduce((s,i)=>s+i.qty,0)}
function cartSubtotal(){return cartGet().reduce((s,i)=>s+i.unit*i.qty,0)}
function couponCheck(code,sub){
  const c=db.coupons.find(x=>x.code===(code||'').trim().toUpperCase());
  if(!c)return{err:'This coupon code does not exist.'};
  if(!c.active)return{err:'This coupon is currently inactive.'};
  const t=now(); if(t<c.starts)return{err:'This coupon is not active yet.'};
  if(t>c.expires)return{err:'This coupon has expired.'};
  if(sub<c.min)return{err:'Minimum order of '+money(c.min)+' required for this coupon.'};
  if(c.limit&&c.used>=c.limit)return{err:'This coupon has reached its usage limit.'};
  let d=c.type==='pct'?sub*c.value/100:c.value; if(c.max&&d>c.max)d=c.max;
  return{c,disc:Math.round(d*100)/100};
}
let session=null; try{session=JSON.parse(localStorage.getItem('ev_session')||'null')}catch(e){}
const setSession=u=>{session=u?{uid:u.id}:null; localStorage.setItem('ev_session',JSON.stringify(session));};
const roleHome=()=>({ADMIN:'#/admin',MANAGER:'#/manager',CUSTOMER:'#/account'}[(me()||{}).role]||'#/');
const okBadge=l=>'<span class="sb" style="--sc:#3E6B4F"><span class="dt"></span>'+esc(l)+'</span>';
let _dg=0;
function plate(inner){
  const g='pg'+(_dg++);
  return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'
  +'<defs><radialGradient id="'+g+'" cx="50%" cy="42%" r="68%"><stop offset="0" stop-color="#26242A"/><stop offset="1" stop-color="#131215"/></radialGradient></defs>'
  +'<circle cx="100" cy="100" r="98" fill="#0D0C0F"/><circle cx="100" cy="100" r="90" fill="url(#'+g+')" stroke="#2E2C31" stroke-width="1.4"/>'
  +'<circle cx="100" cy="100" r="80" fill="none" stroke="#3B393E" stroke-width=".8" opacity=".55"/>'
  +'<path d="M40 52 A78 78 0 0 1 100 24" stroke="rgba(245,245,243,.14)" stroke-width="2" fill="none" stroke-linecap="round"/>'
  +inner+'</svg>';
}
const herb='fill="#5F7040"';
const DISH={
  burger:plate('<ellipse cx="100" cy="152" rx="50" ry="9" fill="#000" opacity=".45"/><rect x="56" y="138" width="88" height="15" rx="7" fill="#B07A44"/><rect x="55" y="122" width="90" height="15" rx="7.5" fill="#54301F"/><path d="M56 122 h88 l-9 9 -11 -7 -11 7 -11 -7 -11 7 -11 -7 -11 7 z" fill="#D9A441"/><rect x="60" y="112" width="80" height="9" rx="4.5" fill="#B03A3A"/><path d="M55 112 q6 9 12 0 q6 9 12 0 q6 9 12 0 q6 9 12 0 q6 9 12 0 q6 9 12 0 q6 9 12 0 l0 -7 q-42 -7 -84 0 z" '+herb+'/><path d="M56 105 q0 -42 44 -42 q44 0 44 42 z" fill="#C08A4E"/><path d="M62 100 q4 -30 32 -33" stroke="#DBAF72" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="84" cy="84" rx="3" ry="1.8" fill="#EAD9B8"/><ellipse cx="104" cy="76" rx="3" ry="1.8" fill="#EAD9B8"/><ellipse cx="120" cy="90" rx="3" ry="1.8" fill="#EAD9B8"/><ellipse cx="94" cy="94" rx="3" ry="1.8" fill="#EAD9B8"/>'),
  pizza:plate('<circle cx="100" cy="102" r="54" fill="#C08A4E"/><circle cx="100" cy="102" r="45" fill="#A8342F"/><circle cx="100" cy="102" r="42" fill="#C94A38"/><circle cx="100" cy="102" r="40" fill="#E8D2A8"/><circle cx="86" cy="92" r="7.5" fill="#B03A3A"/><circle cx="116" cy="108" r="7.5" fill="#B03A3A"/><circle cx="98" cy="120" r="6.5" fill="#B03A3A"/><circle cx="80" cy="112" r="1.6" fill="#8A5A33"/><circle cx="112" cy="88" r="1.6" fill="#8A5A33"/><circle cx="122" cy="118" r="1.5" fill="#8A5A33"/><circle cx="92" cy="128" r="1.5" fill="#8A5A33"/><path d="M96 82 q6 -7 12 0 q-6 7 -12 0z" '+herb+'/><path d="M78 104 q6 -7 12 0 q-6 7 -12 0z" '+herb+'/><path d="M116 126 q6 -7 12 0 q-6 7 -12 0z" '+herb+'/>'),
  steak:plate('<ellipse cx="100" cy="136" rx="62" ry="10" fill="#7E2A22" opacity=".5"/><rect x="42" y="78" width="116" height="54" rx="26" fill="#6B3226"/><rect x="42" y="88" width="116" height="6" fill="#4A1F14" transform="rotate(-8 100 105)"/><rect x="42" y="102" width="116" height="6" fill="#4A1F14" transform="rotate(-8 100 105)"/><rect x="42" y="116" width="116" height="6" fill="#4A1F14" transform="rotate(-8 100 105)"/><rect x="76" y="66" width="30" height="16" rx="4" fill="#EFDDB6" transform="rotate(-6 91 74)"/><path d="M132 70 q10 -12 20 -8" stroke="#5F7040" stroke-width="2.5" fill="none"/><circle cx="136" cy="66" r="1.7" '+herb+'/><circle cx="142" cy="62" r="1.7" '+herb+'/><circle cx="148" cy="60" r="1.7" '+herb+'/><circle cx="58" cy="80" r="1.4" fill="#2B1409"/><circle cx="140" cy="120" r="1.4" fill="#2B1409"/>'),
  chicken:plate('<ellipse cx="100" cy="142" rx="52" ry="9" fill="#000" opacity=".4"/><path d="M68 132 q-14 -36 24 -50 q34 -12 50 12 q12 18 -4 32 q-18 17 -44 13 q-20 -2 -26 -7 z" fill="#9A5A34"/><path d="M78 100 q10 -12 26 -14 M74 116 q14 -10 34 -10" stroke="#6B3A1E" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="132" cy="120" r="14" fill="#E7C87C"/><path d="M132 108 v24 M121 114 l22 12 M121 126 l22 -12" stroke="#C99B44" stroke-width="1.6"/><path d="M64 122 q-8 -8 -4 -16" stroke="#5F7040" stroke-width="2.5" fill="none"/><circle cx="62" cy="106" r="1.8" '+herb+'/><circle cx="60" cy="114" r="1.8" '+herb+'/>'),
  wings:plate('<g transform="rotate(-18 82 92)"><ellipse cx="82" cy="92" rx="15" ry="20" fill="#9A5A34"/><circle cx="82" cy="114" r="6" fill="#EFE3C8"/></g><g transform="rotate(6 116 90)"><ellipse cx="116" cy="90" rx="15" ry="20" fill="#8E4E2C"/><circle cx="116" cy="112" r="6" fill="#EFE3C8"/></g><g transform="rotate(28 96 126)"><ellipse cx="96" cy="126" rx="14" ry="18" fill="#A26038"/><circle cx="96" cy="146" r="5.5" fill="#EFE3C8"/></g><circle cx="66" cy="128" r="1.8" '+herb+'/><circle cx="132" cy="70" r="1.8" '+herb+'/><circle cx="140" cy="120" r="1.8" '+herb+'/>'),
  sandwich:plate('<ellipse cx="100" cy="146" rx="56" ry="9" fill="#000" opacity=".4"/><rect x="44" y="128" width="112" height="14" rx="7" fill="#C08A4E"/><rect x="48" y="112" width="104" height="13" rx="6.5" fill="#9A5A34"/><path d="M48 112 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 l0 -6 q-52 -6 -104 0 z" '+herb+'/><rect x="44" y="92" width="112" height="15" rx="7.5" fill="#C08A4E"/><path d="M52 96 q10 -8 24 -6" stroke="#DBAF72" stroke-width="3.4" fill="none" stroke-linecap="round"/>'),
  pasta:plate('<g stroke="#E7CFA0" stroke-width="5" fill="none" stroke-linecap="round"><path d="M56 132 q22 -16 46 -8 t 44 2"/><path d="M58 122 q26 -14 48 -6 t 40 6"/><path d="M62 112 q20 -12 42 -6 t 38 4"/><path d="M66 104 q22 -10 40 -4 t 32 4"/></g><circle cx="84" cy="106" r="4" fill="#A8342F"/><circle cx="112" cy="98" r="4" fill="#A8342F"/><circle cx="122" cy="116" r="3.4" fill="#A8342F"/><circle cx="72" cy="122" r="3.4" fill="#A8342F"/><path d="M98 88 q7 -8 14 0 q-7 8 -14 0z" '+herb+'/><ellipse cx="100" cy="142" rx="52" ry="8" fill="#000" opacity=".35"/>'),
  rice:plate('<path d="M50 108 h100 q-7 38 -50 38 q-43 0 -50 -38 z" fill="#26242A"/><path d="M50 108 h100" stroke="#3B393E" stroke-width="2"/><g fill="#F2E7CC"><circle cx="78" cy="102" r="5"/><circle cx="92" cy="98" r="5"/><circle cx="108" cy="99" r="5"/><circle cx="122" cy="103" r="5"/><circle cx="100" cy="105" r="5"/><circle cx="66" cy="106" r="4"/><circle cx="134" cy="106" r="4"/></g><rect x="82" y="90" width="16" height="6" rx="3" fill="#B03A3A" transform="rotate(-12 90 93)"/><rect x="106" y="88" width="16" height="6" rx="3" fill="#B03A3A" transform="rotate(9 114 91)"/><circle cx="100" cy="92" r="7" fill="#F2E5C4"/><circle cx="100" cy="92" r="3.2" fill="#D98A2B"/><circle cx="74" cy="94" r="1.4" '+herb+'/><circle cx="124" cy="96" r="1.4" '+herb+'/><ellipse cx="100" cy="152" rx="46" ry="6" fill="#000" opacity=".4"/>'),
  fries:plate('<ellipse cx="100" cy="150" rx="46" ry="8" fill="#000" opacity=".4"/><g stroke="#EFD9A8" stroke-width="9" stroke-linecap="round"><path d="M76 118 L68 66"/><path d="M90 114 L88 56"/><path d="M104 114 L108 58"/><path d="M118 116 L128 68"/></g><path d="M68 116 h64 l-7 36 h-50 z" fill="#780D1C"/><path d="M68 116 h64 l-2 10 h-60 z" fill="#8E1223"/><circle cx="84" cy="132" r="1.6" fill="#EAD9B8"/><circle cx="104" cy="138" r="1.6" fill="#EAD9B8"/><circle cx="118" cy="130" r="1.6" fill="#EAD9B8"/>'),
  calamari:plate('<g fill="none" stroke="#D9A441" stroke-width="7"><circle cx="84" cy="92" r="14"/><circle cx="116" cy="98" r="14"/><circle cx="94" cy="122" r="13"/><circle cx="124" cy="126" r="11"/><circle cx="70" cy="118" r="11"/></g><g fill="#E8B45C"><circle cx="84" cy="92" r="9.5" fill="#26242A"/><circle cx="116" cy="98" r="9.5" fill="#26242A"/><circle cx="94" cy="122" r="8.5" fill="#26242A"/></g><path d="M66 76 q8 -12 20 -12" stroke="#E7C87C" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="136" cy="80" r="1.8" '+herb+'/><circle cx="72" cy="136" r="1.8" '+herb+'/>'),
  bruschetta:plate('<g><rect x="52" y="76" width="42" height="30" rx="8" fill="#C08A4E" transform="rotate(-8 73 91)"/><g transform="rotate(-8 73 91)"><circle cx="64" cy="88" r="3.4" fill="#A8342F"/><circle cx="76" cy="92" r="3.4" fill="#A8342F"/><circle cx="84" cy="84" r="3" fill="#A8342F"/><path d="M68 80 q4 -5 8 0" stroke="#5F7040" stroke-width="2" fill="none"/></g></g><g><rect x="104" y="96" width="42" height="30" rx="8" fill="#B07A44" transform="rotate(6 125 111)"/><g transform="rotate(6 125 111)"><circle cx="116" cy="108" r="3.4" fill="#6B4A2E"/><circle cx="128" cy="112" r="3.4" fill="#6B4A2E"/><circle cx="136" cy="104" r="3" fill="#6B4A2E"/></g></g><g><rect x="66" y="120" width="42" height="30" rx="8" fill="#C08A4E" transform="rotate(-4 87 135)"/><g transform="rotate(-4 87 135)"><circle cx="78" cy="132" r="4" fill="#F2E5C4"/><circle cx="90" cy="136" r="4" fill="#F2E5C4"/><circle cx="84" cy="128" r="2" fill="#D9A441"/></g></g><ellipse cx="100" cy="156" rx="52" ry="7" fill="#000" opacity=".35"/>'),
  lava:plate('<ellipse cx="100" cy="144" rx="50" ry="9" fill="#000" opacity=".45"/><path d="M62 140 q0 -46 38 -46 q38 0 38 46 z" fill="#3A2420"/><path d="M98 96 q5 18 -2 30 q-5 9 5 13 l9 -3 q5 -14 -1 -30 q-3 -8 1 -12 z" fill="#B03A3A"/><circle cx="140" cy="132" r="13" fill="#F2E5C4"/><circle cx="140" cy="132" r="13" fill="none" stroke="#D9C29A" stroke-width="2"/><circle cx="70" cy="112" r="1.4" fill="#EAD9B8"/><circle cx="82" cy="104" r="1.4" fill="#EAD9B8"/><circle cx="112" cy="102" r="1.4" fill="#EAD9B8"/><circle cx="122" cy="112" r="1.4" fill="#EAD9B8"/>'),
  cheesecake:plate('<ellipse cx="100" cy="146" rx="52" ry="8" fill="#000" opacity=".4"/><path d="M60 138 L140 138 L130 94 Q100 84 74 96 z" fill="#EFDDB6"/><path d="M74 96 Q100 84 130 94 L128 100 Q100 91 76 101 z" fill="#9A5A34"/><rect x="62" y="132" width="76" height="7" fill="#B07A44"/><g fill="#7E2A3E"><circle cx="88" cy="112" r="4.4"/><circle cx="102" cy="120" r="4"/><circle cx="112" cy="108" r="3.6"/></g><path d="M78 122 q6 -6 12 0" stroke="#5F7040" stroke-width="2" fill="none"/>'),
  tiramisu:plate('<ellipse cx="100" cy="144" rx="50" ry="8" fill="#000" opacity=".4"/><rect x="60" y="96" width="80" height="42" rx="6" fill="#E8D2A8"/><rect x="60" y="96" width="80" height="12" rx="6" fill="#4A2E20"/><path d="M60 120 h80 M60 130 h80" stroke="#C9A876" stroke-width="2.4"/><rect x="96" y="108" width="8" height="30" fill="#F2E5C4" opacity=".65"/><circle cx="76" cy="88" r="1.6" fill="#4A2E20"/><circle cx="94" cy="84" r="1.6" fill="#4A2E20"/><circle cx="112" cy="88" r="1.6" fill="#4A2E20"/><circle cx="126" cy="84" r="1.6" fill="#4A2E20"/>'),
  lemonade:plate('<ellipse cx="100" cy="152" rx="44" ry="7" fill="#000" opacity=".4"/><path d="M74 62 h52 l-7 74 q-19 9 -38 0 z" fill="rgba(232,226,210,.1)" stroke="#D8D3C4" stroke-width="2.4"/><path d="M78 84 h44 l-5 50 q-17 7 -34 0 z" fill="#C4353F"/><rect x="84" y="96" width="12" height="12" rx="2.5" fill="rgba(245,245,243,.5)" transform="rotate(12 90 102)"/><rect x="102" y="110" width="12" height="12" rx="2.5" fill="rgba(245,245,243,.45)" transform="rotate(-14 108 116)"/><rect x="116" y="40" width="6" height="70" rx="3" fill="#E6002B" transform="rotate(9 119 75)"/><circle cx="72" cy="60" r="9" fill="#E7C87C"/><path d="M72 52 v16 M65 56 l14 8 M65 64 l14 -8" stroke="#C99B44" stroke-width="1.5"/><path d="M126 84 q10 -10 18 -8" stroke="#5F7040" stroke-width="2.4" fill="none"/><circle cx="130" cy="80" r="1.6" '+herb+'/>'),
  cooler:plate('<ellipse cx="100" cy="152" rx="44" ry="7" fill="#000" opacity=".4"/><path d="M76 58 h48 l-6 78 q-18 9 -36 0 z" fill="rgba(232,226,210,.1)" stroke="#D8D3C4" stroke-width="2.4"/><path d="M80 80 h40 l-4 54 q-16 6 -32 0 z" fill="#7E2A3E"/><circle cx="90" cy="94" r="4" fill="#4A1428"/><circle cx="106" cy="104" r="4" fill="#4A1428"/><circle cx="98" cy="118" r="3.5" fill="#4A1428"/><rect x="114" y="36" width="6" height="72" rx="3" fill="#F5F5F3" transform="rotate(-9 117 72)"/><path d="M86 66 q8 -8 16 -4" stroke="#5F7040" stroke-width="2.4" fill="none"/><circle cx="88" cy="62" r="1.6" '+herb+'/><circle cx="118" cy="56" r="8.6" fill="#C4353F"/><path d="M118 50 v12 M113 53 l10 6 M113 59 l10 -6" stroke="#8E1B1B" stroke-width="1.4"/>'),
  espresso:plate('<ellipse cx="100" cy="142" rx="48" ry="9" fill="#000" opacity=".45"/><ellipse cx="100" cy="134" rx="46" ry="10" fill="#E8E2D2"/><ellipse cx="100" cy="131" rx="46" ry="10" fill="#F5F2E8"/><path d="M66 84 h68 l-6 40 q-28 12 -56 0 z" fill="#F2EEE2" stroke="#D8D3C4" stroke-width="2"/><ellipse cx="100" cy="86" rx="31" ry="7" fill="#3A2420"/><path d="M84 84 q10 -5 22 -1 q8 3 12 0" stroke="#B07A44" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M134 94 q16 2 12 14 q-3 9 -16 6" fill="none" stroke="#D8D3C4" stroke-width="5"/><path d="M64 60 q6 6 0 12 M72 58 q6 6 0 12" stroke="rgba(245,245,243,.4)" stroke-width="2" fill="none" stroke-linecap="round"/>')
};
const dishSVG=type=>DISH[type]||DISH.pasta;
// Real food photography for the seeded menu; user-uploaded images take precedence.
const MENU_FOOD_PHOTO_IDS={
  p1:'1579751626657-72bc17010498',p2:'1593560708920-61dd98c46a4e',p3:'1574071318508-1cdbab80d002',
  p4:'1568901346375-23c9450c58cd',p5:'1550547660-d9450f859349',p6:'1561758033-d89a9ad46330',
  p7:'1594221708779-94832f4320d1',p8:'1567620832903-9fc6debc209f',p9:'1606755962773-d324e9a13086',
  p10:'1473093295043-cdd812d0e601',p11:'1555949258-eb67b1ef0ceb',p12:'1606761568499-5ddd45e43b32',
  p13:'1600891964599-f61ba0e24092',p14:'1544025162-d76694265947',p15:'1546833999-b9f581a1996d',
  p16:'1605478371310-a9f1e96b4ff4',p17:'1604908176997-4315c6f59b3d',p18:'1603133872878-684f208fb84b',
  p19:'1573080496219-bb080dd4f877',p20:'1583324113626-70df0f4deaab',p21:'1572695157366-5e585ab2b69f',
  p22:'1606313564200-e75d5e30476c',p23:'1533134242443-d4fd215305ad',p24:'1571877227200-a0d98ea607e9',
  p25:'1523677011781-c91d1bbe2f9e',p26:'1553530666-ba11a7da3888',p27:'1509042239860-f550ce710b93'
};
const menuFoodPhoto=p=>{const id=p&&MENU_FOOD_PHOTO_IDS[p.id];return id?'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w=900&q=85':''};
const HERO_BURGER_PHOTO='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=85';
const STORY_STEAK_PHOTO='https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1100&q=85';
function dishArt(p){
  const src=p&&(p.image||menuFoodPhoto(p));
  if(src)return '<img src="'+esc(src)+'" alt="'+esc(p.name||'')+'" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block">';
  return dishSVG(p&&p.type||'burger');
}
function downscaleImage(dataUrl,maxDim,cb,fmt){
  const img=new Image();
  img.onload=()=>{
    let w=img.width,h=img.height;
    if(w>maxDim||h>maxDim){ if(w>h){h=Math.round(h*maxDim/w);w=maxDim} else {w=Math.round(w*maxDim/h);h=maxDim} }
    const cv=document.createElement('canvas'); cv.width=w;cv.height=h;
    const ctx=cv.getContext('2d'); ctx.drawImage(img,0,0,w,h);
    try{cb(cv.toDataURL(fmt||'image/jpeg',0.85))}catch(e){cb(dataUrl)}
  };
  img.onerror=()=>cb(dataUrl);
  img.src=dataUrl;
}
function miniMap(id,label){
  let s=0; for(const c of id) s=(s*31+c.charCodeAt(0))>>>0;
  const r=n=>{s=(s*1103515245+12345)>>>0; return (s>>>16)%n};
  let streets='';
  for(let i=0;i<5;i++){const y=18+r(130); streets+='<path d="M0 '+y+' Q 60 '+(y+r(40)-20)+' 200 '+(y+r(30))+'" stroke="#2C2A30" stroke-width="'+(4+r(4))+'" fill="none"/>';}
  for(let i=0;i<4;i++){const x=20+r(160); streets+='<path d="M'+x+' 0 Q '+(x+r(30)-15)+' 90 '+(x+r(20)-10)+' 170" stroke="#26242A" stroke-width="'+(3+r(3))+'" fill="none"/>';}
  return '<svg viewBox="0 0 200 170" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of '+esc(label)+'"><rect width="200" height="170" fill="#161519"/>'+streets
  +'<path d="M-10 140 Q 60 118 120 138 T 210 128" stroke="#1F2B33" stroke-width="14" fill="none" opacity=".9"/>'
  +'<g transform="translate(100 84)"><circle r="16" fill="rgba(230,0,43,.18)" class="pulse-pin"/><path d="M0 -14 a11 11 0 0 1 11 11 c0 8 -11 17 -11 17 s-11 -9 -11 -17 a11 11 0 0 1 11 -11z" fill="#E6002B"/><circle cy="-3" r="4" fill="#131215"/></g></svg>';
}
function heroBurger(){
  return '<img src="'+HERO_BURGER_PHOTO+'" alt="Ember &amp; Vine signature burger" loading="eager" decoding="async" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:50%;display:block">';
}
function aboutSteakPhoto(){
  return '<img src="'+STORY_STEAK_PHOTO+'" alt="Grilled ribeye with seasonal sides" loading="lazy" decoding="async" style="width:100%;aspect-ratio:1;object-fit:cover;display:block">';
}
function chArea(cv,labels,values){
  if(!cv||!cv.clientWidth)return;
  const dpr=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight||260;
  cv.width=w*dpr; cv.height=h*dpr; const x=cv.getContext('2d'); x.scale(dpr,dpr);
  const P={l:42,r:10,t:12,b:24},iw=w-P.l-P.r,ih=h-P.t-P.b,max=Math.max.apply(null,values.concat([1]))*1.18;
  const X=i=>P.l+iw*i/Math.max(1,values.length-1), Y=v=>P.t+ih*(1-v/max), t0=performance.now();
  x.font='10px Manrope';
  (function fr(t){
    const k=reduced?1:Math.min(1,(t-t0)/800), e=1-Math.pow(1-k,3);
    x.clearRect(0,0,w,h);
    for(let g=0;g<=3;g++){const gy=P.t+ih*g/3; x.strokeStyle=isDark()?'rgba(255,255,255,.1)':'rgba(19,18,21,.07)'; x.beginPath();x.moveTo(P.l,gy);x.lineTo(w-P.r,gy);x.stroke();
      x.fillStyle='#96959A'; x.textAlign='right'; x.fillText(short$(max*(1-g/3)),P.l-7,gy+3);}
    x.textAlign='center'; const skip=Math.ceil(labels.length/7);
    labels.forEach((L,i)=>{if(i%skip===0){x.fillStyle='#96959A';x.fillText(L,X(i),h-7)}});
    const n=Math.max(2,Math.ceil(values.length*e));
    const pts=values.slice(0,n).map((v,i)=>[X(i),Y(v)]);
    if(pts.length>1){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
      x.lineTo(X(n-1),Y(0));x.lineTo(X(0),Y(0));x.closePath();
      const g=x.createLinearGradient(0,P.t,0,h);g.addColorStop(0,'rgba(230,0,43,.20)');g.addColorStop(1,'rgba(230,0,43,0)');x.fillStyle=g;x.fill();}
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
    x.strokeStyle='#E6002B';x.lineWidth=2.2;x.lineJoin='round';x.stroke();
    const lp=pts[pts.length-1];
    if(lp){x.beginPath();x.arc(lp[0],lp[1],4,0,7);x.fillStyle='#E6002B';x.fill();x.beginPath();x.arc(lp[0],lp[1],8,0,7);x.fillStyle='rgba(230,0,43,.15)';x.fill();}
    if(k<1)requestAnimationFrame(fr);
  })(t0);
}
function chBars(cv,labels,values,col){
  col=col||'#780D1C';
  if(!cv||!cv.clientWidth)return;
  const dpr=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight||260;
  cv.width=w*dpr;cv.height=h*dpr;const x=cv.getContext('2d');x.scale(dpr,dpr);
  const P={l:34,r:8,t:12,b:24},iw=w-P.l-P.r,ih=h-P.t-P.b,max=Math.max.apply(null,values.concat([1]))*1.15,t0=performance.now();
  x.font='10px Manrope';
  (function fr(t){
    const k=reduced?1:Math.min(1,(t-t0)/800),e=1-Math.pow(1-k,3);
    x.clearRect(0,0,w,h);
    const bw=Math.min(26,iw/values.length*.55);
    labels.forEach((L,i)=>{
      const bh=ih*(values[i]/max)*e, bx=P.l+iw*(i+.5)/values.length-bw/2;
      const g=x.createLinearGradient(0,P.t+ih-bh,0,P.t+ih);g.addColorStop(0,col);g.addColorStop(1,col+'55');
      x.fillStyle=g; x.beginPath();
      if(x.roundRect)x.roundRect(bx,P.t+ih-bh,bw,Math.max(0,bh),[4,4,0,0]); else x.rect(bx,P.t+ih-bh,bw,Math.max(0,bh));
      x.fill();
      x.fillStyle='#96959A';x.textAlign='center';x.fillText(L,P.l+iw*(i+.5)/values.length,h-7);
    });
    if(k<1)requestAnimationFrame(fr);
  })(t0);
}
function chDonut(cv,parts,centerLabel,centerVal){
  if(!cv||!cv.clientWidth)return;
  const dpr=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight||190;
  cv.width=w*dpr;cv.height=h*dpr;const x=cv.getContext('2d');x.scale(dpr,dpr);
  const cx=w/2,cy=h/2,R=Math.min(w,h)/2-8,r0=R*.62,tot=parts.reduce((s,p)=>s+p.v,0)||1,t0=performance.now();
  (function fr(t){
    const k=reduced?1:Math.min(1,(t-t0)/800),e=1-Math.pow(1-k,3);
    x.clearRect(0,0,w,h); let a=-Math.PI/2;
    parts.forEach(p=>{const sw=p.v/tot*Math.PI*2*e;
      x.beginPath();x.arc(cx,cy,R,a,a+sw);x.arc(cx,cy,r0,a+sw,a,true);x.closePath();x.fillStyle=p.c;x.fill();
      x.strokeStyle=isDark()?'#201F23':'#fff';x.lineWidth=2;x.stroke(); a+=sw;});
    x.fillStyle=isDark()?'#EDEDEE':'#131215';x.textAlign='center';x.font='800 22px Fraunces';x.fillText(centerVal,cx,cy+2);
    x.font='700 10.5px Manrope';x.fillStyle='#96959A';x.fillText(centerLabel,cx,cy+18);
  })(t0);
}
function toast(msg,type,action){
  type=type||'ok';
  const t=document.createElement('div'); t.className='toast '+type;
  const im={ok:'check-circle-2',err:'alert-triangle',info:'info'}[type]||'info';
  t.innerHTML=ic(im)+'<div style="flex:1">'+esc(msg)+(action?' <span class="ta">'+esc(action.label)+'</span>':'')+'</div>';
  if(action)t.querySelector('.ta').onclick=()=>{action.fn();t.remove()};
  $('#toasts').appendChild(t); icons();
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},action?6000:3400);
}
let _mk=null;
function modal(html,wide){
  closeModal();
  const bk=document.createElement('div'); bk.className='mbk'; _mk=bk;
  bk.innerHTML='<div class="mpanel'+(wide?' wide':'')+'" role="dialog" aria-modal="true"><button class="icon-btn mx" data-act="modal-close" aria-label="Close">'+ic('x')+'</button>'+html+'</div>';
  bk.addEventListener('mousedown',e=>{if(e.target===bk)closeModal()});
  $('#modal-root').appendChild(bk); requestAnimationFrame(()=>bk.classList.add('open')); icons();
  document.body.style.overflow='hidden';
}
function closeModal(){const bk=_mk||$('#modal-root .mbk'); if(bk){bk.classList.remove('open');setTimeout(()=>bk.remove(),200)} _mk=null; document.body.style.overflow='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const fld=(l,inner,hint)=>'<label class="fld"><span>'+l+'</span>'+inner+(hint?'<em class="hint" style="font-style:normal">'+hint+'</em>':'')+'</label>';
const inpF=(n,ph,v,t,req,extra)=>'<input class="in" name="'+n+'" type="'+(t||'text')+'" placeholder="'+esc(ph||'')+'" value="'+esc(v==null?'':v)+'" '+(req===false?'':'required')+' '+(extra||'')+'>';
const selF=(n,opts,v)=>'<select class="in" name="'+n+'">'+opts.map(o=>'<option value="'+esc(o[0])+'"'+(o[0]==v?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select>';
const stars=r=>'<span class="stars">'+[1,2,3,4,5].map(i=>ic('star',i<=Math.round(r)?'f':'')).join('')+'</span>';
const stBadge=s=>'<span class="sb" style="--sc:'+(STC[s]||'#96959A')+'"><span class="dt"></span>'+esc(s)+'</span>';
const sw=on=>'<span class="sw'+(on?' on':'')+'"><span></span></span>';
const empty=(icon,title,text,cta)=>'<div class="empty"><div class="eic">'+ic(icon)+'</div><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p>'+(cta||'')+'</div>';
const ferr=(f,msg)=>{const el=f.querySelector('[data-err]');if(el){el.textContent=msg;el.classList.add('show')}};
const app=$('#app');
let ui={
  menu:{q:'',cat:'all',sort:'popular',minR:0,maxP:60,avail:false,pop:false,feat:false},
  fd:null, co:null, review:{stars:0}, adminTab:'overview', mgrTab:'board', acctTab:'overview', pg:{}, adminPg:1, next:null, coupon:null
};
const NAV_LINKS=[['#/','Home','nav_home'],['#/menu','Menu','nav_menu'],['#/branches','Branches','nav_branches'],['#/offers','Offers','nav_offers'],['#/about','About','nav_about'],['#/contact','Contact','nav_contact']];
function branchArt(b){
  if(b.image)return '<img src="'+b.image+'" alt="'+esc(b.name)+'" style="width:100%;height:100%;object-fit:cover;display:block">';
  return miniMap(b.id,b.name);
}
function logoHTML(){
  if(SET().logo)return '<a class="logo" href="#/" style="align-items:center"><img src="'+SET().logo+'" alt="'+esc(SET().name)+'" style="height:36px;max-width:170px;object-fit:contain;display:block"></a>';
  const parts=SET().name.split(' & ');
  return '<a class="logo" href="#/"><span class="mark">'+ic('flame')+'</span><span>'+esc(parts[0])+(parts[1]?' <b>& </b>'+esc(parts.slice(1).join(' & ')):'')+'</span></a>';
}
function navHTML(active){
  const u=me(), n=cartCount();
  return '<nav class="nav"><div class="wrap nav-in">'
  +logoHTML()
  +'<div class="nav-links">'+NAV_LINKS.map(l=>'<a href="'+l[0]+'" class="'+(active===l[0]?'act':'')+'">'+esc(L(l[2]))+'</a>').join('')+'</div>'
  +'<div class="nav-right">'
  +themeBtn()
  +'<a class="icon-btn bag" href="#/cart" aria-label="Cart">'+ic('shopping-bag')+'<span class="badge-n" data-badge style="'+(n?'':'display:none')+'">'+n+'</span></a>'
  +(u
    ?'<div class="acct-wrap"><button class="icon-btn" data-act="acct-menu" aria-label="Account">'+ic('user')+'</button>'
      +'<div class="dd" data-dd><div class="who"><b>'+esc(u.name)+'</b><span>'+esc(u.email)+'</span></div><div class="sep"></div>'
      +(u.role==='CUSTOMER'
        ?'<a href="#/account">'+ic('layout-dashboard')+'My dashboard</a><a href="#/account/favorites">'+ic('heart')+'Favorites</a><a href="#/account/notifications">'+ic('bell')+'Notifications'+(unreadCount()?'<span class="tag" style="margin-left:auto">'+unreadCount()+'</span>':'')+'</a>'
        :'<a href="'+roleHome()+'">'+ic('layout-dashboard')+'Dashboard</a>')
      +'<div class="sep"></div><button data-act="logout">'+ic('log-out')+'Sign out</button></div></div>'
    :'<a class="btn btn-ghost btn-sm" href="#/login">Log in</a><a class="btn btn-red btn-sm" href="#/register">Sign up</a>')
  +'<button class="icon-btn burger" data-act="m-open" aria-label="Menu">'+ic('menu')+'</button>'
  +'</div></div></nav>'
  +'<div class="mnav" data-mnav><button class="icon-btn x" data-act="m-close" aria-label="Close">'+ic('x')+'</button>'
  +NAV_LINKS.map(l=>'<a href="'+l[0]+'" data-act="m-close">'+esc(L(l[2]))+ic('arrow-up-right')+'</a>').join('')
  +'<a href="#/cart" data-act="m-close">Cart '+ic('shopping-bag')+'</a>'
  +(u
    ?'<a href="'+roleHome()+'" data-act="m-close">Dashboard '+ic('layout-dashboard')+'</a><a href="#/login" data-act="logout">Sign out '+ic('log-out')+'</a>'
    :'<a href="#/login" data-act="m-close">Log in '+ic('log-in')+'</a>')
  +'<div class="mfoot">'+esc(SET().hours)+'<br>'+esc(SET().phone)+'</div></div>';
}
const footerHTML=()=>{const s=SET(),c=db.content;
  return '<footer class="grain"><div class="wrap"><div class="fgrid">'
  +'<div>'+logoHTML()+'<p style="margin-top:14px">'+esc(c.footerNote)+' '+esc(c.storyBody.split('.')[0])+'.</p>'
  +'<div class="socials">'+socialA('instagram')+''+socialA('facebook')+''+socialA('twitter')+'</div></div>'
  +'<div><h4>'+esc(L('foot_explore'))+'</h4><a href="#/menu">'+esc(L('nav_menu'))+'</a><a href="#/branches">'+esc(L('nav_branches'))+'</a><a href="#/offers">'+esc(L('nav_offers'))+'</a><a href="#/about">'+esc(L('nav_about'))+'</a><a href="#/contact">'+esc(L('nav_contact'))+'</a></div>'
  +'<div><h4>'+esc(L('foot_order'))+'</h4><a href="#/menu">Delivery</a><a href="#/menu">Takeaway</a><a href="#/track">Track an order</a><a href="#/account/orders">My orders</a><a href="#/cart">Cart</a></div>'
  +'<div><h4>'+esc(L('foot_visit'))+'</h4><p>'+ic('map-pin')+' '+esc(s.address)+'<br>'+ic('phone')+' '+esc(s.phone)+'<br>'+ic('mail')+' '+esc(s.email)+'<br>'+ic('clock')+' '+esc(s.hours)+'</p></div>'
  +'</div><div class="fbot"><span>© '+new Date().getFullYear()+' '+esc(s.name)+'. All rights reserved.</span><span>Crafted over live fire · '+esc(s.est)+'</span></div></div></footer>';
};
function denied(msg){
  return '<div class="denied"><div><div class="big">403</div><h2 style="margin:16px 0 8px">Access denied</h2><p class="muted" style="max-width:380px;margin:0 auto 24px">'+esc(msg||'Your account does not have permission to view this area.')+'</p><a class="btn btn-red" href="'+roleHome()+'">Back to my dashboard</a></div></div>';
}
let _fk=null;
function refocusRestore(){
  if(!_fk)return;
  const el=document.querySelector('[data-input="'+_fk+'"]');
  if(el){el.focus();try{const L=el.value.length;el.setSelectionRange(L,L)}catch(e){}}
  _fk=null;
}
const PAGE_ROOT_ROUTES = {
  home: 'home', menu: 'menu', branches: 'branches', offers: 'offers', about: 'about', contact: 'contact',
  cart: 'cart', checkout: 'checkout', order: 'order', track: 'track', login: 'login', register: 'register',
  forgot: 'forgot', reset: 'reset'
};
const PAGE_TAB_ROUTES = {
  account: ['overview', 'orders', 'reviews', 'favorites', 'addresses', 'notifications', 'profile', 'settings'],
  manager: ['board', 'orders', 'notifications', 'profile'],
  admin: ['overview', 'orders', 'menu', 'categories', 'branches', 'customers', 'promotions', 'reviews', 'notifications', 'reports', 'content', 'users', 'settings', 'audit', 'profile']
};
function pageSlugForRoute(route) {
  const clean = String(route || '/').replace(/^#/, '').split('?')[0];
  const parts = clean.split('/').filter(Boolean);
  const root = parts[0] || 'home';
  if (PAGE_TAB_ROUTES[root]) {
    const tab = parts[1] || (root === 'manager' ? 'board' : 'overview');
    return PAGE_TAB_ROUTES[root].includes(tab) ? root + '-' + tab : root + '-' + (root === 'manager' ? 'board' : 'overview');
  }
  return PAGE_ROOT_ROUTES[root] || 'home';
}
function pageRouteHref(route) {
  const clean = String(route || '/').replace(/^#/, '') || '/';
  const slug = pageSlugForRoute(clean);
  const prefix = document.body.dataset.entry === 'root' ? 'pages/' : './';
  const dynamicRoute = /^\/(?:order|track)\/[^/]+/.test(clean);
  return prefix + slug + '.html' + (dynamicRoute ? '#' + clean : '');
}
function syncPageFiles(route) {
  const slug = pageSlugForRoute(route);
  document.body.dataset.page = slug;
  const prefix = document.body.dataset.entry === 'root' ? '' : '../';
  const stylesheet = document.getElementById('page-stylesheet');
  const stylePath = prefix + 'assets/css/pages/' + slug + '.css';
  if (stylesheet && stylesheet.getAttribute('href') !== stylePath) stylesheet.setAttribute('href', stylePath);
  const scriptPath = prefix + 'assets/js/pages/' + slug + '.js';
  const loaded = [...document.scripts].some(script => script.dataset.pageFile === slug);
  if (!loaded) {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.dataset.pageFile = slug;
    document.body.appendChild(script);
  }
}
function rewritePageLinks() {
  app.querySelectorAll('a[href^="#/"]').forEach(link => {
    if (link.dataset.act) return;
    const route = link.getAttribute('href').slice(1);
    link.setAttribute('href', pageRouteHref(route));
  });
}
async function render(){
  try{
    closeModal(); document.body.style.overflow='';
    const h=location.hash.replace(/^#/,'')||window.EV_INITIAL_ROUTE||'/';
    const parts=h.split('/').filter(Boolean), u=me();
    let html='', active='#/';
    const root=parts[0]||'home';
    if(root==='home'){html=Home();}
    else if(root==='menu'){active='#/menu';html=Menu();}
    else if(root==='branches'){active='#/branches';html=Branches();}
    else if(root==='offers'){active='#/offers';html=Offers();}
    else if(root==='about'){active='#/about';html=About();}
    else if(root==='contact'){active='#/contact';html=Contact();}
    else if(root==='cart'){html=CartPage();}
    else if(root==='checkout'){
      if(!u){ui.next='/checkout';toast('Please log in to continue your order','info');location.hash='#/login';return}
      html=Checkout();
    }
    else if(root==='order'){html=OrderConfirm(parts[1]);}
    else if(root==='track'){html=Track(parts[1]);}
    else if(root==='login'||root==='register'||root==='forgot'||root==='reset'){html=Auth(root);}
    else if(root==='account'){
      if(!u){ui.next='/account';toast('Please log in to view your account','info');location.hash='#/login';return}
      ui.acctTab=parts[1]||'overview'; html=Account();
    }
    else if(root==='manager'){
      if(!u||(u.role!=='MANAGER'&&u.role!=='ADMIN')){html=denied('This area is restricted to restaurant managers.');}
      else{ui.mgrTab=parts[1]||'board'; html=Manager();}
    }
    else if(root==='admin'){
      if(!u||u.role!=='ADMIN'){html=denied('This area is restricted to platform administrators.');}
      else{ui.adminTab=parts[1]||'overview'; html=Admin();}
    }
    else{html=denied('Page not found.');}
    app.innerHTML=html; syncPageFiles(location.hash.replace(/^#/,'')||window.EV_INITIAL_ROUTE||''); rewritePageLinks(); icons(); observeRv(); mountCharts(); bindHero(); refocusRestore(); window.scrollTo(0,0);
  }catch(err){
    console.error(err);
    app.innerHTML='<div class="denied"><div><div class="big">!</div><h2 style="margin:16px 0 8px">Rendering error</h2><p class="muted" style="max-width:440px;margin:0 auto 20px">'+esc(err.message)+'</p><a class="btn btn-red" href="#/">Back home</a></div></div>';
    icons();
  }
}
window.addEventListener('hashchange',render);
let _obs=null;
function observeRv(){
  const els=$$('.rv');
  if(!('IntersectionObserver' in window)||reduced){els.forEach(el=>el.classList.add('in'));return}
  _obs&&_obs.disconnect();
  _obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');_obs.unobserve(e.target)}}),{threshold:.12});
  els.forEach(el=>_obs.observe(el));
}
function counters(){
  $$('[data-count]').forEach(el=>{
    const target=+el.dataset.count, t0=performance.now();
    (function fr(t){const k=reduced?1:Math.min(1,(t-t0)/1200),e=1-Math.pow(1-k,3);
      el.textContent=Math.round(target*e).toLocaleString(); if(k<1)requestAnimationFrame(fr)})(t0);
  });
}
function bindHero(){
  const stage=$('.hero-stage'); if(!stage||reduced)return;
  const dish=stage.querySelector('.hero-dish');
  if(dish){
    stage.addEventListener('mousemove',e=>{
      const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      dish.style.transform='rotateY('+(x*14)+'deg) rotateX('+(-y*10)+'deg) translate('+(x*14)+'px,'+(y*10)+'px)';
    });
    stage.addEventListener('mouseleave',()=>dish.style.transform='');
  }
  for(let i=0;i<16;i++){const em=document.createElement('span');em.className='ember';
    em.style.cssText='left:'+(8+Math.random()*84)+'%;animation-duration:'+(4+Math.random()*5)+'s;animation-delay:'+(Math.random()*6)+'s;width:'+(3+Math.random()*3)+'px;height:'+(3+Math.random()*3)+'px';
    stage.appendChild(em);}
  counters();
}
function foodCard(p,delay){
  const u=me();
  const fav=u&&db.favorites.some(f=>f.userId===u.id&&f.productId===p.id);
  return '<article class="fcard rv '+(delay||'')+(p.available?'':' unavail')+'" data-pid="'+p.id+'">'
  +'<div class="fimg" data-act="food" data-id="'+p.id+'">'+dishArt(p)
  +'<span class="avail-b">'+(p.available?'<span class="tag g">'+ic('clock')+' '+p.prep+' min</span>':stBadge('Unavailable'))+'</span>'
  +'<button class="heart'+(fav?' on':'')+'" data-act="fav" data-id="'+p.id+'" aria-label="Favorite">'+ic('heart')+'</button></div>'
  +'<div class="fbody"><span class="cat">'+esc(catName(p.cat))+'</span>'
  +'<div class="ftitle"><h3 data-act="food" data-id="'+p.id+'">'+esc(p.name)+'</h3><span class="price">'+money(p.price)+'</span></div>'
  +'<p class="fdesc">'+esc(p.desc)+'</p>'
  +'<div class="fmeta"><span>'+stars(p.rating)+'</span><span>'+p.rating.toFixed(1)+'</span>'+(p.popular?'<span class="tag">Popular</span>':'')+(p.featured?'<span class="tag w">Chef\'s pick</span>':'')+'</div>'
  +'<div class="fact">'+(p.available
    ?'<button class="btn btn-red btn-sm" data-act="add" data-id="'+p.id+'">'+ic('plus')+'Add to cart</button><button class="btn btn-line btn-sm" data-act="food" data-id="'+p.id+'">Details</button>'
    :'<button class="btn btn-line btn-sm" disabled>'+ic('x-circle')+'Unavailable</button>')+'</div>'
  +'</div></article>';
}
function gridOf(list){
  return list.length
    ?'<div class="mgrid" style="padding-top:0">'+list.map(p=>foodCard(p)).join('')+'</div>'
    :'<div style="padding:20px 0 80px">'+empty('search','No dishes match your search','Try a different keyword, category or clear your filters.','<a class="btn btn-dark btn-sm" href="#/menu">Clear filters</a>')+'</div>';
}
function refreshMenuGrid(){
  const w=$('#mgrid-wrap');
  if(w){w.innerHTML=gridOf(filteredProducts()); icons(); observeRv();}
}
function Home(){
  const c=db.content, featured=db.products.filter(p=>p.featured&&p.available).slice(0,6);
  const popular=db.products.filter(p=>p.popular).slice(0,7);
  const promo=db.coupons.filter(x=>x.active&&x.expires>now()).sort((a,b)=>b.value-a.value)[0];
  const quotes=db.reviews.filter(r=>!r.hidden).slice(0,3);
  const words=c.heroTitle.split(' ').map((x,i)=>'<span class="w" style="animation-delay:'+(.15+i*.07).toFixed(2)+'s">'+esc(x)+'</span>').join('');
  const st=c.storyTitle.split(' meets ');
  return navHTML('#/')
  +'<header class="hero grain"><div class="wrap hero-in"><div>'
  +'<span class="kicker on-dark">'+esc(c.heroTag)+'</span>'
  +'<h1>'+words+'</h1>'
  +'<p class="lead">'+esc(c.heroDesc)+'</p>'
  +'<div class="cta"><a class="btn btn-red" href="#/menu" style="padding:15px 30px;font-size:15px">'+ic('flame')+esc(L('hero_btn1'))+'</a><a class="btn btn-ghost" href="#/menu" style="padding:15px 30px;font-size:15px">'+esc(L('hero_btn2'))+'</a></div>'
  +'<div class="hero-meta">'+listOf(c.heroMeta).map((x,i)=>'<span>'+ic(['bike','flame','store'][i%3])+esc(x)+'</span>').join('')+'</div></div>'
  +'<div class="hero-stage"><div class="halo"></div><div class="ring"></div><div class="ring r2"></div>'
  +'<span class="float-i" style="top:12%;left:8%">'+ic('leaf')+'</span>'
  +'<span class="float-i" style="top:22%;right:6%;animation-delay:1.4s">'+ic('flame')+'</span>'
  +'<span class="float-i" style="bottom:16%;left:2%;animation-delay:2.6s">'+ic('sparkles')+'</span>'
  +'<div class="hero-dish">'+(c.heroImage?'<img src="'+c.heroImage+'" alt="Ember &amp; Vine signature burger" loading="eager" decoding="async" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:50%;display:block">':heroBurger())+'</div></div>'
  +'</div></header>'
  +'<div class="marq"><div>'+Array(2).fill(listOf(c.marquee).map(x=>'<span>'+esc(x)+'</span><i>✦</i>').join('')).join('')+'</div></div>'
  +'<section class="sec"><div class="wrap story">'
  +'<div class="art rv"><div class="ph">'+aboutSteakPhoto()+'</div><span class="cap">Ribeye · 28 days dry-aged</span></div>'
  +'<div class="rv d1"><span class="kicker">'+esc(L('k_craft'))+'</span>'
  +'<blockquote>&ldquo;'+esc(st[0])+' meets <b>'+esc(st[1]||'craftsmanship')+'</b>.&rdquo;</blockquote>'
  +'<p>'+esc(c.storyBody)+'</p><p>Four kitchens, one fire. Every dish leaves the pass at the exact moment it should.</p>'
  +'<a class="btn btn-dark" href="#/about" style="margin-top:8px">'+esc(L('k_story_btn'))+' '+ic('arrow-right')+'</a></div>'
  +'</div></section>'
  +'<section class="sec dark grain" style="padding-top:70px"><div class="wrap">'
  +'<div class="sec-h rv"><div><span class="kicker on-dark">'+esc(L('k_featured'))+'</span><h2>'+em2(c.featuredTitle)+'</h2></div><a class="btn btn-ghost btn-sm" href="#/menu">Full menu '+ic('arrow-right')+'</a></div>'
  +'<div class="rail">'+featured.map((p,i)=>foodCard(p,['','d1','d2','d3','d1','d2'][i%6])).join('')+'</div>'
  +'</div></section>'
  +'<section class="sec"><div class="wrap">'
  +'<div class="sec-h rv"><div><span class="kicker">'+esc(L('k_popular'))+'</span><h2>'+em2(c.popularTitle)+'</h2></div><p>'+esc(c.popularSubtitle)+'</p></div>'
  +'<div class="mosaic">'+popular.map((p,i)=>foodCard(p,i<4?['','d1','d2','d3'][i]:'d1')).join('')+'</div>'
  +'</div></section>'
  +(promo
    ?'<section class="sec" style="padding-top:0"><div class="wrap"><div class="offer grain rv">'
      +'<div class="txt"><span class="kicker on-dark">Limited offer · ends '+fmtD(promo.expires)+'</span>'
      +'<h3>'+esc(c.offerTitle)+'<em> — save big</em></h3>'
      +'<p style="color:#d8b9b9;max-width:440px">'+esc(c.offerDesc)+'</p>'
      +'<div class="code">'+esc(promo.code)+'<button data-act="copy-code" data-code="'+esc(promo.code)+'">'+ic('copy')+'Copy</button></div>'
      +'<div><a class="btn btn-red" href="#/menu">Order with this deal '+ic('arrow-right')+'</a></div></div>'
      +'<div class="art">'+dishSVG('burger')+'</div></div></div></section>'
    :'')
  +(quotes.length
    ?'<section class="sec dark grain"><div class="wrap">'
      +'<div class="sec-h rv"><div><span class="kicker on-dark">'+esc(L('k_quotes'))+'</span><h2>'+em2(c.quotesTitle)+'</h2></div></div>'
      +'<div class="quotes rv">'+quotes.map(q=>{const u=userById(q.customerId),p=prod(q.productId);
        return '<div class="quote">'+stars(q.rating)+'<p class="q">&ldquo;'+esc(q.comment)+'&rdquo;</p>'
        +'<div class="who"><span class="av">'+esc((u&&u.name||'G')[0])+'</span><div><b>'+esc(u&&u.name||'Guest')+'</b><span>on '+esc(p?p.name:'a dish')+'</span></div></div></div>'}).join('')+'</div>'
      +'</div></section>'
    :'')
  +'<section class="sec deep grain"><div class="wrap nums">'
  +'<div class="rv"><div class="n"><span data-count="'+(new Date().getFullYear()-2014)+'">0</span><b>+</b></div><span>Years of fire</span></div>'
  +'<div class="rv d1"><div class="n"><span data-count="'+db.products.length+'">0</span></div><span>Dishes crafted</span></div>'
  +'<div class="rv d2"><div class="n"><span data-count="'+db.branches.filter(b=>b.status).length+'">0</span></div><span>Branches</span></div>'
  +'<div class="rv d3"><div class="n"><span data-count="'+Math.max(120,db.orders.length*7)+'">0</span><b>k</b></div><span>Guests served</span></div>'
  +'</div></section>'
  +'<section class="band grain"><span class="kicker on-dark" style="justify-content:center">'+esc(L('k_cta'))+'</span>'
  +'<h2>'+em2(c.ctaTitle)+'</h2>'
  +'<p>'+esc(c.ctaText)+'</p>'
  +'<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap"><a class="btn btn-red" href="#/menu" style="padding:15px 30px">'+ic('flame')+esc(L('cta_btn1'))+'</a><a class="btn btn-ghost" href="#/branches" style="padding:15px 30px">'+ic('map-pin')+esc(L('cta_btn2'))+'</a></div></section>'
  +footerHTML();
}
function filteredProducts(){
  const f=ui.menu, catIds=f.cat==='all'?visibleCats().map(c=>c.id):[f.cat];
  let list=db.products.filter(p=>catIds.indexOf(p.cat)>=0);
  if(f.q){const q=f.q.toLowerCase(); list=list.filter(p=>(p.name+' '+p.desc+' '+p.ing+' '+catName(p.cat)).toLowerCase().indexOf(q)>=0);}
  if(f.minR)list=list.filter(p=>p.rating>=f.minR);
  if(f.maxP<60)list=list.filter(p=>p.price<=f.maxP);
  if(f.avail)list=list.filter(p=>p.available);
  if(f.pop)list=list.filter(p=>p.popular);
  if(f.feat)list=list.filter(p=>p.featured);
  if(f.sort==='price-asc')list=[...list].sort((a,b)=>a.price-b.price);
  else if(f.sort==='price-desc')list=[...list].sort((a,b)=>b.price-a.price);
  else if(f.sort==='rating')list=[...list].sort((a,b)=>b.rating-a.rating);
  else list=[...list].sort((a,b)=>((b.popular?1:0)-(a.popular?1:0))||(b.rating-a.rating));
  return list;
}
function Menu(){
  const cats=visibleCats(), f=ui.menu;
  return navHTML('#/menu')
  +'<header class="phead grain"><div class="wrap"><span class="kicker on-dark">'+esc(L('menu_kicker'))+'</span><h1>'+em2(L('menu_title'))+'</h1><p>'+esc(L('menu_sub'))+'</p></div></header>'
  +'<div class="mtools"><div class="wrap"><div class="r1">'
  +'<div class="srch">'+ic('search')+'<input class="in" placeholder="Search dishes, ingredients…" value="'+esc(f.q)+'" data-input="menu-q" aria-label="Search menu"></div>'
  +'<div class="mbar">'
  +'<label class="ck"><input type="checkbox" data-chg="mf" data-k="avail"'+(f.avail?' checked':'')+'>Available only</label>'
  +'<label class="ck"><input type="checkbox" data-chg="mf" data-k="pop"'+(f.pop?' checked':'')+'>Popular</label>'
  +'<label class="ck"><input type="checkbox" data-chg="mf" data-k="feat"'+(f.feat?' checked':'')+'>Chef\'s picks</label>'
  +'<select class="in" data-chg="mf" data-k="minR" aria-label="Minimum rating"><option value="0">Any rating</option><option value="4"'+(f.minR==4?' selected':'')+'>4.0+</option><option value="4.5"'+(f.minR==4.5?' selected':'')+'>4.5+</option><option value="4.8"'+(f.minR==4.8?' selected':'')+'>4.8+</option></select>'
  +'<label style="display:flex;gap:8px;align-items:center">Under <b id="pv">'+money(f.maxP)+'</b><input type="range" min="5" max="60" value="'+f.maxP+'" data-chg="mf-range" style="accent-color:var(--red);width:110px"></label>'
  +'<select class="in" data-chg="mf" data-k="sort" aria-label="Sort"><option value="popular"'+(f.sort==='popular'?' selected':'')+'>Most popular</option><option value="price-asc"'+(f.sort==='price-asc'?' selected':'')+'>Price: low → high</option><option value="price-desc"'+(f.sort==='price-desc'?' selected':'')+'>Price: high → low</option><option value="rating"'+(f.sort==='rating'?' selected':'')+'>Top rated</option></select>'
  +'</div></div>'
  +'<div class="cats">'
  +'<button class="chip '+(f.cat==='all'?'on red':'')+'" data-act="cat" data-id="all">All · '+db.products.filter(p=>cats.some(c=>c.id===p.cat)).length+'</button>'
  +cats.map(c=>'<button class="chip '+(f.cat===c.id?'on red':'')+'" data-act="cat" data-id="'+c.id+'">'+esc(c.name)+' · '+catProducts(c.id).length+'</button>').join('')
  +'</div></div></div>'
  +'<div class="wrap" id="mgrid-wrap">'+gridOf(filteredProducts())+'</div>'
  +footerHTML();
}
function openSizePicker(p){
  const sizes=pizzaSizes(p);
  modal('<div style="padding:28px"><h3 class="disp" style="font-size:22px;margin-bottom:4px">'+esc(p.name)+'</h3>'
  +'<p class="muted" style="font-size:13px;margin-bottom:16px">Choose a size to add it to your cart.</p>'
  +sizes.map((s,i)=>'<button type="button" class="opt" style="width:100%;margin-bottom:10px;display:block" data-act="size-add" data-id="'+p.id+'" data-i="'+i+'"><div class="t"><span>'+esc(s.name)+'</span><b class="price" style="font-size:16px">'+money(s.price)+'</b></div></button>').join('')
  +'</div>');
}
function openFood(id){
  const p=prod(id); if(!p)return;
  if(!p.available){toast('This dish is currently unavailable.','err');return}
  const groups=(CAT_MODS[p.cat]||[]).map(g=>MOD_GROUPS[g]);
  const sel={}; groups.forEach(g=>{if(g.type==='single')sel[g.name]=0;});
  ui.fd={id,qty:1,sel,pizzaSizeIdx:0};
  paintFoodModal();
}
function fdPrice(){
  const p=prod(ui.fd.id); let v=p.cat==='c1'?pizzaSizes(p)[ui.fd.pizzaSizeIdx||0].price:p.price;
  (CAT_MODS[p.cat]||[]).forEach(k=>{
    const g=MOD_GROUPS[k],sel=ui.fd.sel[g.name];
    if(sel!=null){if(g.type==='single')v+=g.opts[sel].p; else sel.forEach(i=>v+=g.opts[i].p);}
  });
  return v;
}
function paintFoodModal(){
  const p=prod(ui.fd.id), st=ui.fd, groups=(CAT_MODS[p.cat]||[]).map(g=>MOD_GROUPS[g]);
  const u=me();
  const fav=u&&db.favorites.some(f=>f.userId===u.id&&f.productId===p.id);
  modal('<div class="fm"><div class="im">'+dishArt(p)+'</div>'
  +'<div class="inf">'
  +'<span style="font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--gray)">'+esc(catName(p.cat))+'</span>'
  +'<h2 class="disp">'+esc(p.name)+'</h2>'
  +'<div class="fmeta"><span>'+stars(p.rating)+'</span><span>'+p.rating.toFixed(1)+'</span><span>'+ic('clock')+p.prep+' min</span>'+(p.available?stBadge('Available'):stBadge('Unavailable'))+'</div>'
  +'<p class="muted" style="font-size:13.5px">'+esc(p.desc)+'</p>'
  +'<p style="font-size:12.5px;color:var(--gray)"><b style="color:var(--text)">Ingredients:</b> '+esc(p.ing)+'</p>'
  +(p.cat==='c1'?'<div class="modg"><div class="gt">Size</div><div class="mrow">'
    +pizzaSizes(p).map((s,i)=>'<button class="mpick'+(i===(st.pizzaSizeIdx||0)?' on':'')+'" data-act="fdsize" data-i="'+i+'">'+esc(s.name)+'<small>'+money(s.price)+'</small></button>').join('')
    +'</div></div>':'')
  +groups.map(g=>'<div class="modg"><div class="gt">'+esc(g.name)+(g.type==='multi'?' · choose any':'')+'</div><div class="mrow">'
    +g.opts.map((o,i)=>{
      const on=g.type==='single'?st.sel[g.name]===i:((st.sel[g.name]||[]).indexOf(i)>=0);
      return '<button class="mpick'+(on?' on':'')+'" data-act="mod" data-g="'+esc(g.name)+'" data-i="'+i+'">'+esc(o.n)+(o.p?'<small>+'+money(o.p)+'</small>':'')+'</button>';
    }).join('')+'</div></div>').join('')
  +'<div class="modg" style="display:flex;align-items:center;gap:14px;margin-top:auto;padding-top:18px;flex-wrap:wrap">'
  +'<div class="qty"><button data-act="fdq" data-d="-1" aria-label="Decrease">'+ic('minus')+'</button><b data-fdqty>'+st.qty+'</b><button data-act="fdq" data-d="1" aria-label="Increase">'+ic('plus')+'</button></div>'
  +'<button class="heart'+(fav?' on':'')+'" data-act="fav" data-id="'+p.id+'" style="position:static;background:var(--hairline)" aria-label="Favorite">'+ic('heart')+'</button>'
  +(p.available
    ?'<button class="btn btn-red" style="flex:1" data-act="add-modal">Add to cart · <span data-fdprice>'+money(fdPrice()*st.qty)+'</span></button>'
    :'<button class="btn btn-line" style="flex:1" disabled>Unavailable</button>')
  +'</div></div></div>',true);
}
function CartPage(){
  const cart=cartGet(), sub=cartSubtotal();
  const cp=ui.coupon?couponCheck(ui.coupon,sub):null;
  const disc=cp&&cp.disc?cp.disc:0;
  const free=SET().freeOver&&sub-disc>=SET().freeOver;
  const fee=free?0:2.99, tax=(sub-disc)*SET().taxRate/100, total=sub-disc+fee+tax;
  const body=cart.length
    ?'<div class="clist">'+cart.map(it=>{
      const p=prod(it.productId);
      return '<div class="citem"><a class="im" href="#/menu" title="'+esc(it.name)+'">'+dishArt(p)+'</a>'
      +'<div class="inf"><h4 class="disp">'+esc(it.name)+'</h4><div class="mods">'+(it.mods.length?esc(it.mods.join(' · ')):'<span style="color:#c9c8c4">No modifications</span>')+' · '+money(it.unit)+' each</div>'
      +'<div class="qty" style="margin-top:8px"><button data-act="cq" data-key="'+esc(it.key)+'" data-d="-1" aria-label="Less">'+ic('minus')+'</button><b>'+it.qty+'</b><button data-act="cq" data-key="'+esc(it.key)+'" data-d="1" aria-label="More">'+ic('plus')+'</button></div></div>'
      +'<div class="rt"><b class="price">'+money(it.unit*it.qty)+'</b><button class="icon-btn rm" data-act="crm" data-key="'+esc(it.key)+'" aria-label="Remove">'+ic('trash-2')+'</button></div></div>';
    }).join('')
    +'<div style="display:flex;justify-content:space-between;padding:6px 4px"><a class="btn btn-line btn-sm" href="#/menu">'+ic('plus')+'Add more dishes</a>'
    +'<button class="btn btn-sm" style="color:var(--wine)" data-act="clear-cart">'+ic('trash-2')+'Clear cart</button></div></div>'
    :empty('shopping-bag','Your cart is empty','Fire up your appetite — browse the menu and add something worth staying in for.','<a class="btn btn-red" href="#/menu">Browse the menu</a>');
  return navHTML('#/cart')+'<div class="wrap cartpage">'
  +'<div><span class="kicker">Your order</span><h2 class="disp" style="font-size:34px;margin:10px 0 22px">The <em style="color:var(--red);font-style:italic">cart</em></h2>'+body+'</div>'
  +(cart.length
    ?'<aside class="sum"><h3 class="disp">Summary</h3>'
    +'<div class="cp"><input class="in" placeholder="Coupon code" value="'+esc(ui.coupon||'')+'" data-input="coupon" aria-label="Coupon"><button class="btn btn-dark btn-sm" data-act="apply-coupon">Apply</button></div>'
    +(ui.coupon
      ?(cp&&cp.disc
        ?'<div class="conote" style="margin:0 0 12px">'+ic('check-circle-2')+'<span><b>'+esc(ui.coupon)+'</b> applied — you save '+money(cp.disc)+'. <button class="ta" style="color:var(--wine);text-decoration:underline;font-weight:700" data-act="rm-coupon">Remove</button></span></div>'
        :'<div class="conote bad" style="margin:0 0 12px">'+ic('alert-triangle')+'<span>'+esc(cp?cp.err:'Invalid coupon')+' <button class="ta" style="color:var(--wine);text-decoration:underline;font-weight:700" data-act="rm-coupon">Clear</button></span></div>')
      :'')
    +'<div class="ln"><span>Subtotal</span><b>'+money(sub)+'</b></div>'
    +'<div class="ln"><span>Discount</span><b class="off">'+(disc?'−'+money(disc):money(0))+'</b></div>'
    +'<div class="ln"><span>Delivery fee (est.)'+(free?' <span class="strike">'+money(2.99)+'</span>':'')+'</span><b class="'+(free?'off':'')+'">'+(free?'Free':money(fee))+'</b></div>'
    +'<div class="ln"><span>Tax ('+SET().taxRate+'%)</span><b>'+money(tax)+'</b></div>'
    +(SET().freeOver&&sub-disc<SET().freeOver?'<p class="hint" style="margin:4px 0">Add '+money(SET().freeOver-(sub-disc))+' more for free delivery.</p>':'')
    +'<div class="ln tot"><span>Total</span><b>'+money(total)+'</b></div>'
    +'<a class="btn btn-red" style="width:100%;margin-top:16px" href="#/checkout">Checkout '+ic('arrow-right')+'</a>'
    +'<p class="hint" style="text-align:center;margin-top:10px">Cash on delivery · Pay at restaurant</p></aside>'
    :'')
  +'</div>'+footerHTML();
}
function defaultCo(){
  const u=me();
  return {step:1,name:u?u.name:'',phone:u?u.phone:'',branchId:null,method:'delivery',
    addr:{line:u&&u.address||'',apt:'',note:''},coords:null,src:'',dist:null,coupon:ui.coupon||null,payment:'cod',pickupAt:''};
}
function syncDist(){
  const co=ui.co;
  if(co&&co.coords&&co.branchId){const b=branch(co.branchId); co.dist=b?Math.round(distKm(co.coords,b)*10)/10:null;}
}
function Checkout(){
  if(!ui.co)ui.co=defaultCo();
  const co=ui.co, cart=cartGet();
  if(!cart.length)return navHTML()+'<div class="wrap" style="padding:60px 0">'+empty('shopping-bag','Your cart is empty','Add a few dishes before checking out.','<a class="btn btn-red" href="#/menu">Browse menu</a>')+'</div>'+footerHTML();
  const sub=cartSubtotal();
  const cp=co.coupon?couponCheck(co.coupon,sub):null;
  const disc=cp&&cp.disc?cp.disc:0;
  const b=co.branchId?branch(co.branchId):null;
  let fee=0, radiusErr=null, closedNote=null, eta=30;
  if(b){
    const maxPrep=Math.max.apply(null,cart.map(i=>{const p=prod(i.productId);return p?p.prep:15}));
    eta=co.method==='delivery'?maxPrep+25:maxPrep+10;
    if(co.method==='delivery'){
      if(!b.delivery){closedNote=b.name+' does not offer delivery — you can switch to takeaway on the next step, or pick another branch.';}
      else if(co.coords&&co.dist!=null&&co.dist>b.radius){
        radiusErr='Delivery unavailable for this location — '+b.name+' delivers within '+b.radius+' km (you are ~'+co.dist+' km away).';
      }
      fee=(SET().freeOver&&sub-disc>=SET().freeOver)?0:b.fee;
    }
  }
  const tax=(sub-disc)*SET().taxRate/100, total=sub-disc+fee+tax;
  const steps=['Contact','Branch','Method','Details','Coupon','Review'];
  const myAddrs=db.addresses.filter(a=>a.userId===me().id);
  const stepBodies={
    1:'<h3>Contact information</h3><form data-form="co1" novalidate>'
    +fld('Full name',inpF('name','Your name',co.name))
    +fld('Mobile number',inpF('phone','+1 (555) 000-0000',co.phone,'tel'))
    +'<div class="ferr" data-err></div>'
    +'<div class="co-nav"><span></span><button class="btn btn-red">Continue '+ic('arrow-right')+'</button></div></form>',
    2:'<h3>Choose a branch</h3>'
    +'<div class="zonebar" style="margin:0 0 16px"><button type="button" class="btn btn-line btn-sm" data-act="detect">'+ic('locate-fixed')+'Use my location</button>'
    +ZONES.map(z=>'<button type="button" class="zchip'+(co.coords&&co.src===z.n?' on':'')+'" data-act="zone" data-z="'+esc(z.n)+'">'+esc(z.n)+'</button>').join('')+'</div>'
    +(co.coords
      ?'<p class="hint" style="margin-bottom:14px">'+ic('check-circle-2')+' Location set: <b>'+esc(co.src)+'</b>'+(co.dist!=null&&b?' · ~'+co.dist+' km from '+esc(b.name):'')+'</p>'
      :'<p class="hint" style="margin-bottom:14px">Optional — set a location to check delivery radius. You can also just pick a branch.</p>')
    +'<div class="optgrid">'+db.branches.filter(x=>x.status).map(x=>{
      const open=isOpen(x), d=co.coords?Math.round(distKm(co.coords,x)*10)/10:null;
      const far=co.method==='delivery'&&x.delivery&&d!=null&&d>x.radius;
      return '<div class="opt'+(co.branchId===x.id?' sel':'')+'" data-act="branch-pick" data-id="'+x.id+'" role="button" tabindex="0">'
      +'<div class="t"><span>'+esc(x.name)+'</span>'+(open?okBadge('Open'):stBadge('Closed'))+'</div>'
      +'<div class="s">'+esc(x.address)+'</div>'
      +'<div class="s" style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap">'
      +(d!=null?'<span class="tag g">~'+d+' km</span>':'')
      +(x.delivery?'<span class="tag g">Delivery · '+money(x.fee)+'</span>':'<span class="tag w">No delivery</span>')
      +(x.takeaway?'<span class="tag g">Takeaway</span>':'<span class="tag w">No pickup</span>')
      +(far?'<span class="tag" style="background:rgba(230,0,43,.12)">Outside radius</span>':'')
      +'</div></div>';
    }).join('')+'</div>'
    +(radiusErr?'<div class="conote bad">'+ic('alert-triangle')+'<span>'+esc(radiusErr)+'</span></div>':'')
    +(closedNote?'<div class="conote">'+ic('info')+'<span>'+esc(closedNote)+'</span></div>':'')
    +'<div class="co-nav"><button type="button" class="btn btn-line" data-act="co-back">'+ic('chevron-left')+'Back</button><button type="button" class="btn btn-red" data-act="co-branch-next">Continue '+ic('arrow-right')+'</button></div>',
    3:'<h3>Delivery or takeaway?</h3><div class="optgrid">'
    +'<div class="opt'+(co.method==='delivery'?' sel':'')+'" data-act="method" data-m="delivery" role="button" tabindex="0"><div class="t">'+ic('bike')+' Delivery</div><div class="s">Cooked and rushed to your door'+(b?' · '+money(b.fee)+' fee':'')+'</div></div>'
    +'<div class="opt'+(co.method==='takeaway'?' sel':'')+'" data-act="method" data-m="takeaway" role="button" tabindex="0"><div class="t">'+ic('shopping-bag')+' Takeaway</div><div class="s">Skip the fee — collect from the branch</div></div></div>'
    +(b&&!b[co.method]?'<div class="conote bad">'+ic('alert-triangle')+'<span>'+esc(b.name)+' has '+esc(co.method)+' disabled. Choose the other option.</span></div>':'')
    +'<div class="co-nav"><button type="button" class="btn btn-line" data-act="co-back">'+ic('chevron-left')+'Back</button><button type="button" class="btn btn-red" data-act="co-method-next">Continue '+ic('arrow-right')+'</button></div>',
    4:co.method==='delivery'
      ?'<h3>Delivery details</h3>'
      +(myAddrs.length?'<div class="modg" style="border:none;padding:0;margin-bottom:16px"><div class="gt">Saved addresses</div><div class="mrow">'
        +myAddrs.map(a=>'<button type="button" class="mpick" data-act="use-addr" data-id="'+a.id+'">'+esc(a.label)+' <small>'+esc(a.line.slice(0,26))+'…</small></button>').join('')+'</div></div>':'')
      +'<form data-form="co4" novalidate>'
      +fld('Street address','<textarea class="in" name="line" placeholder="Street, number, area">'+esc(co.addr.line)+'</textarea>')
      +fld('Apartment / floor',inpF('apt','e.g. Apt 4B, Floor 9',co.addr.apt,'text',false))
      +fld('Delivery instructions',inpF('note','Ring the bell, leave at desk…',co.addr.note,'text',false))
      +'<div class="ferr" data-err></div>'
      +'<div class="co-nav"><button type="button" class="btn btn-line" data-act="co-back">'+ic('chevron-left')+'Back</button><button class="btn btn-red">Continue '+ic('arrow-right')+'</button></div></form>'
      :'<h3>Pickup details</h3><form data-form="co4" novalidate>'
      +fld('Full name',inpF('name','Your name',co.name))
      +fld('Mobile number',inpF('phone','+1 (555) 000-0000',co.phone,'tel'))
      +fld('Pickup time (optional)',inpF('pickupAt','e.g. 19:30',co.pickupAt,'time',false))
      +'<div class="ferr" data-err></div>'
      +'<div class="co-nav"><button type="button" class="btn btn-line" data-act="co-back">'+ic('chevron-left')+'Back</button><button class="btn btn-red">Continue '+ic('arrow-right')+'</button></div></form>',
    5:'<h3>Coupon & payment</h3>'
    +'<div class="cp" style="margin-top:0"><input class="in" placeholder="Coupon code" value="'+esc(co.coupon||'')+'" data-input="co-coupon" aria-label="Coupon"><button type="button" class="btn btn-dark btn-sm" data-act="apply-co-coupon">Apply</button></div>'
    +(co.coupon
      ?(cp&&cp.disc
        ?'<div class="conote">'+ic('check-circle-2')+'<span><b>'+esc(co.coupon)+'</b> applied — '+money(cp.disc)+' off.</span></div>'
        :'<div class="conote bad">'+ic('alert-triangle')+'<span>'+esc(cp?cp.err:'Invalid coupon.')+'</span></div>')
      :'')
    +'<div class="modg" style="margin-top:16px"><div class="gt">Payment method</div><div class="optgrid">'
    +'<div class="opt'+(co.payment==='cod'?' sel':'')+'" data-act="pay" data-p="cod"><div class="t">'+ic('banknote')+' Cash on delivery</div><div class="s">Pay the courier when your food arrives</div></div>'
    +'<div class="opt'+(co.payment==='counter'?' sel':'')+'" data-act="pay" data-p="counter"><div class="t">'+ic('credit-card')+' Pay at '+(co.method==='delivery'?'delivery':'restaurant')+'</div><div class="s">Card or cash at handover / counter</div></div>'
    +'</div></div>'
    +'<div class="co-nav"><button type="button" class="btn btn-line" data-act="co-back">'+ic('chevron-left')+'Back</button><button type="button" class="btn btn-red" data-act="co-coupon-next">Review order '+ic('arrow-right')+'</button></div>',
    6:'<h3>Review & confirm</h3>'
    +(radiusErr?'<div class="conote bad">'+ic('alert-triangle')+'<span>'+esc(radiusErr)+'</span></div>':'')
    +(b&&!isOpen(b)?'<div class="conote bad">'+ic('clock')+'<span>'+esc(b.name)+' is currently closed ('+esc(b.open)+'–'+esc(b.close)+'). Your order will be prepared when they reopen, or pick an open branch.</span></div>':'')
    +'<div class="modg" style="border:none;padding:0;margin-bottom:14px"><div class="gt">Order items</div>'
    +cart.map(i=>'<div style="display:flex;justify-content:space-between;padding:7px 0;font-size:13.5px;border-bottom:1px dashed var(--line)"><span><b>'+i.qty+'×</b> '+esc(i.name)+(i.mods.length?'<br><small class="muted">'+esc(i.mods.join(' · '))+'</small>':'')+'</span><b>'+money(i.unit*i.qty)+'</b></div>').join('')+'</div>'
    +'<div class="optgrid" style="margin-bottom:14px">'
    +'<div class="opt"><div class="t">'+ic('store')+' '+esc(b?b.name:'—')+'</div><div class="s">'+(co.method==='delivery'?'Delivery':'Takeaway')+(co.dist!=null?' · ~'+co.dist+' km':'')+'</div></div>'
    +'<div class="opt"><div class="t">'+ic('clock')+' ~'+eta+' min</div><div class="s">'+(co.method==='delivery'?'Estimated delivery':'Estimated pickup')+(co.method==='takeaway'&&co.pickupAt?' · requested '+esc(co.pickupAt):'')+'</div></div></div>'
    +'<div style="font-size:13.5px;color:var(--gray);line-height:1.7">'+ic('user')+' <b style="color:var(--text)">'+esc(co.name)+'</b> · '+esc(co.phone)+'<br>'
    +(co.method==='delivery'
      ?ic('map-pin')+' '+esc(co.addr.line)+(co.addr.apt?', '+esc(co.addr.apt):'')
      :ic('map-pin')+' Pickup at '+esc(b?b.address:''))+'</div>'
    +'<div class="co-nav"><button type="button" class="btn btn-line" data-act="co-back">'+ic('chevron-left')+'Back</button><button type="button" class="btn btn-red" data-act="place-order"'+(radiusErr?' disabled':'')+'>'+ic('check')+' Place order · '+money(total)+'</button></div>'
  };
  return navHTML()+'<div class="wrap co">'
  +'<div><span class="kicker">Almost there</span><h2 class="disp" style="font-size:32px;margin:10px 0 24px">Checkout</h2>'
  +'<div class="stepper">'+steps.map((s,i)=>'<div class="st'+(i+1<co.step?' done':'')+(i+1===co.step?' cur':'')+'"><span class="n">'+(i+1<co.step?'✓':i+1)+'</span>'+s+'</div>').join('')+'</div>'
  +'<div class="cocard">'+(stepBodies[co.step]||'')+'</div></div>'
  +'<aside class="mini-o"><h4>'+ic('receipt')+' Order summary</h4>'
  +cart.map(i=>'<div style="display:flex;justify-content:space-between;font-size:13px;padding:5px 0;color:var(--gray)"><span>'+i.qty+'× '+esc(i.name)+'</span><b style="color:var(--text)">'+money(i.unit*i.qty)+'</b></div>').join('')
  +'<div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:1px solid var(--line);font-size:14px"><span style="color:var(--gray)">Subtotal</span><b style="color:var(--text)">'+money(sub)+'</b></div>'
  +(disc?'<div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0"><span style="color:var(--gray)">Discount</span><b style="color:var(--ok)">−'+money(disc)+'</b></div>':'')
  +'<div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0"><span style="color:var(--gray)">'+(co.method==='delivery'?'Delivery fee':'Takeaway')+'</span><b style="color:var(--text)">'+(co.method==='delivery'?(fee===0&&disc?'<span style="text-decoration:line-through;margin-right:6px;color:var(--gray)">'+money(b?b.fee:0)+'</span>Free':money(fee)):'No fee')+'</b></div>'
  +'<div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0"><span style="color:var(--gray)">Tax ('+SET().taxRate+'%)</span><b style="color:var(--text)">'+money(tax)+'</b></div>'
  +'<div style="display:flex;justify-content:space-between;font-size:17px;padding:12px 0 0;margin-top:6px;border-top:1px solid var(--line)"><span class="disp" style="font-weight:700">Total</span><b class="price">'+money(total)+'</b></div>'
  +'<p class="hint" style="margin-top:12px">'+ic('shield-check')+' Prices are locked in when you order — later menu changes never affect this order.</p></aside>'
  +'</div>'+footerHTML();
}
async function placeOrder(){
  const co=ui.co, cart=cartGet(), u=me();
  const sub=cartSubtotal();
  for(const it of cart){
    const p=prod(it.productId);
    if(!p||!p.available){toast(it.name+' is no longer available — remove it to continue.','err');return}
  }
  const b=branch(co.branchId);
  if(!b){toast('Please select a branch.','err');ui.co.step=2;render();return}
  if(!b[co.method]){toast(b.name+' has '+co.method+' disabled.','err');ui.co.step=3;render();return}
  if(co.method==='delivery'&&co.dist!=null&&co.dist>b.radius){toast('Delivery is unavailable for this location.','err');ui.co.step=2;render();return}
  let cp=null,disc=0;
  if(co.coupon){const r=couponCheck(co.coupon,sub); if(r.err){toast(r.err,'err');ui.co.step=5;render();return} cp=r.c; disc=r.disc;}
  const fee=co.method==='delivery'?((SET().freeOver&&sub-disc>=SET().freeOver)?0:b.fee):0;
  const tax=+((sub-disc)*SET().taxRate/100).toFixed(2);
  const total=+(sub-disc+fee+tax).toFixed(2);
  const maxPrep=Math.max.apply(null,cart.map(i=>{const p=prod(i.productId);return p?p.prep:15}));
  const o={id:'o'+db.seq,code:'EV-'+db.seq++,customerId:u.id,branchId:b.id,type:co.method,
    items:cart.map(i=>({productId:i.productId,name:i.name,unit:i.unit,qty:i.qty,sub:+(i.unit*i.qty).toFixed(2),mods:[...i.mods]})),
    subtotal:+sub.toFixed(2),discount:disc,deliveryFee:fee,tax,total,
    payment:{method:co.payment,status:'unpaid'},status:'Pending',
    name:co.name,phone:co.phone,
    address:co.method==='delivery'?{line:co.addr.line,apt:co.addr.apt,note:co.addr.note}:null,
    pickupAt:co.method==='takeaway'?co.pickupAt:'',dist:co.dist,eta:co.method==='delivery'?maxPrep+25:maxPrep+10,
    createdAt:now(),events:[{s:'Pending',ts:now(),by:u.name}]};
  if(cp)cp.used++;
  db.orders.unshift(o);
  notify('role:MANAGER','New '+co.method+' order',o.code+' · '+u.name+' · '+o.items.reduce((s,i)=>s+i.qty,0)+' items · '+money(total)+' at '+b.name+'.','#/manager/orders');
  notify('role:ADMIN','New '+co.method+' order',o.code+' · '+u.name+' · '+money(total)+' at '+b.name+'.','#/admin/orders');
  notify('user:'+u.id,'Order placed',o.code+' received at '+b.name+'. We\'ll confirm shortly.','#/track/'+o.id);
  audit('Placed order '+o.code+' ('+money(total)+', '+co.method+')');
  await saveDB();
  cartSet([]); ui.coupon=null; ui.co=null;
  location.hash='#/order/'+o.id;
}
function orderById(id){return db.orders.find(o=>o.id===id||o.code===id)}
function OrderConfirm(id){
  const o=id?orderById(id):null;
  if(!o)return navHTML()+empty('file-question','Order not found','We could not find this order.','<a class="btn btn-dark" href="#/">Back home</a>')+footerHTML();
  const b=branch(o.branchId);
  return navHTML()+'<div class="oc">'
  +'<div class="confirm-ic">'+ic('check')+'</div>'
  +'<span class="kicker" style="justify-content:center">Order received</span>'
  +'<h1 class="disp" style="font-size:40px;margin:12px 0 8px">Thank you, <em style="color:var(--red);font-style:italic">'+esc((o.name||'friend').split(' ')[0])+'.</em></h1>'
  +'<p class="muted" style="max-width:420px;margin:0 auto 8px">Your order <b style="color:var(--text)">'+o.code+'</b> is confirmed at <b style="color:var(--text)">'+esc(b?b.name:'our kitchen')+'</b> — '+(o.type==='delivery'?'arriving in about '+o.eta+' minutes':'ready for pickup in about '+o.eta+' minutes')+'.</p>'
  +'<div class="card" style="text-align:left;margin:28px auto;max-width:460px">'
  +o.items.map(i=>'<div style="display:flex;justify-content:space-between;font-size:13.5px;padding:6px 0;border-bottom:1px dashed var(--line)"><span><b>'+i.qty+'×</b> '+esc(i.name)+'</span><b>'+money(i.sub)+'</b></div>').join('')
  +(o.discount?'<div style="display:flex;justify-content:space-between;font-size:13.5px;padding:6px 0;color:var(--ok)"><span>Discount</span><b>−'+money(o.discount)+'</b></div>':'')
  +'<div style="display:flex;justify-content:space-between;font-size:15px;padding:10px 0 0"><span class="disp" style="font-weight:700">Total</span><b class="price">'+money(o.total)+'</b></div></div>'
  +'<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">'
  +'<a class="btn btn-red" href="#/track/'+o.id+'">'+ic('bike')+'Track order</a><a class="btn btn-line" href="#/menu">Order more</a></div>'
  +'</div>'+footerHTML();
}
function Track(id){
  const o=id?orderById(id):null;
  if(!o)return navHTML()+empty('file-question','Order not found','Check your order history for the correct order.','<a class="btn btn-dark" href="#/account/orders">My orders</a>')+footerHTML();
  const b=branch(o.branchId), steps=FLOW[o.type]||FLOW.delivery, idx=steps.indexOf(o.status), cancelled=o.status==='Cancelled';
  const u=me(), mine=u&&o.customerId===u.id;
  const hasReview=db.reviews.some(r=>r.orderId===o.id);
  return navHTML()+'<div class="wrap" style="max-width:860px;padding:48px 24px 90px">'
  +'<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">'
  +'<div><span class="kicker">Order '+o.code+'</span><h1 class="disp" style="font-size:34px;margin:10px 0 4px">'+(o.status==='Completed'?'Enjoyed by you':cancelled?'Order cancelled':'On the fire')+'</h1>'
  +'<p class="muted">'+(o.type==='delivery'?'Delivery':'Takeaway')+' · '+esc(b?b.name:'—')+' · placed '+ago(o.createdAt)+'</p></div>'
  +'<div>'+stBadge(o.status)+'</div></div>'
  +'<div class="grid2b" style="margin-top:30px">'
  +'<div class="card"><h3>Progress</h3>'
  +(cancelled?'<div class="conote bad">'+ic('x-circle')+'<span>This order was cancelled on '+fmtDT((o.events.find(e=>e.s==='Cancelled')||{}).ts||o.createdAt)+'.</span></div>':'')
  +'<div class="tl">'+steps.map((s,i)=>{
    const ev=o.events.find(e=>e.s===s);
    const done=i<idx||o.status==='Completed';
    return '<div class="ti'+(done?' done':'')+(i===idx&&o.status!=='Completed'?' cur':'')+'">'
    +'<span class="dot">'+(done?ic('check'):'')+'</span><b>'+s+'</b><span>'+(ev?fmtDT(ev.ts):(i===idx?'In progress…':'Pending'))+'</span></div>';
  }).join('')+'</div>'
  +(mine&&!cancelled&&o.status==='Pending'?'<button class="btn btn-line btn-sm" data-act="cancel-order" data-id="'+o.id+'" style="color:var(--wine)">'+ic('x-circle')+'Cancel order</button>':'')
  +'</div>'
  +'<div><div class="card" style="margin-bottom:18px"><h3>Items</h3>'
  +o.items.map(i=>'<div style="display:flex;justify-content:space-between;font-size:13.5px;padding:6px 0;border-bottom:1px dashed var(--line)"><span><b>'+i.qty+'×</b> '+esc(i.name)+'</span><b>'+money(i.sub)+'</b></div>').join('')
  +'<div style="display:flex;justify-content:space-between;font-size:15px;padding:12px 0 0"><b class="disp">Total</b><b class="price">'+money(o.total)+'</b></div></div>'
  +'<div class="card"><h3>Details</h3><p style="font-size:13px;color:var(--gray);line-height:1.8">'
  +ic('store')+' '+esc(b?b.name:'—')+'<br>'+ic('clock')+' Est. '+o.eta+' min'+(o.pickupAt?' · requested '+esc(o.pickupAt):'')+'<br>'
  +(o.type==='delivery'&&o.address?ic('map-pin')+' '+esc(o.address.line)+(o.address.apt?', '+esc(o.address.apt):'')+'<br>'+ic('phone')+' '+esc(o.phone)+'<br>':'')
  +ic('banknote')+' '+(o.payment.method==='cod'?'Cash on delivery':'Pay at '+(o.type==='delivery'?'delivery':'counter'))+' · <b style="color:var(--wine)">'+(o.payment.status==='unpaid'?'Unpaid':'Paid')+'</b></p>'
  +(mine&&o.status==='Completed'&&!hasReview?'<button class="btn btn-red btn-sm" data-act="review-open" data-id="'+o.id+'" style="width:100%;margin-top:10px">'+ic('star')+'Write a review</button>':'')
  +(mine?'<button class="btn btn-line btn-sm" data-act="reorder" data-id="'+o.id+'" style="width:100%;margin-top:10px">'+ic('refresh-cw')+'Reorder</button>':'')
  +'</div></div></div></div>'+footerHTML();
}
function Auth(kind){
  const side='<div class="side grain"><span class="kicker on-dark">'+esc(SET().name)+'</span>'
  +'<blockquote style="margin-top:18px">&ldquo;The best meals are the ones you <b>remember by firelight.</b>&rdquo;</blockquote>'
  +'<div class="att">— Chef Aurelio Vane, Head of Kitchen</div>'
  +'<div style="margin-top:40px;display:flex;gap:30px;color:#b9b8bd;font-size:12.5px;font-weight:700">'+ic('star')+' 4.8 average rating &nbsp; '+ic('store')+' 4 branches</div></div>';
  const box={
    login:'<h1 class="disp">Welcome back</h1><p class="sub">Log in to order, track and collect rewards.</p>'
    +'<form data-form="login" novalidate>'+fld('Email',inpF('email','you@example.com','','email'))
    +'<div class="fld"><span>Password</span><div class="rel"><input class="in" name="password" type="password" placeholder="Your password" required><button type="button" class="icon-btn pw-eye" data-act="pw-eye" tabindex="-1">'+ic('eye')+'</button></div></div>'
    +'<div class="ferr" data-err></div>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin:4px 0 18px"><label class="ck" style="font-size:13px;color:var(--gray);display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="remember" checked>Remember me</label><a href="#/forgot" style="font-size:13px;font-weight:700;color:var(--wine)">Forgot password?</a></div>'
    +'<button class="btn btn-red" style="width:100%">Log in '+ic('arrow-right')+'</button></form>'
    +'<p style="margin-top:18px;font-size:13.5px" class="muted">New here? <a href="#/register" style="color:var(--red);font-weight:700">Create an account</a></p>'
    +'<div class="demo-box"><b>Demo access — development</b>'
    +'<div>Admin <code>admin@emberandvine.com</code> / <code>admin123</code></div>'
    +'<div style="margin-top:3px">Manager <code>manager@emberandvine.com</code> / <code>manager123</code></div>'
    +'<div style="margin-top:3px">Customer <code>sophia@example.com</code> / <code>customer123</code></div>'
    +'<div class="qk"><button type="button" class="btn btn-line btn-xs" data-act="qk" data-e="admin@emberandvine.com" data-p="admin123">Fill admin</button><button type="button" class="btn btn-line btn-xs" data-act="qk" data-e="manager@emberandvine.com" data-p="manager123">Fill manager</button><button type="button" class="btn btn-line btn-xs" data-act="qk" data-e="sophia@example.com" data-p="customer123">Fill customer</button></div></div>',
    register:'<h1 class="disp">Join the table</h1><p class="sub">One account for orders, tracking and favorites.</p>'
    +'<form data-form="register" novalidate>'
    +'<div class="row2">'+fld('Full name',inpF('name','Sophia Laurent'))+fld('Mobile',inpF('phone','+1 (555) 000-0000','','tel'))+'</div>'
    +fld('Email',inpF('email','you@example.com','','email'))
    +fld('Address',inpF('address','Street, city','','text',false))
    +'<div class="row2">'
    +'<div class="fld"><span>Password</span><div class="rel"><input class="in" name="password" type="password" placeholder="Min. 8 characters" required minlength="8" oninput="pwMeter(this.value)"><button type="button" class="icon-btn pw-eye" data-act="pw-eye" tabindex="-1">'+ic('eye')+'</button></div>'
    +'<div class="pw-meter"><i id="pwm"></i></div><span class="pw-lbl" id="pwl">Enter a password</span></div>'
    +fld('Confirm password',inpF('password2','Repeat password','','password'))
    +'</div><div class="ferr" data-err></div>'
    +'<button class="btn btn-red" style="width:100%;margin-top:6px">Create account '+ic('arrow-right')+'</button></form>'
    +'<p style="margin-top:18px;font-size:13.5px" class="muted">Already a member? <a href="#/login" style="color:var(--red);font-weight:700">Log in</a></p>',
    forgot:'<h1 class="disp">Reset your password</h1><p class="sub">Enter your account email — we\'ll issue a 6-digit reset code.</p>'
    +'<form data-form="forgot" novalidate>'+fld('Email',inpF('email','you@example.com','','email'))+'<div class="ferr" data-err></div>'
    +'<button class="btn btn-red" style="width:100%">Send reset code '+ic('mail')+'</button></form>'
    +'<p style="margin-top:18px;font-size:13.5px" class="muted">Remembered it? <a href="#/login" style="color:var(--red);font-weight:700">Back to login</a></p>',
    reset:'<h1 class="disp">Choose a new password</h1><p class="sub">Enter the email, the reset code we issued and your new password.</p>'
    +'<form data-form="reset" novalidate>'+fld('Email',inpF('email','you@example.com','','email'))
    +fld('Reset code',inpF('code','6-digit code'))
    +fld('New password',inpF('password','Min. 8 characters','','password'))
    +'<div class="ferr" data-err></div>'
    +'<button class="btn btn-red" style="width:100%">Update password '+ic('key-round')+'</button></form>'
  };
  return navHTML('')+'<div class="auth"><div class="form"><div class="box">'+box[kind]+'</div></div>'+side+'</div>';
}
window.pwMeter=function(v){
  let sc=0; if(v.length>=8)sc++; if(v.length>=12)sc++; if(/[A-Z]/.test(v)&&/[a-z]/.test(v))sc++; if(/\d/.test(v))sc++; if(/[^A-Za-z0-9]/.test(v))sc++;
  const m=$('#pwm'),l=$('#pwl'); if(!m)return;
  const seg=[['10%','#96959A','Too weak'],['25%','#96959A','Weak'],['45%','#780D1C','Okay'],['65%','#780D1C','Good'],['85%','#E6002B','Strong'],['100%','#3E6B4F','Excellent']][sc];
  m.style.width=seg[0]; m.style.background=seg[1]; l.textContent=v?seg[2]:'Enter a password';
};
function Branches(){
  const c=db.content;
  return navHTML('#/branches')
  +'<header class="phead grain"><div class="wrap"><span class="kicker on-dark">'+esc(L('branches_kicker'))+'</span><h1>'+em2(c.branchesTitle)+'</h1><p>'+esc(c.branchesSubtitle)+'</p></div></header>'
  +'<div class="wrap bgrid">'+db.branches.filter(b=>b.status).map(b=>{
    const open=isOpen(b);
    return '<article class="bcard rv"><div class="map">'+branchArt(b)+'</div>'
    +'<div class="bin"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3 class="disp">'+esc(b.name)+'</h3>'+(open?okBadge('Open now'):stBadge('Closed'))+'</div>'
    +'<div class="bi">'+ic('map-pin')+esc(b.address)+'</div>'
    +'<div class="bi">'+ic('phone')+esc(b.phone)+'</div>'
    +'<div class="bi">'+ic('clock')+esc(b.open)+' – '+esc(b.close)+'</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap">'+(b.delivery?'<span class="tag g">Delivery · '+money(b.fee)+' · '+b.radius+' km</span>':'<span class="tag w">No delivery</span>')+(b.takeaway?'<span class="tag g">Takeaway</span>':'<span class="tag w">No pickup</span>')+'</div>'
    +'<div class="bact"><button class="btn btn-red btn-sm" style="flex:1" data-act="order-at" data-id="'+b.id+'">'+ic('flame')+'Order here</button><a class="btn btn-line btn-sm" href="#/contact">Call</a></div>'
    +'</div></article>';
  }).join('')+'</div>'+footerHTML();
}
function Offers(){
  const list=db.coupons.filter(c=>c.active&&c.expires>now()), pc=db.content;
  return navHTML('#/offers')
  +'<header class="phead grain"><div class="wrap"><span class="kicker on-dark">'+esc(L('offers_kicker'))+'</span><h1>'+em2(pc.offersTitle)+'</h1><p>'+esc(pc.offersSubtitle)+'</p></div></header>'
  +'<div class="wrap" style="padding:44px 24px 90px;display:flex;flex-direction:column;gap:22px">'
  +(list.length?list.map((c,i)=>'<div class="offer grain rv '+['','d1','d2'][i%3]+'">'
    +'<div class="txt"><span class="kicker on-dark">Expires '+fmtD(c.expires)+'</span>'
    +'<h3>'+(c.type==='pct'?c.value+'% off':money(c.value)+' off')+' <em>'+esc((c.desc||'your order').split('—')[0])+'</em></h3>'
    +'<p style="color:#d8b9b9;max-width:460px">Min. order '+money(c.min)+(c.max?' · max discount '+money(c.max):'')+(c.limit?' · '+Math.max(0,c.limit-c.used)+' uses left':'')+'</p>'
    +'<div class="code">'+esc(c.code)+'<button data-act="copy-code" data-code="'+esc(c.code)+'">'+ic('copy')+'Copy</button></div>'
    +'<div><a class="btn btn-red" href="#/menu">Start an order '+ic('arrow-right')+'</a></div></div>'
    +'<div class="art">'+dishSVG(['pizza','burger','lava'][i%3])+'</div></div>').join('')
  :empty('ticket','No live offers right now','New deals drop every weekend — check back soon.','<a class="btn btn-dark" href="#/menu">Browse menu anyway</a>'))
  +'</div>'+footerHTML();
}
function About(){
  const c=db.content, st=c.storyTitle.split(' meets ');
  return navHTML('#/about')
  +'<header class="phead grain"><div class="wrap"><span class="kicker on-dark">'+esc(L('about_kicker'))+'</span><h1>'+em2(c.aboutHeroTitle)+'</h1></div></header>'
  +'<div class="wrap">'
  +'<div class="abt-sec"><div class="txt rv"><span class="kicker">Est. '+esc(SET().est)+'</span>'
  +'<h2>'+esc(st[0])+' <em>meets '+(esc(st[1]||'craftsmanship'))+'</em></h2>'
  +'<p>'+esc(c.storyBody)+'</p><p>'+esc(c.aboutExtra)+'</p></div>'
  +'<div class="art rv d1">'+(c.aboutImage1?picImgHTML(c.aboutImage1,'cover').replace('style="','style="border-radius:12px;aspect-ratio:1;'):aboutSteakPhoto())+'</div></div>'
  +'<div class="abt-sec rev"><div class="txt rv"><span class="kicker">'+esc(L('philosophy_kicker'))+'</span><h2>'+em2(c.philosophyTitle)+'</h2>'
  +'<p>'+esc(c.philosophyBody)+'</p></div>'
  +'<div class="art rv d1">'+(c.aboutImage2?picImgHTML(c.aboutImage2,'cover').replace('style="','style="border-radius:12px;aspect-ratio:1;'):dishSVG('pizza'))+'</div></div>'
  +'</div>'
  +'<section class="sec dark grain"><div class="wrap">'
  +'<div class="sec-h rv"><div><span class="kicker on-dark">'+esc(L('values_kicker'))+'</span><h2>'+em2(L('values_title'))+'</h2></div></div>'
  +'<div class="vals rv">'
  +(c.values||[]).map((v,i)=>'<div class="val"><div class="vi">'+ic(['flame','leaf','clock','heart-handshake'][i%4])+'</div><h4>'+esc(v.title)+'</h4><p>'+esc(v.desc)+'</p></div>').join('')
  +'</div></div></section>'
  +'<section class="band grain"><span class="kicker on-dark" style="justify-content:center">'+esc(L('about_cta_kicker'))+'</span><h2>'+em2(c.aboutCtaTitle)+'</h2><p>'+esc(c.aboutCtaText)+'</p>'
  +'<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap"><a class="btn btn-red" href="#/branches">Visit a branch</a><a class="btn btn-ghost" href="#/menu">Order in</a></div></section>'
  +footerHTML();
}
function Contact(){
  const s=SET();
  return navHTML('#/contact')
  +'<header class="phead grain"><div class="wrap"><span class="kicker on-dark">'+esc(L('contact_kicker'))+'</span><h1>'+em2(db.content.contactTitle)+'</h1></div></header>'
  +'<div class="wrap" style="padding:48px 24px 90px;display:grid;grid-template-columns:1fr 1.1fr;gap:44px" id="contact-grid">'
  +'<div class="rv"><div class="card" style="margin-bottom:18px"><h3>'+ic('phone')+' Talk to us</h3>'
  +'<p style="font-size:14px;color:var(--gray);line-height:2">'+ic('phone')+' '+esc(s.phone)+'<br>'+ic('mail')+' '+esc(s.email)+'<br>'+ic('map-pin')+' '+esc(s.address)+'<br>'+ic('clock')+' '+esc(s.hours)+'</p>'
  +'<div class="socials" style="margin-top:14px">'+socialA('instagram')+''+socialA('facebook')+''+socialA('twitter')+'</div></div>'
  +'<div class="card"><h3>'+ic('store')+' Branches</h3>'+db.branches.filter(b=>b.status).map(b=>'<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed var(--line);font-size:13.5px;gap:8px"><span><b>'+esc(b.name)+'</b><br><span class="muted">'+esc(b.phone)+'</span></span>'+(isOpen(b)?okBadge('Open'):stBadge('Closed'))+'</div>').join('')+'</div></div>'
  +'<div class="card rv d1" style="align-self:start"><h3>Send a message</h3>'
  +'<form data-form="contact" novalidate>'+fld('Your name',inpF('name','Full name'))+fld('Email',inpF('email','you@example.com','','email'))
  +fld('Subject',selF('subject',[['General','General question'],['Feedback','Feedback'],['Catering','Catering & events'],['Complaint','Something went wrong']]))
  +fld('Message','<textarea class="in" name="message" required placeholder="Tell us everything…"></textarea>')
  +'<div class="ferr" data-err></div><button class="btn btn-red">'+ic('send')+'Send message</button></form></div>'
  +'</div>'+footerHTML();
}
function sideHTML(scope,tabFn){
  const u=me();
  const items={
    account:[['overview','layout-dashboard','Overview'],['orders','receipt','Orders'],['reviews','message-square','Reviews'],['favorites','heart','Favorites'],['addresses','map-pin','Addresses'],['notifications','bell','Notifications'],['profile','user','Profile'],['settings','settings','Settings']],
    manager:[['board','layout-dashboard','Dashboard'],['orders','clipboard-list','Orders'],['notifications','bell','Notifications'],['profile','user','Profile']],
    admin:[['overview','layout-dashboard','Overview'],['orders','clipboard-list','Orders'],['menu','utensils','Menu'],['categories','tags','Categories'],['branches','store','Branches'],['customers','users','Customers'],['promotions','percent','Promotions'],['reviews','message-square','Reviews'],['notifications','bell','Notifications'],['reports','bar-chart-3','Reports'],['content','file-text','Website Content'],['users','shield','Users & Roles'],['settings','settings','Settings'],['audit','history','Audit Log'],['profile','user','Profile']]
  }[scope];
  return '<aside class="side" data-side>'+logoHTML()
  +'<nav class="snav">'+items.map(t=>tabFn(t)).join('')+'</nav>'
  +'<div class="suser"><span class="av">'+esc(u.name[0])+'</span><div style="min-width:0"><b>'+esc(u.name)+'</b><span>'+u.role+(u.role==='MANAGER'&&u.branchId?' · '+esc((branch(u.branchId)||{}).name||''):'')+'</span></div>'
  +'<button class="icon-btn" data-act="logout" title="Sign out" style="margin-left:auto">'+ic('log-out')+'</button></div></aside>'
  +'<div class="side-bk" data-sbk data-act="sidebar"></div>';
}
function Account(){
  const u=me(), tab=ui.acctTab;
  const my=db.orders.filter(o=>o.customerId===u.id);
  const active=my.filter(o=>['Completed','Cancelled'].indexOf(o.status)<0);
  const favs=db.favorites.filter(f=>f.userId===u.id).map(f=>prod(f.productId)).filter(Boolean);
  const spend=my.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0);
  const sideTab=t=>'<a href="#/account/'+t[0]+'" class="'+(tab===t[0]?'act':'')+'">'+ic(t[1])+t[2]+(t[0]==='notifications'&&unreadCount()?'<span class="cnt">'+unreadCount()+'</span>':'')+'</a>';
  let body='';
  if(tab==='overview'){
    const recent=my[0];
    const pendingReviews=my.filter(o=>o.status==='Completed'&&!db.reviews.some(r=>r.orderId===o.id)).length;
    body='<div class="kpis">'
    +'<div class="kpi rv in"><div class="ki">'+ic('bike')+'</div><div class="kv">'+active.length+'</div><div class="kl">Active orders</div></div>'
    +'<div class="kpi rv in"><div class="ki">'+ic('receipt')+'</div><div class="kv">'+my.length+'</div><div class="kl">Total orders</div></div>'
    +'<div class="kpi rv in"><div class="ki">'+ic('heart')+'</div><div class="kv">'+favs.length+'</div><div class="kl">Favorites</div></div>'
    +'<div class="kpi rv in"><div class="ki">'+ic('banknote')+'</div><div class="kv">'+money(spend)+'</div><div class="kl">Lifetime spend</div></div>'
    +'<a class="kpi rv in" href="#/account/reviews" style="text-decoration:none;color:inherit"><div class="ki">'+ic('star')+'</div><div class="kv">'+pendingReviews+'</div><div class="kl">Reviews to write</div></a></div>'
    +'<div class="grid2b">'
    +'<div class="card"><h3>'+ic('clock')+' Recent order</h3>'
    +(recent
      ?'<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><b>'+recent.code+'</b> · '+esc((branch(recent.branchId)||{}).name||'—')+'<br><span class="muted" style="font-size:12.5px">'+recent.items.reduce((s,i)=>s+i.qty,0)+' items · '+ago(recent.createdAt)+'</span></div><div style="display:flex;gap:10px;align-items:center">'+stBadge(recent.status)+'<a class="btn btn-line btn-xs" href="#/track/'+recent.id+'">Track</a></div></div>'
      :'<p class="muted" style="font-size:13.5px">No orders yet — your first feast awaits. <a href="#/menu" style="color:var(--red);font-weight:700">Browse menu</a></p>')
    +'</div>'
    +'<div class="card"><h3>'+ic('map-pin')+' Saved addresses</h3>'
    +(db.addresses.filter(a=>a.userId===u.id).slice(0,3).map(a=>'<div style="padding:7px 0;border-bottom:1px dashed var(--line);font-size:13px"><b>'+esc(a.label)+'</b> · '+esc(a.line)+'</div>').join('')||'<p class="muted" style="font-size:13.5px">No addresses saved.</p>')
    +'<a class="btn btn-line btn-xs" href="#/account/addresses" style="margin-top:10px">Manage addresses</a></div></div>';
  }
  else if(tab==='orders'){
    body=my.length
      ?'<div class="tblw"><div class="scroll"><table class="tbl"><thead><tr><th>Order</th><th>Branch</th><th>Type</th><th>Total</th><th>Status</th><th>Date</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
      +my.map(o=>'<tr><td data-l="Order"><b>'+o.code+'</b></td><td data-l="Branch">'+esc((branch(o.branchId)||{}).name||'—')+'</td><td data-l="Type">'+o.type+'</td><td data-l="Total"><b>'+money(o.total)+'</b></td><td data-l="Status">'+stBadge(o.status)+'</td><td data-l="Date">'+fmtD(o.createdAt)+'</td>'
      +'<td class="nolab" style="text-align:right"><div class="tacts"><a class="icon-btn" href="#/track/'+o.id+'" title="Track">'+ic('bike')+'</a>'
      +(o.status==='Completed'&&!db.reviews.some(r=>r.orderId===o.id)?'<button class="icon-btn" data-act="review-open" data-id="'+o.id+'" title="Review">'+ic('star')+'</button>':'')
      +'<button class="icon-btn" data-act="reorder" data-id="'+o.id+'" title="Reorder">'+ic('refresh-cw')+'</button></div></td></tr>').join('')
      +'</tbody></table></div></div>'
      :empty('receipt','No orders yet','When you order, every feast lands here with live tracking.','<a class="btn btn-red" href="#/menu">Start your first order</a>');
  }
  else if(tab==='favorites'){
    body=favs.length
      ?'<div class="mgrid" style="padding-top:0">'+favs.map(p=>foodCard(p)).join('')+'</div>'
      :empty('heart','No favorites yet','Tap the heart on any dish and it will be saved to your account.','<a class="btn btn-red" href="#/menu">Find a favorite</a>');
  }
  else if(tab==='reviews'){
    const myReviews=db.reviews.filter(r=>r.customerId===u.id).sort((a,b)=>b.ts-a.ts);
    const reviewable=my.filter(o=>o.status==='Completed'&&!db.reviews.some(r=>r.orderId===o.id));
    body='<div class="card" style="margin-bottom:18px"><h3>'+ic('star')+' Write a review</h3>'
    +(reviewable.length
      ?'<p class="muted" style="font-size:13.5px;margin-bottom:14px">Tell us how it went — pick a recent order to review.</p>'
        +reviewable.map(o=>'<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 0;border-bottom:1px dashed var(--line)"><span><b>'+o.code+'</b> · '+esc((branch(o.branchId)||{}).name||'—')+' · '+fmtD(o.createdAt)+'<br><span class="muted" style="font-size:12px">'+o.items.map(i=>i.name).join(', ')+'</span></span><button class="btn btn-red btn-sm" data-act="review-open" data-id="'+o.id+'">'+ic('star')+'Write a review</button></div>').join('')
      :'<p class="muted" style="font-size:13.5px">No completed orders are waiting for a review right now. <a href="#/menu" style="color:var(--red);font-weight:700">Order something</a> and we\'ll ask you here once it arrives.</p>')
    +'</div>'
    +'<div class="tblw"><div class="th"><h3 class="disp">Your reviews · '+myReviews.length+'</h3></div>'
    +(myReviews.length
      ?myReviews.map(r=>{const p=prod(r.productId),o=orderById(r.orderId);
        return '<div class="notif"><div class="ni">'+ic('message-square')+'</div><div style="flex:1"><b>'+esc(p?p.name:'—')+'</b><div style="margin:3px 0">'+stars(r.rating)+'</div><p>&ldquo;'+esc(r.comment)+'&rdquo;</p><p style="margin-top:3px;opacity:.7">'+fmtD(r.ts)+' · order '+esc(o?o.code:'')+'</p></div></div>';
      }).join('')
      :'<div>'+empty('message-square','No reviews yet','Once you review an order, it will show up here.','')+'</div>')
    +'</div>';
  }
  else if(tab==='addresses'){
    const list=db.addresses.filter(a=>a.userId===u.id);
    body='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><h2 class="disp" style="font-size:24px">Saved addresses</h2><button class="btn btn-red btn-sm" data-act="addr-new">'+ic('plus')+'Add address</button></div>'
    +(list.length?'<div class="optgrid">'+list.map(a=>'<div class="card"><div style="display:flex;justify-content:space-between"><b>'+esc(a.label)+'</b><button class="icon-btn dng" data-act="addr-del" data-id="'+a.id+'" title="Delete">'+ic('trash-2')+'</button></div><p style="font-size:13px;color:var(--gray);margin-top:6px">'+esc(a.line)+(a.apt?', '+esc(a.apt):'')+(a.note?'<br><em>'+esc(a.note)+'</em>':'')+'</p></div>').join('')+'</div>'
    :empty('map-pin','No saved addresses','Save your frequent addresses for one-tap checkout.',''))
    +'<form data-form="addr" class="card" style="margin-top:22px" novalidate><h3>Add a new address</h3>'
    +'<div class="row2">'+fld('Label',inpF('label','Home, Office…'))+fld('Street address',inpF('line','Street, number, area'))+'</div>'
    +'<div class="row2">'+fld('Apartment / floor',inpF('apt','Optional','','text',false))+fld('Note for courier',inpF('note','Optional','','text',false))+'</div>'
    +'<div class="ferr" data-err></div><button class="btn btn-dark btn-sm">'+ic('check')+'Save address</button></form>';
  }
  else if(tab==='notifications'){
    const list=myNotifs();
    body='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:10px;flex-wrap:wrap"><h2 class="disp" style="font-size:24px">Notifications '+(unreadCount()?'<span class="tag">'+unreadCount()+' unread</span>':'')+'</h2>'
    +(list.length?'<button class="btn btn-line btn-sm" data-act="mark-all">'+ic('check-check')+'Mark all read</button>':'')+'</div>'
    +'<div class="tblw">'+(list.length?list.slice(0,30).map(n=>'<div class="notif'+(n.read?' read':'')+'"><div class="ni">'+ic('bell')+'</div>'
      +'<div style="flex:1"><b>'+esc(n.title)+'</b><p>'+esc(n.body)+'</p>'+(n.link?'<a href="#'+esc(n.link)+'" data-act="mark-read" data-id="'+n.id+'" style="font-size:12px;color:var(--red);font-weight:700">View</a>':'')+'</div>'
      +'<span class="tm">'+ago(n.ts)+(!n.read?'<span class="un"></span><button class="icon-btn" style="width:28px;height:28px" data-act="mark-read" data-id="'+n.id+'" title="Mark read">'+ic('check')+'</button>':'')+'</span></div>').join('')
    :'<div>'+empty('bell','All caught up','Order updates and promotions will appear here.','<a class="btn btn-dark btn-sm" href="#/menu">Browse menu</a>')+'</div>')+'</div>';
  }
  else if(tab==='profile'){
    body='<div class="card" style="max-width:560px"><h3>'+ic('user')+' Profile</h3>'
    +'<form data-form="profile" novalidate>'+fld('Full name',inpF('name','Full name',u.name))+fld('Mobile',inpF('phone','+1 (555) 000-0000',u.phone,'tel',false))
    +fld('Default address',inpF('address','Street, city',u.address||'','text',false))
    +'<button class="btn btn-red btn-sm">'+ic('check')+'Save changes</button></form></div>';
  }
  else if(tab==='settings'){
    body='<div class="card" style="max-width:560px"><h3>'+ic('lock')+' Change password</h3>'
    +'<form data-form="password" novalidate>'+fld('Current password','<input class="in" name="old" type="password" required>')
    +fld('New password','<input class="in" name="np" type="password" required minlength="8" placeholder="Min. 8 characters">')
    +'<div class="ferr" data-err></div><button class="btn btn-dark btn-sm">'+ic('key-round')+'Update password</button></form></div>'
    +'<div class="card" style="max-width:560px;margin-top:18px"><h3>'+ic('shield-check')+' Account</h3>'
    +'<p style="font-size:13.5px;color:var(--gray)">Role: <b style="color:var(--text)">'+u.role+'</b> · Member since '+fmtD(u.createdAt)+'<br>Email: '+esc(u.email)+'</p></div>';
  }
  else{body=empty('layout-dashboard','Page not found','Use the sidebar to navigate your account.','');}
  return '<div class="dash">'+sideHTML('account',sideTab)
  +'<div class="main"><div class="top"><button class="icon-btn mob-tgl" data-act="sidebar">'+ic('menu')+'</button><h1 class="disp">My account</h1>'
  +'<div class="tb">'+themeBtn()+'<a class="btn btn-line btn-sm" href="#/">'+ic('store')+'Restaurant</a></div></div>'
  +'<div class="content">'+body+'</div></div></div>';
}
function advanceLabel(o){
  const fl=FLOW[o.type]||FLOW.delivery, i=fl.indexOf(o.status);
  if(i<0||i>=fl.length-1)return null;
  return fl[i+1];
}
function advLblFor(o){
  return {Pending:'Confirm',Confirmed:'Start preparing',Preparing:(o.type==='takeaway'?'Mark ready':'Out for delivery'),'Out for Delivery':'Mark completed','Ready for Pickup':'Hand over'}[o.status]||advanceLabel(o);
}
function Manager(){
  const u=me(), tab=ui.mgrTab;
  const scoped=u.role==='ADMIN'?db.orders:db.orders.filter(o=>o.branchId===u.branchId);
  const today=dkey(now());
  const t=scoped.filter(o=>dkey(o.createdAt)===today);
  const sideTab=tm=>'<a href="#/manager/'+tm[0]+'" class="'+(tab===tm[0]?'act':'')+'">'+ic(tm[1])+tm[2]
    +(tm[0]==='board'&&scoped.filter(o=>o.status==='Pending').length?'<span class="cnt">'+scoped.filter(o=>o.status==='Pending').length+'</span>':'')
    +(tm[0]==='notifications'&&unreadCount()?'<span class="cnt">'+unreadCount()+'</span>':'')+'</a>';
  let body='';
  if(tab==='board'){
    const cols=[['Pending','Pending','#96959A'],['Confirmed','Confirmed','#131215'],['Preparing','Preparing','#780D1C'],['ready','Ready · On the road','#E6002B'],['Completed','Completed','#3E6B4F']];
    const card=o=>'<div class="ocard"><div class="oc-t"><b>'+o.code+'</b>'+stBadge(o.status)+'</div>'
    +'<div class="oc-i">'+o.items.map(i=>i.qty+'× '+esc(i.name)).join('<br>')+'</div>'
    +'<div class="oc-i">'+(o.type==='delivery'?ic('bike'):' '+ic('shopping-bag'))+' '+esc(o.name)+' · '+ago(o.createdAt)+'</div>'
    +'<div class="oc-f"><span class="pr">'+money(o.total)+'</span>'
    +(advanceLabel(o)?'<button class="btn '+(o.status==='Preparing'?'btn-red':'btn-dark')+' btn-xs" data-act="adv" data-id="'+o.id+'">'+ic('arrow-right')+esc(advLblFor(o))+'</button>':'<span class="tag g">Done</span>')
    +'</div></div>';
    body='<div class="kpis">'
    +'<div class="kpi"><div class="ki">'+ic('bell')+'</div><div class="kv">'+t.filter(o=>o.status==='Pending').length+'</div><div class="kl">New orders</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('chef-hat')+'</div><div class="kv">'+t.filter(o=>['Confirmed','Preparing'].indexOf(o.status)>=0).length+'</div><div class="kl">In kitchen</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('package')+'</div><div class="kv">'+t.filter(o=>['Out for Delivery','Ready for Pickup'].indexOf(o.status)>=0).length+'</div><div class="kl">Ready / on the road</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('check-circle-2')+'</div><div class="kv">'+t.filter(o=>o.status==='Completed').length+'</div><div class="kl">Completed today</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('banknote')+'</div><div class="kv">'+money(t.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0))+'</div><div class="kl">Revenue today</div></div></div>'
    +'<div class="board">'+cols.map(col=>{
      const key=col[0],list=scoped.filter(o=>(key==='ready'?['Out for Delivery','Ready for Pickup'].indexOf(o.status)>=0:o.status===key)&&!(key==='Completed'&&dkey(o.createdAt)!==today));
      return '<div class="bcol"><h4><span style="width:8px;height:8px;border-radius:50%;background:'+col[2]+';display:inline-block"></span>'+col[1]+' <span class="c">'+list.length+'</span></h4>'
      +(list.slice(0,8).map(card).join('')||'<p class="muted" style="font-size:12.5px;padding:8px 2px">Nothing here.</p>')+'</div>';
    }).join('')+'</div>';
  }
  else if(tab==='orders'){
    const f=ui.mgrF||{};
    let list=[...scoped];
    if(f.q)list=list.filter(o=>(o.code+' '+o.name+' '+o.phone).toLowerCase().indexOf(f.q.toLowerCase())>=0);
    if(f.st&&f.st!=='all')list=list.filter(o=>o.status===f.st);
    if(f.tp&&f.tp!=='all')list=list.filter(o=>o.type===f.tp);
    body='<div class="tblw"><div class="th"><h3 class="disp">Branch orders</h3>'
    +'<input class="in" style="max-width:200px" placeholder="Search code / customer" value="'+esc(f.q||'')+'" data-input="mgr-q">'
    +'<select class="in" style="width:auto" data-chg="mgr-f" data-k="st"><option value="all">All statuses</option>'+FLOW.delivery.concat(['Cancelled']).map(s=>'<option'+(f.st===s?' selected':'')+'>'+s+'</option>').join('')+'</select>'
    +'<select class="in" style="width:auto" data-chg="mgr-f" data-k="tp"><option value="all">All types</option><option'+(f.tp==='delivery'?' selected':'')+'>delivery</option><option'+(f.tp==='takeaway'?' selected':'')+'>takeaway</option></select></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Total</th><th>Status</th><th>Placed</th><th class="nolab" style="text-align:right">Action</th></tr></thead><tbody>'
    +(list.slice(0,40).map(o=>'<tr><td data-l="Order"><b>'+o.code+'</b></td><td data-l="Customer">'+esc(o.name)+'<br><span class="muted" style="font-size:11.5px">'+esc(o.phone)+'</span></td><td data-l="Type">'+(o.type==='delivery'?'Delivery':'Takeaway')+'</td><td data-l="Total"><b>'+money(o.total)+'</b></td><td data-l="Status">'+stBadge(o.status)+'</td><td data-l="Placed">'+ago(o.createdAt)+'</td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts"><button class="icon-btn" data-act="order-view" data-id="'+o.id+'" title="Details">'+ic('eye')+'</button>'
    +(advanceLabel(o)?'<button class="btn btn-red btn-xs" data-act="adv" data-id="'+o.id+'">'+ic('arrow-right')+esc(advLblFor(o))+'</button>':'')
    +'</div></td></tr>').join('')||'<tr><td colspan="7" style="text-align:center;padding:40px" class="muted">No orders match.</td></tr>')
    +'</tbody></table></div></div>';
  }
  else if(tab==='notifications'){
    const list=myNotifs();
    body='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:10px;flex-wrap:wrap"><h2 class="disp" style="font-size:24px">Operations notifications</h2>'
    +(list.length?'<button class="btn btn-line btn-sm" data-act="mark-all">'+ic('check-check')+'Mark all read</button>':'')+'</div>'
    +'<div class="tblw">'+(list.length?list.slice(0,30).map(n=>'<div class="notif'+(n.read?' read':'')+'"><div class="ni">'+ic('bell')+'</div><div style="flex:1"><b>'+esc(n.title)+'</b><p>'+esc(n.body)+'</p>'+(n.link?'<a href="#'+esc(n.link)+'" data-act="mark-read" data-id="'+n.id+'" style="font-size:12px;color:var(--red);font-weight:700">View</a>':'')+'</div><span class="tm">'+ago(n.ts)+(!n.read?'<span class="un"></span>':'')+'</span></div>').join('')
    :'<div>'+empty('bell','No notifications','New orders and updates will land here.','')+'</div>')+'</div>';
  }
  else if(tab==='profile'){
    body='<div class="card" style="max-width:560px"><h3>'+ic('user')+' My profile</h3>'
    +'<form data-form="profile" novalidate>'+fld('Full name',inpF('name','Full name',u.name))+fld('Mobile',inpF('phone','+1 (555) 000-0000',u.phone,'tel',false))
    +'<button class="btn btn-red btn-sm">'+ic('check')+'Save</button></form></div>'
    +'<div class="card" style="max-width:560px;margin-top:18px"><h3>'+ic('lock')+' Change password</h3>'
    +'<form data-form="password" novalidate>'+fld('Current password','<input class="in" name="old" type="password" required>')
    +fld('New password','<input class="in" name="np" type="password" required minlength="8">')
    +'<div class="ferr" data-err></div><button class="btn btn-dark btn-sm">'+ic('key-round')+'Update</button></form></div>';
  }
  else{body=empty('layout-dashboard','Page not found','Use the sidebar to navigate.','');}
  return '<div class="dash">'+sideHTML('manager',sideTab)+'<div class="main">'
  +'<div class="top"><button class="icon-btn mob-tgl" data-act="sidebar">'+ic('menu')+'</button><h1 class="disp">Operations console</h1>'
  +'<div class="tb">'+themeBtn()+'<span class="tag w">'+(u.role==='ADMIN'?'All branches':esc((branch(u.branchId)||{}).name||''))+'</span>'
  +'<button class="icon-btn bell" data-act="goto-notifs" data-base="manager" aria-label="Notifications">'+ic('bell')+(unreadCount()?'<span class="badge-n">'+unreadCount()+'</span>':'')+'</button></div></div>'
  +'<div class="content">'+body+'</div></div></div>';
}
function setOrderStatus(o,next,byName){
  o.status=next; o.events.push({s:next,ts:now(),by:byName});
  notify('user:'+o.customerId,'Order '+next.toLowerCase(),o.code+' is now: '+next+'.','#/track/'+o.id);
  if(next==='Completed')notify('user:'+o.customerId,'Enjoy your meal','Your order '+o.code+' was completed. Loved it? Leave a review.','#/track/'+o.id);
}
function Admin(){
  const u=me(), tab=ui.adminTab;
  const sideTab=t=>'<a href="#/admin/'+t[0]+'" class="'+(tab===t[0]?'act':'')+'">'+ic(t[1])+t[2]
    +(t[0]==='orders'&&db.orders.filter(o=>o.status==='Pending').length?'<span class="cnt">'+db.orders.filter(o=>o.status==='Pending').length+'</span>':'')
    +(t[0]==='notifications'&&unreadCount()?'<span class="cnt">'+unreadCount()+'</span>':'')+'</a>';
  let body='';
  if(tab==='overview'){
    const today=dkey(now()), valid=db.orders.filter(o=>o.status!=='Cancelled');
    const rev14=[],lbl14=[],ord14=[];
    for(let i=13;i>=0;i--){
      const d=dkey(now()-i*DAY);
      lbl14.push(new Date(now()-i*DAY).toLocaleDateString(undefined,{month:'short',day:'numeric'}));
      rev14.push(valid.filter(o=>dkey(o.createdAt)===d).reduce((s,o)=>s+o.total,0));
      ord14.push(db.orders.filter(o=>dkey(o.createdAt)===d&&o.status!=='Cancelled').length);
    }
    const del=valid.filter(o=>o.type==='delivery').length, tak=valid.filter(o=>o.type==='takeaway').length;
    const sell={},catRev={};
    valid.forEach(o=>o.items.forEach(i=>{sell[i.name]=(sell[i.name]||0)+i.sub; const p=prod(i.productId); if(p)catRev[p.cat]=(catRev[p.cat]||0)+i.sub;}));
    const top=Object.entries(sell).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const maxTop=top.length?top[0][1]:1;
    const catSorted=Object.entries(catRev).sort((a,b)=>b[1]-a[1]);
    const maxCat=catSorted.length?catSorted[0][1]:1;
    body='<div class="kpis">'
    +'<div class="kpi"><div class="ki">'+ic('banknote')+'</div><div class="kv">'+money(valid.filter(o=>dkey(o.createdAt)===today).reduce((s,o)=>s+o.total,0))+'</div><div class="kl">Today\'s revenue</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('receipt')+'</div><div class="kv">'+db.orders.filter(o=>dkey(o.createdAt)===today).length+'</div><div class="kl">Orders today</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('bell')+'</div><div class="kv">'+db.orders.filter(o=>o.status==='Pending').length+'</div><div class="kl">Pending</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('check-circle-2')+'</div><div class="kv">'+db.orders.filter(o=>o.status==='Completed').length+'</div><div class="kl">Completed</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('users')+'</div><div class="kv">'+db.users.filter(x=>x.role==='CUSTOMER').length+'</div><div class="kl">Customers</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('store')+'</div><div class="kv">'+db.branches.filter(b=>b.status).length+'</div><div class="kl">Active branches</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('utensils')+'</div><div class="kv">'+db.products.length+'</div><div class="kl">Menu items</div></div></div>'
    +'<div class="grid2"><div class="card"><h3>Revenue · last 14 days</h3><canvas class="ch" id="ch-rev"></canvas></div>'
    +'<div class="card"><h3>Orders · last 14 days</h3><canvas class="ch" id="ch-ord"></canvas></div></div>'
    +'<div class="grid2b"><div class="card"><h3>Delivery vs takeaway</h3><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap"><canvas id="ch-dt" style="width:190px;height:190px"></canvas>'
    +'<div style="font-size:13px;display:flex;flex-direction:column;gap:8px"><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#E6002B;margin-right:8px"></span>Delivery · <b>'+del+'</b></span><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#96959A;margin-right:8px"></span>Takeaway · <b>'+tak+'</b></span></div></div></div>'
    +'<div class="card"><h3>Best sellers</h3>'+(top.map(x=>'<div class="rep-bar"><div class="rl"><span>'+esc(x[0])+'</span><b>'+money(x[1])+'</b></div><div class="rt"><i data-w="'+Math.round(x[1]/maxTop*100)+'"></i></div></div>').join('')||'<p class="muted">No sales yet.</p>')+'</div></div>'
    +'<div class="card"><h3>Category performance</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:18px">'
    +(catSorted.map(x=>'<div><div style="display:flex;justify-content:space-between;font-size:13px"><b>'+esc(catName(x[0]))+'</b><span class="muted">'+money(x[1])+'</span></div><div class="rt" style="height:7px;margin-top:5px"><i data-w="'+Math.round(x[1]/maxCat*100)+'"></i></div></div>').join('')||'<p class="muted">No sales yet.</p>')
    +'</div></div>';
  }
  else if(tab==='orders'){
    const f=ui.admF||{};
    let list=[...db.orders];
    if(f.q)list=list.filter(o=>(o.code+' '+o.name+' '+o.phone).toLowerCase().indexOf(f.q.toLowerCase())>=0);
    if(f.st&&f.st!=='all')list=list.filter(o=>o.status===f.st);
    if(f.br&&f.br!=='all')list=list.filter(o=>o.branchId===f.br);
    if(f.tp&&f.tp!=='all')list=list.filter(o=>o.type===f.tp);
    if(f.sort==='total')list.sort((a,b)=>b.total-a.total); else list.sort((a,b)=>b.createdAt-a.createdAt);
    const per=9, pages=Math.max(1,Math.ceil(list.length/per));
    ui.adminPg=Math.min(ui.adminPg,pages);
    const page=list.slice((ui.adminPg-1)*per,ui.adminPg*per);
    body='<div class="tblw"><div class="th"><h3 class="disp">All orders</h3>'
    +'<input class="in" style="max-width:190px" placeholder="Search code / name / phone" value="'+esc(f.q||'')+'" data-input="adm-q">'
    +'<select class="in" style="width:auto" data-chg="adm-f" data-k="st"><option value="all">All statuses</option>'+Object.keys(STC).map(s=>'<option'+(f.st===s?' selected':'')+'>'+s+'</option>').join('')+'</select>'
    +'<select class="in" style="width:auto" data-chg="adm-f" data-k="br"><option value="all">All branches</option>'+db.branches.map(b=>'<option value="'+b.id+'"'+(f.br===b.id?' selected':'')+'>'+esc(b.name)+'</option>').join('')+'</select>'
    +'<select class="in" style="width:auto" data-chg="adm-f" data-k="tp"><option value="all">All types</option><option'+(f.tp==='delivery'?' selected':'')+'>delivery</option><option'+(f.tp==='takeaway'?' selected':'')+'>takeaway</option></select>'
    +'<select class="in" style="width:auto" data-chg="adm-f" data-k="sort"><option value="date"'+(f.sort!=='total'?' selected':'')+'>Newest</option><option value="total"'+(f.sort==='total'?' selected':'')+'>Highest total</option></select>'
    +'<button class="btn btn-line btn-xs" data-act="export-csv" data-scope="orders">'+ic('download')+'CSV</button></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Order ID</th><th>Customer</th><th>Branch</th><th>Type</th><th>Total</th><th>Status</th><th>Date</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +(page.map(o=>'<tr><td data-l="Order"><b>'+o.code+'</b></td><td data-l="Customer">'+esc(o.name)+'<br><span class="muted" style="font-size:11.5px">'+esc(o.phone)+'</span></td><td data-l="Branch">'+esc((branch(o.branchId)||{}).name||'—')+'</td><td data-l="Type">'+o.type+'</td><td data-l="Total"><b>'+money(o.total)+'</b></td>'
    +'<td data-l="Status">'+stBadge(o.status)+'</td><td data-l="Date">'+fmtD(o.createdAt)+'</td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts"><button class="icon-btn" data-act="order-view" data-id="'+o.id+'" title="Details">'+ic('eye')+'</button>'
    +(['Completed','Cancelled'].indexOf(o.status)<0?'<select class="in" style="width:auto;padding:6px 26px 6px 9px;font-size:12px" data-chg="o-status" data-id="'+o.id+'"><option value="">Change…</option>'+Object.keys(STC).filter(s=>s!==o.status).map(s=>'<option>'+s+'</option>').join('')+'</select>':'')
    +'</div></td></tr>').join('')||'<tr><td colspan="8" style="text-align:center;padding:40px" class="muted">No orders match your filters.</td></tr>')
    +'</tbody></table></div>'
    +(pages>1?'<div class="pager">'+Array.from({length:pages},(x,i)=>'<button class="'+(ui.adminPg===i+1?'on':'')+'" data-act="adm-pg" data-p="'+(i+1)+'">'+(i+1)+'</button>').join('')+'</div>':'')
    +'</div>';
  }
  else if(tab==='menu'){
    body='<div class="tblw"><div class="th"><h3 class="disp">Menu items · '+db.products.length+'</h3>'
    +'<input class="in" style="max-width:220px" placeholder="Search menu…" value="'+esc(ui.pq||'')+'" data-input="adm-pq">'
    +'<button class="btn btn-red btn-sm" data-act="product-new">'+ic('plus')+'Add dish</button></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Dish</th><th>Category</th><th>Price</th><th>Prep</th><th>Rating</th><th>Flags</th><th>Available</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +db.products.filter(p=>!ui.pq||p.name.toLowerCase().indexOf(ui.pq.toLowerCase())>=0).map(p=>'<tr>'
    +'<td data-l="Dish"><div class="tt"><span class="th-im">'+dishArt(p)+'</span><b>'+esc(p.name)+'</b></div></td>'
    +'<td data-l="Category">'+esc(catName(p.cat))+'</td><td data-l="Price"><b>'+money(p.price)+'</b></td><td data-l="Prep">'+p.prep+' min</td>'
    +'<td data-l="Rating">'+p.rating.toFixed(1)+' '+ic('star','f')+'</td>'
    +'<td data-l="Flags"><div style="display:flex;gap:6px">'+(p.featured?'<span class="tag w">Chef</span>':'')+(p.popular?'<span class="tag">Pop</span>':'')+'</div></td>'
    +'<td data-l="Available"><button data-act="p-avail" data-id="'+p.id+'" aria-label="Toggle availability">'+sw(p.available)+'</button></td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts">'
    +'<button class="icon-btn'+(p.popular?'':' dng')+'" data-act="p-flag" data-id="'+p.id+'" data-k="popular" title="Toggle popular" style="'+(p.popular?'color:var(--red)':'')+'">'+ic('flame')+'</button>'
    +'<button class="icon-btn'+(p.featured?'':' dng')+'" data-act="p-flag" data-id="'+p.id+'" data-k="featured" title="Toggle featured" style="'+(p.featured?'color:var(--red)':'')+'">'+ic('award')+'</button>'
    +'<button class="icon-btn" data-act="product-edit" data-id="'+p.id+'" title="Edit">'+ic('pencil')+'</button>'
    +'<button class="icon-btn dng" data-act="product-del" data-id="'+p.id+'" title="Delete">'+ic('trash-2')+'</button></div></td></tr>').join('')
    +'</tbody></table></div></div>';
  }
  else if(tab==='categories'){
    const cats=[...db.categories].sort((a,b)=>a.order-b.order);
    body='<div class="tblw"><div class="th"><h3 class="disp">Categories</h3><button class="btn btn-red btn-sm" data-act="cat-new">'+ic('plus')+'Add category</button></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Order</th><th>Category</th><th>Dishes</th><th>Enabled</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +cats.map((c,i)=>'<tr><td data-l="Order">'+(i+1)+'</td><td data-l="Category"><div class="tt"><span class="th-im">'+dishSVG(c.type)+'</span><b>'+esc(c.name)+'</b></div></td>'
    +'<td data-l="Dishes">'+catProducts(c.id).length+'</td>'
    +'<td data-l="Enabled"><button data-act="cat-toggle" data-id="'+c.id+'">'+sw(c.status)+'</button></td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts">'
    +'<button class="icon-btn" data-act="cat-up" data-id="'+c.id+'" title="Move up">'+ic('chevron-up')+'</button>'
    +'<button class="icon-btn" data-act="cat-down" data-id="'+c.id+'" title="Move down">'+ic('chevron-down')+'</button>'
    +'<button class="icon-btn" data-act="cat-edit" data-id="'+c.id+'" title="Edit">'+ic('pencil')+'</button>'
    +'<button class="icon-btn dng" data-act="cat-del" data-id="'+c.id+'" title="Delete">'+ic('trash-2')+'</button></div></td></tr>').join('')
    +'</tbody></table></div></div>'
    +'<p class="hint" style="margin-top:12px">'+ic('info')+' Disabled categories are hidden from the customer menu together with their dishes.</p>';
  }
  else if(tab==='branches'){
    body='<div class="tblw"><div class="th"><h3 class="disp">Branches</h3><button class="btn btn-red btn-sm" data-act="branch-new">'+ic('plus')+'Add branch</button></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Branch</th><th>Contact</th><th>Hours</th><th>Services</th><th>Fee / Radius</th><th>Active</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +db.branches.map(b=>'<tr><td data-l="Branch"><div class="tt"><span class="th-im" style="width:60px">'+branchArt(b)+'</span><div><b>'+esc(b.name)+'</b><span>'+esc(b.address)+'</span></div></div></td>'
    +'<td data-l="Contact">'+esc(b.phone)+'<br><span class="muted" style="font-size:11.5px">'+esc(b.email)+'</span></td>'
    +'<td data-l="Hours">'+esc(b.open)+'–'+esc(b.close)+'<br>'+(isOpen(b)?'<span class="tag g">Open now</span>':'<span class="tag w">Closed</span>')+'</td>'
    +'<td data-l="Services">'+(b.delivery?'<span class="tag g">Delivery</span>':'<span class="tag w">No delivery</span>')+' '+(b.takeaway?'<span class="tag g">Takeaway</span>':'<span class="tag w">No pickup</span>')+'</td>'
    +'<td data-l="Fee">'+money(b.fee)+' · '+b.radius+' km</td>'
    +'<td data-l="Active"><button data-act="b-toggle" data-id="'+b.id+'">'+sw(b.status)+'</button></td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts">'
    +'<button class="icon-btn'+(b.delivery?'':' dng')+'" data-act="b-svc" data-id="'+b.id+'" data-k="delivery" title="Toggle delivery" style="'+(b.delivery?'color:var(--red)':'')+'">'+ic('bike')+'</button>'
    +'<button class="icon-btn'+(b.takeaway?'':' dng')+'" data-act="b-svc" data-id="'+b.id+'" data-k="takeaway" title="Toggle takeaway" style="'+(b.takeaway?'color:var(--red)':'')+'">'+ic('shopping-bag')+'</button>'
    +'<button class="icon-btn" data-act="branch-edit" data-id="'+b.id+'" title="Edit">'+ic('pencil')+'</button>'
    +'<button class="icon-btn dng" data-act="branch-del" data-id="'+b.id+'" title="Delete">'+ic('trash-2')+'</button></div></td></tr>').join('')
    +'</tbody></table></div></div>';
  }
  else if(tab==='customers'){
    const custs=db.users.filter(x=>x.role==='CUSTOMER');
    const q=(ui.cq||'').toLowerCase();
    const list=custs.filter(c=>!q||(c.name+c.email+c.phone).toLowerCase().indexOf(q)>=0);
    body='<div class="tblw"><div class="th"><h3 class="disp">Customers · '+custs.length+'</h3><input class="in" style="max-width:230px" placeholder="Search customers…" value="'+esc(ui.cq||'')+'" data-input="adm-cq"></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Spend</th><th>Status</th><th>Joined</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +(list.map(c=>{
      const os=db.orders.filter(o=>o.customerId===c.id);
      const sp=os.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0);
      return '<tr><td data-l="Customer"><div class="tt"><span class="th-im" style="background:var(--wine);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800">'+esc(c.name[0])+'</span><b>'+esc(c.name)+'<span class="muted" style="font-weight:400">'+esc(c.email)+'</span></b></div></td>'
      +'<td data-l="Phone">'+esc(c.phone)+'</td><td data-l="Orders">'+os.length+'</td><td data-l="Spend"><b>'+money(sp)+'</b></td>'
      +'<td data-l="Status">'+(c.status==='active'?okBadge('Active'):stBadge('Disabled'))+'</td><td data-l="Joined">'+fmtD(c.createdAt)+'</td>'
      +'<td class="nolab" style="text-align:right"><div class="tacts"><button class="icon-btn" data-act="cust-view" data-id="'+c.id+'" title="Profile">'+ic('eye')+'</button>'
      +'<button class="icon-btn dng" data-act="cust-toggle" data-id="'+c.id+'" title="'+(c.status==='active'?'Disable':'Enable')+'">'+ic('power')+'</button></div></td></tr>';
    }).join('')||'<tr><td colspan="7" style="text-align:center;padding:40px" class="muted">No customers found.</td></tr>')
    +'</tbody></table></div></div>';
  }
  else if(tab==='promotions'){
    body='<div class="tblw"><div class="th"><h3 class="disp">Coupons & promotions</h3><button class="btn btn-red btn-sm" data-act="promo-new">'+ic('plus')+'New promotion</button></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Window</th><th>Usage</th><th>Active</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +db.coupons.map(c=>'<tr><td data-l="Code"><b style="letter-spacing:.08em">'+esc(c.code)+'</b><br><span class="muted" style="font-size:11.5px">'+esc(c.desc)+'</span></td>'
    +'<td data-l="Discount"><b style="color:var(--red)">'+(c.type==='pct'?c.value+'%':money(c.value))+'</b>'+(c.max?'<br><span class="muted" style="font-size:11.5px">max '+money(c.max)+'</span>':'')+'</td>'
    +'<td data-l="Min">'+money(c.min)+'</td><td data-l="Window">'+fmtD(c.starts)+' → '+fmtD(c.expires)+'</td>'
    +'<td data-l="Usage">'+c.used+(c.limit?'/'+c.limit:'')+'</td>'
    +'<td data-l="Active"><button data-act="promo-toggle" data-id="'+c.id+'">'+sw(c.active)+'</button></td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts"><button class="icon-btn" data-act="promo-edit" data-id="'+c.id+'">'+ic('pencil')+'</button><button class="icon-btn dng" data-act="promo-del" data-id="'+c.id+'">'+ic('trash-2')+'</button></div></td></tr>').join('')
    +'</tbody></table></div></div>';
  }
  else if(tab==='reviews'){
    body='<div class="tblw"><div class="th"><h3 class="disp">Guest reviews · '+db.reviews.length+'</h3></div>'
    +(db.reviews.map(r=>{
      const cu=userById(r.customerId),p=prod(r.productId),o=orderById(r.orderId);
      return '<div class="notif'+(r.hidden?' read':'')+'"><div class="ni">'+ic('message-square')+'</div>'
      +'<div style="flex:1"><b>'+esc(cu?cu.name:'Guest')+' on '+esc(p?p.name:'—')+'</b><div style="margin:3px 0">'+stars(r.rating)+'</div><p>&ldquo;'+esc(r.comment)+'&rdquo;</p><p style="margin-top:3px;opacity:.7">'+fmtD(r.ts)+' · order '+esc(o?o.code:'')+'</p></div>'
      +'<div class="tacts"><button class="icon-btn" data-act="rev-hide" data-id="'+r.id+'" title="'+(r.hidden?'Unhide':'Hide')+'">'+ic(r.hidden?'eye':'eye-off')+'</button>'
      +'<button class="icon-btn dng" data-act="rev-del" data-id="'+r.id+'" title="Delete">'+ic('trash-2')+'</button></div></div>';
    }).join('')||'<div>'+empty('message-square','No reviews yet','Reviews from completed orders appear here.','')+'</div>')+'</div>';
  }
  else if(tab==='notifications'){
    body='<div class="card" style="margin-bottom:18px"><h3>'+ic('send')+' Broadcast a promotion to all customers</h3>'
    +'<form data-form="broadcast" novalidate><div class="row2">'+fld('Title',inpF('title','Weekend deal is live!'))+fld('Link (optional)',inpF('link','/offers','','text',false))+'</div>'
    +fld('Message','<textarea class="in" name="body" required placeholder="Tell customers about it…"></textarea>')
    +'<button class="btn btn-red btn-sm">'+ic('send')+'Send to all customers</button></form></div>'
    +'<div class="tblw"><div class="th"><h3 class="disp">All notifications</h3><button class="btn btn-line btn-xs" data-act="export-csv" data-scope="notifs">'+ic('download')+'CSV</button></div>'
    +'<div class="scroll" style="max-height:480px;overflow-y:auto">'
    +db.notifications.slice(0,50).map(n=>{
      const to=n.to.indexOf('role:')===0?n.to.split(':')[1]:((userById(n.to.split(':')[1])||{}).name||n.to);
      return '<div class="notif'+(n.read?' read':'')+'"><div class="ni">'+ic('bell')+'</div><div style="flex:1"><b>'+esc(n.title)+'</b><p>'+esc(n.body)+'</p></div><span class="tm">to '+esc(to)+'<br>'+ago(n.ts)+'</span></div>';
    }).join('')+'</div></div>';
  }
  else if(tab==='reports'){
    if(!ui.rep)ui.rep={from:dkey(now()-13*DAY),to:dkey(now()),br:'all',tp:'all',st:'all'};
    const f=ui.rep;
    const from=new Date(f.from+'T00:00').getTime(), to=new Date(f.to+'T23:59').getTime();
    let list=db.orders.filter(o=>o.createdAt>=from&&o.createdAt<=to);
    if(f.br!=='all')list=list.filter(o=>o.branchId===f.br);
    if(f.tp!=='all')list=list.filter(o=>o.type===f.tp);
    if(f.st!=='all')list=list.filter(o=>o.status===f.st);
    const valid=list.filter(o=>o.status!=='Cancelled');
    const rev=valid.reduce((s,o)=>s+o.total,0);
    const days=Math.max(1,Math.min(14,Math.round((to-from)/DAY)+1));
    const lbl=[],rv=[],od=[];
    for(let i=0;i<days;i++){const d=dkey(from+i*DAY);lbl.push(new Date(from+i*DAY).toLocaleDateString(undefined,{month:'short',day:'numeric'}));rv.push(valid.filter(o=>dkey(o.createdAt)===d).reduce((s,o)=>s+o.total,0));od.push(valid.filter(o=>dkey(o.createdAt)===d).length);}
    const sell={}; valid.forEach(o=>o.items.forEach(i=>sell[i.name]=(sell[i.name]||0)+i.qty));
    const best=Object.entries(sell).sort((a,b)=>b[1]-a[1]).slice(0,8), mx=best.length?best[0][1]:1;
    const perBranch=db.branches.map(b=>({b:b,rev:valid.filter(o=>o.branchId===b.id).reduce((s,o)=>s+o.total,0),n:valid.filter(o=>o.branchId===b.id).length})).sort((x,y)=>y.rev-x.rev);
    body='<div class="tblw" style="margin-bottom:18px"><div class="th"><h3 class="disp">Filters</h3>'
    +'<label style="font-size:11px;font-weight:800;color:var(--gray);text-transform:uppercase">From<input class="in" type="date" value="'+f.from+'" data-chg="rep" data-k="from" style="margin-top:4px"></label>'
    +'<label style="font-size:11px;font-weight:800;color:var(--gray);text-transform:uppercase">To<input class="in" type="date" value="'+f.to+'" data-chg="rep" data-k="to" style="margin-top:4px"></label>'
    +'<select class="in" style="width:auto" data-chg="rep" data-k="br"><option value="all">All branches</option>'+db.branches.map(b=>'<option value="'+b.id+'"'+(f.br===b.id?' selected':'')+'>'+esc(b.name)+'</option>').join('')+'</select>'
    +'<select class="in" style="width:auto" data-chg="rep" data-k="tp"><option value="all">All types</option><option'+(f.tp==='delivery'?' selected':'')+'>delivery</option><option'+(f.tp==='takeaway'?' selected':'')+'>takeaway</option></select>'
    +'<select class="in" style="width:auto" data-chg="rep" data-k="st"><option value="all">All statuses</option>'+Object.keys(STC).map(s=>'<option'+(f.st===s?' selected':'')+'>'+s+'</option>').join('')+'</select>'
    +'<button class="btn btn-red btn-xs" data-act="export-csv" data-scope="report">'+ic('download')+'Export CSV</button></div></div>'
    +'<div class="kpis">'
    +'<div class="kpi"><div class="ki">'+ic('banknote')+'</div><div class="kv">'+money(rev)+'</div><div class="kl">Revenue</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('receipt')+'</div><div class="kv">'+list.length+'</div><div class="kl">Orders</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('bike')+'</div><div class="kv">'+valid.filter(o=>o.type==='delivery').length+'</div><div class="kl">Delivery</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('shopping-bag')+'</div><div class="kv">'+valid.filter(o=>o.type==='takeaway').length+'</div><div class="kl">Takeaway</div></div>'
    +'<div class="kpi"><div class="ki">'+ic('users')+'</div><div class="kv">'+new Set(list.map(o=>o.customerId)).size+'</div><div class="kl">Unique customers</div></div></div>'
    +'<div class="grid2"><div class="card"><h3>Revenue in range</h3><canvas class="ch" id="ch-rev"></canvas></div><div class="card"><h3>Orders in range</h3><canvas class="ch" id="ch-ord"></canvas></div></div>'
    +'<div class="grid2b"><div class="card"><h3>Best-selling dishes</h3>'+(best.map(x=>'<div class="rep-bar"><div class="rl"><span>'+esc(x[0])+'</span><b>'+x[1]+' sold</b></div><div class="rt"><i data-w="'+Math.round(x[1]/mx*100)+'"></i></div></div>').join('')||'<p class="muted">No sales in range.</p>')+'</div>'
    +'<div class="card"><h3>Branch performance</h3><div class="scroll"><table class="tbl" style="min-width:0"><thead><tr><th>Branch</th><th>Orders</th><th>Revenue</th></tr></thead><tbody>'
    +perBranch.map(x=>'<tr><td>'+esc(x.b.name)+'</td><td>'+x.n+'</td><td><b>'+money(x.rev)+'</b></td></tr>').join('')
    +'</tbody></table></div></div></div>';
  }
  else if(tab==='content'){
    const c=db.content; _stagedPics={};
    body='<div class="grid2b"><div class="card"><h3>'+ic('home')+' Homepage</h3>'
    +'<form data-form="content" novalidate>'
    +fld('Hero tagline',inpF('heroTag','Tagline',c.heroTag))
    +fld('Hero heading',inpF('heroTitle','Heading',c.heroTitle))
    +fld('Hero description','<textarea class="in" name="heroDesc" required>'+esc(c.heroDesc)+'</textarea>')
    +fld('Story headline',inpF('storyTitle','Headline',c.storyTitle))
    +fld('Story body','<textarea class="in" name="storyBody" required style="min-height:110px">'+esc(c.storyBody)+'</textarea>')
    +'<div class="row2">'+fld('Offer title',inpF('offerTitle','Title',c.offerTitle))+fld('Offer description',inpF('offerDesc','Description',c.offerDesc))+'</div>'
    +fld('Footer note',inpF('footerNote','Note',c.footerNote,'text',false))
    +fld('Hero badges (comma separated)',inpF('heroMeta','Delivery in ~35 min, Live-fire kitchen, 4 branches',c.heroMeta,'text',false))
    +fld('Scrolling banner (comma separated)',inpF('marquee','Charcoal grill, 48-hour dough',c.marquee,'text',false))
    +fld('Featured section title',inpF('featuredTitle','Title',c.featuredTitle,'text',false))
    +'<div class="row2">'+fld('Popular section title',inpF('popularTitle','Title',c.popularTitle,'text',false))+fld('Reviews section title',inpF('quotesTitle','Title',c.quotesTitle,'text',false))+'</div>'
    +fld('Popular section subtitle',inpF('popularSubtitle','Subtitle',c.popularSubtitle,'text',false))
    +fld('Bottom banner title',inpF('ctaTitle','Title',c.ctaTitle,'text',false))
    +fld('Bottom banner text',inpF('ctaText','Text',c.ctaText,'text',false))
    +'<button class="btn btn-red btn-sm">'+ic('check')+'Save & publish</button></form></div>'
    +'<div><div class="card" style="margin-bottom:18px"><h3>'+ic('info')+' How this works</h3><p style="font-size:13.5px;color:var(--gray)">Everything you save here is reflected instantly on the customer website — hero, story, offers and footer read from this configuration, never hardcoded.</p></div>'
    +'<div class="card"><h3>'+ic('eye')+' Current hero preview</h3><div style="background:var(--ink);color:var(--on-dark);border-radius:12px;padding:22px">'
    +'<span class="kicker on-dark" style="font-size:10px">'+esc(c.heroTag)+'</span>'
    +'<p class="disp" style="font-size:22px;font-weight:800;margin-top:8px">'+esc(c.heroTitle)+'</p>'
    +'<p style="font-size:12px;color:#b9b8bd;margin-top:6px">'+esc(c.heroDesc)+'</p></div></div></div></div>'
    +'<div class="grid2b">'
    +'<div class="card"><h3>'+ic('image')+' Logo, icon &amp; pictures</h3>'
    +'<form data-form="pictures" novalidate>'+PIC_SLOTS.map(picSlotHTML).join('')
    +'<button class="btn btn-red btn-sm" style="margin-top:16px">'+ic('check')+'Save pictures</button></form>'
    +'<p class="hint" style="margin-top:10px">Dish photos are edited under Menu; branch photos under Branches.</p></div>'
    +'<div class="card"><h3>'+ic('file-text')+' About page &amp; page headings</h3>'
    +'<form data-form="contentPages" novalidate>'
    +fld('About page heading',inpF('aboutHeroTitle','Heading',c.aboutHeroTitle,'text',false))
    +fld('About page — extra paragraph','<textarea class="in" name="aboutExtra">'+esc(c.aboutExtra)+'</textarea>')
    +fld('Philosophy heading',inpF('philosophyTitle','Heading',c.philosophyTitle,'text',false))
    +fld('Philosophy text','<textarea class="in" name="philosophyBody">'+esc(c.philosophyBody)+'</textarea>')
    +(c.values||[]).map((v,i)=>'<div class="row2">'+fld('Value '+(i+1)+' title',inpF('value'+(i+1)+'Title','Title',v.title,'text',false))+fld('Value '+(i+1)+' text',inpF('value'+(i+1)+'Desc','Text',v.desc,'text',false))+'</div>').join('')
    +'<div class="row2">'+fld('About banner title',inpF('aboutCtaTitle','Title',c.aboutCtaTitle,'text',false))+fld('About banner text',inpF('aboutCtaText','Text',c.aboutCtaText,'text',false))+'</div>'
    +'<div class="row2">'+fld('Branches page title',inpF('branchesTitle','Title',c.branchesTitle,'text',false))+fld('Branches page subtitle',inpF('branchesSubtitle','Subtitle',c.branchesSubtitle,'text',false))+'</div>'
    +'<div class="row2">'+fld('Offers page title',inpF('offersTitle','Title',c.offersTitle,'text',false))+fld('Offers page subtitle',inpF('offersSubtitle','Subtitle',c.offersSubtitle,'text',false))+'</div>'
    +fld('Contact page title',inpF('contactTitle','Title',c.contactTitle,'text',false))
    +'<button class="btn btn-red btn-sm">'+ic('check')+'Save page text</button></form></div></div>'
    +'<div class="card"><h3>'+ic('type')+' Labels, buttons &amp; small text</h3><p class="hint" style="margin-bottom:14px">Edit navigation names, button text, section labels, the Menu page heading and footer headings. Leave a field empty to restore the default.</p>'
    +'<form data-form="labels" novalidate>'
    +['Navigation','Homepage','Menu page','Other pages','Footer'].map(g=>'<div class="gt" style="font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--gray);margin:14px 0 8px">'+g+'</div><div class="row2">'+LABEL_DEFS.filter(d=>d.g===g).map(d=>fld(esc(d.label),inpF('lb_'+d.k,d.def,(c.labels&&c.labels[d.k])||'','text',false))).join('')+'</div>').join('')
    +'<button class="btn btn-red btn-sm" style="margin-top:8px">'+ic('check')+'Save labels</button></form></div>';
  }
  else if(tab==='users'){
    const staff=db.users.filter(x=>x.role!=='CUSTOMER');
    body='<div class="tblw" style="margin-bottom:20px"><div class="th"><h3 class="disp">Staff accounts</h3></div>'
    +'<div class="scroll"><table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Status</th><th class="nolab" style="text-align:right">Actions</th></tr></thead><tbody>'
    +staff.map(x=>'<tr><td data-l="Name"><b>'+esc(x.name)+'</b>'+(x.id===u.id?' <span class="tag g">you</span>':'')+'</td><td data-l="Email">'+esc(x.email)+'</td>'
    +'<td data-l="Role"><span class="tag '+(x.role==='ADMIN'?'':'w')+'">'+x.role+'</span></td><td data-l="Branch">'+(x.branchId?esc((branch(x.branchId)||{}).name||'—'):'—')+'</td>'
    +'<td data-l="Status">'+(x.status==='active'?okBadge('Active'):stBadge('Disabled'))+'</td>'
    +'<td class="nolab" style="text-align:right"><div class="tacts">'+(x.id!==u.id?'<button class="icon-btn dng" data-act="user-toggle" data-id="'+x.id+'">'+ic('power')+'</button>':'<span class="muted" style="font-size:12px">—</span>')+'</div></td></tr>').join('')
    +'</tbody></table></div></div>'
    +'<div class="card" style="max-width:640px"><h3>'+ic('user-plus')+' Add a staff account</h3>'
    +'<form data-form="user" novalidate><div class="row2">'+fld('Full name',inpF('name','Jane Smith'))+fld('Email',inpF('email','jane@emberandvine.com','','email'))+'</div>'
    +'<div class="row2">'+fld('Role',selF('role',[['MANAGER','Manager'],['ADMIN','Admin']]))+fld('Branch (managers)',selF('branchId',[['','— none —']].concat(db.branches.map(b=>[b.id,b.name]))))+'</div>'
    +fld('Temporary password',inpF('password','Min. 8 characters','','password'))
    +'<div class="ferr" data-err></div><button class="btn btn-dark btn-sm">'+ic('check')+'Create account</button></form></div>';
  }
  else if(tab==='settings'){
    const s=SET();
    body='<div class="grid2b"><div class="card"><h3>'+ic('store')+' Restaurant profile</h3>'
    +'<form data-form="settings" novalidate>'+fld('Restaurant name',inpF('name','Name',s.name))
    +'<div class="row2">'+fld('Phone',inpF('phone','Phone',s.phone))+fld('Email',inpF('email','Email',s.email,'email'))+'</div>'
    +fld('HQ address',inpF('address','Address',s.address))
    +fld('Opening hours',inpF('hours','Hours',s.hours))
    +'<div class="row2">'+fld('Currency symbol',inpF('symbol','$',s.symbol))+fld('Tax rate %',inpF('taxRate','5',String(s.taxRate),'number','step="0.1"'))+'</div>'
    +'<div class="row2">'+fld('Free delivery over',inpF('freeOver','60',String(s.freeOver),'number','step="0.01"'))+fld('Founded (year)',inpF('est','2014',s.est))+'</div>'
    +'<button class="btn btn-red btn-sm">'+ic('check')+'Save settings</button></form></div>'
    +'<div class="card"><h3>'+ic('at-sign')+' Social links</h3>'
    +'<form data-form="social" novalidate>'+fld('Instagram',inpF('instagram','@handle',s.social.instagram))+fld('Facebook',inpF('facebook','page',s.social.facebook))+fld('Twitter / X',inpF('twitter','@handle',s.social.twitter))
    +'<button class="btn btn-dark btn-sm">'+ic('check')+'Save links</button></form></div>'
    +'<div class="card"><h3>'+ic('image')+' Logo &amp; icon</h3><p class="hint" style="margin-bottom:12px">Change your logo, website icon and page pictures under <b>Website Content</b>.</p><a class="btn btn-line btn-sm" href="#/admin/content">'+ic('arrow-right')+'Open Website Content</a></div></div>';
  }
  else if(tab==='audit'){
    body='<div class="tblw"><div class="th"><h3 class="disp">Audit log · sensitive operations</h3><button class="btn btn-line btn-xs" data-act="export-csv" data-scope="audit">'+ic('download')+'CSV</button></div>'
    +'<div style="max-height:600px;overflow-y:auto">'
    +(db.auditLogs.map(a=>'<div class="audit-li">'+ic('shield-check')+'<span class="who">'+esc(a.user)+'</span><span>'+esc(a.action)+'</span><span class="tm">'+fmtDT(a.ts)+'</span></div>').join('')||'<p class="muted" style="padding:30px;text-align:center">No entries.</p>')
    +'</div></div>';
  }
  else if(tab==='profile'){
    body='<div class="card" style="max-width:560px"><h3>'+ic('user')+' Admin profile</h3>'
    +'<form data-form="profile" novalidate>'+fld('Full name',inpF('name','Full name',u.name))+fld('Mobile',inpF('phone','+1 (555) 000-0000',u.phone,'tel',false))
    +'<button class="btn btn-red btn-sm">'+ic('check')+'Save</button></form></div>'
    +'<div class="card" style="max-width:560px;margin-top:18px"><h3>'+ic('lock')+' Change password</h3>'
    +'<form data-form="password" novalidate>'+fld('Current password','<input class="in" name="old" type="password" required>')
    +fld('New password','<input class="in" name="np" type="password" required minlength="8">')
    +'<div class="ferr" data-err></div><button class="btn btn-dark btn-sm">'+ic('key-round')+'Update</button></form></div>';
  }
  else{body=empty('layout-dashboard','Page not found','Use the sidebar to navigate the console.','');}
  return '<div class="dash">'+sideHTML('admin',sideTab)+'<div class="main">'
  +'<div class="top"><button class="icon-btn mob-tgl" data-act="sidebar">'+ic('menu')+'</button><h1 class="disp">Admin console</h1>'
  +'<div class="tb">'+themeBtn()+'<span class="tag">ADMIN</span>'
  +'<button class="btn btn-line btn-sm" data-act="storage-connect">'+(cloudToken()?'Cloud storage connected':'Connect cloud storage')+'</button>'
  +'<button class="icon-btn bell" data-act="goto-notifs" data-base="admin" aria-label="Notifications">'+ic('bell')+(unreadCount()?'<span class="badge-n">'+unreadCount()+'</span>':'')+'</button></div></div>'
  +'<div class="content">'+body+'</div></div></div>';
}
function mountCharts(){
  $$('.rep-bar [data-w], .card [data-w]').forEach(b=>requestAnimationFrame(()=>b.style.width=b.dataset.w+'%'));
  const rev=$('#ch-rev');
  if(rev){
    const inReports=ui.adminTab==='reports'&&ui.rep;
    const f=inReports?ui.rep:null;
    const from=f?new Date(f.from+'T00:00').getTime():now()-13*DAY;
    const days=f?Math.max(1,Math.min(14,Math.round((new Date(f.to+'T23:59')-new Date(f.from+'T00:00'))/DAY)+1)):14;
    const lbl=[],rv=[],od=[];
    for(let i=0;i<days;i++){
      const d=dkey(from+i*DAY);
      lbl.push(new Date(from+i*DAY).toLocaleDateString(undefined,{month:'short',day:'numeric'}));
      rv.push(db.orders.filter(o=>dkey(o.createdAt)===d&&o.status!=='Cancelled').reduce((s,o)=>s+o.total,0));
      od.push(db.orders.filter(o=>dkey(o.createdAt)===d&&o.status!=='Cancelled').length);
    }
    chArea(rev,lbl,rv);
    const odC=$('#ch-ord'); if(odC)chBars(odC,lbl,od);
    const dt=$('#ch-dt');
    if(dt){const valid=db.orders.filter(o=>o.status!=='Cancelled');
      chDonut(dt,[{v:valid.filter(o=>o.type==='delivery').length,c:'#E6002B'},{v:valid.filter(o=>o.type==='takeaway').length,c:'#96959A'}],'total orders',String(valid.length));}
  }
}
let _stagedImage;
function productModal(p){
  const isNew=!p;
  p=p||{name:'',cat:(visibleCats()[0]||{}).id||'c1',price:'',prep:15,type:'burger',desc:'',ing:'',available:true,featured:false,popular:false};
  _stagedImage=undefined;
  modal('<div style="padding:28px"><h3 class="disp" style="font-size:23px;margin-bottom:18px">'+(isNew?'Add a dish':'Edit dish')+'</h3>'
  +'<form data-form="product" data-id="'+(p.id||'')+'" novalidate>'
  +fld('Name',inpF('name','Dish name',p.name))
  +'<div class="modg" style="border:none;padding:0;margin-bottom:16px"><div class="gt">Dish photo</div>'
  +'<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">'
  +'<div data-img-preview style="width:84px;height:84px;border-radius:10px;overflow:hidden;background:var(--ink);flex:none">'+dishArt(p)+'</div>'
  +'<div style="display:flex;flex-direction:column;gap:8px">'
  +'<label class="btn btn-line btn-sm" style="cursor:pointer;width:fit-content">'+ic('upload')+'Choose image<input type="file" accept="image/*" data-chg="img-pick" style="display:none"></label>'
  +'<div data-img-remove-wrap>'+(p.image?'<button type="button" class="btn btn-sm" style="color:var(--wine)" data-act="img-remove">'+ic('trash-2')+'Remove photo</button>':'<span class="hint">A real food photo is used by default for seeded menu items.</span>')+'</div>'
  +'</div></div></div>'
  +'<div class="row2">'+fld('Category',selF('cat',visibleCats().map(c=>[c.id,c.name]),p.cat).replace('<select class="in" name="cat">','<select class="in" name="cat" data-chg="cat-sizes">'))+fld('Plate style',selF('type',TYPE_LIST.map(t=>[t,t]),p.type))+'</div>'
  +'<div data-sizes-section class="modg" style="border:none;padding:0;margin-bottom:16px;display:'+(p.cat==='c1'?'block':'none')+'"><div class="gt">Sizes &amp; pricing (Pizza only)</div>'
  +'<div class="row2">'+fld('Regular price',inpF('sizeRegular','0.00',String(pizzaSizes(p)[0]?pizzaSizes(p)[0].price:p.price),'number',true,'step="0.01" min="0"'))
  +fld('Large price',inpF('sizeLarge','0.00',String(pizzaSizes(p)[1]?pizzaSizes(p)[1].price:(p.price?(+p.price+3).toFixed(2):'')),'number',true,'step="0.01" min="0"'))+'</div></div>'
  +'<div class="row2"><div data-baseprice-wrap style="display:'+(p.cat==='c1'?'none':'block')+'">'+fld('Price',inpF('price','0.00',String(p.price),'number',p.cat!=='c1','step="0.01" min="0"'))+'</div>'+fld('Prep time (min)',inpF('prep','15',String(p.prep),'number',true,'min="1"'))+'</div>'
  +fld('Description','<textarea class="in" name="desc" required>'+esc(p.desc)+'</textarea>')
  +fld('Ingredients (comma separated)','<textarea class="in" name="ing" required style="min-height:64px">'+esc(p.ing)+'</textarea>')
  +'<div style="display:flex;gap:22px;margin:6px 0 16px;font-size:13.5px;font-weight:700;flex-wrap:wrap">'
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="available"'+(p.available?' checked':'')+' style="accent-color:var(--red)">Available</label>'
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="featured"'+(p.featured?' checked':'')+' style="accent-color:var(--red)">Chef\'s pick</label>'
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="popular"'+(p.popular?' checked':'')+' style="accent-color:var(--red)">Popular</label></div>'
  +'<div class="ferr" data-err></div>'
  +'<div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-line btn-sm" data-act="modal-close">Cancel</button><button class="btn btn-red btn-sm">'+ic('check')+(isNew?'Create dish':'Save changes')+'</button></div></form></div>');
}
function catModal(c){
  const isNew=!c;
  c=c||{name:'',type:'burger',status:true};
  modal('<div style="padding:28px"><h3 class="disp" style="font-size:23px;margin-bottom:18px">'+(isNew?'Add category':'Edit category')+'</h3>'
  +'<form data-form="category" data-id="'+(c.id||'')+'" novalidate>'
  +fld('Category name',inpF('name','e.g. Seafood',c.name))
  +fld('Plate style',selF('type',TYPE_LIST.map(t=>[t,t]),c.type))
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer;font-size:13.5px;font-weight:700;margin-bottom:16px"><input type="checkbox" name="status"'+(c.status?' checked':'')+' style="accent-color:var(--red)">Enabled (visible to customers)</label>'
  +'<div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-line btn-sm" data-act="modal-close">Cancel</button><button class="btn btn-red btn-sm">'+ic('check')+'Save</button></div></form></div>');
}
function branchModal(b){
  const isNew=!b;
  b=b||{name:'',address:'',phone:'',email:'',lat:40.712,lng:-74.006,open:'11:00',close:'23:00',delivery:true,takeaway:true,radius:5,fee:2.99,status:true};
  _stagedBranchImage=undefined;
  modal('<div style="padding:28px"><h3 class="disp" style="font-size:23px;margin-bottom:18px">'+(isNew?'Add branch':'Edit branch')+'</h3>'
  +'<form data-form="branch" data-id="'+(b.id||'')+'" novalidate>'
  +fld('Branch name',inpF('name','e.g. Westside',b.name))
  +'<div class="modg" style="border:none;padding:0;margin-bottom:16px"><div class="gt">Branch photo</div><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">'
  +'<div data-branch-preview style="width:110px;height:76px;border-radius:10px;overflow:hidden;background:var(--ink);flex:none">'+branchArt(b)+'</div>'
  +'<div style="display:flex;flex-direction:column;gap:8px"><label class="btn btn-line btn-sm" style="cursor:pointer;width:fit-content">'+ic('upload')+'Replace image<input type="file" accept="image/*" data-chg="branch-img-pick" style="display:none"></label>'
  +'<button type="button" class="btn btn-sm" style="color:var(--wine);width:fit-content" data-act="branch-img-remove">'+ic('rotate-ccw')+'Use default map art</button></div></div></div>'
  +fld('Address',inpF('address','Street, area',b.address))
  +'<div class="row2">'+fld('Phone',inpF('phone','Phone',b.phone))+fld('Email',inpF('email','Email',b.email,'email'))+'</div>'
  +'<div class="row2">'+fld('Latitude',inpF('lat','40.712',String(b.lat),'number',true,'step="any"'))+fld('Longitude',inpF('lng','-74.006',String(b.lng),'number',true,'step="any"'))+'</div>'
  +'<div class="row2">'+fld('Opens',inpF('open','',b.open,'time'))+fld('Closes',inpF('close','',b.close,'time'))+'</div>'
  +'<div class="row2">'+fld('Delivery radius (km)',inpF('radius','5',String(b.radius),'number',true,'step="0.5"'))+fld('Delivery fee',inpF('fee','2.99',String(b.fee),'number',true,'step="0.01"'))+'</div>'
  +'<div style="display:flex;gap:22px;margin:6px 0 16px;font-size:13.5px;font-weight:700;flex-wrap:wrap">'
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="delivery"'+(b.delivery?' checked':'')+' style="accent-color:var(--red)">Delivery</label>'
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="takeaway"'+(b.takeaway?' checked':'')+' style="accent-color:var(--red)">Takeaway</label>'
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer"><input type="checkbox" name="status"'+(b.status?' checked':'')+' style="accent-color:var(--red)">Active</label></div>'
  +'<div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-line btn-sm" data-act="modal-close">Cancel</button><button class="btn btn-red btn-sm">'+ic('check')+'Save branch</button></div></form></div>');
}
function promoModal(c){
  const isNew=!c;
  c=c||{code:'',type:'pct',value:10,min:0,max:'',starts:dkey(now()),expires:dkey(now()+30*DAY),limit:'',active:true,desc:''};
  modal('<div style="padding:28px"><h3 class="disp" style="font-size:23px;margin-bottom:18px">'+(isNew?'New promotion':'Edit promotion')+'</h3>'
  +'<form data-form="promo" data-id="'+(c.id||'')+'" novalidate>'
  +'<div class="row2">'+fld('Coupon code',inpF('code','WEEKEND20',c.code))+fld('Type',selF('type',[['pct','% of order'],['fix','Fixed amount']],c.type))+'</div>'
  +'<div class="row2">'+fld('Value',inpF('value','10',String(c.value),'number',true,'step="0.01"'))+fld('Max discount (optional)',inpF('max','',c.max?String(c.max):'','number',false,'step="0.01"'))+'</div>'
  +'<div class="row2">'+fld('Minimum order',inpF('min','0',String(c.min),'number',true,'step="0.01"'))+fld('Usage limit (optional)',inpF('limit','',c.limit?String(c.limit):'','number',false,'min="1"'))+'</div>'
  +'<div class="row2">'+fld('Starts',inpF('starts','',c.starts,'date'))+fld('Expires',inpF('expires','',c.expires,'date'))+'</div>'
  +fld('Description',inpF('desc','Short tagline',c.desc,'text',false))
  +'<label class="ck" style="display:flex;gap:7px;cursor:pointer;font-size:13.5px;font-weight:700;margin-bottom:16px"><input type="checkbox" name="active"'+(c.active?' checked':'')+' style="accent-color:var(--red)">Active</label>'
  +'<div class="ferr" data-err></div>'
  +'<div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-line btn-sm" data-act="modal-close">Cancel</button><button class="btn btn-red btn-sm">'+ic('check')+'Save promotion</button></div></form></div>');
}
function orderModal(o){
  const b=branch(o.branchId),cu=userById(o.customerId);
  modal('<div style="padding:28px">'
  +'<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3 class="disp" style="font-size:23px">'+o.code+'</h3>'+stBadge(o.status)+'</div>'
  +'<p class="muted" style="font-size:13px;margin:4px 0 18px">'+fmtDT(o.createdAt)+' · '+esc(cu?cu.name:o.name)+' · '+esc(o.phone)+' · '+(o.type==='delivery'?'Delivery':'Takeaway')+' · '+esc(b?b.name:'—')+'</p>'
  +(o.address?'<p style="font-size:13px;color:var(--gray);margin-bottom:14px">'+ic('map-pin')+' '+esc(o.address.line)+(o.address.apt?', '+esc(o.address.apt):'')+(o.address.note?' — <em>'+esc(o.address.note)+'</em>':'')+'</p>':'')
  +'<div class="tblw" style="margin-bottom:14px"><table class="tbl" style="min-width:0"><tbody>'
  +o.items.map(i=>'<tr><td data-l="Item"><b>'+i.qty+'×</b> '+esc(i.name)+(i.mods.length?'<br><small class="muted">'+esc(i.mods.join(' · '))+'</small>':'')+'</td><td data-l="Amount" style="text-align:right"><b>'+money(i.sub)+'</b></td></tr>').join('')
  +'</tbody></table></div>'
  +'<div style="font-size:13.5px;line-height:2;color:var(--gray)">Subtotal '+money(o.subtotal)+(o.discount?' · Discount <b style="color:var(--ok)">−'+money(o.discount)+'</b>':'')+' · Delivery '+money(o.deliveryFee)+' · Tax '+money(o.tax)+'<br>Total <b class="price" style="font-size:18px">'+money(o.total)+'</b> · '+(o.payment.method==='cod'?'Cash on delivery':'Pay at '+(o.type==='delivery'?'delivery':'counter'))+' · <b style="color:var(--wine)">'+o.payment.status+'</b></div>'
  +'<div class="modg" style="margin-top:16px"><div class="gt">Timeline</div>'
  +o.events.map(e=>'<div style="display:flex;gap:10px;font-size:12.5px;padding:4px 0"><b style="min-width:130px">'+esc(e.s)+'</b><span class="muted">'+fmtDT(e.ts)+' · '+esc(e.by)+'</span></div>').join('')+'</div>'
  +(['Completed','Cancelled'].indexOf(o.status)<0
    ?'<div style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap">'+Object.keys(STC).filter(s=>s!==o.status).map(s=>'<button class="btn '+(s==='Cancelled'?'btn-line':'btn-dark')+' btn-xs" data-act="o-set" data-id="'+o.id+'" data-s="'+s+'">'+s+'</button>').join('')+'</div>'
    :'')
  +'</div>',true);
}
function custModal(c){
  const os=db.orders.filter(o=>o.customerId===c.id);
  const sp=os.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0);
  modal('<div style="padding:28px"><div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">'
  +'<span style="width:52px;height:52px;border-radius:50%;background:var(--wine);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px">'+esc(c.name[0])+'</span>'
  +'<div><h3 class="disp" style="font-size:22px">'+esc(c.name)+'</h3><p class="muted" style="font-size:12.5px">'+esc(c.email)+' · '+esc(c.phone)+'</p></div></div>'
  +'<div class="kpis" style="grid-template-columns:repeat(3,1fr)"><div class="kpi"><div class="kv">'+os.length+'</div><div class="kl">Orders</div></div>'
  +'<div class="kpi"><div class="kv">'+money(sp)+'</div><div class="kl">Lifetime spend</div></div>'
  +'<div class="kpi"><div class="kv" style="font-size:16px">'+fmtD(c.createdAt)+'</div><div class="kl">Member since</div></div></div>'
  +'<div class="modg"><div class="gt">Recent orders</div>'
  +(os.slice(0,5).map(o=>'<div style="display:flex;justify-content:space-between;font-size:13px;padding:7px 0;border-bottom:1px dashed var(--line)"><span><b>'+o.code+'</b> · '+esc((branch(o.branchId)||{}).name||'')+'</span><span>'+money(o.total)+' · '+esc(o.status)+'</span></div>').join('')||'<p class="muted" style="font-size:13px">No orders yet.</p>')+'</div>'
  +'<div class="modg"><div class="gt">Addresses</div>'
  +(db.addresses.filter(a=>a.userId===c.id).map(a=>'<p style="font-size:13px;padding:4px 0"><b>'+esc(a.label)+'</b> — '+esc(a.line)+'</p>').join('')||'<p class="muted" style="font-size:13px">None saved.</p>')+'</div></div>');
}
function mkItem(p,qty,mods){
  let unit=p.price;
  (mods||[]).forEach(mn=>{for(const k in MOD_GROUPS){const o=MOD_GROUPS[k].opts.find(o=>o.n===mn);if(o)unit+=o.p}});
  return {key:p.id+JSON.stringify(mods||[]),productId:p.id,name:p.name,unit:+unit.toFixed(2),qty:qty,mods:[...(mods||[])]};
}
function addToCart(pid,qty,mods){
  const p=prod(pid); if(!p||!p.available)return;
  const c=cartGet(), it=mkItem(p,qty,mods);
  const ex=c.find(x=>x.key===it.key);
  if(ex)ex.qty+=it.qty; else c.push(it);
  cartSet(c);
  const b=$('[data-badge]');
  if(b){b.textContent=cartCount();b.style.display='';b.classList.add('pulse');setTimeout(()=>b.classList.remove('pulse'),500)}
  toast(p.name+' added to cart','ok',{label:'View cart',fn:()=>location.hash='#/cart'});
}
function exportCSV(scope){
  let rows,header,name;
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  if(scope==='orders'||scope==='report'){
    let list=[...db.orders];
    if(scope==='report'&&ui.rep){
      const f=ui.rep,from=new Date(f.from+'T00:00').getTime(),to=new Date(f.to+'T23:59').getTime();
      list=list.filter(o=>o.createdAt>=from&&o.createdAt<=to);
      if(f.br!=='all')list=list.filter(o=>o.branchId===f.br);
      if(f.tp!=='all')list=list.filter(o=>o.type===f.tp);
      if(f.st!=='all')list=list.filter(o=>o.status===f.st);
    }
    header=['Order ID','Customer','Phone','Branch','Type','Subtotal','Discount','Delivery Fee','Tax','Total','Status','Payment','Date'];
    rows=list.map(o=>[o.code,o.name,o.phone,(branch(o.branchId)||{}).name||'',o.type,o.subtotal,o.discount,o.deliveryFee,o.tax,o.total,o.status,o.payment.method+'/'+o.payment.status,new Date(o.createdAt).toISOString()]);
    name='orders';
  }else if(scope==='notifs'){
    header=['To','Title','Body','Read','Time'];
    rows=db.notifications.map(n=>[n.to,n.title,n.body,n.read,new Date(n.ts).toISOString()]);
    name='notifications';
  }else{
    header=['User','Action','Time'];
    rows=db.auditLogs.map(a=>[a.user,a.action,new Date(a.ts).toISOString()]);
    name='audit-log';
  }
  const csv=[header].concat(rows).map(r=>r.map(q).join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=name+'.csv'; a.click();
  toast('CSV exported ('+rows.length+' rows)','ok');
}
const ACT={
  'storage-connect':async()=>{
    if(cloudToken())return toast('Cloud storage is already connected for this browser session.','info');
    const entered=window.prompt('Enter the EV_STORAGE_ADMIN_TOKEN configured for this Netlify site. This token is kept only for the current browser session.');
    if(!entered)return;
    try{
      sessionStorage.setItem(CLOUD_TOKEN_KEY,entered.trim());
      cloudLastSyncAt=0;
      await syncCloudSiteState();
      try{localStorage.setItem(DBKEY,JSON.stringify(db))}catch(error){console.warn('Could not update the local cache after cloud sync',error)}
      toast('Cloud storage connected. Shared site content and pictures are saved on Netlify.','ok');
      render();
    }catch(error){
      try{sessionStorage.removeItem(CLOUD_TOKEN_KEY)}catch(e){}
      cloudLastSyncAt=0;
      cloudLastError=error.message;
      toast('Could not connect cloud storage: '+error.message,'err');
    }
  },
  'm-open':()=>{const m=$('[data-mnav]');m&&m.classList.add('open')},
  'm-close':()=>{const m=$('[data-mnav]');m&&m.classList.remove('open')},
  'modal-close':()=>closeModal(),
  'acct-menu':(t,e)=>{e.stopPropagation();const dd=t.parentElement.querySelector('[data-dd]');$$('[data-dd]').forEach(x=>{if(x!==dd)x.classList.remove('open')});dd&&dd.classList.toggle('open')},
  'logout':async()=>{setSession(null);toast('Signed out. See you at the table.','ok');if(location.hash==='#/'||location.hash===''){render()}else{location.hash='#/'}},
  'sidebar':()=>{const s=$('[data-side]'),bk=$('[data-sbk]');s&&s.classList.toggle('open');bk&&bk.classList.toggle('open')},
  'food':t=>openFood(t.dataset.id),
  'fav':(t,e)=>{
    e.stopPropagation();
    if(!me()){ui.next='menu';toast('Log in to save favorites','info');location.hash='#/login';return}
    const pid=t.dataset.id;
    const i=db.favorites.findIndex(f=>f.userId===me().id&&f.productId===pid);
    if(i>=0){db.favorites.splice(i,1);t.classList.remove('on');toast('Removed from favorites','info')}
    else{db.favorites.push({userId:me().id,productId:pid});t.classList.add('on','pop');toast('Saved to favorites','ok')}
    saveDB();
  },
  'add':t=>{
    const p=prod(t.dataset.id);
    if(!p||!p.available)return toast('This dish is unavailable.','err');
    if(p.cat==='c1')return openSizePicker(p);
    addToCart(t.dataset.id,1,[]);
  },
  'add-modal':()=>{
    const p=prod(ui.fd.id);
    if(!p||!p.available)return toast('This dish is unavailable.','err');
    const mods=[];
    (CAT_MODS[p.cat]||[]).forEach(k=>{
      const g=MOD_GROUPS[k],s=ui.fd.sel[g.name];
      if(g.type==='single'&&s!=null&&g.opts[s].n!=='Regular')mods.push(g.opts[s].n);
      else if(g.type==='multi')(s||[]).forEach(i=>mods.push(g.opts[i].n));
    });
    if(p.cat==='c1'){
      const sizes=pizzaSizes(p), sz=sizes[ui.fd.pizzaSizeIdx||0];
      let extra=0;
      mods.forEach(mn=>{for(const k in MOD_GROUPS){const o=MOD_GROUPS[k].opts.find(o=>o.n===mn);if(o)extra+=o.p}});
      const allMods=(sz.name==='Regular'?[]:[sz.name]).concat(mods);
      const unit=+(sz.price+extra).toFixed(2);
      const key=p.id+JSON.stringify(allMods);
      const c=cartGet(), ex=c.find(x=>x.key===key);
      if(ex)ex.qty+=ui.fd.qty; else c.push({key,productId:p.id,name:p.name,unit,qty:ui.fd.qty,mods:allMods});
      cartSet(c);
      const b=$('[data-badge]'); if(b){b.textContent=cartCount();b.style.display='';b.classList.add('pulse');setTimeout(()=>b.classList.remove('pulse'),500)}
      toast(p.name+' added to cart','ok',{label:'View cart',fn:()=>location.hash='#/cart'});
      closeModal();
      return;
    }
    addToCart(ui.fd.id,ui.fd.qty,mods);closeModal();
  },
  'fdsize':t=>{ui.fd.pizzaSizeIdx=+t.dataset.i;paintFoodModal();},
  'size-add':t=>{
    const p=prod(t.dataset.id); if(!p)return;
    const sizes=pizzaSizes(p), s=sizes[+t.dataset.i]; if(!s)return;
    const mods=s.name==='Regular'?[]:[s.name];
    const key=p.id+JSON.stringify(mods);
    const c=cartGet(), ex=c.find(x=>x.key===key);
    if(ex)ex.qty+=1; else c.push({key,productId:p.id,name:p.name,unit:s.price,qty:1,mods});
    cartSet(c);
    closeModal();
    const b=$('[data-badge]'); if(b){b.textContent=cartCount();b.style.display='';b.classList.add('pulse');setTimeout(()=>b.classList.remove('pulse'),500)}
    toast(p.name+' ('+s.name+') added to cart','ok',{label:'View cart',fn:()=>location.hash='#/cart'});
  },
  'mod':t=>{
    const gName=t.dataset.g;
    const gKey=Object.keys(MOD_GROUPS).find(k=>MOD_GROUPS[k].name===gName);
    const g=MOD_GROUPS[gKey]; const i=+t.dataset.i;
    if(g.type==='single')ui.fd.sel[gName]=i;
    else{const cur=ui.fd.sel[gName]||(ui.fd.sel[gName]=[]);const j=cur.indexOf(i);if(j>=0)cur.splice(j,1);else cur.push(i);}
    paintFoodModal();
  },
  'fdq':t=>{
    ui.fd.qty=Math.max(1,ui.fd.qty+ +t.dataset.d);
    const q=$('[data-fdqty]');if(q)q.textContent=ui.fd.qty;
    const pr=$('[data-fdprice]');if(pr)pr.textContent=money(fdPrice()*ui.fd.qty);
  },
  'cat':t=>{ui.menu.cat=t.dataset.id;render()},
  'cq':t=>{const c=cartGet();const it=c.find(x=>x.key===t.dataset.key);if(!it)return;it.qty+= +t.dataset.d;if(it.qty<1)return ACT.crm(t);cartSet(c);render()},
  'crm':t=>{cartSet(cartGet().filter(x=>x.key!==t.dataset.key));toast('Item removed','info');render()},
  'clear-cart':()=>{cartSet([]);toast('Cart cleared','info');render()},
  'apply-coupon':()=>{
    const v=($('#modal-root [data-input=coupon]')||$('[data-input=coupon]')||{}).value||'';
    const code=v.trim();
    if(!code)return toast('Enter a coupon code first','err');
    const r=couponCheck(code,cartSubtotal());
    if(r.err){ui.coupon=code.toUpperCase();render();toast(r.err,'err')}
    else{ui.coupon=code.toUpperCase();render();toast('Coupon '+ui.coupon+' applied — you save '+money(r.disc),'ok')}
  },
  'rm-coupon':()=>{ui.coupon=null;if(ui.co)ui.co.coupon=null;render()},
  'apply-co-coupon':()=>{
    const v=($('#modal-root [data-input=co-coupon]')||$('[data-input=co-coupon]')||{}).value||'';
    ui.co.coupon=v.trim()?v.trim().toUpperCase():null;
    if(ui.co.coupon){const r=couponCheck(ui.co.coupon,cartSubtotal());toast(r.err||'Coupon applied — saving '+money(r.disc),r.err?'err':'ok')}
    render();
  },
  'pay':t=>{ui.co.payment=t.dataset.p;render()},
  'branch-pick':t=>{ui.co.branchId=t.dataset.id;syncDist();render()},
  'zone':t=>{const z=ZONES.find(x=>x.n===t.dataset.z);ui.co.coords={lat:z.lat,lng:z.lng};ui.co.src=z.n;syncDist();render();toast('Location set to '+z.n,'ok')},
  'detect':()=>{
    if(!navigator.geolocation)return toast('Geolocation is not available — choose your area manually.','err');
    toast('Requesting your location…','info');
    navigator.geolocation.getCurrentPosition(
      p=>{ui.co.coords={lat:p.coords.latitude,lng:p.coords.longitude};ui.co.src='My location';syncDist();render();toast('Location detected','ok')},
      ()=>toast('Location permission denied — choose your area manually.','err'),
      {timeout:8000});
  },
  'use-addr':t=>{
    const a=db.addresses.find(x=>x.id===t.dataset.id);
    if(!a)return;
    ui.co.addr={line:a.line,apt:a.apt,note:a.note};
    toast('Address filled from "'+a.label+'"','ok');render();
  },
  'method':t=>{ui.co.method=t.dataset.m;render()},
  'co-back':()=>{ui.co.step=Math.max(1,ui.co.step-1);render()},
  'co-branch-next':()=>{
    if(!ui.co.branchId)return toast('Please select a branch to continue.','err');
    const b=branch(ui.co.branchId);
    if(!b.delivery&&!b.takeaway)return toast('That branch has no services available — pick another branch.','err');
    ui.co.step=3;render();
  },
  'co-method-next':()=>{
    const b=branch(ui.co.branchId);
    if(!b[ui.co.method])return toast(b.name+' has '+ui.co.method+' disabled — choose the other option.','err');
    ui.co.step=4;render();
  },
  'co-coupon-next':()=>{ui.co.step=6;render()},
  'place-order':()=>placeOrder(),
  'cancel-order':async t=>{
    const o=orderById(t.dataset.id);
    if(!o||o.status!=='Pending')return;
    o.status='Cancelled';o.events.push({s:'Cancelled',ts:now(),by:me().name});
    notify('role:MANAGER','Order cancelled',o.code+' was cancelled by the customer.');
    notify('role:ADMIN','Order cancelled',o.code+' was cancelled by the customer.');
    audit('Customer cancelled order '+o.code);
    await saveDB();toast('Order cancelled','info');render();
  },
  'reorder':async t=>{
    const o=orderById(t.dataset.id); if(!o)return;
    const c=cartGet(); let added=0;
    o.items.forEach(i=>{
      const p=prod(i.productId);
      if(p&&p.available){
        const key=p.id+JSON.stringify(i.mods||[]);
        const ex=c.find(x=>x.key===key);
        if(ex)ex.qty+=i.qty; else c.push(mkItem(p,i.qty,i.mods));
        added+=i.qty;
      }
    });
    cartSet(c);
    toast(added?added+' items added back to your cart':'Those items are no longer available',added?'ok':'err');
    if(added)location.hash='#/cart';
  },
  'review-open':t=>{
    const o=orderById(t.dataset.id); if(!o)return;
    ui.review={orderId:o.id,stars:0};
    modal('<div style="padding:28px"><h3 class="disp" style="font-size:22px;margin-bottom:4px">Review your order</h3>'
    +'<p class="muted" style="font-size:13px;margin-bottom:16px">'+o.code+' · how was everything?</p>'
    +'<div class="sin" id="star-in">'+[1,2,3,4,5].map(i=>'<button type="button" data-act="star" data-v="'+i+'" aria-label="'+i+' stars">'+ic('star')+'</button>').join('')+'</div>'
    +'<form data-form="review" style="margin-top:14px" novalidate>'
    +fld('Your comment','<textarea class="in" name="comment" required placeholder="What did you love? What could be better?"></textarea>')
    +'<div class="ferr" data-err></div><button class="btn btn-red btn-sm">'+ic('send')+'Publish review</button></form></div>');
  },
  'star':t=>{
    ui.review.stars=+t.dataset.v;
    $$('#star-in button').forEach((b,i)=>b.classList.toggle('on',i<ui.review.stars));
  },
  'copy-code':t=>{
    const code=t.dataset.code;
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(code).then(()=>toast('Code '+code+' copied to clipboard','ok')).catch(()=>toast('Code: '+code,'info'));
    }else toast('Code: '+code,'info');
  },
  'order-at':t=>{ui.co=defaultCo();ui.co.branchId=t.dataset.id;ui.co.step=3;syncDist();location.hash='#/checkout'},
  'goto-notifs':t=>{location.hash='#/'+t.dataset.base+'/notifications'},
  'mark-read':async t=>{
    const n=db.notifications.find(x=>x.id===t.dataset.id);
    if(n)n.read=true;
    await saveDB();
    if(n&&n.link)location.hash='#'+n.link.replace(/^#/,''); else render();
  },
  'mark-all':async()=>{myNotifs().forEach(n=>n.read=true);await saveDB();toast('All marked as read','ok');render()},
  'adv':async t=>{
    const o=orderById(t.dataset.id);
    const next=advanceLabel(o);
    if(!o||!next)return;
    const prev=o.status;
    setOrderStatus(o,next,me().name);
    audit(me().name+' moved order '+o.code+': '+prev+' → '+next);
    await saveDB();toast(o.code+' → '+next,'ok');render();
  },
  'order-view':t=>{const o=orderById(t.dataset.id);o&&orderModal(o)},
  'o-set':async t=>{
    const o=orderById(t.dataset.id),s=t.dataset.s;
    if(!o||!s||o.status===s)return;
    const prev=o.status;
    setOrderStatus(o,s,me().name);
    if(s==='Cancelled')notify('role:MANAGER','Order cancelled',o.code+' was cancelled by '+me().name+'.');
    audit(me().name+' changed order '+o.code+': '+prev+' → '+s);
    await saveDB();closeModal();toast(o.code+' → '+s,'ok');render();
  },
  'product-new':()=>productModal(null),
  'product-edit':t=>productModal(prod(t.dataset.id)),
  'product-del':t=>{
    const p=prod(t.dataset.id); if(!p)return;
    modal('<div style="padding:28px;text-align:center"><div class="eic" style="margin:0 auto 14px">'+ic('alert-triangle')+'</div>'
    +'<h3 class="disp" style="font-size:21px">Delete "'+esc(p.name)+'"?</h3>'
    +'<p class="muted" style="font-size:13.5px;margin:8px 0 18px">Past orders keep their price snapshots, but the dish disappears from the menu. This cannot be undone.</p>'
    +'<div style="display:flex;gap:10px;justify-content:center"><button class="btn btn-line btn-sm" data-act="modal-close">Keep it</button><button class="btn btn-red btn-sm" data-act="product-del-yes" data-id="'+p.id+'">'+ic('trash-2')+'Delete dish</button></div></div>');
  },
  'product-del-yes':async t=>{
    const p=prod(t.dataset.id); if(!p)return;
    db.products=db.products.filter(x=>x.id!==p.id);
    audit('Deleted product "'+p.name+'" ('+money(p.price)+')');
    await saveDB();closeModal();toast('"'+p.name+'" deleted','info');render();
  },
  'p-avail':async t=>{const p=prod(t.dataset.id);if(!p)return;p.available=!p.available;audit('Set "'+p.name+'" availability to '+(p.available?'Available':'Unavailable'));await saveDB();render()},
  'p-flag':async t=>{const p=prod(t.dataset.id);if(!p)return;p[t.dataset.k]=!p[t.dataset.k];await saveDB();render()},
  'cat-new':()=>catModal(null),
  'cat-edit':t=>catModal(db.categories.find(c=>c.id===t.dataset.id)),
  'cat-del':async t=>{
    const c=db.categories.find(x=>x.id===t.dataset.id); if(!c)return;
    if(catProducts(c.id).length)return toast('Move or delete the dishes in this category first.','err');
    db.categories=db.categories.filter(x=>x.id!==c.id);
    audit('Deleted category "'+c.name+'"');
    await saveDB();toast('Category deleted','info');render();
  },
  'cat-toggle':async t=>{const c=db.categories.find(x=>x.id===t.dataset.id);if(!c)return;c.status=!c.status;audit((c.status?'Enabled':'Disabled')+' category "'+c.name+'"');await saveDB();render()},
  'cat-up':t=>reorderCat(t.dataset.id,-1),
  'cat-down':t=>reorderCat(t.dataset.id,1),
  'branch-new':()=>branchModal(null),
  'branch-edit':t=>branchModal(branch(t.dataset.id)),
  'branch-del':async t=>{
    const b=branch(t.dataset.id); if(!b)return;
    if(db.orders.some(o=>['Pending','Confirmed','Preparing','Out for Delivery','Ready for Pickup'].indexOf(o.status)>=0&&o.branchId===b.id))
      return toast('This branch has active orders — finish or move them first.','err');
    db.branches=db.branches.filter(x=>x.id!==b.id);
    audit('Deleted branch "'+b.name+'"');
    await saveDB();toast('Branch deleted','info');render();
  },
  'b-toggle':async t=>{const b=branch(t.dataset.id);if(!b)return;b.status=!b.status;audit((b.status?'Activated':'Deactivated')+' branch "'+b.name+'"');await saveDB();render()},
  'b-svc':async t=>{const b=branch(t.dataset.id);if(!b)return;b[t.dataset.k]=!b[t.dataset.k];audit((b[t.dataset.k]?'Enabled':'Disabled')+' '+t.dataset.k+' at "'+b.name+'"');await saveDB();render()},
  'cust-view':t=>{const c=userById(t.dataset.id);c&&custModal(c)},
  'cust-toggle':async t=>{
    const c=userById(t.dataset.id); if(!c)return;
    c.status=c.status==='active'?'disabled':'active';
    audit((c.status==='active'?'Enabled':'Disabled')+' customer account "'+c.name+'"');
    await saveDB();toast(c.status==='active'?'Account enabled':'Account disabled',c.status==='active'?'ok':'info');render();
  },
  'promo-new':()=>promoModal(null),
  'promo-edit':t=>promoModal(db.coupons.find(c=>c.id===t.dataset.id)),
  'promo-del':async t=>{
    const c=db.coupons.find(x=>x.id===t.dataset.id); if(!c)return;
    db.coupons=db.coupons.filter(x=>x.id!==c.id);
    audit('Deleted promotion "'+c.code+'"');
    await saveDB();toast('Promotion deleted','info');render();
  },
  'promo-toggle':async t=>{const c=db.coupons.find(x=>x.id===t.dataset.id);if(!c)return;c.active=!c.active;audit((c.active?'Activated':'Deactivated')+' coupon "'+c.code+'"');await saveDB();render()},
  'rev-hide':async t=>{
    const r=db.reviews.find(x=>x.id===t.dataset.id); if(!r)return;
    r.hidden=!r.hidden;
    audit((r.hidden?'Hid':'Unhid')+' a review by '+((userById(r.customerId)||{}).name||'a guest'));
    await saveDB();render();
  },
  'rev-del':async t=>{
    const r=db.reviews.find(x=>x.id===t.dataset.id); if(!r)return;
    db.reviews=db.reviews.filter(x=>x.id!==r.id);
    audit('Deleted a review by '+((userById(r.customerId)||{}).name||'a guest'));
    await saveDB();toast('Review removed','info');render();
  },
  'user-toggle':async t=>{
    const x=userById(t.dataset.id); if(!x)return;
    x.status=x.status==='active'?'disabled':'active';
    audit((x.status==='active'?'Enabled':'Disabled')+' staff account "'+x.name+'" ('+x.role+')');
    await saveDB();render();
  },
  'export-csv':t=>exportCSV(t.dataset.scope),
  'adm-pg':t=>{ui.adminPg=+t.dataset.p;render()},
  'addr-del':async t=>{db.addresses=db.addresses.filter(a=>a.id!==t.dataset.id);await saveDB();toast('Address removed','info');render()},
  'addr-new':()=>{
    const el=document.querySelector('[data-form=addr] input[name=label]');
    if(el){el.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>el.focus(),350)}
  },
  'qk':t=>{
    const f=$('form[data-form=login]');
    if(!f)return;
    f.email.value=t.dataset.e;f.password.value=t.dataset.p;
    toast('Credentials filled — press Log in','info');
  },
  'pw-eye':t=>{
    const inp=t.parentElement.querySelector('input');
    if(inp){inp.type=inp.type==='password'?'text':'password'}
  },
  'theme-toggle':()=>{
    const t=isDark()?'light':'dark';
    applyTheme(t);
    try{localStorage.setItem(THEME_KEY,t)}catch(e){}
    $$('[data-theme-btn]').forEach(b=>{b.innerHTML=ic(t==='dark'?'sun':'moon')});
    icons(); mountCharts();
  },
  'pic-remove':t=>{_stagedPics[t.dataset.slot]=null;setPicPreview(t.dataset.slot,null);},
  'branch-img-remove':()=>{
    _stagedBranchImage=null;
    const pv=document.querySelector('[data-branch-preview]');
    const nm=document.querySelector('form[data-form="branch"]');
    if(pv)pv.innerHTML=miniMap('preview',nm&&nm.elements.name?nm.elements.name.value:'Branch');
  },
  'img-remove':()=>{
    _stagedImage=null;
    const prev=document.querySelector('[data-img-preview]');
    const form=document.querySelector('form[data-form="product"]');
    const product=form&&prod(form.dataset.id);
    const typeSel=form&&form.querySelector('select[name="type"]');
    if(prev)prev.innerHTML=product?dishArt(Object.assign({},product,{image:null})):dishSVG(typeSel?typeSel.value:'burger');
    const rw=document.querySelector('[data-img-remove-wrap]');
    if(rw)rw.innerHTML='<span class="hint">The default food photo will be used when one is available.</span>';
  }
};
function reorderCat(id,dir){
  const cats=[...db.categories].sort((a,b)=>a.order-b.order);
  const i=cats.findIndex(c=>c.id===id), j=i+dir;
  if(i<0||j<0||j>=cats.length)return;
  const tmp=cats[i].order;cats[i].order=cats[j].order;cats[j].order=tmp;
  audit('Reordered categories (moved "'+cats[i].name+'")');
  saveDB();render();
}
document.addEventListener('click',e=>{
  if(!e.target.closest('[data-dd]')&&!e.target.closest('[data-act=acct-menu]'))$$('[data-dd]').forEach(d=>d.classList.remove('open'));
  const t=e.target.closest('[data-act]');
  if(!t)return;
  const fn=ACT[t.dataset.act];
  if(fn){if(t.tagName!=='A')e.preventDefault();fn(t,e);}
});
let _qt=null;
document.addEventListener('input',e=>{
  const k=e.target.dataset.input; if(!k)return;
  if(k==='menu-q'){ui.menu.q=e.target.value;clearTimeout(_qt);_qt=setTimeout(refreshMenuGrid,160);}
  else if(k==='adm-pq'){ui.pq=e.target.value;_fk=k;clearTimeout(_qt);_qt=setTimeout(render,250);}
  else if(k==='adm-cq'){ui.cq=e.target.value;_fk=k;clearTimeout(_qt);_qt=setTimeout(render,250);}
  else if(k==='mgr-q'){(ui.mgrF||(ui.mgrF={})).q=e.target.value;_fk=k;clearTimeout(_qt);_qt=setTimeout(render,250);}
  else if(k==='adm-q'){(ui.admF||(ui.admF={})).q=e.target.value;ui.adminPg=1;_fk=k;clearTimeout(_qt);_qt=setTimeout(render,250);}
  else if(k==='co-coupon'&&ui.co){ui.co.coupon=e.target.value.toUpperCase();}
  else if(k==='coupon'){ui.coupon=e.target.value.toUpperCase();}
});
document.addEventListener('change',e=>{
  const t=e.target,k=t.dataset.chg;
  if(!k)return;
  if(k==='mf'){ui.menu[t.dataset.k]=t.type==='checkbox'?t.checked:(t.dataset.k==='minR'?+t.value:t.value);refreshMenuGrid();}
  else if(k==='mf-range'){ui.menu.maxP=+t.value;const pv=$('#pv');if(pv)pv.textContent=money(+t.value);clearTimeout(_qt);_qt=setTimeout(refreshMenuGrid,150);}
  else if(k==='mgr-f'){(ui.mgrF||(ui.mgrF={}))[t.dataset.k]=t.value;render();}
  else if(k==='adm-f'){(ui.admF||(ui.admF={}))[t.dataset.k]=t.value;ui.adminPg=1;render();}
  else if(k==='rep'){ui.rep[t.dataset.k]=t.value;render();}
  else if(k==='o-status'){
    const o=orderById(t.dataset.id);
    if(o&&t.value)ACT['o-set']({dataset:{id:o.id,s:t.value}});
  }
  else if(k==='img-pick'){
    const file=t.files&&t.files[0];
    if(!file)return;
    if(!/^image\//.test(file.type)){toast('Please choose an image file.','err');t.value='';return}
    const reader=new FileReader();
    reader.onload=()=>{
      downscaleImage(reader.result,480,img=>{
        _stagedImage=img;
        const prev=document.querySelector('[data-img-preview]');
        if(prev)prev.innerHTML='<img src="'+img+'" style="width:100%;height:100%;object-fit:cover;display:block">';
        const rw=document.querySelector('[data-img-remove-wrap]');
        if(rw)rw.innerHTML='<button type="button" class="btn btn-sm" style="color:var(--wine)" data-act="img-remove">'+ic('trash-2')+'Remove photo</button>';
        icons();
      });
    };
    reader.readAsDataURL(file);
  }
  else if(k==='cat-sizes'){
    const v=t.value==='c1';
    const sec=document.querySelector('[data-sizes-section]'),base=document.querySelector('[data-baseprice-wrap]');
    if(sec)sec.style.display=v?'block':'none';
    if(base)base.style.display=v?'none':'block';
  }
  else if(k==='pic-pick'){
    const sl=PIC_SLOTS.find(x=>x.k===t.dataset.slot), file=t.files&&t.files[0];
    if(!sl||!file)return;
    if(!/^image\//.test(file.type)){toast('Please choose an image file.','err');t.value='';return}
    const reader=new FileReader();
    reader.onload=()=>downscaleImage(reader.result,sl.max,img=>{
      _stagedPics[sl.k]=img; setPicPreview(sl.k,img);
      toast(sl.label+' ready — click "Save pictures" to apply.','info');
    },sl.png?'image/png':'image/jpeg');
    reader.readAsDataURL(file);
  }
  else if(k==='branch-img-pick'){
    const file=t.files&&t.files[0];
    if(!file)return;
    if(!/^image\//.test(file.type)){toast('Please choose an image file.','err');t.value='';return}
    const reader=new FileReader();
    reader.onload=()=>downscaleImage(reader.result,800,img=>{
      _stagedBranchImage=img;
      const pv=document.querySelector('[data-branch-preview]');
      if(pv)pv.innerHTML='<img src="'+img+'" style="width:100%;height:100%;object-fit:cover;display:block">';
    });
    reader.readAsDataURL(file);
  }
});
const FORMS={
  login:async f=>{
    ferr(f,'');f.querySelector('[data-err]').classList.remove('show');
    const email=f.email.value.trim().toLowerCase(), pw=f.password.value;
    if(!email||!pw)return ferr(f,'Please fill in both fields.');
    const u=db.users.find(x=>x.email.toLowerCase()===email);
    const h=await hash(pw);
    if(!u||u.pass!==h)return ferr(f,'Incorrect email or password.');
    if(u.status!=='active')return ferr(f,'This account has been disabled. Contact the restaurant.');
    setSession(u);
    toast('Welcome back, '+u.name.split(' ')[0],'ok');
    const go=ui.next&&u.role==='CUSTOMER'?'#/'+ui.next:roleHome();
    ui.next=null;
    if(location.hash===go)render(); else location.hash=go;
  },
  register:async f=>{
    ferr(f,'');
    const v=n=>f.elements[n].value.trim();
    if(!v('name')||!v('email')||!v('phone'))return ferr(f,'Please fill in all required fields.');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email')))return ferr(f,'That email address looks invalid.');
    if(db.users.some(x=>x.email.toLowerCase()===v('email').toLowerCase()))return ferr(f,'An account with this email already exists.');
    if(f.password.value.length<8)return ferr(f,'Password must be at least 8 characters.');
    if(f.password.value!==f.password2.value)return ferr(f,'Passwords do not match.');
    const u={id:uid('u'),name:v('name'),email:v('email'),phone:v('phone'),role:'CUSTOMER',pass:await hash(f.password.value),status:'active',address:v('address'),createdAt:now()};
    db.users.push(u);
    notify('user:'+u.id,'Welcome to '+SET().name,'Your account is ready. Use code WELCOME15 for 15% off your first order.','#/menu');
    await saveDB();setSession(u);
    toast('Account created — welcome to the table','ok');
    location.hash='#/account';
  },
  forgot:async f=>{
    ferr(f,'');
    const email=f.email.value.trim().toLowerCase();
    const u=db.users.find(x=>x.email.toLowerCase()===email);
    if(!u)return ferr(f,'No account found with that email.');
    const code=String(Math.floor(100000+Math.random()*900000));
    db.resetCodes[email]={code:code,ts:now()};
    await saveDB();
    toast('Reset code issued. Demo mode: your code is '+code,'info',{label:'Enter it now',fn:()=>location.hash='#/reset'});
  },
  reset:async f=>{
    ferr(f,'');
    const email=f.email.value.trim().toLowerCase(), rec=db.resetCodes[email];
    if(!rec)return ferr(f,'No reset code was issued for this email.');
    if(now()-rec.ts>15*MIN)return ferr(f,'This reset code expired — request a new one.');
    if(f.code.value.trim()!==rec.code)return ferr(f,'That reset code is incorrect.');
    if(f.password.value.length<8)return ferr(f,'Password must be at least 8 characters.');
    const u=db.users.find(x=>x.email.toLowerCase()===email);
    u.pass=await hash(f.password.value);
    delete db.resetCodes[email];
    await saveDB();
    toast('Password updated — log in with your new password','ok');
    location.hash='#/login';
  },
  contact:async f=>{
    db.messages.push({id:uid('m'),name:f.elements.name.value.trim(),email:f.email.value.trim(),subject:f.subject.value,message:f.message.value.trim(),ts:now()});
    db.users.filter(x=>x.role==='ADMIN').forEach(x=>notify('user:'+x.id,'Contact message: '+f.subject.value,f.elements.name.value+' ('+f.email.value+'): '+f.message.value.slice(0,90)));
    await saveDB();f.reset();
    toast("Message sent — we'll reply within 24 hours.",'ok');
  },
  co1:async f=>{
    ferr(f,'');
    const name=f.elements.name.value.trim(), phone=f.phone.value.trim();
    if(!name)return ferr(f,'Please enter your name.');
    if(phone.replace(/\D/g,'').length<7)return ferr(f,'Please enter a valid phone number.');
    ui.co.name=name;ui.co.phone=phone;ui.co.step=2;render();
  },
  co4:async f=>{
    ferr(f,'');
    if(ui.co.method==='delivery'){
      const line=f.line.value.trim();
      if(!line)return ferr(f,'Please enter your street address.');
      ui.co.addr={line:line,apt:f.apt.value.trim(),note:f.note.value.trim()};
    }else{
      const name=f.elements.name.value.trim(), phone=f.phone.value.trim();
      if(!name||!phone)return ferr(f,'Name and phone are required for pickup.');
      ui.co.name=name;ui.co.phone=phone;ui.co.pickupAt=f.pickupAt.value;
    }
    ui.co.step=5;render();
  },
  review:async f=>{
    if(!ui.review.stars)return ferr(f,'Please choose a star rating.');
    const o=orderById(ui.review.orderId); if(!o)return;
    db.reviews.unshift({id:uid('r'),orderId:o.id,customerId:me().id,productId:(o.items[0]||{}).productId,rating:ui.review.stars,comment:f.comment.value.trim(),ts:now(),hidden:false});
    db.users.filter(x=>x.role==='ADMIN').forEach(x=>notify('user:'+x.id,'New review',me().name+' left a '+ui.review.stars+'-star review on '+o.code+'.','#/admin/reviews'));
    audit('Reviewed order '+o.code+' ('+ui.review.stars+'★)');
    await saveDB();closeModal();toast('Thank you — your review is live','ok');render();
  },
  profile:async f=>{
    const u=me();
    u.name=f.elements.name.value.trim()||u.name;
    u.phone=f.phone.value.trim();
    if(f.address&&f.address.value.trim())u.address=f.address.value.trim();
    await saveDB();toast('Profile saved','ok');render();
  },
  password:async f=>{
    ferr(f,'');
    const u=me();
    if(await hash(f.old.value)!==u.pass)return ferr(f,'Current password is incorrect.');
    if(f.np.value.length<8)return ferr(f,'New password must be at least 8 characters.');
    u.pass=await hash(f.np.value);
    await saveDB();f.reset();toast('Password updated','ok');
  },
  addr:async f=>{
    ferr(f,'');
    if(!f.line.value.trim())return ferr(f,'Please enter the street address.');
    db.addresses.push({id:uid('a'),userId:me().id,label:f.label.value.trim()||'Address',line:f.line.value.trim(),apt:f.apt.value.trim(),note:f.note.value.trim()});
    await saveDB();toast('Address saved','ok');render();
  },
  product:async f=>{
    ferr(f,'');
    const id=f.dataset.id;
    const cat=f.cat.value;
    const prep=parseInt(f.prep.value);
    let price,sizes;
    if(cat==='c1'){
      const reg=parseFloat(f.sizeRegular.value),lg=parseFloat(f.sizeLarge.value);
      if(!(reg>0)||!(lg>0)){ferr(f,'Please enter valid prices for both pizza sizes.');toast('Please enter valid prices for both pizza sizes.','err');return;}
      price=reg;
      sizes=[{name:'Regular',price:+reg.toFixed(2)},{name:'Large',price:+lg.toFixed(2)}];
    }else{
      price=parseFloat(f.price.value);
      if(!(price>0)){ferr(f,'Price must be greater than zero.');toast('Please enter a price greater than zero before saving.','err');return;}
    }
    const old=id?prod(id):null;
    const data={name:f.elements.name.value.trim(),cat:cat,price:price,prep:prep||15,type:f.type.value,desc:f.desc.value.trim(),ing:f.ing.value.trim(),
      available:f.available.checked,featured:f.featured.checked,popular:f.popular.checked};
    if(cat==='c1')data.sizes=sizes;
    if(_stagedImage!==undefined)data.image=_stagedImage;
    if(old){
      const oldPrice=old.price;
      Object.assign(old,data);
      if(oldPrice!==price)audit('Changed price of "'+old.name+'" from '+money(oldPrice)+' to '+money(price));
      else audit('Updated product "'+old.name+'"');
      toast('Dish updated','ok');
    }else{
      db.products.push(Object.assign({id:uid('p'),rating:4.5},data));
      audit('Created product "'+data.name+'" ('+money(price)+')');
      toast('Dish added to the menu','ok');
    }
    await saveDB();closeModal();render();
  },
  category:async f=>{
    const id=f.dataset.id;
    if(id){
      const c=db.categories.find(x=>x.id===id);
      if(c){c.name=f.elements.name.value.trim()||c.name;c.type=f.type.value;c.status=f.status.checked;audit('Updated category "'+c.name+'"');}
    }else{
      const maxO=Math.max(0,Math.max.apply(null,db.categories.map(c=>c.order)));
      db.categories.push({id:uid('c'),name:f.elements.name.value.trim()||'New category',type:f.type.value,status:f.status.checked,order:maxO+1});
      audit('Created category "'+f.elements.name.value.trim()+'"');
    }
    await saveDB();closeModal();toast('Category saved — customer menu updated','ok');render();
  },
  branch:async f=>{
    const id=f.dataset.id;
    const data={name:f.elements.name.value.trim(),address:f.address.value.trim(),phone:f.phone.value.trim(),email:f.email.value.trim(),
      lat:parseFloat(f.lat.value)||0,lng:parseFloat(f.lng.value)||0,open:f.open.value||'11:00',close:f.close.value||'23:00',
      radius:parseFloat(f.radius.value)||5,fee:parseFloat(f.fee.value)||0,delivery:f.delivery.checked,takeaway:f.takeaway.checked,status:f.status.checked};
    if(_stagedBranchImage!==undefined)data.image=_stagedBranchImage;
    if(id){Object.assign(branch(id),data);audit('Updated branch "'+data.name+'"');}
    else{db.branches.push(Object.assign({id:uid('b')},data));audit('Added branch "'+data.name+'"');}
    await saveDB();closeModal();toast('Branch saved','ok');render();
  },
  promo:async f=>{
    ferr(f,'');
    const id=f.dataset.id;
    const data={code:f.code.value.trim().toUpperCase(),type:f.type.value,value:parseFloat(f.value.value)||0,min:parseFloat(f.min.value)||0,
      max:f.max.value?parseFloat(f.max.value):null,limit:f.limit.value?parseInt(f.limit.value):null,
      starts:f.starts.value?new Date(f.starts.value+'T00:00').getTime():now(),
      expires:f.expires.value?new Date(f.expires.value+'T23:59').getTime():now()+30*DAY,
      desc:f.desc.value.trim(),active:f.active.checked};
    if(!(data.value>0))return ferr(f,'Discount value must be positive.');
    if(data.expires<=data.starts)return ferr(f,'Expiration must be after the start date.');
    if(id){Object.assign(db.coupons.find(c=>c.id===id),data);audit('Updated promotion "'+data.code+'"');}
    else{
      if(db.coupons.some(c=>c.code===data.code))return ferr(f,'This coupon code already exists.');
      db.coupons.push(Object.assign({id:uid('cp'),used:0},data));
      audit('Created promotion "'+data.code+'"');
    }
    await saveDB();closeModal();toast('Promotion saved','ok');render();
  },
  user:async f=>{
    ferr(f,'');
    const email=f.email.value.trim().toLowerCase();
    if(db.users.some(x=>x.email.toLowerCase()===email))return ferr(f,'This email is already registered.');
    if(f.password.value.length<8)return ferr(f,'Password must be at least 8 characters.');
    const u={id:uid('u'),name:f.elements.name.value.trim(),email:email,phone:'',role:f.role.value,pass:await hash(f.password.value),status:'active',createdAt:now()};
    if(f.role.value==='MANAGER'&&f.branchId.value)u.branchId=f.branchId.value;
    db.users.push(u);
    audit('Created '+u.role+' account for "'+u.name+'"');
    await saveDB();f.reset();toast(u.role+' account created for '+u.name,'ok');render();
  },
  broadcast:async f=>{
    const title=f.title.value.trim(), body=f.body.value.trim(), link=f.link.value.trim();
    if(!title||!body)return;
    db.users.filter(x=>x.role==='CUSTOMER'&&x.status==='active').forEach(x=>notify('user:'+x.id,title,body,link));
    audit('Broadcast "'+title+'" to all customers');
    await saveDB();f.reset();toast('Promotion sent to all customers','ok');render();
  },
  content:async f=>{
    const c=db.content;
    ['heroTag','heroTitle','heroDesc','storyTitle','storyBody','offerTitle','offerDesc','footerNote','heroMeta','marquee','featuredTitle','popularTitle','quotesTitle','popularSubtitle','ctaTitle','ctaText'].forEach(k=>{const el=f.elements[k];if(el)c[k]=el.value.trim()});
    audit('Updated website content');
    await saveDB();siteSaveToast('Published — the website is updated live.');render();
  },
  contentPages:async f=>{
    const c=db.content;
    ['aboutHeroTitle','aboutExtra','philosophyTitle','philosophyBody','aboutCtaTitle','aboutCtaText','branchesTitle','branchesSubtitle','offersTitle','offersSubtitle','contactTitle'].forEach(k=>{const el=f.elements[k];if(el)c[k]=el.value.trim()});
    c.values=(c.values||[]).map((v,i)=>{const t=f.elements['value'+(i+1)+'Title'],d=f.elements['value'+(i+1)+'Desc'];return{title:t?t.value.trim():v.title,desc:d?d.value.trim():v.desc}});
    audit('Updated about page and page headings');
    await saveDB();siteSaveToast('Published — page text updated.');render();
  },
  labels:async f=>{
    const c=db.content; c.labels={};
    LABEL_DEFS.forEach(d=>{const el=f.elements['lb_'+d.k];const v=el?el.value.trim():'';if(v&&v!==d.def)c.labels[d.k]=v});
    audit('Updated labels and small text');
    await saveDB();siteSaveToast('Labels saved — the website is updated.');render();
  },
  pictures:async f=>{
    const keys=Object.keys(_stagedPics);
    if(!keys.length)return toast('Choose a new image (or "Use default") first.','info');
    keys.forEach(k=>{
      const sl=PIC_SLOTS.find(x=>x.k===k); if(!sl)return;
      const target=sl.where==='settings'?SET():db.content;
      if(_stagedPics[k]===null)delete target[k]; else target[k]=_stagedPics[k];
    });
    if(keys.indexOf('favicon')>=0)applyFavicon();
    _stagedPics={};
    audit('Updated logo / pictures ('+keys.join(', ')+')');
    await saveDB();siteSaveToast('Pictures saved — the website is updated.');render();
  },
  settings:async f=>{
    const s=SET();
    s.name=f.elements.name.value.trim()||s.name;s.phone=f.phone.value.trim();s.email=f.email.value.trim();
    s.address=f.address.value.trim();s.hours=f.hours.value.trim();
    s.symbol=f.symbol.value.trim()||'$';s.taxRate=parseFloat(f.taxRate.value)||0;
    s.freeOver=parseFloat(f.freeOver.value)||0;s.est=f.est.value.trim();
    audit('Updated restaurant settings');
    await saveDB();siteSaveToast('Settings saved.');render();
  },
  social:async f=>{
    const s=SET().social;
    s.instagram=f.instagram.value.trim();s.facebook=f.facebook.value.trim();s.twitter=f.twitter.value.trim();
    audit('Updated social links');
    await saveDB();siteSaveToast('Social links saved.');render();
  }
};
document.addEventListener('submit',e=>{
  const f=e.target.closest('form[data-form]');
  if(!f)return;
  e.preventDefault();
  const fn=FORMS[f.dataset.form];
  fn&&fn(f);
});
(async function boot(){
  try{
    const hasLocalData=await loadDB();
    if(!hasLocalData)db=await seedDB();
    if(remoteSiteState)mergeCloudPublicData(remoteSiteState);
    if(!hasLocalData)await saveDB();
    applyFavicon();
    await render();
  }catch(err){
    console.error(err);
    showFatal(err.message);
  }
})();
