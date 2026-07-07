/* ═══════════════════════════════════════════════════════════
   AskAura — app.js  v3
   Full-screen · Light theme · Page-based sidebar navigation
   Features: TF-IDF NLP · Fuzzy matching · Typewriter
   Voice input · History · FAQ Editor · Analytics · Export
   Feedback · Keyboard shortcuts · A11y · Toast · Responsive
═══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════════════════════════
   1. FAQ DATA
══════════════════════════════════════════════════════════ */
const DEFAULT_FAQS = [
  // Account
  {id:'a1',cat:'Account',q:"How do I reset my password?",           a:"Go to the login page and click 'Forgot password'. Enter your registered email and we'll send a reset link within a few minutes. Check your spam folder if you don't see it within 5 minutes.",           tags:["password","reset","login","forgot","access","credentials","locked out"]},
  {id:'a2',cat:'Account',q:"How do I create a new account?",         a:"Click 'Sign up' on our homepage. Fill in your name, email, and a secure password. You'll receive a verification email — click the link inside to activate your account. The whole process takes under 2 minutes.", tags:["create","register","sign up","new account","join","registration","get started"]},
  {id:'a3',cat:'Account',q:"Can I change my username or email?",      a:"Yes! Go to Settings → Profile. You can update your display name anytime. Email changes require re-verification for security purposes. Allow up to 24 hours for the change to propagate fully.",            tags:["change","username","email","update","profile","edit","modify","rename"]},
  {id:'a4',cat:'Account',q:"How do I delete my account permanently?", a:"Navigate to Settings → Privacy → Delete Account. This is irreversible and removes all your data. We recommend downloading your data export first. The deletion completes within 30 days.",           tags:["delete","remove","close","account","cancel","terminate","permanently"]},
  {id:'a5',cat:'Account',q:"How do I enable two-factor authentication?", a:"Go to Settings → Security → Two-Factor Authentication and click Enable. Use an authenticator app (Google Authenticator, Authy) or SMS codes. Backup codes are also provided — store them safely.", tags:["two factor","2fa","authentication","security","otp","sms","authenticator","enable"]},
  {id:'a6',cat:'Account',q:"I'm not receiving the verification email.", a:"Check your spam/junk folder first. If it's not there, go to the login page and click 'Resend verification email'. Make sure you signed up with the correct email. Contact support if the issue persists.", tags:["verification","email","not received","resend","confirm","activate","inbox"]},
  {id:'a7',cat:'Account',q:"Can I have multiple accounts?",            a:"Each email address can only have one account. You can create separate accounts with different emails. Sharing accounts or violating our one-account policy may result in suspension.",                tags:["multiple accounts","two accounts","second account","another account","duplicate"]},
  {id:'a8',cat:'Account',q:"How do I log out of all devices?",         a:"Go to Settings → Security → Active Sessions. You'll see all devices currently logged in. Click 'Log out all other sessions' to remotely sign out of every device except the current one.",            tags:["logout","sign out","all devices","sessions","revoke","remote"]},
  // Billing
  {id:'b1',cat:'Billing',q:"What payment methods do you accept?",      a:"We accept all major credit/debit cards (Visa, Mastercard, Amex, Discover), PayPal, UPI, net banking, and bank transfers. All transactions are encrypted with 256-bit SSL. We do not store full card details.", tags:["payment","credit card","pay","methods","upi","paypal","visa","mastercard","net banking"]},
  {id:'b2',cat:'Billing',q:"How do I cancel my subscription?",         a:"Go to Billing → Subscription and click 'Cancel plan'. Your access continues until the end of the current billing period — you won't lose access immediately. You can re-subscribe anytime with no penalty.", tags:["cancel","subscription","stop","end","unsubscribe","plan","downgrade"]},
  {id:'b3',cat:'Billing',q:"Can I get a refund?",                      a:"We offer a 14-day money-back guarantee for first-time subscribers. Contact support within 14 days of your first charge with your order ID. We'll process a full refund within 3–5 business days.",        tags:["refund","money back","return","charge","guarantee","reimbursement","get money back"]},
  {id:'b4',cat:'Billing',q:"Why was I charged twice or incorrectly?",  a:"Duplicate charges are rare but can occur. Contact support with your email address and the transaction dates/amounts. We investigate within 24 hours and issue a refund if a billing error is confirmed.", tags:["charged","twice","double","billing","error","duplicate","wrong amount","overcharged"]},
  {id:'b5',cat:'Billing',q:"How do I upgrade or downgrade my plan?",   a:"Go to Billing → Change Plan. Upgrades take effect immediately and you're billed the prorated difference. Downgrades take effect at the start of your next billing cycle. No service interruption occurs.", tags:["upgrade","downgrade","plan","change","switch","tier","pro","basic"]},
  {id:'b6',cat:'Billing',q:"Where can I find my invoices?",            a:"All invoices are under Billing → Invoice History. Download any invoice as a PDF. Invoices are also emailed automatically after each successful charge to your registered email address.",                tags:["invoice","receipt","billing history","download","pdf","tax","records"]},
  {id:'b7',cat:'Billing',q:"Is there a free trial available?",         a:"Yes! New users get a 7-day free trial of the Pro plan with no credit card required. At the end of the trial you'll be asked to choose a paid plan or you'll roll back to the free tier automatically.",   tags:["free trial","trial","free","no credit card","try","test","pro trial"]},
  {id:'b8',cat:'Billing',q:"Can I pause my subscription?",             a:"Yes, pause for up to 3 months under Billing → Subscription → Pause. Your data and settings are preserved. Billing resumes automatically when the pause ends or you manually resume.",                    tags:["pause","freeze","hold","suspend","temporarily stop","subscription pause"]},
  // Product
  {id:'p1',cat:'Product',q:"What are the system requirements?",        a:"Our app runs on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. For mobile: iOS 14+ and Android 10+. No desktop installation required — it's entirely web-based. JavaScript must be enabled.",         tags:["system","requirements","browser","mobile","compatibility","ios","android","specs","chrome","firefox"]},
  {id:'p2',cat:'Product',q:"Is there an offline mode?",                a:"Offline mode is available on our mobile apps for previously downloaded content. The web app requires an internet connection. Offline edits sync automatically when you reconnect.",                        tags:["offline","no internet","download","sync","without connection","airplane mode"]},
  {id:'p3',cat:'Product',q:"How many devices can I use simultaneously?",a:"Standard plan: up to 3 simultaneous devices. Pro plan: unlimited devices. View and revoke active sessions anytime under Settings → Security → Active Sessions.",                                     tags:["devices","logged in","sessions","simultaneous","multiple","limit","how many"]},
  {id:'p4',cat:'Product',q:"Does the app support multiple languages?", a:"Yes! We support 25+ languages including English, Hindi, Spanish, French, German, Portuguese, Japanese, Korean, and Arabic. Change your language in Settings → Preferences → Language.",               tags:["language","multilingual","hindi","spanish","french","localization","translate","international"]},
  {id:'p5',cat:'Product',q:"Is there a desktop app available?",        a:"Yes! Desktop apps for Windows (10/11) and macOS (11+) are available under Downloads on our website. The desktop app offers faster performance and native notifications.",                              tags:["desktop app","windows","mac","macos","download","install","native app","application"]},
  {id:'p6',cat:'Product',q:"Does your app integrate with other tools?",a:"We integrate with 50+ tools including Slack, Google Drive, Notion, Zapier, GitHub, Jira, Trello, and Salesforce. Go to Settings → Integrations. Custom integrations available via our REST API.",     tags:["integration","slack","google drive","zapier","notion","github","connect","api","tools"]},
  {id:'p7',cat:'Product',q:"Is there a mobile app?",                   a:"Yes! Available on iOS (App Store) and Android (Google Play). The mobile app supports most features of the web version plus offline access.",                                                             tags:["mobile app","ios","android","app store","google play","phone","smartphone","tablet"]},
  {id:'p8',cat:'Product',q:"What file formats are supported?",         a:"Import: CSV, JSON, Excel (.xlsx), and PDF. Export: CSV, JSON, PDF, or full ZIP archive. Go to Settings → Data → Import/Export.",                                                                       tags:["file format","import","export","csv","json","excel","pdf","upload","download data"]},
  {id:'p9',cat:'Product',q:"How often is the app updated?",            a:"Minor updates and bug fixes weekly. Major feature releases monthly. View the changelog at help.example.com/changelog. The web app updates automatically; desktop/mobile apps prompt you to update.",      tags:["update","version","changelog","new features","release","how often","latest"]},
  // Support
  {id:'s1',cat:'Support',q:"How do I contact customer support?",       a:"Reach us via Live chat (available 24/7 for Pro users), Email support@example.com, or Phone +1-800-555-0100 (Mon–Fri, 9am–6pm IST). Average first-response time is under 2 hours.",                    tags:["contact","support","help","email","call","chat","reach","get help","phone number"]},
  {id:'s2',cat:'Support',q:"How long does support take to respond?",   a:"Live chat: within minutes (9am–6pm IST, Mon–Fri). Pro users get 24/7 chat. Email: 2–4 hours. Complex issues may take up to 1 business day. We'll keep you updated throughout.",                       tags:["response time","reply","how long","wait","support","quick","fast","sla"]},
  {id:'s3',cat:'Support',q:"Is there a help center or documentation?", a:"Yes! Visit help.example.com for step-by-step guides, video tutorials, API docs, and release notes. Community forums are at community.example.com.",                                                      tags:["documentation","help center","guide","tutorial","knowledge base","article","docs","forum"]},
  {id:'s4',cat:'Support',q:"Can I report a bug or suggest a feature?", a:"Use the feedback button (bottom-left of any page) to report bugs or submit feature ideas. You can also email feedback@example.com. We review all submissions and prioritize based on user impact.",      tags:["bug","report","feature request","feedback","suggestion","improve","issue","problem"]},
  {id:'s5',cat:'Support',q:"Is there a community forum?",              a:"Yes! Join our community at community.example.com. Ask questions, share tips, vote on feature requests, and connect with other users. We also have an active Discord server — link on the community page.", tags:["community","forum","discord","user group","discuss","help","peers"]},
  {id:'s6',cat:'Support',q:"Do you offer onboarding sessions?",        a:"Live onboarding webinars every Tuesday and Thursday at 3pm IST — free for all users. Pro and Enterprise plans include personalized 1-on-1 onboarding. Register at help.example.com/onboarding.",        tags:["onboarding","training","webinar","tutorial","getting started","help","learn","session"]},
  // Privacy
  {id:'pr1',cat:'Privacy',q:"How is my data protected?",               a:"All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We hold SOC 2 Type II certification, are ISO 27001 compliant, and fully GDPR-ready. Third-party security audits are conducted annually.", tags:["data","security","encrypted","privacy","gdpr","protect","safe","secure","iso","soc2"]},
  {id:'pr2',cat:'Privacy',q:"Do you share my data with third parties?",a:"We never sell your personal data. We share limited data only with vetted service providers bound by strict data processing agreements. Review our full sub-processor list in our Privacy Policy.",        tags:["share","third party","sell","data","privacy","personal","vendor","sub-processor"]},
  {id:'pr3',cat:'Privacy',q:"How do I export my data?",                a:"Go to Settings → Privacy → Export Data. We prepare a ZIP archive with all your content, messages, settings, and billing history. The file is ready within 24 hours and emailed as a download link.",     tags:["download","export","data","backup","my data","zip","portability","gdpr","right to data"]},
  {id:'pr4',cat:'Privacy',q:"What is your data retention policy?",     a:"Active account data is retained while your account exists. After deletion, personal data is purged within 30 days. Anonymised analytics data may be retained for up to 2 years for product improvement.", tags:["data retention","how long","store","delete data","purge","gdpr","keep","retention policy"]},
  {id:'pr5',cat:'Privacy',q:"Is the app GDPR and CCPA compliant?",     a:"Yes. We are fully compliant with GDPR (EU), CCPA (California), and PDPA (India). Exercise your rights — access, correction, deletion, portability — via Settings → Privacy or privacy@example.com.", tags:["gdpr","ccpa","pdpa","compliance","regulation","eu","california","privacy law","rights"]},
  {id:'pr6',cat:'Privacy',q:"How do I report a security vulnerability?",a:"Email security@example.com with details. We have a responsible disclosure program and aim to acknowledge reports within 48 hours. Please don't post vulnerabilities publicly before we've had a chance to fix them.", tags:["security","vulnerability","bug","report","responsible disclosure","hack","pen test"]},
  {id:'pr7',cat:'Privacy',q:"Can I control what data the app collects?",a:"Yes. In Settings → Privacy → Data Controls you can opt out of analytics tracking, disable personalised recommendations, and manage cookie preferences. Opting out does not affect core functionality.", tags:["data collection","opt out","analytics","tracking","cookies","control","privacy settings"]},
  // Pricing
  {id:'pc1',cat:'Pricing',q:"What plans and pricing do you offer?",    a:"Three plans: Free (basic features, 1 user), Pro ($12/month, all features, 3 devices), and Enterprise (custom pricing, unlimited users, SSO, dedicated support). Annual billing saves 20%.",           tags:["plans","pricing","cost","how much","price","free","pro","enterprise","subscription","tier"]},
  {id:'pc2',cat:'Pricing',q:"Is there a student or non-profit discount?",a:"Students with a valid .edu email get 50% off Pro. Verified non-profits get 60% off. Apply at pricing.example.com/discounts. Discounts cannot be combined with other promotions.",                    tags:["student","discount","non-profit","edu","reduction","cheaper","offer","coupon"]},
  {id:'pc3',cat:'Pricing',q:"What happens if I downgrade to the free plan?",a:"Your data is fully preserved when you downgrade — nothing is deleted. However, Pro-exclusive features (integrations, priority support) become inaccessible until you upgrade again.",            tags:["downgrade","free plan","data","lose","access","features","what happens","switch"]},
];

const CAT_META = {
  Account: {icon:'ti-user-circle', color:'#6256E8', desc:'Account settings, login, security, and profile management'},
  Billing: {icon:'ti-credit-card', color:'#0EA5E9', desc:'Payments, subscriptions, invoices, refunds, and plans'},
  Product: {icon:'ti-device-laptop',color:'#8B5CF6', desc:'Features, integrations, system requirements, and updates'},
  Support: {icon:'ti-headset',     color:'#10B981', desc:'Contacting support, documentation, community, and onboarding'},
  Privacy: {icon:'ti-shield-check',color:'#F59E0B', desc:'Data security, GDPR compliance, exports, and privacy controls'},
  Pricing: {icon:'ti-tag',         color:'#EF4444', desc:'Plans, pricing, discounts, and upgrade/downgrade options'},
};

const SUGGESTED = [
  {label:'Account', icon:'ti-user-circle',  qs:["How do I reset my password?","How do I enable two-factor authentication?","How do I log out of all devices?","Can I have multiple accounts?"]},
  {label:'Billing', icon:'ti-credit-card',  qs:["Is there a free trial available?","How do I upgrade or downgrade my plan?","Where can I find my invoices?","Can I pause my subscription?"]},
  {label:'Product', icon:'ti-device-laptop',qs:["Is there a desktop app available?","Does your app integrate with other tools?","What file formats are supported?","How often is the app updated?"]},
  {label:'Support', icon:'ti-headset',      qs:["How do I contact customer support?","Can I report a bug or suggest a feature?","Do you offer onboarding sessions?"]},
  {label:'Privacy', icon:'ti-shield-check', qs:["Is the app GDPR and CCPA compliant?","Can I control what data the app collects?","What is your data retention policy?"]},
  {label:'Pricing', icon:'ti-tag',          qs:["What plans and pricing do you offer?","Is there a student or non-profit discount?","What happens if I downgrade to the free plan?"]},
];

let FAQS = [...DEFAULT_FAQS];

/* ══════════════════════════════════════════════════════════
   2. ANALYTICS
══════════════════════════════════════════════════════════ */
const Analytics = {
  queries: [],
  feedback: {},
  record(q, score){ this.queries.push({q, score, ts:Date.now()}); },
  topQueries(n=5){
    const c={};
    this.queries.forEach(({q})=>{ c[q]=(c[q]||0)+1; });
    return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,n);
  },
  confDist(){
    const h=this.queries.filter(x=>x.score>0.5).length;
    const m=this.queries.filter(x=>x.score>0.28&&x.score<=0.5).length;
    const l=this.queries.filter(x=>x.score<=0.28).length;
    return {h,m,l,total:this.queries.length||1};
  },
  poorMatches(){
    return this.queries.filter(x=>x.score<0.15).map(x=>x.q)
      .filter((v,i,a)=>a.indexOf(v)===i).slice(0,5);
  },
};

/* ══════════════════════════════════════════════════════════
   3. HISTORY
══════════════════════════════════════════════════════════ */
const History = {
  items:[],
  add(q){ this.items=[q,...this.items.filter(x=>x!==q)].slice(0,8); renderHistory(); },
};

/* ══════════════════════════════════════════════════════════
   4. NLP ENGINE
══════════════════════════════════════════════════════════ */
const STOPWORDS=new Set(['the','a','an','is','it','in','on','at','to','do','i','my','how','can','does','what','why','when','where','who','will','was','are','for','of','and','or','be','this','that','have','has','with','from','by','not','would','could','should','their','there','they','we','you','your']);

function tokenize(text){
  return text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>1&&!STOPWORDS.has(w));
}
function editDist(a,b){
  const m=a.length,n=b.length;
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
function fuzzyExpand(tokens,vocab){
  const extra=[];
  tokens.forEach(tok=>{ if(tok.length<4)return; vocab.forEach(v=>{ if(v!==tok&&v.length>3&&editDist(tok,v)<=Math.floor(tok.length/4)) extra.push(v); }); });
  return [...new Set([...tokens,...extra])];
}

let IDF={},FAQ_VECS=[],VOCAB=[];

function rebuildIndex(){
  const allDocs=FAQS.map(f=>`${f.q} ${f.tags.join(' ')}`);
  VOCAB=[...new Set(allDocs.flatMap(d=>tokenize(d)))];
  const df={},N=allDocs.length;
  allDocs.forEach(d=>{ const s=new Set(tokenize(d)); s.forEach(t=>{ df[t]=(df[t]||0)+1; }); });
  IDF={};
  for(const t in df) IDF[t]=Math.log((N+1)/(df[t]+1))+1;
  FAQ_VECS=FAQS.map(f=>tfidf(tokenize(`${f.q} ${f.tags.join(' ')}`)));
  updateBadges();
}

function tfidf(tokens){
  const tf={},n=tokens.length||1;
  tokens.forEach(t=>{ tf[t]=(tf[t]||0)+1; });
  const vec={};
  for(const t in tf) if(IDF[t]) vec[t]=(tf[t]/n)*IDF[t];
  return vec;
}
function cosine(a,b){
  let dot=0,na=0,nb=0;
  Object.keys(a).forEach(k=>{ dot+=(a[k]||0)*(b[k]||0); na+=a[k]**2; });
  Object.values(b).forEach(v=>(nb+=v**2));
  const d=Math.sqrt(na)*Math.sqrt(nb);
  return d===0?0:dot/d;
}
function findMatch(query){
  let tokens=tokenize(query);
  tokens=fuzzyExpand(tokens,VOCAB);
  const qvec=tfidf(tokens);
  const ranked=FAQS.map((f,i)=>({f,score:cosine(qvec,FAQ_VECS[i])})).sort((a,b)=>b.score-a.score);
  return {tokens,ranked};
}
rebuildIndex();

/* ══════════════════════════════════════════════════════════
   5. DOM REFS & UTILS
══════════════════════════════════════════════════════════ */
const msgsEl    = document.getElementById('messages');
const inputEl   = document.getElementById('user-input');
const procEl    = document.getElementById('process-panel');
const histEl    = document.getElementById('history-list');
const announcer = document.getElementById('sr-announcer');

let msgCounter=0;
const nextMsgId=()=>'msg-'+(++msgCounter);
const announce=t=>{ announcer.textContent=''; setTimeout(()=>{ announcer.textContent=t; },50); };
const setProcess=html=>{ procEl.innerHTML=html; };
const scrollBottom=()=>{ msgsEl.scrollTo({top:msgsEl.scrollHeight,behavior:'smooth'}); };
const confColor=s=>s>0.5?'#22C997':s>0.28?'#F59E0B':'#EF4444';
const confLabel=s=>s>0.5?'High confidence':s>0.28?'Medium confidence':'Low confidence';

/* ══════════════════════════════════════════════════════════
   6. TOAST
══════════════════════════════════════════════════════════ */
function showToast(msg,type='info',duration=3000){
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  const icon=type==='success'?'ti-circle-check':type==='error'?'ti-alert-circle':'ti-info-circle';
  el.innerHTML=`<i class="ti ${icon}"></i> ${msg}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(()=>{ el.style.animation='toast-out .3s ease forwards'; setTimeout(()=>el.remove(),300); },duration);
}

/* ══════════════════════════════════════════════════════════
   7. SIDEBAR: PAGE NAVIGATION
══════════════════════════════════════════════════════════ */
const chatView = document.getElementById('chat-view');
const pageView = document.getElementById('page-view');
let currentPage = 'chat';

function showChat(){
  currentPage='chat';
  chatView.classList.remove('hidden');
  pageView.classList.add('hidden');
  document.getElementById('topbar-title').textContent='Chat Assistant';
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  document.querySelector('[data-page="chat"]').classList.add('active');
  closeMobileSidebar();
}

function showPage(cat){
  currentPage=cat;
  chatView.classList.add('hidden');
  pageView.classList.remove('hidden');

  const meta = CAT_META[cat];
  document.getElementById('topbar-title').textContent = cat;
  document.getElementById('page-title').textContent = cat;
  document.getElementById('page-subtitle').textContent = meta.desc;
  document.getElementById('page-header-icon').innerHTML = `<i class="ti ${meta.icon}" style="color:${meta.color}"></i>`;
  document.getElementById('page-search').value='';

  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  document.querySelector(`[data-cat="${cat}"]`).classList.add('active');
  renderPageFaqs(cat,'');
  closeMobileSidebar();
}

document.querySelectorAll('.nav-item').forEach(el=>{
  el.addEventListener('click',()=>{
    if(el.dataset.page==='chat') showChat();
    else showPage(el.dataset.cat);
  });
});

document.getElementById('page-search').addEventListener('input',e=>{
  renderPageFaqs(currentPage, e.target.value);
});

function renderPageFaqs(cat, filter){
  const list = document.getElementById('page-faq-list');
  const lc   = filter.toLowerCase();
  const items = FAQS.filter(f => f.cat===cat && (!filter || f.q.toLowerCase().includes(lc) || f.a.toLowerCase().includes(lc)));

  if(!items.length){
    list.innerHTML=`<div class="page-empty"><i class="ti ti-search-off"></i>No FAQs match your search.</div>`;
    return;
  }

  list.innerHTML = items.map(f=>`
    <div class="faq-card" data-id="${f.id}">
      <div class="faq-card-q">
        <span class="faq-card-q-text">${f.q}</span>
        <i class="ti ti-chevron-down faq-chevron"></i>
      </div>
      <div class="faq-card-a">
        <div class="faq-card-a-inner">${f.a}</div>
        <div class="faq-card-footer">
          <button class="faq-ask-btn" data-q="${f.q.replace(/"/g,'&quot;')}">
            <i class="ti ti-message-2"></i> Ask in Chat
          </button>
          <div class="faq-tags">${f.tags.slice(0,3).map(t=>`<span class="faq-tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Accordion toggle
  list.querySelectorAll('.faq-card-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const card=q.closest('.faq-card');
      const wasOpen=card.classList.contains('open');
      list.querySelectorAll('.faq-card').forEach(c=>c.classList.remove('open'));
      if(!wasOpen) card.classList.add('open');
    });
  });

  // Ask in chat
  list.querySelectorAll('.faq-ask-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      showChat();
      setTimeout(()=>sendQuery(btn.dataset.q),100);
    });
  });
}

function updateBadges(){
  ['Account','Billing','Product','Support','Privacy','Pricing'].forEach(cat=>{
    const badge=document.getElementById('badge-'+cat);
    if(badge) badge.textContent=FAQS.filter(f=>f.cat===cat).length;
  });
}

/* ══════════════════════════════════════════════════════════
   8. SIDEBAR MOBILE
══════════════════════════════════════════════════════════ */
const sidebar   = document.getElementById('sidebar');
const backdrop  = document.getElementById('sidebar-backdrop');

function openMobileSidebar(){
  sidebar.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeMobileSidebar(){
  sidebar.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.style.overflow='';
}

document.getElementById('sidebar-toggle').addEventListener('click',()=>{
  if(window.innerWidth<=900){
    sidebar.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar();
  } else {
    sidebar.classList.toggle('hidden-desktop');
    document.getElementById('app').classList.toggle('sidebar-hidden');
  }
});
backdrop.addEventListener('click', closeMobileSidebar);

/* ══════════════════════════════════════════════════════════
   9. HISTORY
══════════════════════════════════════════════════════════ */
function renderHistory(){
  histEl.innerHTML='';
  if(!History.items.length){
    const e=document.createElement('div');
    e.className='hist-empty';e.textContent='No recent questions yet';
    histEl.appendChild(e);return;
  }
  History.items.forEach(q=>{
    const btn=document.createElement('button');
    btn.className='hist-item';btn.title=q;
    btn.innerHTML=`<i class="ti ti-history"></i>${q.length>28?q.slice(0,26)+'…':q}`;
    btn.addEventListener('click',()=>{ showChat(); setTimeout(()=>sendQuery(q),80); });
    histEl.appendChild(btn);
  });
}
renderHistory();

/* ══════════════════════════════════════════════════════════
   10. CHAT RENDERING
══════════════════════════════════════════════════════════ */
const chatLog=[];

function appendUser(text){
  const wrap=document.createElement('div');wrap.className='msg user';
  const av=document.createElement('div');av.className='msg-av user';av.textContent='Me';
  const bub=document.createElement('div');bub.className='bubble';bub.textContent=text;
  wrap.appendChild(av);wrap.appendChild(bub);
  msgsEl.appendChild(wrap);scrollBottom();
}

function appendBotStreaming(text,score,related){
  const id=nextMsgId();
  const wrap=document.createElement('div');wrap.className='msg bot';wrap.id=id;
  const av=document.createElement('div');av.className='msg-av bot';
  av.innerHTML='<i class="ti ti-robot"></i>';
  const body=document.createElement('div');body.style.maxWidth='100%';
  const bub=document.createElement('div');bub.className='bubble typewriter-cursor';
  body.appendChild(bub);

  const meta=document.createElement('div');meta.className='meta';meta.style.display='none';

  // Confidence
  const row=document.createElement('div');row.className='conf-row';
  const bar=document.createElement('div');bar.className='conf-bar';
  const fill=document.createElement('div');fill.className='conf-fill';
  fill.style.cssText=`width:0%;background:${confColor(score)}`;
  bar.appendChild(fill);
  const lbl=document.createElement('span');lbl.className='conf-label';
  lbl.textContent=`${confLabel(score)} · ${Math.round(score*100)}%`;
  row.appendChild(bar);row.appendChild(lbl);meta.appendChild(row);

  // Feedback
  const fbRow=document.createElement('div');fbRow.className='feedback-row';
  const fbLbl=document.createElement('span');fbLbl.className='feedback-lbl';fbLbl.textContent='Was this helpful?';
  const btnUp=document.createElement('button');btnUp.className='fb-btn';btnUp.textContent='👍';
  const btnDn=document.createElement('button');btnDn.className='fb-btn';btnDn.textContent='👎';
  btnUp.onclick=()=>{ Analytics.feedback[id]='up';btnUp.classList.add('active-up');btnDn.classList.remove('active-down');showToast('Thanks for your feedback!','success'); };
  btnDn.onclick=()=>{ Analytics.feedback[id]='down';btnDn.classList.add('active-down');btnUp.classList.remove('active-up');showToast("We'll work to improve this answer.",'info'); };
  fbRow.appendChild(fbLbl);fbRow.appendChild(btnUp);fbRow.appendChild(btnDn);meta.appendChild(fbRow);

  // Related
  if(related&&related.length){
    const sl=document.createElement('div');sl.className='sug-lbl';sl.textContent='Related questions';
    const sd=document.createElement('div');sd.className='suggestions';
    related.forEach(r=>{
      const btn=document.createElement('button');btn.className='sug-btn';
      btn.textContent=r.q.length>46?r.q.slice(0,44)+'…':r.q;
      btn.onclick=()=>sendQuery(r.q);sd.appendChild(btn);
    });
    meta.appendChild(sl);meta.appendChild(sd);
  }

  body.appendChild(meta);
  wrap.appendChild(av);wrap.appendChild(body);
  msgsEl.appendChild(wrap);scrollBottom();

  // Typewriter
  let i=0;
  const speed=Math.max(10,Math.min(28,Math.floor(1800/text.length)));
  (function type(){
    if(i<text.length){ bub.textContent=text.slice(0,++i); scrollBottom(); setTimeout(type,speed); }
    else{
      bub.classList.remove('typewriter-cursor');
      meta.style.display='';
      setTimeout(()=>{ fill.style.width=Math.round(score*100)+'%'; },50);
      announce(text.slice(0,100));
    }
  })();
}

function showTyping(){
  const wrap=document.createElement('div');wrap.className='msg bot';wrap.id='typing-indicator';
  const av=document.createElement('div');av.className='msg-av bot';av.innerHTML='<i class="ti ti-robot"></i>';
  const bub=document.createElement('div');bub.className='typing-bub';
  bub.innerHTML='<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  wrap.appendChild(av);wrap.appendChild(bub);msgsEl.appendChild(wrap);scrollBottom();
  return wrap;
}

function appendNoMatch(){
  const wrap=document.createElement('div');wrap.className='msg bot';
  const av=document.createElement('div');av.className='msg-av bot';av.innerHTML='<i class="ti ti-robot"></i>';
  const body=document.createElement('div');body.style.maxWidth='100%';
  const bub=document.createElement('div');bub.className='bubble';
  bub.style.cssText='color:#7B76A0;font-style:italic';
  bub.textContent="I couldn't find a strong match for that. Try rephrasing, or browse a topic page from the sidebar.";
  const sl=document.createElement('div');sl.className='sug-lbl';sl.style.marginTop='8px';sl.textContent='Try these popular questions';
  const sd=document.createElement('div');sd.className='suggestions';
  FAQS.slice(0,4).forEach(f=>{
    const btn=document.createElement('button');btn.className='sug-btn';
    btn.textContent=f.q.length>44?f.q.slice(0,42)+'…':f.q;
    btn.onclick=()=>sendQuery(f.q);sd.appendChild(btn);
  });
  body.appendChild(bub);body.appendChild(sl);body.appendChild(sd);
  wrap.appendChild(av);wrap.appendChild(body);msgsEl.appendChild(wrap);scrollBottom();
  announce("I couldn't find a match. Please try rephrasing.");
}

/* ══════════════════════════════════════════════════════════
   11. WELCOME CARD
══════════════════════════════════════════════════════════ */
function buildWelcome(){
  const wrap=document.createElement('div');wrap.className='msg bot';
  const av=document.createElement('div');av.className='msg-av bot';av.innerHTML='<i class="ti ti-robot"></i>';
  const card=document.createElement('div');card.className='welcome-card';
  card.innerHTML=`
    <div class="welcome-visual-frame"><img src="./assets/images/askaura-warm-welcome.png" alt="" loading="lazy" onerror="this.closest('.welcome-visual-frame').classList.add('is-missing'); this.remove();" /></div>
    <h3>👋 Hi! I'm AskAura, your FAQ Assistant</h3>
    <p>Ask me anything about your account, billing, product features, privacy, or pricing — or browse a topic page from the sidebar for a full overview.</p>
  `;
  card.querySelector('h3').textContent='Good Morning';
  card.querySelector('p').textContent='AskAura is ready to answer account, billing, product, support, privacy, and pricing questions with a calm, guided flow.';
  SUGGESTED.forEach(cat=>{
    const sec=document.createElement('div');sec.className='cat-section';
    const lbl=document.createElement('div');lbl.className='cat-label';
    lbl.innerHTML=`<i class="ti ${cat.icon}" style="font-size:11px"></i> ${cat.label}`;
    const pills=document.createElement('div');pills.className='cat-pills';
    cat.qs.forEach(q=>{
      const btn=document.createElement('button');btn.className='cat-pill';
      btn.textContent=q.length>46?q.slice(0,44)+'…':q;
      btn.onclick=()=>sendQuery(q);pills.appendChild(btn);
    });
    sec.appendChild(lbl);sec.appendChild(pills);card.appendChild(sec);
  });
  wrap.appendChild(av);wrap.appendChild(card);msgsEl.appendChild(wrap);scrollBottom();
}

/* ══════════════════════════════════════════════════════════
   12. SEND LOGIC
══════════════════════════════════════════════════════════ */
function sendQuery(q){
  q=q.trim();if(!q)return;
  chatLog.push({role:'user',text:q,ts:new Date().toISOString()});
  appendUser(q);History.add(q);inputEl.value='';
  setProcess('<i class="ti ti-analyze" style="color:#6256E8"></i> <span class="step-highlight">Tokenizing</span> · computing TF-IDF cosine similarity…');
  const typingEl=showTyping();
  setTimeout(()=>{
    const {tokens,ranked}=findMatch(q);
    const best=ranked[0];
    Analytics.record(q,best.score);
    setProcess(`<i class="ti ti-search" style="color:#6256E8"></i> Scored <span class="step-highlight">${FAQS.length} FAQs</span> using ${tokens.length} token(s) · best: ${Math.round(best.score*100)}%`);
    typingEl.remove();
    if(best.score>0.07){
      const others=ranked.slice(1,4).filter(r=>r.score>0.04).map(r=>r.f);
      appendBotStreaming(best.f.a,best.score,others.length?others:null);
      chatLog.push({role:'bot',text:best.f.a,score:best.score,ts:new Date().toISOString()});
    } else {
      appendNoMatch();
      chatLog.push({role:'bot',text:'[No match]',score:0,ts:new Date().toISOString()});
    }
  },650);
}

document.getElementById('send-btn').addEventListener('click',()=>sendQuery(inputEl.value));
inputEl.addEventListener('keydown',e=>{ if(e.key==='Enter')sendQuery(inputEl.value); });

/* ══════════════════════════════════════════════════════════
   13. CLEAR CHAT
══════════════════════════════════════════════════════════ */
document.getElementById('btn-clear').addEventListener('click',()=>{
  if(currentPage!=='chat') showChat();
  msgsEl.innerHTML='';chatLog.length=0;setProcess('');
  setTimeout(buildWelcome,60);showToast('Conversation cleared','success');
});

/* ══════════════════════════════════════════════════════════
   14. KEYBOARD SHORTCUTS
══════════════════════════════════════════════════════════ */
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){
    e.preventDefault();
    if(currentPage!=='chat') showChat();
    inputEl.focus();inputEl.select();
  }
  if(e.key==='Escape'){
    inputEl.blur();
    document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m=>{ m.hidden=true; });
    closeMobileSidebar();
  }
});

/* ══════════════════════════════════════════════════════════
   15. MODALS
══════════════════════════════════════════════════════════ */
function openModal(id){ const m=document.getElementById(id);m.hidden=false;const f=m.querySelector('button,input,textarea,select');if(f)setTimeout(()=>f.focus(),50); }
function closeModal(id){ document.getElementById(id).hidden=true; }

document.querySelectorAll('.modal-close,[data-close]').forEach(btn=>{
  btn.addEventListener('click',()=>closeModal(btn.dataset.close||btn.closest('.modal-overlay').id));
});
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',e=>{ if(e.target===m)closeModal(m.id); });
});

/* ══════════════════════════════════════════════════════════
   16. ANALYTICS
══════════════════════════════════════════════════════════ */
document.getElementById('btn-analytics').addEventListener('click',()=>{
  renderAnalytics();openModal('modal-analytics');
});

function renderAnalytics(){
  const body=document.getElementById('analytics-body');
  const dist=Analytics.confDist();
  const topQ=Analytics.topQueries();
  const poor=Analytics.poorMatches();
  const fbUp=Object.values(Analytics.feedback).filter(x=>x==='up').length;
  const fbDn=Object.values(Analytics.feedback).filter(x=>x==='down').length;
  const pct=n=>((n/dist.total)*100).toFixed(0);
  body.innerHTML=`
    <div class="analytics-visual"><img src="./assets/images/askaura-warm-answer.png" alt="" loading="lazy" onerror="this.closest('.analytics-visual').classList.add('is-missing'); this.remove();" /></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num">${dist.total}</div><div class="stat-lbl">Total Queries</div></div>
      <div class="stat-card"><div class="stat-num" style="color:#22C997">${fbUp}</div><div class="stat-lbl">👍 Helpful</div></div>
      <div class="stat-card"><div class="stat-num" style="color:#EF4444">${fbDn}</div><div class="stat-lbl">👎 Not helpful</div></div>
    </div>
    <div class="analytics-section-title">Confidence distribution</div>
    <div class="conf-dist-bar">
      <div class="conf-high-fill" style="width:${pct(dist.h)}%"></div>
      <div class="conf-med-fill"  style="width:${pct(dist.m)}%"></div>
      <div class="conf-low-fill"  style="width:${pct(dist.l)}%"></div>
    </div>
    <div class="conf-dist-legend">
      <div class="legend-item"><span class="conf-dot" style="background:#22C997"></span>High (${dist.h})</div>
      <div class="legend-item"><span class="conf-dot" style="background:#F59E0B"></span>Medium (${dist.m})</div>
      <div class="legend-item"><span class="conf-dot" style="background:#EF4444"></span>Low (${dist.l})</div>
    </div>
    <div class="analytics-section-title" style="margin-top:18px">Top questions asked</div>
    ${topQ.length?topQ.map(([q,c],i)=>`
      <div class="top-q-item">
        <div class="top-q-rank">${i+1}</div>
        <div class="top-q-text">${q}</div>
        <div class="top-q-count">${c}×</div>
      </div>`).join(''):'<div class="hist-empty">No queries yet.</div>'}
    ${poor.length?`<div class="analytics-section-title" style="margin-top:18px">Poor matches — review these FAQs</div>${poor.map(q=>`<div class="poor-item">⚠ ${q}</div>`).join('')}`:''}
  `;
}

/* ══════════════════════════════════════════════════════════
   17. FAQ EDITOR
══════════════════════════════════════════════════════════ */
document.getElementById('btn-editor').addEventListener('click',()=>{ renderEditorList('');openModal('modal-editor'); });
document.getElementById('editor-search').addEventListener('input',e=>renderEditorList(e.target.value));

function renderEditorList(filter){
  const el=document.getElementById('editor-list');
  const lc=filter.toLowerCase();
  const items=filter?FAQS.filter(f=>f.q.toLowerCase().includes(lc)||f.cat.toLowerCase().includes(lc)):FAQS;
  if(!items.length){el.innerHTML='<div class="hist-empty">No FAQs match your filter.</div>';return;}
  el.innerHTML=items.map(f=>`
    <div class="editor-faq-item" data-id="${f.id}">
      <div class="editor-faq-content">
        <div class="editor-faq-q">${f.q}</div>
        <div class="editor-faq-a">${f.a}</div>
        <div class="editor-faq-cat">${f.cat}</div>
      </div>
      <div class="editor-faq-actions">
        <button class="editor-btn edit" data-id="${f.id}" title="Edit"><i class="ti ti-pencil"></i></button>
        <button class="editor-btn del"  data-id="${f.id}" title="Delete"><i class="ti ti-trash"></i></button>
      </div>
    </div>`).join('');
  el.querySelectorAll('.editor-btn.edit').forEach(btn=>btn.addEventListener('click',()=>openFaqForm(btn.dataset.id)));
  el.querySelectorAll('.editor-btn.del').forEach(btn=>btn.addEventListener('click',()=>{
    FAQS=FAQS.filter(f=>f.id!==btn.dataset.id);
    rebuildIndex();renderEditorList(document.getElementById('editor-search').value);
    if(currentPage!=='chat') renderPageFaqs(currentPage,'');
    showToast('FAQ deleted','success');
  }));
}

let editingId=null;
document.getElementById('btn-add-faq').addEventListener('click',()=>openFaqForm(null));

function openFaqForm(id){
  editingId=id;
  const f=id?FAQS.find(x=>x.id===id):null;
  document.getElementById('faq-form-title').textContent=f?'Edit FAQ':'Add FAQ';
  document.getElementById('faq-form-q').value=f?f.q:'';
  document.getElementById('faq-form-a').value=f?f.a:'';
  document.getElementById('faq-form-tags').value=f?f.tags.join(', '):'';
  document.getElementById('faq-form-cat').value=f?f.cat:'Account';
  openModal('modal-faq-form');
}

document.getElementById('faq-form-save').addEventListener('click',()=>{
  const q=document.getElementById('faq-form-q').value.trim();
  const a=document.getElementById('faq-form-a').value.trim();
  const tags=document.getElementById('faq-form-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const cat=document.getElementById('faq-form-cat').value;
  if(!q||!a){showToast('Question and answer are required.','error');return;}
  if(editingId){
    const idx=FAQS.findIndex(f=>f.id===editingId);
    FAQS[idx]={...FAQS[idx],q,a,tags,cat};
  } else {
    FAQS.push({id:'u'+Date.now(),cat,q,a,tags});
  }
  rebuildIndex();
  renderEditorList(document.getElementById('editor-search').value);
  if(currentPage!=='chat') renderPageFaqs(currentPage,'');
  closeModal('modal-faq-form');
  showToast(editingId?'FAQ updated!':'FAQ added!','success');
});

/* ══════════════════════════════════════════════════════════
   18. EXPORT
══════════════════════════════════════════════════════════ */
document.getElementById('btn-export').addEventListener('click',()=>openModal('modal-export'));

function downloadFile(content,filename,type){
  const blob=new Blob([content],{type});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  URL.revokeObjectURL(a.href);
  showToast(`Exported as ${filename}`,'success');
  closeModal('modal-export');
}

document.getElementById('export-txt').addEventListener('click',()=>
  downloadFile(chatLog.map(m=>`[${m.role.toUpperCase()}] ${m.text}`).join('\n\n'),'askaura-chat.txt','text/plain'));
document.getElementById('export-json').addEventListener('click',()=>
  downloadFile(JSON.stringify(chatLog,null,2),'askaura-chat.json','application/json'));
document.getElementById('export-md').addEventListener('click',()=>
  downloadFile(['# AskAura Chat Export\n',...chatLog.map(m=>m.role==='user'?`**You:** ${m.text}\n`:`**AskAura:** ${m.text}\n`)].join('\n'),'askaura-chat.md','text/markdown'));

/* ══════════════════════════════════════════════════════════
   19. VOICE INPUT
══════════════════════════════════════════════════════════ */
const voiceBtn=document.getElementById('voice-btn');
let recognition=null;

if('webkitSpeechRecognition' in window||'SpeechRecognition' in window){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  recognition=new SR();
  recognition.lang='en-US';recognition.interimResults=true;recognition.continuous=false;
  recognition.onstart=()=>{ voiceBtn.classList.add('recording');setProcess('<i class="ti ti-microphone" style="color:#6256E8"></i> <span class="step-highlight">Listening…</span> speak your question'); };
  recognition.onresult=e=>{ const t=Array.from(e.results).map(r=>r[0].transcript).join('');inputEl.value=t;if(e.results[e.results.length-1].isFinal)sendQuery(t); };
  recognition.onerror=e=>showToast('Voice error: '+e.error,'error');
  recognition.onend=()=>{ voiceBtn.classList.remove('recording');setProcess(''); };
  voiceBtn.addEventListener('click',()=>{
    if(currentPage!=='chat') showChat();
    voiceBtn.classList.contains('recording')?recognition.stop():recognition.start();
  });
} else {
  voiceBtn.style.opacity='.4';voiceBtn.style.cursor='not-allowed';voiceBtn.title='Voice input not supported in this browser';
  voiceBtn.addEventListener('click',()=>showToast('Voice input requires Chrome or Edge.','error'));
}

/* ══════════════════════════════════════════════════════════
   20. BOOT
══════════════════════════════════════════════════════════ */
setTimeout(buildWelcome,80);
