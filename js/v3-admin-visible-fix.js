(()=>{
  function ensureVisibleAdminOptions(){
    const grid=document.querySelector('#home .tile-grid');
    if(grid&&!document.getElementById('settingsHomeTile')){
      grid.insertAdjacentHTML('beforeend',`<button id="settingsHomeTile" class="tile blue" onclick="openScreen('settings')"><div class="tile-icon">⚙️</div><div class="tile-title">Configurações</div><div class="tile-sub">Dados da empresa</div></button>`);
    }
    const more=document.querySelector('#more .more-card');
    if(more&&!document.getElementById('companySettingsRow')){
      more.insertAdjacentHTML('afterbegin',`<div id="companySettingsRow" class="more-row"><span>🏢</span><button onclick="openScreen('settings')">Dados da empresa</button></div>`);
    }
    const version=document.querySelector('#more .small');
    if(version)version.innerHTML='Brigadeiros e bem casados<br>Versão 3.0 — Administrativo e Financeiro';
  }
  const previousReady=Dev.ready;
  Dev.ready=()=>{previousReady();ensureVisibleAdminOptions();};
  ensureVisibleAdminOptions();
})();