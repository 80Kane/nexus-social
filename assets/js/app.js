/* NEXUS SOCIAL - app.js v2.0 - Timothy Rollings / Legacy Media Co. 
   Sections: HOME | EXPLORE | NOTIFICATIONS | MESSAGES | REELS | ANALYTICS | PROFILE */
'use strict';

    // === GUARD LUCIDE ===
    function RI() { if (typeof lucide !== "undefined" && typeof lucide.createIcons === "function") lucide.createIcons(); }
    RI();

    // === UTILS ===
    function fmtNum(n) { if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return ''+n; }
    let toastId = 0;
    function showToast(title, msg, color) {
      const c = document.getElementById('toast-container');
      const id = 'toast-'+(++toastId);
      const t = document.createElement('div');
      t.className = 'toast'; t.id = id;
      t.style.cssText = 'background:var(--card);border:1px solid var(--border);border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;max-width:340px;box-shadow:0 8px 24px rgba(0,0,0,.15);pointer-events:auto;';
      t.innerHTML = `<div style="width:32px;height:32px;border-radius:999px;background:${color||'#0D9488'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;color:white;font-weight:700;">!</div><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;">${title}</div><div style="font-size:11px;color:var(--muted);">${msg}</div></div><button class="toast-x" style="background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;flex-shrink:0;"><i data-lucide="x" class="w-4 h-4"></i></button>`;
      c.appendChild(t); RI();
      t.querySelector('.toast-x').addEventListener('click', () => dismissToast(id));
      setTimeout(() => dismissToast(id), 4000);
    }
    function dismissToast(id) { const t = document.getElementById(id); if (!t) return; t.classList.add('removing'); setTimeout(() => t.remove(), 300); }

    // === DARK MODE ===
    let darkMode = localStorage.getItem('nexus-dark') === 'true';
    function applyDark() { document.body.classList.toggle('dark-mode', darkMode); localStorage.setItem('nexus-dark', darkMode); }
    applyDark();
    document.getElementById('dark-toggle').addEventListener('click', () => { darkMode = !darkMode; applyDark(); });
    document.getElementById('drawer-dark-toggle').addEventListener('click', () => { darkMode = !darkMode; applyDark(); });

    // === DATA ===
    const users = {
      ava: { name:'Ava Chen', handle:'@ava.chen', initials:'AC', color:'#EF4444' },
      marcus: { name:'Marcus Kim', handle:'@marcus.kim', initials:'MK', color:'#0D9488' },
      sofia: { name:'Sofia Reyes', handle:'@sofia_reyes', initials:'SR', color:'#F59E0B' },
      jordan: { name:'Jordan Blake', handle:'@jordan.blake', initials:'JB', color:'#0F766E' },
      priya: { name:'Priya Patel', handle:'@priya.dev', initials:'PP', color:'#D97706' },
      leo: { name:'Leo Torres', handle:'@leo.torres', initials:'LT', color:'#F59E0B' },
      emma: { name:'Emma Walsh', handle:'@emma.walsh', initials:'EW', color:'#D97706' },
      tim: { name:'Timothy Rollings', handle:'@timrollings', initials:'TR', color:'#0D9488', verified:true }
    };

    const postsData = [
      { id:1, uid:'ava', time:'2h ago', text:'Just wrapped the most insane design sprint ðŸš€ Three days, zero sleep, one legendary product. Can\'t wait to share what we built. Stay tuned. ðŸ‘€ #design #startup', image:null, likes:1247, comments:89, reposts:234, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'marcus',text:'Can\'t wait to see it! ðŸ”¥',time:'1h ago'},{uid:'priya',text:'Three days no sleep?? Legend status.',time:'45m ago'},{uid:'jordan',text:'This is gonna be huge!',time:'30m ago'}] },
      { id:7, uid:'marcus', time:'3h ago', text:'Which dark mode do you prefer? ðŸŒ™', image:null, likes:3412, comments:412, reposts:891, liked:false, reposted:false, bookmarked:false,
        poll:{ options:[{text:'True Dark (OLED)',votes:1200,pct:52},{text:'Soft Dark (Gray)',votes:716,pct:31},{text:'Auto (System)',votes:393,pct:17}],totalVotes:2309,timeLeft:'2 days left',voted:false,selectedIdx:null },
        commentList:[{uid:'ava',text:'True dark all the way!',time:'2h ago'},{uid:'jordan',text:'Auto is the future',time:'1h ago'},{uid:'tim',text:'OLED dark is king ðŸ‘‘',time:'45m ago'}] },
      { id:2, uid:'sofia', time:'6h ago', text:'Golden hour hits different when you\'re in Lisbon ðŸ‡µðŸ‡¹âœ¨', image:'linear-gradient(135deg,#f59e0b,#ef4444)', likes:8721, comments:203, reposts:1102, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'emma',text:'Stunning! Adding Lisbon to my bucket list ðŸ˜',time:'5h ago'},{uid:'leo',text:'Those sunsets are unreal!',time:'4h ago'},{uid:'tim',text:'Need to visit ASAP!',time:'3h ago'}] },
      { id:3, uid:'jordan', time:'8h ago', text:'Finally launched my indie game after 18 months of solo dev! It\'s live on Steam. Link in bio. All the feelings right now ðŸ˜­ðŸŽ®', image:'linear-gradient(135deg,#1e1b4b,#3730a3)', likes:14203, comments:1812, reposts:4301, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'ava',text:'CONGRATS!! ðŸŽ‰ðŸŽ‰ Downloading right now!',time:'7h ago'},{uid:'marcus',text:'18 months of grind, you earned this!',time:'6h ago'},{uid:'priya',text:'Adding to my wishlist!',time:'5h ago'}] },
      { id:4, uid:'priya', time:'12h ago', text:'Tip: Stop using console.log for debugging. Start using debugger + breakpoints. Your future self will thank you. ðŸ’» #webdev #javascript', image:null, likes:5612, comments:672, reposts:2103, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'jordan',text:'console.log("I feel attacked") ðŸ˜‚',time:'11h ago'},{uid:'marcus',text:'Breakpoints changed my life',time:'10h ago'},{uid:'tim',text:'This is the way.',time:'9h ago'}] },
      { id:5, uid:'leo', time:'1d ago', text:'Sunday farmers market haul ðŸŒ¿ðŸ…ðŸŒ½ Eating local is eating better. Who else does weekly market runs?', image:'linear-gradient(135deg,#14532d,#0d9488)', likes:2301, comments:156, reposts:398, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'sofia',text:'Market mornings are the best! ðŸŒ»',time:'20h ago'},{uid:'emma',text:'Love this! Support local always',time:'18h ago'},{uid:'ava',text:'The colors ðŸŽ¨',time:'16h ago'}] }
    ];

    const storyData = [
      { key:'ava', ...users.ava, bg:'linear-gradient(135deg,#EF4444,#D97706)', emoji:'ðŸŽ¨', text:'New design dropping tomorrow! ðŸ”¥' },
      { key:'marcus', ...users.marcus, bg:'linear-gradient(135deg,#0D9488,#134E4A)', emoji:'ðŸŒ™', text:'Dark mode everything. No exceptions.' },
      { key:'sofia', ...users.sofia, bg:'linear-gradient(135deg,#F59E0B,#D97706)', emoji:'ðŸ‡µðŸ‡¹', text:'Lisbon sunsets hit different âœ¨' },
      { key:'jordan', ...users.jordan, bg:'linear-gradient(135deg,#0F766E,#0D9488)', emoji:'ðŸŽ®', text:'Launch day energy!! ðŸš€' },
      { key:'priya', ...users.priya, bg:'linear-gradient(135deg,#D97706,#F59E0B)', emoji:'ðŸ’»', text:'Coding at 2am. Again. Worth it.' },
      { key:'leo', ...users.leo, bg:'linear-gradient(135deg,#F59E0B,#0D9488)', emoji:'ðŸŒ¿', text:'Market haul was INSANE ðŸ…' },
      { key:'emma', ...users.emma, bg:'linear-gradient(135deg,#D97706,#0D9488)', emoji:'â˜•', text:'Coffee + code = perfection' }
    ];

    const conversations = [
      { uid:'ava', lastMsg:'That design sprint was insane right? ðŸ˜‚', time:'2m', unread:2, messages:[
        {from:'them',text:'Hey Tim! Loved your latest post ðŸ”¥',t:'10:15 AM'},{from:'me',text:'Thanks Ava! How\'s the design sprint going?',t:'10:17 AM'},{from:'them',text:'Insane!! We pulled an all-nighter but it was worth it',t:'10:18 AM'},{from:'me',text:'Ha! The best work happens at 3am sometimes ðŸ˜‚',t:'10:20 AM'},{from:'them',text:'100%! Hey are you going to DesignWeek2026?',t:'10:35 AM'},{from:'me',text:'Yes! Maybe we can link up there?',t:'10:36 AM'},{from:'them',text:'That design sprint was insane right? ðŸ˜‚',t:'10:50 AM'}
      ]},
      { uid:'marcus', lastMsg:'Did you try the debugger tip yet?', time:'15m', unread:1, messages:[
        {from:'me',text:'Dark mode post is going CRAZY ðŸ”¥',t:'9:00 AM'},{from:'them',text:'I know right! 3K likes overnight!',t:'9:05 AM'},{from:'them',text:'Did you try the debugger tip I shared?',t:'9:10 AM'},{from:'me',text:'Not yet, on my list for today',t:'9:12 AM'},{from:'them',text:'Game changer trust me',t:'9:13 AM'},{from:'me',text:'I\'ll let you know ðŸ˜„',t:'9:15 AM'},{from:'them',text:'Did you try the debugger tip yet?',t:'9:40 AM'}
      ]},
      { uid:'sofia', lastMsg:'You HAVE to come to Lisbon ðŸ‡µðŸ‡¹', time:'1h', unread:0, messages:[
        {from:'them',text:'Tim!! Lisbon is BEAUTIFUL ðŸ¥¹',t:'3:00 PM'},{from:'me',text:'The photos look insane! How long are you there?',t:'3:10 PM'},{from:'them',text:'3 more weeks. Golden hour is unreal here',t:'3:15 PM'},{from:'me',text:'I need to plan a trip',t:'3:20 PM'},{from:'them',text:'YES come! I\'ll be your tour guide',t:'3:22 PM'},{from:'me',text:'Deal. August?',t:'3:25 PM'},{from:'them',text:'You HAVE to come to Lisbon ðŸ‡µðŸ‡¹',t:'4:00 PM'}
      ]},
      { uid:'jordan', lastMsg:'Congrats on the 48K! You earned it ðŸŽ‰', time:'3h', unread:0, messages:[
        {from:'them',text:'Dude your engagement rate is crazy high',t:'5:00 PM'},{from:'me',text:'Thanks! Consistency is key',t:'5:05 PM'},{from:'them',text:'How do you come up with post ideas?',t:'5:10 PM'},{from:'me',text:'I keep a running notes doc of random thoughts ðŸ“',t:'5:15 PM'},{from:'them',text:'That\'s smart. Gonna steal that',t:'5:20 PM'},{from:'me',text:'Steal away! Works every time',t:'5:25 PM'},{from:'them',text:'Congrats on the 48K! You earned it ðŸŽ‰',t:'5:30 PM'}
      ]},
      { uid:'priya', lastMsg:'Can we collab on a JS series?', time:'1d', unread:0, messages:[
        {from:'them',text:'Love your content style, Tim!',t:'Yesterday'},{from:'me',text:'Thank you so much Priya! Love yours too',t:'Yesterday'},{from:'them',text:'Your engagement is goals honestly',t:'Yesterday'},{from:'me',text:'You\'ll get there! Your dev content is top tier',t:'Yesterday'},{from:'them',text:'I\'ve been thinking about a JS tutorial series',t:'Yesterday'},{from:'me',text:'YES do it! I\'d collab on that',t:'Yesterday'},{from:'them',text:'Can we collab on a JS series?',t:'Yesterday'}
      ]}
    ];

    const notifsAll = [
      { avatar:'AC', color:'#EF4444', text:'<b>ava.chen</b> liked your post "Building something big..."', time:'2m ago', unread:true },
      { avatar:'MK', color:'#0D9488', text:'<b>marcus.kim</b> started following you', time:'5m ago', unread:true },
      { avatar:'ðŸ‘¥', color:'#0F766E', text:'<b>3 people</b> liked your photo', time:'12m ago', unread:true },
      { avatar:'JB', color:'#0F766E', text:'<b>jordan.blake</b> commented: "This is incredible work, Tim!"', time:'28m ago', unread:false },
      { avatar:'SR', color:'#F59E0B', text:'<b>sofia_reyes</b> reposted your post', time:'1h ago', unread:false },
      { avatar:'PP', color:'#D97706', text:'<b>priya.dev</b> commented: "So true! I switched to breakpoints last year..."', time:'2h ago', unread:false },
      { avatar:'ðŸ‘¤', color:'#0D9488', text:'<b>5 new followers</b> this week', time:'3h ago', unread:false },
      { avatar:'LT', color:'#F59E0B', text:'<b>leo.torres</b> liked your post', time:'4h ago', unread:false },
      { avatar:'ðŸ”¥', color:'#D97706', text:'<b>Trending alert:</b> Your post is in #WebDev top 10!', time:'6h ago', unread:false, special:true },
      { avatar:'ðŸŽ‰', color:'#0D9488', text:'<b>Milestone:</b> Your post reached 10K impressions!', time:'8h ago', unread:false, special:true },
    ];
    const notifsMentions = [
      { avatar:'AC', color:'#EF4444', text:'<b>ava.chen</b> mentioned you: "@timrollings this is the collab we need!"', time:'15m ago', unread:true },
      { avatar:'MK', color:'#0D9488', text:'<b>marcus.kim</b> mentioned you: "cc @timrollings on this design take"', time:'1h ago', unread:false },
      { avatar:'JB', color:'#0F766E', text:'<b>jordan.blake</b> mentioned you: "Inspired by @timrollings\' recent thread ðŸ™Œ"', time:'3h ago', unread:false },
      { avatar:'SR', color:'#F59E0B', text:'<b>sofia_reyes</b> mentioned you: "@timrollings you need to visit Lisbon!"', time:'1d ago', unread:false },
    ];
    const notifsFollows = [
      { avatar:'EW', color:'#D97706', text:'<b>emma.walsh</b> started following you', time:'10m ago', unread:true },
      { avatar:'LT', color:'#F59E0B', text:'<b>leo.torres</b> started following you', time:'1h ago', unread:false },
      { avatar:'PP', color:'#D97706', text:'<b>priya.dev</b> started following you', time:'3h ago', unread:false },
      { avatar:'ðŸ‘¥', color:'#0D9488', text:'<b>5 new followers</b> from #DesignWeek2026', time:'6h ago', unread:false },
      { avatar:'ðŸ†', color:'#F59E0B', text:'<b>Your follower count hit 48,700!</b> Milestone unlocked', time:'1d ago', unread:false, special:true },
    ];

    const reelsData = [
      { uid:'ava', caption:'Design systems that actually make sense ðŸŽ¨ #design #ux #figma', bg:'linear-gradient(180deg,#0d9488,#134e4a)', sound:'Golden Hour Remix', artist:'DJ Teal', likes:24300, comments:891, bookmarks:2100, commentList:[{uid:'marcus',text:'Your workflow is insane ðŸ”¥'},{uid:'jordan',text:'Need this tutorial!'},{uid:'tim',text:'Design goals honestly'},{uid:'sofia',text:'So clean!'}] },
      { uid:'marcus', caption:'Dark mode or light mode? I think we all know the answer ðŸŒ™ #productivity #devlife', bg:'linear-gradient(180deg,#1a1a2e,#16213e)', sound:'Lo-Fi Study Vibes', artist:'StudyBeats', likes:18700, comments:1200, bookmarks:3400, commentList:[{uid:'ava',text:'Dark mode forever!'},{uid:'priya',text:'Light mode gang ðŸ˜…'},{uid:'tim',text:'Dark mode supremacy'},{uid:'jordan',text:'Both have their place tbh'}] },
      { uid:'sofia', caption:'Lisbon golden hour ðŸ‡µðŸ‡¹âœ¨ Day 14 of 21. This city has my whole heart #travel #lisbon', bg:'linear-gradient(180deg,#f59e0b,#ef4444)', sound:'Midnight Groove', artist:'NightVibe', likes:52100, comments:3200, bookmarks:8700, commentList:[{uid:'ava',text:'GORGEOUS ðŸ˜'},{uid:'tim',text:'Adding to my bucket list!'},{uid:'emma',text:'The colors!!!'},{uid:'leo',text:'Living the dream'}] },
      { uid:'jordan', caption:'18 months of solo dev in 60 seconds. The highs, the lows, the launch ðŸŽ® #indiedev #gamedev', bg:'linear-gradient(180deg,#1e1b4b,#4c1d95)', sound:'Morning Motivation', artist:'RiseUp', likes:89400, comments:7800, bookmarks:12300, commentList:[{uid:'marcus',text:'INSANE dedication'},{uid:'ava',text:'So proud of you!!'},{uid:'priya',text:'This gives me chills'},{uid:'tim',text:'Legendary ðŸ†'}] },
      { uid:'tim', caption:'Building Legacy Media from zero ðŸš€ This is what 10 years in creative direction looks like. #creative #legacy #brand', bg:'linear-gradient(180deg,#0d9488,#d97706)', sound:'Legacy Beat', artist:'TimR', likes:41200, comments:2900, bookmarks:6100, commentList:[{uid:'ava',text:'Inspiration!!'},{uid:'jordan',text:'Goals ðŸŽ¯'},{uid:'sofia',text:'Amazing journey Tim!'},{uid:'marcus',text:'The GOAT ðŸ'}] }
    ];

    const chartDataSets = {
      followers: { label:'Followers over 12 months', data:[38000,39200,40100,41800,42500,43900,44700,45200,46100,47300,48100,48700], fmt:v=>(v/1e3).toFixed(1)+'K' },
      impressions: { label:'Monthly impressions', data:[820000,940000,1100000,1300000,1400000,1600000,1700000,1800000,1900000,2000000,2050000,2100000], fmt:v=>v>=1e6?(v/1e6).toFixed(1)+'M':(v/1e3).toFixed(0)+'K' },
      reach: { label:'Monthly reach', data:[310000,350000,410000,470000,510000,580000,620000,670000,730000,790000,830000,870000], fmt:v=>(v/1e3).toFixed(0)+'K' },
      engagement: { label:'Engagement rate', data:[4.1,4.5,4.9,5.3,5.6,5.9,6.1,6.3,6.5,6.7,6.75,6.8], fmt:v=>v.toFixed(1)+'%' }
    };
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // === STATE ===
    let currentView = 'home';
    let activeConv = 0;
    let currentStoryIdx = 0;
    let storyTimer = null;
    let isScheduleMode = false, isPollMode = false, isImageMode = false;
    let vcallInterval = null, vcallSecs = 0;
    let activeChartTab = 'followers';
    let activeNotifTab = 'all';
    let activeProfileTab = 'posts';
    let sessionBookmarks = [];

    // === VIEW SWITCHING ===
    function showView(id) {
      currentView = id;
      document.getElementById('mobile-more-drawer').style.display = 'none';
      document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
      const target = document.getElementById('view-'+id);
      if (target) { target.style.display = 'block'; target.classList.remove('view-enter'); void target.offsetWidth; target.classList.add('view-enter'); }
      document.querySelectorAll('#desktop-nav .nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === id));
      document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === id));
      if (id === 'home') renderHome();
      if (id === 'explore') renderExplore();
      if (id === 'notifications') renderNotifications();
      if (id === 'messages') renderMessages();
      if (id === 'reels') renderReels();
      if (id === 'analytics') renderAnalytics();
      if (id === 'profile') renderProfile();
      window.scrollTo(0, 0);
    }

    document.querySelectorAll('#desktop-nav .nav-item').forEach(item => item.addEventListener('click', function() { if (this.dataset.view) showView(this.dataset.view); }));
    document.querySelectorAll('.mobile-nav-item').forEach(item => item.addEventListener('click', function() {
      if (this.dataset.view === 'more') { const d = document.getElementById('mobile-more-drawer'); d.style.display = d.style.display === 'none' || !d.style.display ? 'block' : 'none'; return; }
      if (this.dataset.view) showView(this.dataset.view);
    }));
    document.getElementById('drawer-profile').addEventListener('click', () => showView('profile'));
    document.getElementById('drawer-analytics').addEventListener('click', () => showView('analytics'));
    document.getElementById('drawer-messages').addEventListener('click', () => showView('messages'));
    document.getElementById('mob-bell-btn').addEventListener('click', () => showView('notifications'));
    document.getElementById('mob-dm-btn').addEventListener('click', () => showView('messages'));

    // === AVATAR HELPER ===
    function avatar(u, size=42) {
      return `<div style="width:${size}px;height:${size}px;border-radius:999px;background:${u.color};display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${Math.round(size*.33)}px;flex-shrink:0;">${u.initials}</div>`;
    }
    function verifiedBadge(u) { return u.verified ? ' <span style="color:#F59E0B;">âœ“</span>' : ''; }

    // ========== HOME ==========
    function renderHome() {
      renderStories();
      renderPosts();
    }
    function renderStories() {
      const bar = document.getElementById('stories-bar');
      bar.innerHTML = `<div class="story-ring" data-story="you" style="flex-shrink:0;text-align:center;cursor:pointer;">
        <div style="width:64px;height:64px;border-radius:999px;background:var(--input);display:flex;align-items:center;justify-content:center;border:2px dashed var(--border);"><i data-lucide="plus" class="w-5 h-5" style="color:var(--muted);"></i></div>
        <div style="font-size:11px;margin-top:6px;color:var(--muted);">Your Story</div>
      </div>`;
      storyData.forEach(s => {
        bar.innerHTML += `<div class="story-ring" data-story="${s.key}" style="flex-shrink:0;text-align:center;cursor:pointer;">
          <div style="width:64px;height:64px;background:var(--gradient);padding:2.5px;border-radius:999px;"><div style="background:var(--bg);border-radius:999px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><span style="font-weight:700;font-size:16px;">${s.initials}</span></div></div>
          <div style="font-size:11px;margin-top:6px;">${s.name.split(' ')[0]}</div>
        </div>`;
      });
      RI();
      bar.querySelectorAll('.story-ring').forEach(r => r.addEventListener('click', function() {
        if (this.dataset.story === 'you') { openCreateModal(); return; }
        openStory(this.dataset.story);
      }));
    }

    function renderPosts() {
      const feed = document.getElementById('posts-feed');
      feed.innerHTML = '';
      postsData.forEach((post, idx) => {
        feed.appendChild(createPostCard(post, idx));
      });
      RI();
      bindPostEvents();
    }

    function createPostCard(post, idx) {
      const u = users[post.uid];
      const div = document.createElement('div');
      div.className = 'card';
      div.style.padding = '16px';
      let pollHtml = '';
      if (post.poll) {
        const p = post.poll;
        pollHtml = `<div class="poll-widget" data-pidx="${idx}" style="margin-bottom:12px;">
          ${p.options.map((opt,oi) => `<div class="poll-option ${p.voted?'voted':''}" data-pidx="${idx}" data-oidx="${oi}" style="margin-bottom:6px;">
            ${p.voted ? `<div class="poll-bar" style="width:${opt.pct}%;background:${p.selectedIdx===oi?'rgba(13,148,136,.2)':'rgba(13,148,136,.08)'};"></div>` : ''}
            <span style="display:flex;justify-content:space-between;align-items:center;font-size:14px;"><span>${p.voted&&p.selectedIdx===oi?'âœ” ':''}${opt.text}</span>${p.voted?`<span style="font-weight:600;">${opt.pct}%</span>`:''}</span>
          </div>`).join('')}
          <div style="font-size:12px;color:var(--muted);margin-top:6px;">${fmtNum(p.totalVotes)} votes Â· ${p.timeLeft}${p.voted?' Â· You voted':''}</div>
        </div>`;
      }
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          ${avatar(u)}
          <div style="flex:1;min-width:0;"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><span style="font-weight:700;font-size:14px;">${u.name}${verifiedBadge(u)}</span><span style="color:var(--muted);font-size:13px;">${u.handle}</span><span style="color:var(--muted);font-size:12px;">Â· ${post.time}</span></div></div>
          <div style="position:relative;"><button class="post-menu-btn" data-pidx="${idx}" style="background:none;border:none;cursor:pointer;color:var(--muted);padding:6px;"><i data-lucide="more-horizontal" class="w-5 h-5"></i></button>
          <div class="dropdown-menu" id="menu-${idx}"><div class="dropdown-item post-menu-action" data-action="copy" data-pidx="${idx}"><i data-lucide="link" class="w-4 h-4"></i> Copy Link</div><div class="dropdown-item post-menu-action" data-action="not-interested" data-pidx="${idx}"><i data-lucide="eye-off" class="w-4 h-4"></i> Not Interested</div><div class="dropdown-item post-menu-action" data-action="report" data-pidx="${idx}"><i data-lucide="flag" class="w-4 h-4"></i> Report</div></div></div>
        </div>
        <p style="font-size:15px;line-height:1.6;margin-bottom:12px;">${post.text}</p>
        ${post.image ? `<div style="width:100%;aspect-ratio:16/9;border-radius:12px;background:${post.image};margin-bottom:12px;"></div>` : ''}
        ${pollHtml}
        <div style="display:flex;align-items:center;gap:2px;border-top:1px solid var(--border);padding-top:10px;">
          <button class="post-like-btn" data-pidx="${idx}" style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:500;color:${post.liked?'#EF4444':'var(--muted)'};min-width:44px;min-height:44px;"><i data-lucide="heart" class="w-5 h-5" ${post.liked?'style="fill:#EF4444;color:#EF4444;"':''}></i> ${fmtNum(post.likes)}</button>
          <button class="post-comment-btn" data-pidx="${idx}" style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:500;color:var(--muted);min-width:44px;min-height:44px;"><i data-lucide="message-circle" class="w-5 h-5"></i> ${fmtNum(post.comments)}</button>
          <button class="post-repost-btn" data-pidx="${idx}" style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:500;color:${post.reposted?'#0D9488':'var(--muted)'};min-width:44px;min-height:44px;"><i data-lucide="repeat-2" class="w-5 h-5"></i> ${fmtNum(post.reposts)}</button>
          <button class="post-bookmark-btn" data-pidx="${idx}" style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:500;color:${post.bookmarked?'#D97706':'var(--muted)'};min-width:44px;min-height:44px;"><i data-lucide="bookmark" class="w-5 h-5" ${post.bookmarked?'style="fill:#D97706;color:#D97706;"':''}></i></button>
          <button class="post-share-btn" data-pidx="${idx}" style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:8px;font-size:13px;color:var(--muted);margin-left:auto;min-width:44px;min-height:44px;"><i data-lucide="share" class="w-5 h-5"></i></button>
        </div>
        <div class="comment-section" data-pidx="${idx}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
          <div class="comments-list" style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px;">
            ${post.commentList.map(c => { const cu = users[c.uid]; return `<div style="display:flex;gap:8px;">${avatar(cu,28)}<div><div style="font-size:13px;"><b>${cu.name}</b> <span style="color:var(--muted);font-size:11px;">Â· ${c.time}</span></div><div style="font-size:13px;margin-top:2px;">${c.text}</div></div></div>`; }).join('')}
          </div>
          <div style="display:flex;gap:8px;"><input class="comment-input" data-pidx="${idx}" type="text" placeholder="Write a comment..." style="flex:1;padding:8px 14px;border-radius:999px;font-size:13px;"><button class="comment-submit" data-pidx="${idx}" style="background:var(--gradient);border:none;border-radius:999px;padding:8px 16px;color:white;font-size:13px;font-weight:600;cursor:pointer;">Post</button></div>
        </div>`;
      return div;
    }

    function bindPostEvents() {
      document.querySelectorAll('.post-like-btn').forEach(b => b.addEventListener('click', function() {
        const i = +this.dataset.pidx; postsData[i].liked = !postsData[i].liked; postsData[i].likes += postsData[i].liked ? 1 : -1;
        this.classList.add('heart-burst'); setTimeout(() => this.classList.remove('heart-burst'), 350); renderPosts();
      }));
      document.querySelectorAll('.post-comment-btn').forEach(b => b.addEventListener('click', function() {
        const s = document.querySelector(`.comment-section[data-pidx="${this.dataset.pidx}"]`);
        s.style.display = s.style.display === 'none' ? 'block' : 'none';
      }));
      document.querySelectorAll('.post-repost-btn').forEach(b => b.addEventListener('click', function() {
        const i = +this.dataset.pidx; postsData[i].reposted = !postsData[i].reposted; postsData[i].reposts += postsData[i].reposted ? 1 : -1; renderPosts();
      }));
      document.querySelectorAll('.post-bookmark-btn').forEach(b => b.addEventListener('click', function() {
        const i = +this.dataset.pidx; postsData[i].bookmarked = !postsData[i].bookmarked;
        if (postsData[i].bookmarked && !sessionBookmarks.includes(i)) sessionBookmarks.push(i);
        else sessionBookmarks = sessionBookmarks.filter(x => x !== i);
        renderPosts();
      }));
      document.querySelectorAll('.post-share-btn').forEach(b => b.addEventListener('click', () => showToast('ðŸ“¤ Link copied!','Post link copied to clipboard','#0D9488')));
      document.querySelectorAll('.comment-submit').forEach(b => b.addEventListener('click', function() {
        const i = +this.dataset.pidx; const input = document.querySelector(`.comment-input[data-pidx="${i}"]`);
        const text = input.value.trim(); if (!text) return;
        postsData[i].commentList.push({uid:'tim',text,time:'Just now'}); postsData[i].comments++; input.value = '';
        renderPosts(); document.querySelector(`.comment-section[data-pidx="${i}"]`).style.display = 'block';
      }));
      document.querySelectorAll('.comment-input').forEach(inp => inp.addEventListener('keydown', function(e) { if (e.key==='Enter') document.querySelector(`.comment-submit[data-pidx="${this.dataset.pidx}"]`).click(); }));
      document.querySelectorAll('.poll-option:not(.voted)').forEach(o => o.addEventListener('click', function() {
        const pi = +this.dataset.pidx, oi = +this.dataset.oidx;
        if (!postsData[pi].poll || postsData[pi].poll.voted) return;
        postsData[pi].poll.voted = true; postsData[pi].poll.selectedIdx = oi; renderPosts();
      }));
      document.querySelectorAll('.post-menu-btn').forEach(b => b.addEventListener('click', function(e) {
        e.stopPropagation(); const m = document.getElementById('menu-'+this.dataset.pidx);
        document.querySelectorAll('.dropdown-menu').forEach(d => { if(d!==m) d.classList.remove('show'); });
        m.classList.toggle('show');
      }));
      document.querySelectorAll('.post-menu-action').forEach(a => a.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action==='copy') showToast('ðŸ”— Link copied!','Post link copied to clipboard','#0D9488');
        else if (action==='not-interested') showToast('ðŸ‘ï¸ Got it','We\'ll show you less of this','var(--muted)');
        else if (action==='report') showToast('ðŸš© Reported','Thanks for keeping Nexus safe','#EF4444');
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
      }));
    }
    document.addEventListener('click', () => document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show')));

    document.getElementById('load-more-btn').addEventListener('click', function() {
      this.textContent = 'Loading...'; this.style.opacity = '.5';
      setTimeout(() => {
        const extra = [
          { id:100, uid:'emma', time:'2d ago', text:'Coffee art is an underrated skill. Fight me â˜•ðŸŽ¨', image:null, likes:1820, comments:94, reposts:312, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'ava',text:'I could never!',time:'1d ago'},{uid:'leo',text:'Facts!',time:'1d ago'},{uid:'marcus',text:'Cappuccino art hits different',time:'1d ago'}] },
          { id:101, uid:'marcus', time:'3d ago', text:'Just hit 50K followers. Still processing. Thank you all ðŸ™', image:'linear-gradient(135deg,#0D9488,#134E4A)', likes:9200, comments:430, reposts:1500, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'ava',text:'CONGRATS!! ðŸŽ‰',time:'2d ago'},{uid:'jordan',text:'Well deserved!!',time:'2d ago'},{uid:'tim',text:'Legend!',time:'2d ago'}] },
          { id:102, uid:'ava', time:'4d ago', text:'Design tip: White space isn\'t empty space. It\'s breathing room for your content. ðŸ’¨âœ¨', image:null, likes:4100, comments:210, reposts:890, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[{uid:'priya',text:'Preach! ðŸ™Œ',time:'3d ago'},{uid:'sofia',text:'This!',time:'3d ago'},{uid:'tim',text:'Saving this forever',time:'3d ago'}] }
        ];
        extra.forEach(p => postsData.push(p));
        this.textContent = 'No more posts'; this.style.cursor = 'default';
        renderPosts();
      }, 600);
    });

    // ========== EXPLORE ==========
    function renderExplore() {
      const c = document.getElementById('explore-content');
      const tags = [
        {tag:'#AIRevolution',cat:'Technology',catColor:'#0D9488',count:'142K posts'},
        {tag:'#DesignWeek2026',cat:'Design',catColor:'#D97706',count:'89K posts'},
        {tag:'#IndieGame',cat:'Gaming',catColor:'#0D9488',count:'67K posts'},
        {tag:'#LisbonVibes',cat:'Travel',catColor:'#F59E0B',count:'54K posts'},
        {tag:'#WebDev',cat:'Tech',catColor:'#0F766E',count:'231K posts'},
        {tag:'#SundayMarket',cat:'Lifestyle',catColor:'#D97706',count:'28K posts'}
      ];
      const sounds = [
        {name:'Golden Hour Remix',creator:'DJ Teal',plays:'12.4K reels'},
        {name:'Lo-Fi Study Vibes',creator:'StudyBeats',plays:'9.1K reels'},
        {name:'Midnight Groove',creator:'NightVibe',plays:'7.8K reels'},
        {name:'Morning Motivation',creator:'RiseUp',plays:'5.2K reels'},
        {name:'Legacy Beat',creator:'TimR',plays:'3.9K reels'}
      ];
      const suggestUsers = [
        {uid:'ava',bio:'Senior UX Designer @Figma Â· Design Systems nerd ðŸŽ¨'},
        {uid:'marcus',bio:'Productivity hacker Â· Dark mode evangelist ðŸŒ™'},
        {uid:'sofia',bio:'Travel photographer Â· 47 countries âœˆï¸'},
        {uid:'jordan',bio:'Solo indie game dev Â· Steam wishlister ðŸŽ®'}
      ];
      const tileGrads = ['#0D9488,#F59E0B','#f59e0b,#ef4444','#1e1b4b,#4c1d95','#14532d,#0d9488','#f43f5e,#f59e0b','#134e4a,#042f2e','#d97706,#f59e0b','#3b82f6,#1e1b4b','#0d9488,#059669'];

      c.innerHTML = `
        <div style="position:relative;margin-bottom:24px;">
          <i data-lucide="search" class="w-5 h-5" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);"></i>
          <input id="explore-search" type="text" placeholder="Search topics, people, tags..." style="width:100%;padding:12px 16px 12px 42px;border-radius:999px;font-size:15px;">
        </div>
        <h2 style="font-weight:700;font-size:20px;margin-bottom:16px;">ðŸ”¥ Trending Now</h2>
        <div id="trending-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px;">
          ${tags.map(t => `<div class="card explore-filterable" data-text="${t.tag} ${t.cat}" style="padding:16px;cursor:pointer;transition:all .15s;border-radius:14px;" data-tag="${t.tag}"><div style="font-size:12px;color:${t.catColor};font-weight:600;margin-bottom:4px;">${t.cat}</div><div style="font-weight:700;font-size:16px;">${t.tag}</div><div style="font-size:12px;color:var(--muted);margin-top:4px;">${t.count}</div></div>`).join('')}
        </div>
        <h2 style="font-weight:700;font-size:20px;margin-bottom:16px;">ðŸŽµ Trending Sounds</h2>
        <div class="no-scrollbar" style="display:flex;gap:14px;overflow-x:auto;padding:4px 0;margin-bottom:28px;">
          ${sounds.map(s => `<div class="sound-card explore-filterable" data-text="${s.name} ${s.creator}" style="flex-shrink:0;width:140px;text-align:center;cursor:pointer;">
            <div style="width:72px;height:72px;margin:0 auto 8px;border-radius:999px;background:conic-gradient(#0D9488,#F59E0B,#0D9488);padding:3px;"><div style="width:100%;height:100%;border-radius:999px;background:var(--card);display:flex;align-items:center;justify-content:center;"><i data-lucide="music" class="w-5 h-5" style="color:#0D9488;"></i></div></div>
            <div style="font-size:13px;font-weight:600;">${s.name}</div><div style="font-size:11px;color:var(--muted);">${s.creator} Â· ${s.plays}</div>
            <button class="play-sound-btn btn-gradient" data-sound="${s.name}" data-creator="${s.creator}" style="margin-top:6px;padding:4px 14px;font-size:11px;">â–¶ Play</button>
          </div>`).join('')}
        </div>
        <h2 style="font-weight:700;font-size:20px;margin-bottom:16px;">Suggested Accounts</h2>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px;" id="explore-suggest">
          ${suggestUsers.map(s => { const u = users[s.uid]; return `<div class="card explore-filterable" data-text="${u.name} ${u.handle} ${s.bio}" style="padding:14px;display:flex;align-items:center;gap:12px;">${avatar(u,44)}<div style="flex:1;min-width:0;"><div style="font-weight:600;font-size:14px;">${u.name}</div><div style="font-size:12px;color:var(--muted);">${u.handle} Â· ${s.bio}</div></div><button class="follow-btn explore-follow-btn">Follow</button></div>`; }).join('')}
        </div>
        <h2 style="font-weight:700;font-size:20px;margin-bottom:16px;">Popular Posts</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;" id="explore-grid">
          ${tileGrads.map((g,i) => `<div class="explore-tile" data-tile="${i}" style="aspect-ratio:1;border-radius:14px;background:linear-gradient(135deg,${g});cursor:pointer;position:relative;overflow:hidden;transition:transform .15s,box-shadow .15s;">
            <div style="position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center;gap:12px;color:white;font-size:13px;font-weight:600;border-radius:14px;" class="tile-overlay"><span>â¤ï¸ ${fmtNum(Math.floor(Math.random()*5000+500))}</span><span>ðŸ’¬ ${Math.floor(Math.random()*200+20)}</span></div>
          </div>`).join('')}
        </div>`;
      RI();
      // Search
      c.querySelector('#explore-search').addEventListener('input', function() {
        const q = this.value.toLowerCase();
        c.querySelectorAll('.explore-filterable').forEach(el => {
          el.style.display = !q || el.dataset.text.toLowerCase().includes(q) ? '' : 'none';
        });
      });
      // Follow buttons
      c.querySelectorAll('.explore-follow-btn').forEach(b => b.addEventListener('click', function() { this.classList.toggle('following'); this.textContent = this.classList.contains('following') ? 'Following' : 'Follow'; }));
      // Sound play
      c.querySelectorAll('.play-sound-btn').forEach(b => b.addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('mini-sound-name').textContent = this.dataset.sound;
        document.getElementById('mini-sound-creator').textContent = this.dataset.creator;
        document.getElementById('mini-player').style.display = 'flex';
        document.getElementById('mini-vinyl').classList.remove('vinyl-paused');
        RI();
      }));
      // Tile hover
      c.querySelectorAll('.explore-tile').forEach(t => {
        t.addEventListener('mouseenter', function() { this.querySelector('.tile-overlay').style.opacity = '1'; this.style.transform = 'scale(1.03)'; });
        t.addEventListener('mouseleave', function() { this.querySelector('.tile-overlay').style.opacity = '0'; this.style.transform = ''; });
        t.addEventListener('click', function() {
          const bg = this.style.background;
          document.getElementById('post-detail-body').innerHTML = `<div style="width:100%;aspect-ratio:1;border-radius:12px;background:${bg};margin-bottom:16px;"></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">${avatar(users.tim,36)}<div><div style="font-weight:600;font-size:14px;">Timothy Rollings <span style="color:#F59E0B;">âœ“</span></div><div style="font-size:12px;color:var(--muted);">@timrollings</div></div></div><div style="display:flex;gap:16px;font-size:13px;color:var(--muted);"><span>â¤ï¸ ${fmtNum(Math.floor(Math.random()*5000+500))}</span><span>ðŸ’¬ ${Math.floor(Math.random()*200+20)}</span></div>`;
          document.getElementById('post-detail-modal').style.display = 'flex'; RI();
        });
      });
      // Tag click
      c.querySelectorAll('[data-tag]').forEach(t => t.addEventListener('click', function() {
        const si = c.querySelector('#explore-search'); si.value = this.dataset.tag; si.dispatchEvent(new Event('input'));
      }));
    }

    // ========== NOTIFICATIONS ==========
    function renderNotifications() {
      const c = document.getElementById('notif-content');
      c.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <h2 style="font-weight:700;font-size:20px;">Notifications</h2>
          <button id="mark-read-btn" style="background:none;border:none;cursor:pointer;color:#0D9488;font-size:13px;font-weight:600;">Mark all as read</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:20px;" id="notif-tabs">
          <button class="ntab ${activeNotifTab==='all'?'active':''}" data-ntab="all" style="padding:7px 18px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .15s;">All</button>
          <button class="ntab ${activeNotifTab==='mentions'?'active':''}" data-ntab="mentions" style="padding:7px 18px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .15s;">Mentions</button>
          <button class="ntab ${activeNotifTab==='follows'?'active':''}" data-ntab="follows" style="padding:7px 18px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .15s;">Follows</button>
        </div>
        <div id="notif-list" style="display:flex;flex-direction:column;gap:4px;"></div>
        <div style="margin-top:16px;text-align:center;">
          <button id="sim-notif-btn" class="btn-gradient" style="padding:9px 24px;font-size:13px;">Simulate Notification</button>
        </div>`;
      renderNotifList();
      c.querySelectorAll('.ntab').forEach(t => {
        if (t.classList.contains('active')) { t.style.background = 'var(--gradient)'; t.style.color = 'white'; t.style.borderColor = 'transparent'; }
        else { t.style.background = 'var(--card)'; t.style.color = 'var(--text)'; }
        t.addEventListener('click', function() {
          activeNotifTab = this.dataset.ntab;
          c.querySelectorAll('.ntab').forEach(x => { x.classList.remove('active'); x.style.background='var(--card)'; x.style.color='var(--text)'; x.style.borderColor='var(--border)'; });
          this.classList.add('active'); this.style.background='var(--gradient)'; this.style.color='white'; this.style.borderColor='transparent';
          renderNotifList();
        });
      });
      c.querySelector('#mark-read-btn').addEventListener('click', () => {
        [notifsAll,notifsMentions,notifsFollows].forEach(arr => arr.forEach(n => n.unread=false));
        renderNotifList();
        document.querySelectorAll('.notif-badge,.notif-badge-mob').forEach(b => b.style.display='none');
      });
      c.querySelector('#sim-notif-btn').addEventListener('click', () => {
        const msgs = [{t:'ðŸŽ‰ New follower!',s:'Someone just followed you'},{t:'ðŸ’¬ New comment',s:'Check it out!'},{t:'ðŸ”¥ Going viral!',s:'1.2K new views'}];
        const m = msgs[Math.floor(Math.random()*msgs.length)];
        showToast(m.t, m.s, '#0D9488');
      });
    }
    function renderNotifList() {
      const list = document.getElementById('notif-list');
      if (!list) return;
      const data = activeNotifTab==='all'?notifsAll:activeNotifTab==='mentions'?notifsMentions:notifsFollows;
      list.innerHTML = data.map(n => {
        const isEmoji = /[\u{1F000}-\u{1FFFF}]/u.test(n.avatar);
        return `<div class="card ${n.unread?'notif-unread':''}" style="padding:14px 16px;display:flex;align-items:center;gap:12px;border-radius:12px;${n.special?'border-left:3px solid #F59E0B;background:rgba(245,158,11,.06);':''}">
          <div style="width:40px;height:40px;border-radius:999px;background:${n.color};display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${isEmoji?'18px':'12px'};flex-shrink:0;">${n.avatar}</div>
          <div style="flex:1;min-width:0;"><div style="font-size:14px;line-height:1.5;">${n.text}</div><div style="font-size:12px;color:var(--muted);margin-top:2px;">${n.time}</div></div>
        </div>`;
      }).join('');
    }

    // ========== MESSAGES ==========
    function renderMessages() {
      const c = document.getElementById('messages-content');
      c.innerHTML = `
        <h2 style="font-weight:700;font-size:20px;margin-bottom:16px;">Messages</h2>
        <div style="display:flex;gap:0;border:1px solid var(--border);border-radius:16px;overflow:hidden;min-height:500px;background:var(--card);">
          <div id="msg-list" style="width:100%;max-width:220px;border-right:1px solid var(--border);overflow-y:auto;"></div>
          <div style="flex:1;display:flex;flex-direction:column;" id="msg-chat">
            <div id="msg-header" style="padding:14px 16px;border-bottom:1px solid var(--border);font-weight:600;font-size:15px;display:flex;align-items:center;gap:10px;"></div>
            <div id="msg-thread" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:320px;"></div>
            <div style="padding:12px;border-top:1px solid var(--border);display:flex;gap:8px;">
              <input id="msg-input" type="text" placeholder="Type a message..." style="flex:1;padding:10px 14px;border-radius:999px;font-size:14px;">
              <button id="msg-send" style="background:var(--gradient);border:none;border-radius:999px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;"><i data-lucide="send" class="w-4 h-4" style="color:white;"></i></button>
            </div>
          </div>
        </div>`;
      renderConvList();
      renderChat();
      c.querySelector('#msg-send').addEventListener('click', sendMsg);
      c.querySelector('#msg-input').addEventListener('keydown', e => { if(e.key==='Enter') sendMsg(); });
    }
    function renderConvList() {
      const list = document.getElementById('msg-list');
      if (!list) return;
      list.innerHTML = conversations.map((conv,i) => {
        const u = users[conv.uid];
        return `<div class="msg-conv" data-cidx="${i}" style="padding:12px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:background .15s;${i===activeConv?'background:var(--hover);border-left:3px solid #0D9488;':''}">
          ${avatar(u,38)}
          <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.name}</div><div style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${conv.lastMsg}</div></div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;"><span style="font-size:11px;color:var(--muted);">${conv.time}</span>${conv.unread?`<span style="width:18px;height:18px;border-radius:999px;background:#0D9488;color:white;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">${conv.unread}</span>`:''}</div>
        </div>`;
      }).join('');
      list.querySelectorAll('.msg-conv').forEach(el => el.addEventListener('click', function() {
        activeConv = +this.dataset.cidx; conversations[activeConv].unread = 0; renderConvList(); renderChat();
      }));
    }
    function renderChat() {
      const conv = conversations[activeConv];
      const u = users[conv.uid];
      const header = document.getElementById('msg-header');
      if (!header) return;
      header.innerHTML = `${avatar(u,32)}<div style="flex:1;"><div style="font-size:14px;font-weight:600;">${u.name}</div><div style="font-size:11px;color:var(--muted);">${u.handle}</div></div><button id="vcall-start" style="background:none;border:none;cursor:pointer;color:#0D9488;padding:8px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;"><i data-lucide="video" class="w-5 h-5"></i></button>`;
      const thread = document.getElementById('msg-thread');
      thread.innerHTML = conv.messages.map(m => `<div class="${m.from==='me'?'msg-sent':'msg-received'}">${m.text}<div style="font-size:10px;opacity:.6;margin-top:4px;text-align:${m.from==='me'?'right':'left'};">${m.t}</div></div>`).join('');
      thread.scrollTop = thread.scrollHeight;
      RI();
      header.querySelector('#vcall-start').addEventListener('click', () => openVideoCall(u));
    }
    function sendMsg() {
      const input = document.getElementById('msg-input');
      const text = input.value.trim(); if (!text) return;
      conversations[activeConv].messages.push({from:'me',text,t:'Just now'});
      conversations[activeConv].lastMsg = text; conversations[activeConv].time = 'now';
      input.value = ''; renderConvList(); renderChat();
    }

    // ========== REELS ==========
    function renderReels() {
      const c = document.getElementById('reels-content');
      const vh = window.innerHeight - 60;
      c.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;"><h2 style="font-weight:700;font-size:20px;">ðŸŽ¬ Reels</h2></div>
        <div class="reels-container" style="height:${vh}px;">
          ${reelsData.map((reel,i) => {
            const u = users[reel.uid];
            return `<div class="reel-card" style="height:${vh}px;background:${reel.bg};" data-ridx="${i}">
              <button class="reel-play-toggle" data-ridx="${i}" style="position:absolute;inset:0;z-index:2;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                <div class="reel-play-icon" data-ridx="${i}" style="width:64px;height:64px;border-radius:999px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);opacity:0;transition:opacity .2s;"><i data-lucide="play" class="w-8 h-8" style="color:white;"></i></div>
              </button>
              <div style="position:absolute;right:12px;bottom:140px;display:flex;flex-direction:column;gap:16px;z-index:3;">
                <div class="reel-like" data-ridx="${i}" style="text-align:center;cursor:pointer;"><i data-lucide="heart" class="w-7 h-7" style="color:white;"></i><div style="font-size:11px;color:white;margin-top:2px;" class="reel-like-count">${fmtNum(reel.likes)}</div></div>
                <div class="reel-comment-toggle" data-ridx="${i}" style="text-align:center;cursor:pointer;"><i data-lucide="message-circle" class="w-7 h-7" style="color:white;"></i><div style="font-size:11px;color:white;margin-top:2px;">${fmtNum(reel.comments)}</div></div>
                <div style="text-align:center;cursor:pointer;"><i data-lucide="share" class="w-7 h-7" style="color:white;"></i></div>
                <div class="reel-bookmark" data-ridx="${i}" style="text-align:center;cursor:pointer;"><i data-lucide="bookmark" class="w-7 h-7" style="color:white;"></i><div style="font-size:11px;color:white;margin-top:2px;">${fmtNum(reel.bookmarks)}</div></div>
              </div>
              <div style="position:absolute;left:12px;bottom:80px;z-index:3;max-width:70%;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">${avatar(u,36)}<span style="color:white;font-weight:700;font-size:14px;">${u.name}${verifiedBadge(u)}</span></div>
                <div style="color:white;font-size:13px;line-height:1.4;">${reel.caption}</div>
              </div>
              <div style="position:absolute;bottom:16px;left:12px;right:60px;z-index:3;">
                <div class="reel-sound-btn" data-sound="${reel.sound}" data-creator="${reel.artist}" style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.3);border-radius:999px;padding:6px 12px;cursor:pointer;">
                  <div style="width:24px;height:24px;border-radius:999px;background:conic-gradient(#F59E0B,#0D9488,#F59E0B);padding:2px;flex-shrink:0;"><div class="vinyl-spin" style="width:100%;height:100%;border-radius:999px;background:#333;"></div></div>
                  <div style="font-size:11px;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">ðŸŽµ ${reel.sound} Â· ${reel.artist}</div>
                </div>
              </div>
              <div class="comment-drawer" id="reel-comments-${i}">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><h4 style="font-weight:700;">Comments</h4><button class="reel-comment-close" data-ridx="${i}" style="background:none;border:none;cursor:pointer;color:var(--muted);"><i data-lucide="x" class="w-5 h-5"></i></button></div>
                <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px;">
                  ${reel.commentList.map(rc => { const ru = users[rc.uid]; return `<div style="display:flex;gap:8px;">${avatar(ru,28)}<div><b style="font-size:12px;">${ru.name}</b><div style="font-size:13px;">${rc.text}</div></div></div>`; }).join('')}
                </div>
                <div style="display:flex;gap:8px;"><input class="reel-comment-input" data-ridx="${i}" type="text" placeholder="Add a comment..." style="flex:1;padding:8px 14px;border-radius:999px;font-size:13px;"><button class="reel-comment-send" data-ridx="${i}" style="background:var(--gradient);border:none;border-radius:999px;padding:8px 16px;color:white;font-size:13px;font-weight:600;cursor:pointer;">Post</button></div>
              </div>
            </div>`;
          }).join('')}
        </div>`;
      RI();
      // Bind reel events
      c.querySelectorAll('.reel-play-toggle').forEach(b => b.addEventListener('click', function() {
        const icon = c.querySelector(`.reel-play-icon[data-ridx="${this.dataset.ridx}"]`);
        icon.style.opacity = icon.style.opacity === '1' ? '0' : '1';
      }));
      c.querySelectorAll('.reel-like').forEach(b => b.addEventListener('click', function() {
        const i = +this.dataset.ridx;
        const heart = this.querySelector('i');
        const isLiked = heart.style.fill === 'rgb(239, 68, 68)';
        if (isLiked) { heart.style.fill = ''; heart.style.color = 'white'; reelsData[i].likes--; }
        else { heart.style.fill = '#EF4444'; heart.style.color = '#EF4444'; reelsData[i].likes++; }
        this.querySelector('.reel-like-count').textContent = fmtNum(reelsData[i].likes);
        this.classList.add('heart-burst'); setTimeout(() => this.classList.remove('heart-burst'), 350);
      }));
      c.querySelectorAll('.reel-comment-toggle').forEach(b => b.addEventListener('click', function() {
        document.getElementById('reel-comments-'+this.dataset.ridx).classList.add('open');
      }));
      c.querySelectorAll('.reel-comment-close').forEach(b => b.addEventListener('click', function() {
        document.getElementById('reel-comments-'+this.dataset.ridx).classList.remove('open');
      }));
      c.querySelectorAll('.reel-bookmark').forEach(b => b.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const isB = icon.style.fill === 'rgb(217, 119, 6)';
        if (isB) { icon.style.fill = ''; icon.style.color = 'white'; } else { icon.style.fill = '#D97706'; icon.style.color = '#D97706'; }
      }));
      c.querySelectorAll('.reel-sound-btn').forEach(b => b.addEventListener('click', function() {
        document.getElementById('mini-sound-name').textContent = this.dataset.sound;
        document.getElementById('mini-sound-creator').textContent = this.dataset.creator;
        document.getElementById('mini-player').style.display = 'flex'; RI();
      }));
      c.querySelectorAll('.reel-comment-send').forEach(b => b.addEventListener('click', function() {
        const i = +this.dataset.ridx;
        const inp = c.querySelector(`.reel-comment-input[data-ridx="${i}"]`);
        if (!inp.value.trim()) return;
        reelsData[i].commentList.push({uid:'tim',text:inp.value.trim()});
        inp.value = ''; renderReels();
      }));
    }

    // ========== ANALYTICS ==========
    function renderAnalytics() {
      const c = document.getElementById('analytics-content');
      c.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <h2 style="font-weight:700;font-size:22px;">ðŸ“Š Creator Analytics</h2>
          <select id="analytics-range" style="padding:6px 14px;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;">
            <option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365" selected>This Year</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;" id="stat-cards">
          ${[{icon:'eye',label:'Total Reach',val:'2.1M',delta:'â†‘ 14.3%',color:'#0D9488'},{icon:'heart',label:'Engagement Rate',val:'6.8%',delta:'â†‘ 2.1%',color:'#F59E0B'},{icon:'users',label:'New Followers',val:'+3,247',delta:'â†‘ 22%',color:'#0D9488'},{icon:'dollar-sign',label:'Revenue Est.',val:'$8,420',delta:'â†‘ 31%',color:'#F59E0B'}].map(s => `
            <div class="card" style="padding:16px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><div style="width:32px;height:32px;border-radius:10px;background:${s.color}20;display:flex;align-items:center;justify-content:center;"><i data-lucide="${s.icon}" class="w-4 h-4" style="color:${s.color};"></i></div><span style="font-size:11px;color:var(--muted);">${s.label}</span></div>
              <div class="stat-val" style="font-size:24px;font-weight:800;">${s.val}</div>
              <div style="font-size:11px;color:#0D9488;font-weight:600;margin-top:4px;">${s.delta}</div>
            </div>`).join('')}
        </div>
        <div class="card" style="padding:20px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h3 style="font-weight:700;font-size:16px;">Audience Growth</h3>
            <div style="display:flex;gap:4px;" id="chart-tabs">
              ${['followers','impressions','reach','engagement'].map(t => `<button class="ctab ${t===activeChartTab?'active':''}" data-ctab="${t}" style="padding:5px 12px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .15s;">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`).join('')}
            </div>
          </div>
          <div id="chart-label" style="font-size:12px;color:var(--muted);margin-bottom:8px;"></div>
          <div style="position:relative;height:220px;" id="chart-area">
            <svg id="growth-chart" width="100%" height="100%" viewBox="0 0 600 220" preserveAspectRatio="none"></svg>
            <div id="chart-tooltip" style="display:none;position:absolute;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;pointer-events:none;z-index:5;box-shadow:0 4px 12px rgba(0,0,0,.1);"></div>
          </div>
        </div>
        <div class="card" style="padding:20px;margin-bottom:24px;">
          <h3 style="font-weight:700;font-size:16px;margin-bottom:16px;">Top Performing Posts</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${[{title:'"Building something big..."',date:'Oct 1',imp:'284K',likes:'14.2K',cmt:'1.8K',eng:'8.4%',grad:'#0D9488,#F59E0B'},{title:'"Dark mode productivity tip"',date:'Sep 28',imp:'198K',likes:'5.6K',cmt:'672',eng:'6.1%',grad:'#042F2E,#0D9488'},{title:'"Solo dev game launch!"',date:'Sep 22',imp:'412K',likes:'22.1K',cmt:'3.2K',eng:'12.3%',grad:'#0F766E,#D97706'}].map(p => `
              <div style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:12px;background:var(--input);cursor:pointer;transition:background .15s;">
                <div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,${p.grad});flex-shrink:0;"></div>
                <div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div><div style="font-size:11px;color:var(--muted);">${p.date} Â· ${p.imp} imp Â· ${p.likes} â¤ï¸ Â· ${p.cmt} ðŸ’¬ Â· <span style="color:#0D9488;font-weight:600;">${p.eng}</span></div></div>
              </div>`).join('')}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
          <div class="card" style="padding:20px;">
            <h3 style="font-weight:700;font-size:14px;margin-bottom:12px;">Age Breakdown</h3>
            <svg viewBox="0 0 120 120" width="100" height="100" style="display:block;margin:0 auto 12px;">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#0D9488" stroke-width="16" stroke-dasharray="69 245" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" stroke-width="16" stroke-dasharray="129 186" stroke-dashoffset="-69" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#D97706" stroke-width="16" stroke-dasharray="75 239" stroke-dashoffset="-198" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#6B7280" stroke-width="16" stroke-dasharray="41 274" stroke-dashoffset="-273" transform="rotate(-90 60 60)"/>
            </svg>
            <div style="font-size:11px;display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:2px;background:#0D9488;"></div>18â€“24: 22%</div>
              <div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:2px;background:#F59E0B;"></div>25â€“34: 41%</div>
              <div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:2px;background:#D97706;"></div>35â€“44: 24%</div>
              <div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:2px;background:#6B7280;"></div>45+: 13%</div>
            </div>
          </div>
          <div class="card" style="padding:20px;">
            <h3 style="font-weight:700;font-size:14px;margin-bottom:12px;">Top Locations</h3>
            ${[{loc:'Texas, USA',pct:38,c:'#0D9488'},{loc:'California, USA',pct:19,c:'#F59E0B'},{loc:'New York, USA',pct:12,c:'#0D9488'},{loc:'Atlanta, USA',pct:8,c:'#D97706'},{loc:'London, UK',pct:6,c:'#0D9488'}].map(l => `<div style="margin-bottom:6px;"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;"><span>${l.loc}</span><span style="font-weight:600;">${l.pct}%</span></div><div style="height:4px;background:var(--input);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${l.pct}%;background:${l.c};border-radius:99px;"></div></div></div>`).join('')}
          </div>
        </div>
        <div class="card" style="padding:20px;margin-bottom:24px;">
          <h3 style="font-weight:700;font-size:16px;margin-bottom:16px;">Revenue & Brand Deals</h3>
          <div style="display:flex;align-items:flex-end;gap:12px;height:120px;margin-bottom:16px;padding:0 8px;">
            ${[{v:'$3.2K',h:38,m:'May'},{v:'$4.1K',h:49,m:'Jun'},{v:'$5.0K',h:60,m:'Jul'},{v:'$6.3K',h:75,m:'Aug'},{v:'$7.1K',h:85,m:'Sep'},{v:'$8.4K',h:100,m:'Oct'}].map(b => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:10px;color:var(--muted);">${b.v}</div><div style="width:100%;background:linear-gradient(180deg,#F59E0B,#D97706);border-radius:6px 6px 0 0;height:${b.h}%;"></div><div style="font-size:10px;color:var(--muted);">${b.m}</div></div>`).join('')}
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[{brand:'Adobe Creative',type:'Sponsored Post',status:'Active',scolor:'#0D9488',val:'$2,500',grad:'#EF4444,#D97706'},{brand:'Canva Pro',type:'Ambassador',status:'Active',scolor:'#0D9488',val:'$1,800/mo',grad:'#0D9488,#F59E0B'},{brand:'Nike Digital',type:'Story Series',status:'Pending',scolor:'#D97706',val:'$3,200',grad:'#134E4A,#0D9488'}].map(d => `<div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:var(--input);font-size:13px;"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${d.grad});flex-shrink:0;"></div><div style="flex:1;min-width:0;"><div style="font-weight:600;">${d.brand}</div><div style="font-size:11px;color:var(--muted);">${d.type} Â· <span style="color:${d.scolor};">${d.status}</span></div></div><span style="font-weight:700;color:${d.scolor};">${d.val}</span></div>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button id="export-pdf" class="btn-gradient" style="flex:1;padding:10px 24px;font-size:13px;">ðŸ“¥ Download Report</button>
          <button id="share-dash" style="background:var(--card);border:1.5px solid #0D9488;border-radius:999px;padding:10px 24px;font-size:13px;font-weight:600;cursor:pointer;color:#0D9488;flex:1;">ðŸ“¤ Share Dashboard</button>
        </div>`;
      RI();
      drawChart(activeChartTab);
      c.querySelectorAll('.ctab').forEach(t => {
        if (t.classList.contains('active')) { t.style.background = 'var(--gradient)'; t.style.color = 'white'; t.style.borderColor = 'transparent'; }
        else { t.style.background = 'var(--card)'; t.style.color = 'var(--text)'; }
        t.addEventListener('click', function() {
          activeChartTab = this.dataset.ctab;
          c.querySelectorAll('.ctab').forEach(x => { x.classList.remove('active'); x.style.background='var(--card)'; x.style.color='var(--text)'; x.style.borderColor='var(--border)'; });
          this.classList.add('active'); this.style.background='var(--gradient)'; this.style.color='white'; this.style.borderColor='transparent';
          drawChart(activeChartTab);
        });
      });
      c.querySelector('#export-pdf').addEventListener('click', () => showToast('ðŸ“¥ Coming soon','PDF export is in development','#0D9488'));
      c.querySelector('#share-dash').addEventListener('click', () => showToast('ðŸ“¤ Coming soon','Dashboard sharing is in development','#0D9488'));
      // Animate stat counters
      c.querySelectorAll('.stat-val').forEach(el => { el.style.animation = 'countUp .6s ease'; });
    }

    function drawChart(tab) {
      const ds = chartDataSets[tab];
      document.getElementById('chart-label').textContent = ds.label;
      const svg = document.getElementById('growth-chart');
      const W=600, H=220, pad=35;
      const min = Math.min(...ds.data)*.95, max = Math.max(...ds.data)*1.05;
      const pts = ds.data.map((v,i) => ({
        x: pad + (i/(ds.data.length-1))*(W-pad*2),
        y: H - pad - ((v-min)/(max-min))*(H-pad*2),
        v, month: months[i]
      }));
      const pathD = pts.map((p,i) => (i===0?'M':'L')+p.x+','+p.y).join(' ');
      const fillD = pathD+` L${pts[pts.length-1].x},${H-pad} L${pts[0].x},${H-pad} Z`;
      let grid = '';
      for (let i=0;i<5;i++) { const y=pad+(i/4)*(H-pad*2); grid += `<line x1="${pad}" y1="${y}" x2="${W-pad}" y2="${y}" stroke="var(--border)" stroke-width=".5" opacity=".3"/>`; }
      // Y labels
      const yVals = [max, max-(max-min)*.25, max-(max-min)*.5, max-(max-min)*.75, min].map(v => ds.fmt(v));
      let yLabels = '';
      for (let i=0;i<5;i++) { const y=pad+(i/4)*(H-pad*2); yLabels += `<text x="${pad-4}" y="${y+4}" fill="var(--muted)" font-size="9" text-anchor="end">${yVals[i]}</text>`; }
      // X labels
      let xLabels = pts.map(p => `<text x="${p.x}" y="${H-8}" fill="var(--muted)" font-size="9" text-anchor="middle">${p.month}</text>`).join('');
      svg.innerHTML = `${grid}${yLabels}${xLabels}<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F59E0B"/><stop offset="1" stop-color="#F59E0B" stop-opacity="0"/></linearGradient></defs><path d="${fillD}" fill="url(#cg)" opacity=".15"/><path d="${pathD}" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`+pts.map((p,i) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#F59E0B" stroke="var(--card)" stroke-width="2" class="cdot" data-idx="${i}" style="cursor:pointer;"/>`).join('');
      const tooltip = document.getElementById('chart-tooltip');
      svg.querySelectorAll('.cdot').forEach(d => {
        d.addEventListener('mouseenter', function() { const i=+this.dataset.idx; const p=pts[i]; tooltip.style.display='block'; tooltip.textContent=p.month+' 2026: '+ds.fmt(p.v); tooltip.style.left=(p.x/W*100)+'%'; tooltip.style.top=(p.y-30)+'px'; });
        d.addEventListener('mouseleave', () => { tooltip.style.display='none'; });
      });
    }

    // ========== PROFILE ==========
    function renderProfile() {
      const c = document.getElementById('profile-content');
      c.innerHTML = `
        <div class="card" style="border-radius:16px;overflow:hidden;margin-top:16px;">
          <div style="height:150px;background:linear-gradient(135deg,#0D9488,#0F766E,#D97706,#F59E0B,#0D9488);position:relative;overflow:hidden;" class="animated-gradient">
            <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(245,158,11,.9);color:white;font-size:11px;font-weight:700;padding:4px 14px;border-radius:999px;">VERIFIED CREATOR âœ“</div>
            <div style="position:absolute;bottom:-40px;left:20px;">
              <div style="width:100px;height:100px;border-radius:999px;background:linear-gradient(135deg,#0D9488,#0F766E);display:flex;align-items:center;justify-content:center;color:#F59E0B;font-weight:800;font-size:34px;border:3px solid #F59E0B;">TR</div>
            </div>
          </div>
          <div style="padding:50px 20px 20px;">
            <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
              <button id="edit-profile-btn" style="border:1.5px solid var(--border);border-radius:999px;padding:7px 20px;font-size:13px;font-weight:600;cursor:pointer;background:var(--card);color:var(--text);">Edit Profile</button>
            </div>
            <h2 style="font-weight:800;font-size:22px;" id="profile-name-display">Timothy Rollings <span style="color:#F59E0B;font-size:18px;">âœ“</span></h2>
            <div style="color:var(--muted);font-size:14px;margin-bottom:4px;" id="profile-bio-display">@timrollings Â· Creative Director & Digital Strategist</div>
            <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--muted);margin-bottom:12px;">
              <span style="display:flex;align-items:center;gap:4px;"><i data-lucide="map-pin" class="w-4 h-4"></i> Cypress, TX</span>
              <span style="display:flex;align-items:center;gap:4px;"><i data-lucide="link" class="w-4 h-4"></i> <span style="color:#0D9488;">legacymedia.co</span></span>
              <span style="display:flex;align-items:center;gap:4px;"><i data-lucide="calendar" class="w-4 h-4"></i> Joined March 2021</span>
            </div>
          </div>
        </div>
        <div class="card" style="padding:20px;margin-top:16px;text-align:center;">
          <div class="gold-shimmer" style="width:76px;height:76px;border-radius:999px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;-webkit-background-clip:unset;-webkit-text-fill-color:unset;">
            <div style="width:70px;height:70px;border-radius:999px;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div style="font-size:22px;font-weight:800;color:#D97706;">97</div>
              <div style="font-size:9px;color:var(--muted);">/ 100</div>
            </div>
          </div>
          <div style="font-weight:700;font-size:15px;color:#D97706;">Nexus Impact Scoreâ„¢</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Top 1% of Creators</div>
        </div>
        <div class="no-scrollbar" style="display:flex;gap:10px;overflow-x:auto;padding:16px 0;">
          ${[{v:'284',l:'Posts'},{v:'48.7K',l:'Followers'},{v:'1,203',l:'Following'},{v:'2.1M',l:'Impressions'},{v:'6.8%',l:'Engagement'}].map(s => `<div class="card" style="flex-shrink:0;padding:14px 20px;text-align:center;min-width:90px;"><div style="font-size:20px;font-weight:800;">${s.v}</div><div style="font-size:11px;color:var(--muted);">${s.l}</div></div>`).join('')}
        </div>
        <div style="display:flex;gap:0;border-bottom:1px solid var(--border);" id="profile-tabs">
          ${['Posts','Reposts','Liked','Bookmarks','Scheduled'].map((t,i) => `<button class="ptab ${i===0?'active':''}" data-ptab="${t.toLowerCase()}" style="flex:1;padding:12px 0;font-size:12px;font-weight:600;cursor:pointer;background:none;border:none;border-bottom:2px solid ${i===0?'#0D9488':'transparent'};color:${i===0?'#0D9488':'var(--muted)'};transition:all .15s;">${t}</button>`).join('')}
        </div>
        <div id="profile-tab-content" style="margin-top:16px;"></div>`;
      RI();
      c.querySelector('#edit-profile-btn').addEventListener('click', () => { document.getElementById('edit-profile-modal').style.display = 'flex'; });
      c.querySelectorAll('.ptab').forEach(t => t.addEventListener('click', function() {
        activeProfileTab = this.dataset.ptab;
        c.querySelectorAll('.ptab').forEach(x => { x.classList.remove('active'); x.style.borderBottomColor='transparent'; x.style.color='var(--muted)'; });
        this.classList.add('active'); this.style.borderBottomColor='#0D9488'; this.style.color='#0D9488';
        renderProfileTab();
      }));
      renderProfileTab();
    }

    function renderProfileTab() {
      const area = document.getElementById('profile-tab-content');
      if (!area) return;
      const tileGrads = ['#0D9488,#F59E0B','#134E4A,#042F2E','#d97706,#f59e0b','#1e1b4b,#0d9488','#f43f5e,#d97706','#0d9488,#059669','#f59e0b,#ef4444','#1a1a2e,#4c1d95','#d97706,#0d9488'];
      const tileCaptions = ['Building Legacy Media from the ground up ðŸš€','10 lessons from 10 years in creative direction','When the brief becomes the breakthrough ðŸ’¡','Team collab session at Legacy HQ ðŸ¢','DesignWeek2026 recap â€” what a week ðŸŽ¨','New campaign going live tomorrow ðŸ‘€','Late night creative sessions hit different ðŸŒ™','The rebrand that changed everything','Cypress, TX sunsets are unmatched ðŸŒ…'];

      if (activeProfileTab === 'posts') {
        area.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">
          ${tileGrads.map((g,i) => `<div class="profile-tile" data-idx="${i}" style="aspect-ratio:1;border-radius:14px;background:linear-gradient(135deg,${g});cursor:pointer;position:relative;overflow:hidden;transition:transform .15s;">
            <div class="tile-ov" style="position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;transition:opacity .2s;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;color:white;font-size:12px;font-weight:600;border-radius:14px;padding:8px;text-align:center;"><span>â¤ï¸ ${fmtNum(Math.floor(Math.random()*5000+500))}</span><span>ðŸ’¬ ${Math.floor(Math.random()*200+20)}</span></div>
          </div>`).join('')}
        </div>`;
        area.querySelectorAll('.profile-tile').forEach(t => {
          t.addEventListener('mouseenter', function() { this.querySelector('.tile-ov').style.opacity='1'; });
          t.addEventListener('mouseleave', function() { this.querySelector('.tile-ov').style.opacity='0'; });
          t.addEventListener('click', function() {
            const i = +this.dataset.idx;
            document.getElementById('post-detail-body').innerHTML = `<div style="width:100%;aspect-ratio:1;border-radius:12px;background:linear-gradient(135deg,${tileGrads[i]});margin-bottom:16px;"></div>${avatar(users.tim,36)}<div style="margin-top:8px;font-weight:600;font-size:14px;">Timothy Rollings <span style="color:#F59E0B;">âœ“</span></div><p style="font-size:14px;margin-top:8px;">${tileCaptions[i]}</p>`;
            document.getElementById('post-detail-modal').style.display = 'flex'; RI();
          });
        });
      } else if (activeProfileTab === 'reposts') {
        const reposts = [
          {uid:'ava',text:'Design is not just what it looks like. Design is how it works. â€” Steve Jobs ðŸ’¡',likes:4200,comments:180,reposts:890},
          {uid:'priya',text:'Thread: 10 JavaScript tricks that will change how you code ðŸ§µðŸ‘‡',likes:7800,comments:430,reposts:2100},
          {uid:'jordan',text:'Shipped my game. 18 months. Over 1,000 wishlists. Thank you ALL ðŸŽ®ðŸ™',likes:14200,comments:1800,reposts:4300}
        ];
        area.innerHTML = reposts.map(p => {
          const u = users[p.uid];
          return `<div class="card" style="padding:16px;margin-bottom:12px;">
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px;display:flex;align-items:center;gap:4px;"><i data-lucide="repeat-2" class="w-4 h-4"></i> Timothy Rollings reposted</div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">${avatar(u)}<div><span style="font-weight:700;font-size:14px;">${u.name}</span> <span style="color:var(--muted);font-size:13px;">${u.handle}</span></div></div>
            <p style="font-size:15px;line-height:1.6;margin-bottom:10px;">${p.text}</p>
            <div style="display:flex;gap:12px;font-size:13px;color:var(--muted);"><span>â¤ï¸ ${fmtNum(p.likes)}</span><span>ðŸ’¬ ${fmtNum(p.comments)}</span><span>ðŸ” ${fmtNum(p.reposts)}</span></div>
          </div>`;
        }).join('');
        RI();
      } else if (activeProfileTab === 'liked') {
        const liked = [
          {uid:'marcus',text:'Sleep is a productivity strategy, not a luxury ðŸ’¤ 8 hours = 10x output',likes:3200},
          {uid:'sofia',text:'The best camera is the one you always carry ðŸ“¸',likes:5100},
          {uid:'leo',text:'Community > Competition. Always. ðŸ¤',likes:2800}
        ];
        area.innerHTML = liked.map(p => {
          const u = users[p.uid];
          return `<div class="card" style="padding:16px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">${avatar(u)}<div><span style="font-weight:700;font-size:14px;">${u.name}</span> <span style="color:var(--muted);font-size:13px;">${u.handle}</span></div></div>
            <p style="font-size:15px;line-height:1.6;margin-bottom:10px;">${p.text}</p>
            <div style="display:flex;gap:12px;font-size:13px;"><span style="color:#EF4444;">â¤ï¸ ${fmtNum(p.likes)}</span></div>
          </div>`;
        }).join('');
      } else if (activeProfileTab === 'bookmarks') {
        const defaultBookmarks = [
          {uid:'priya',text:'Debugging cheat sheet â€” save this! ðŸ’¾',likes:4500,image:'linear-gradient(135deg,#0d9488,#134e4a)'},
          {uid:'ava',text:'The design tools I use every single day (2026 edition) ðŸ› ï¸',likes:6200,image:null},
          {uid:'jordan',text:'How I marketed my indie game with zero budget ðŸ“ˆ',likes:3100,image:null}
        ];
        const feedBookmarks = postsData.filter(p => p.bookmarked).map(p => ({uid:p.uid,text:p.text,likes:p.likes,image:p.image}));
        const all = [...defaultBookmarks, ...feedBookmarks];
        if (all.length === 0) {
          area.innerHTML = `<div style="text-align:center;padding:40px 0;color:var(--muted);"><i data-lucide="bookmark" class="w-12 h-12" style="margin:0 auto 12px;display:block;opacity:.3;"></i><div style="font-size:15px;font-weight:600;">No bookmarks yet</div><div style="font-size:13px;margin-top:4px;">Save posts to find them here later</div></div>`;
          RI(); return;
        }
        area.innerHTML = all.map(p => {
          const u = users[p.uid];
          return `<div class="card" style="padding:16px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">${avatar(u)}<div><span style="font-weight:700;font-size:14px;">${u.name}</span> <span style="color:var(--muted);font-size:13px;">${u.handle}</span></div><div style="margin-left:auto;color:#D97706;"><i data-lucide="bookmark" class="w-5 h-5" style="fill:#D97706;color:#D97706;"></i></div></div>
            <p style="font-size:15px;line-height:1.6;margin-bottom:10px;">${p.text}</p>
            ${p.image?`<div style="width:100%;aspect-ratio:16/9;border-radius:12px;background:${p.image};margin-bottom:10px;"></div>`:''}
            <div style="display:flex;gap:12px;font-size:13px;color:var(--muted);"><span>â¤ï¸ ${fmtNum(p.likes)}</span></div>
          </div>`;
        }).join('');
        RI();
      } else if (activeProfileTab === 'scheduled') {
        const scheduled = [
          {date:'Oct 15, 2026 Â· 9:00 AM',text:'Excited to announce a MAJOR collab dropping next week ðŸ”¥ Stay tuned. #Legacy #brand'},
          {date:'Oct 20, 2026 Â· 12:00 PM',text:'My full creative process breakdown â€” from brief to launch. Thread incoming ðŸ§µ #creative #strategy'}
        ];
        area.innerHTML = scheduled.map((s,i) => `<div class="card" style="padding:16px;margin-bottom:12px;position:relative;">
          <span style="position:absolute;top:12px;right:12px;background:#F59E0B;color:white;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;">Scheduled</span>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">${avatar(users.tim,36)}<div><div style="font-size:13px;font-weight:600;">Timothy Rollings <span style="color:#F59E0B;">âœ“</span></div><div style="font-size:11px;color:var(--muted);">@timrollings</div></div></div>
          <p style="font-size:14px;margin-bottom:8px;">${s.text}</p>
          <div style="font-size:12px;color:#D97706;font-weight:600;display:flex;align-items:center;gap:4px;margin-bottom:10px;"><i data-lucide="calendar" class="w-4 h-4"></i> ðŸ“… ${s.date}</div>
          <div style="display:flex;gap:8px;">
            <button class="sched-edit btn-gradient" data-sidx="${i}" style="padding:6px 16px;font-size:12px;">Edit</button>
            <button class="sched-del" data-sidx="${i}" style="background:none;border:1.5px solid #EF4444;border-radius:999px;padding:6px 16px;font-size:12px;font-weight:600;cursor:pointer;color:#EF4444;">Delete</button>
          </div>
        </div>`).join('');
        RI();
        area.querySelectorAll('.sched-edit').forEach(b => b.addEventListener('click', () => openCreateModal()));
        area.querySelectorAll('.sched-del').forEach(b => b.addEventListener('click', function() {
          this.closest('.card').style.opacity = '0'; this.closest('.card').style.transition = 'opacity .3s';
          setTimeout(() => { this.closest('.card').remove(); }, 300);
          showToast('ðŸ—‘ï¸ Removed','Scheduled post removed','#EF4444');
        }));
      }
    }

    // ========== CREATE POST MODAL ==========
    function openCreateModal() {
      const m = document.getElementById('create-modal'); m.style.display = 'flex';
      document.getElementById('create-textarea').value = ''; document.getElementById('char-count').textContent = '0';
      document.getElementById('emoji-picker').style.display = 'none';
      document.getElementById('poll-section').style.display = 'none';
      document.getElementById('schedule-section').style.display = 'none';
      document.getElementById('create-image-preview').style.display = 'none';
      isScheduleMode = false; isPollMode = false; isImageMode = false;
      document.getElementById('submit-post').textContent = 'Post';
    }
    function closeCreateModal() { document.getElementById('create-modal').style.display = 'none'; }

    document.getElementById('create-post-btn').addEventListener('click', openCreateModal);
    document.getElementById('mobile-fab').addEventListener('click', openCreateModal);
    document.getElementById('close-create').addEventListener('click', closeCreateModal);
    document.getElementById('create-modal').addEventListener('click', function(e) { if(e.target===this) closeCreateModal(); });

    document.getElementById('create-textarea').addEventListener('input', function() {
      const len = this.value.length;
      const cc = document.getElementById('char-count');
      cc.textContent = len;
      cc.style.color = len >= 280 ? '#EF4444' : len >= 260 ? '#D97706' : 'var(--muted)';
    });

    // Emoji picker
    const emojis = ['ðŸ˜€','ðŸ˜‚','ðŸ¥°','ðŸ˜Ž','ðŸ”¥','ðŸš€','ðŸ’¡','âœ¨','â¤ï¸','ðŸ‘','ðŸŽ‰','ðŸ’ª','ðŸŒŸ','ðŸ˜','ðŸ¤”','ðŸ‘€','ðŸ™Œ','ðŸ’¯','ðŸŽ¯','âš¡','ðŸŒˆ','ðŸ•','â˜•','ðŸŽ®','ðŸ“¸','ðŸŽ¨','ðŸ’»','ðŸŒ','ðŸ†','ðŸ’Ž'];
    document.getElementById('emoji-grid').innerHTML = emojis.map(e => `<span class="emoji-btn">${e}</span>`).join('');
    document.getElementById('emoji-toggle').addEventListener('click', () => { const p = document.getElementById('emoji-picker'); p.style.display = p.style.display==='none'?'block':'none'; });
    document.getElementById('emoji-grid').addEventListener('click', function(e) { if (e.target.classList.contains('emoji-btn')) { const ta = document.getElementById('create-textarea'); ta.value += e.target.textContent; ta.dispatchEvent(new Event('input')); ta.focus(); } });

    document.getElementById('img-attach').addEventListener('click', function() {
      isImageMode = !isImageMode;
      const prev = document.getElementById('create-image-preview');
      prev.style.display = isImageMode ? 'block' : 'none';
      prev.style.background = 'linear-gradient(135deg,#0D9488,#F59E0B)';
      this.style.color = isImageMode ? '#0D9488' : 'var(--muted)';
    });
    document.getElementById('poll-toggle').addEventListener('click', function() {
      isPollMode = !isPollMode;
      document.getElementById('poll-section').style.display = isPollMode ? 'block' : 'none';
      this.style.color = isPollMode ? '#0D9488' : 'var(--muted)';
    });
    document.getElementById('add-poll-opt').addEventListener('click', function() {
      const c = document.getElementById('poll-options-create');
      if (c.children.length >= 4) return;
      const inp = document.createElement('input'); inp.type='text'; inp.placeholder='Option '+(c.children.length+1);
      inp.className='poll-opt-input'; inp.style.cssText='padding:8px 12px;border-radius:8px;font-size:13px;';
      c.appendChild(inp);
    });
    document.getElementById('schedule-toggle').addEventListener('click', function() {
      isScheduleMode = !isScheduleMode;
      document.getElementById('schedule-section').style.display = isScheduleMode ? 'block' : 'none';
      this.style.color = isScheduleMode ? '#D97706' : 'var(--muted)';
      document.getElementById('submit-post').textContent = isScheduleMode ? 'Schedule Post' : 'Post';
    });

    document.getElementById('submit-post').addEventListener('click', function() {
      const text = document.getElementById('create-textarea').value.trim();
      if (!text) return;
      if (isScheduleMode) {
        closeCreateModal();
        showToast('ðŸ“… Post scheduled!','Your post has been scheduled','#D97706');
        return;
      }
      const newPost = { id:Date.now(), uid:'tim', time:'Just now', text, image: isImageMode ? 'linear-gradient(135deg,#0D9488,#F59E0B)' : null, likes:0, comments:0, reposts:0, liked:false, reposted:false, bookmarked:false, poll:null, commentList:[] };
      postsData.unshift(newPost);
      closeCreateModal(); showView('home');
      showToast('ðŸŽ‰ Posted!','Your post is now live','#0D9488');
    });

    // ========== STORY VIEWER ==========
    let currentStory = 0;
    function openStory(key) {
      const idx = storyData.findIndex(s => s.key === key);
      if (idx === -1) return;
      currentStory = idx; showStorySlide();
    }
    function showStorySlide() {
      const s = storyData[currentStory];
      document.getElementById('story-modal').style.display = 'block';
      document.getElementById('story-avatar').style.background = s.color;
      document.getElementById('story-avatar').textContent = s.initials;
      document.getElementById('story-user').textContent = s.name;
      document.getElementById('story-content').style.background = s.bg;
      document.getElementById('story-content').innerHTML = `<div style="font-size:64px;">${s.emoji}</div><div style="color:white;font-size:22px;font-weight:700;text-align:center;padding:0 32px;text-shadow:0 2px 8px rgba(0,0,0,.3);">${s.text}</div>`;
      const prog = document.getElementById('story-progress');
      prog.style.transition = 'none'; prog.style.width = '0%'; void prog.offsetWidth;
      prog.style.transition = 'width 5s linear'; prog.style.width = '100%';
      clearTimeout(storyTimer);
      storyTimer = setTimeout(() => { if (currentStory < storyData.length-1) { currentStory++; showStorySlide(); } else closeStoryModal(); }, 5000);
      // Reactions
      const reacts = document.getElementById('story-reactions');
      const reactionEmojis = ['â¤ï¸','ðŸ˜‚','ðŸ˜®','ðŸ˜¢','ðŸ”¥','ðŸ‘'];
      reacts.innerHTML = reactionEmojis.map(e => `<div class="story-react" data-emoji="${e}" style="text-align:center;cursor:pointer;"><div style="font-size:28px;">${e}</div><div style="font-size:10px;color:white;opacity:.8;" class="react-count">${Math.floor(Math.random()*80+5)}</div></div>`).join('');
      reacts.querySelectorAll('.story-react').forEach(r => r.addEventListener('click', function() {
        const countEl = this.querySelector('.react-count');
        countEl.textContent = +countEl.textContent + 1;
        const fl = document.createElement('div'); fl.className = 'emoji-float'; fl.textContent = this.dataset.emoji;
        fl.style.left = (30+Math.random()*40)+'%'; fl.style.bottom = '140px';
        document.getElementById('story-modal').appendChild(fl);
        setTimeout(() => fl.remove(), 1200);
      }));
    }
    function closeStoryModal() { document.getElementById('story-modal').style.display = 'none'; clearTimeout(storyTimer); }

    document.getElementById('story-close').addEventListener('click', closeStoryModal);
    document.getElementById('story-prev').addEventListener('click', () => { if (currentStory > 0) { currentStory--; showStorySlide(); } });
    document.getElementById('story-next').addEventListener('click', () => { if (currentStory < storyData.length-1) { currentStory++; showStorySlide(); } else closeStoryModal(); });
    document.getElementById('story-reply-send').addEventListener('click', () => {
      const inp = document.getElementById('story-reply-input');
      if (inp.value.trim()) { showToast('ðŸ’¬ Reply sent!','Your reply was delivered','#0D9488'); inp.value = ''; }
    });

    // ========== VIDEO CALL ==========
    function openVideoCall(u) {
      const ov = document.getElementById('video-call-overlay'); ov.style.display = 'flex';
      document.getElementById('vcall-name').textContent = u.name;
      document.getElementById('vcall-remote-avatar').style.background = u.color;
      document.getElementById('vcall-remote-avatar').textContent = u.initials;
      document.getElementById('vcall-remote-label').textContent = u.name;
      vcallSecs = 0;
      clearInterval(vcallInterval);
      vcallInterval = setInterval(() => { vcallSecs++; const m=Math.floor(vcallSecs/60),s=vcallSecs%60; document.getElementById('vcall-timer').textContent=m+':'+String(s).padStart(2,'0'); }, 1000);
      RI();
    }
    function closeVideoCall() {
      clearInterval(vcallInterval);
      document.getElementById('video-call-overlay').style.display = 'none';
      showToast('ðŸ“ž Call ended','Duration: '+Math.floor(vcallSecs/60)+':'+String(vcallSecs%60).padStart(2,'0'),'#0D9488');
    }
    document.getElementById('vcall-end').addEventListener('click', closeVideoCall);
    document.getElementById('vcall-mic').addEventListener('click', function() {
      const muted = this.style.background === 'rgb(239, 68, 68)';
      this.style.background = muted ? 'rgba(255,255,255,.15)' : '#EF4444';
    });
    document.getElementById('vcall-cam').addEventListener('click', function() {
      const off = this.style.background === 'rgb(239, 68, 68)';
      this.style.background = off ? 'rgba(255,255,255,.15)' : '#EF4444';
    });
    document.getElementById('vcall-react').addEventListener('click', function() {
      ['â¤ï¸','ðŸŽ‰','ðŸ‘'].forEach((e,i) => {
        setTimeout(() => {
          const el = document.createElement('div'); el.className='emoji-float'; el.textContent=e;
          el.style.left=(30+Math.random()*40)+'%'; el.style.bottom='100px';
          document.getElementById('vcall-emoji-area').appendChild(el);
          setTimeout(() => el.remove(), 1200);
        }, i*200);
      });
    });

    // ========== EDIT PROFILE ==========
    document.getElementById('close-edit').addEventListener('click', () => { document.getElementById('edit-profile-modal').style.display = 'none'; });
    document.getElementById('edit-profile-modal').addEventListener('click', function(e) { if(e.target===this) this.style.display='none'; });
    document.getElementById('save-profile').addEventListener('click', function() {
      const name = document.getElementById('edit-name').value;
      const pn = document.getElementById('profile-name-display');
      if (pn) pn.innerHTML = name + ' <span style="color:#F59E0B;font-size:18px;">âœ“</span>';
      document.getElementById('edit-profile-modal').style.display = 'none';
      showToast('âœ… Profile updated!','Your changes have been saved','#0D9488');
    });

    // ========== POST DETAIL MODAL ==========
    document.getElementById('close-detail').addEventListener('click', () => { document.getElementById('post-detail-modal').style.display = 'none'; });
    document.getElementById('post-detail-modal').addEventListener('click', function(e) { if(e.target===this) this.style.display='none'; });

    // ========== MINI PLAYER ==========
    document.getElementById('mini-close-btn').addEventListener('click', () => { document.getElementById('mini-player').style.display = 'none'; });
    document.getElementById('mini-play-btn').addEventListener('click', () => { document.getElementById('mini-vinyl').classList.toggle('vinyl-paused'); });

    // ========== FOLLOW BUTTONS (RIGHT SIDEBAR) ==========
    document.querySelectorAll('.right-follow-btn').forEach(b => b.addEventListener('click', function() { this.classList.toggle('following'); this.textContent = this.classList.contains('following') ? 'Following' : 'Follow'; }));

    // ========== ONBOARDING ==========
    function initOnboarding() {
      if (localStorage.getItem('nexus_onboarded') === 'true') return;
      document.getElementById('onboard-overlay').style.display = 'block';
      renderOnboardDots();
      const interests = ['Design ðŸŽ¨','Technology ðŸ’»','Business ðŸ“ˆ','Travel âœˆï¸','Gaming ðŸŽ®','Music ðŸŽµ','Photography ðŸ“¸','Fitness ðŸ’ª','Food ðŸœ','Fashion ðŸ‘—','Film ðŸŽ¬','Sports âš½'];
      const chips = document.getElementById('interest-chips');
      const selected = new Set();
      interests.forEach(i => {
        const chip = document.createElement('button');
        chip.textContent = i;
        chip.style.cssText = 'padding:8px 18px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid var(--border);background:var(--card);color:var(--text);transition:all .15s;';
        chip.addEventListener('click', function() {
          if (selected.has(i)) { selected.delete(i); this.style.background='var(--card)'; this.style.borderColor='var(--border)'; this.style.color='var(--text)'; }
          else { selected.add(i); this.style.background='rgba(13,148,136,.15)'; this.style.borderColor='#0D9488'; this.style.color='#0D9488'; }
          const nb = document.getElementById('onboard-next-2'); nb.disabled = selected.size===0; nb.style.opacity = selected.size>0?'1':'.5';
        });
        chips.appendChild(chip);
      });
    }
    function renderOnboardDots() {
      for (let s=1;s<=4;s++) { const dc = document.getElementById('onboard-dots-'+s); if(!dc) continue; dc.innerHTML='';
        for (let d=1;d<=4;d++) { const dot=document.createElement('div'); dot.style.cssText=`width:8px;height:8px;border-radius:999px;${d===s?'background:#F59E0B;':'background:transparent;border:1.5px solid var(--muted);'}`; dc.appendChild(dot); }
      }
    }
    function showOnboardStep(step) { for(let i=1;i<=4;i++) { document.getElementById('onboard-step-'+i).style.display=i===step?'flex':'none'; } if(step===4) spawnConfetti(); }
    function spawnConfetti() {
      const c = document.getElementById('confetti-container'); c.innerHTML='';
      const colors = ['#0D9488','#F59E0B','#D97706','#0F766E','#EF4444','#FBBF24'];
      for (let i=0;i<60;i++) { const p=document.createElement('div'); p.className='confetti-piece'; const sz=6+Math.random()*8;
        p.style.cssText=`width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;top:-20px;border-radius:${Math.random()>.5?'999px':'2px'};--dur:${1.5+Math.random()*2}s;animation-delay:${Math.random()*.8}s;`;
        c.appendChild(p); }
    }
    document.getElementById('onboard-start-btn').addEventListener('click', () => showOnboardStep(2));
    document.getElementById('onboard-back-2').addEventListener('click', () => showOnboardStep(1));
    document.getElementById('onboard-next-2').addEventListener('click', () => showOnboardStep(3));
    document.getElementById('onboard-back-3').addEventListener('click', () => showOnboardStep(2));
    document.getElementById('onboard-next-3').addEventListener('click', () => showOnboardStep(4));
    document.getElementById('onboard-enter').addEventListener('click', function() {
      localStorage.setItem('nexus_onboarded','true');
      const ov = document.getElementById('onboard-overlay'); ov.style.opacity='0';
      setTimeout(() => { ov.style.display='none'; ov.style.opacity='1'; }, 500);
    });

    // ========== ESCAPE KEY ==========
    document.addEventListener('keydown', function(e) {
      if (e.key==='Escape') { closeCreateModal(); closeStoryModal(); closeVideoCall();
        document.getElementById('edit-profile-modal').style.display='none';
        document.getElementById('post-detail-modal').style.display='none';
      }
    });

    // ========== LAYOUT ==========
    function adjustLayout() {
      const main = document.getElementById('main-content');
      if (window.innerWidth >= 768) { main.style.marginLeft='240px'; main.style.marginRight='280px'; main.style.padding='0 24px 40px'; }
      else { main.style.marginLeft='0'; main.style.marginRight='0'; main.style.padding='56px 12px 80px'; }
    }
    window.addEventListener('resize', adjustLayout);
    adjustLayout();

    // ========== LIVE TOASTS ==========
    setTimeout(() => showToast('â¤ï¸ ava.chen liked your post','just now','#0D9488'), 3000);
    setTimeout(() => showToast('ðŸ‘¤ jordan.blake started following you','just now','#D97706'), 7000);
    setTimeout(() => showToast('ðŸ”¥ Trending!','Your post hit #WebDev top 10','#F59E0B'), 13000);

    // ========== INIT ==========
    renderHome();
    RI();
    initOnboarding();
  
