import{a as n}from"./auth.BGLnl9Fs.js";function r(){const e=document.getElementById("nav-auth");if(!e)return;const t=n.getState();t.isAuthenticated&&t.user?(e.innerHTML=`
        <span style="margin-right: var(--spacing-md); color: rgba(255,255,255,0.8);">
          ${t.user.username}
        </span>
        <button id="logout-btn" class="btn-secondary" style="padding: 4px 12px; font-size: 0.875rem;">
          Abmelden
        </button>
      `,document.getElementById("logout-btn")?.addEventListener("click",()=>{n.logout()})):e.innerHTML=`
        <a href="/" style="color: white; margin-right: var(--spacing-md);">Anmelden</a>
        <a href="/register" style="color: white;">Registrieren</a>
      `}n.subscribe(r);
