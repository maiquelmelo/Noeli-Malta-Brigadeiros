(()=>{
  const VERSION='3.1-production-intelligent-1';
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href=`css/v3-1-production.css?v=${VERSION}`;
  document.head.appendChild(style);
  const files=[
    'js/dev-ui.js',
    'js/dev-orders.js',
    'js/dev-production.js',
    'js/dev-notifications.js',
    'js/dev-workflow.js',
    'js/v3-base.js',
    'js/v3-delete-fix.js',
    'js/v3-admin-finance.js',
    'js/v3-admin-visible-fix.js',
    'js/v3-1-production.js'
  ];
  let chain=Promise.resolve();
  files.forEach(src=>{
    chain=chain.then(()=>new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=`${src}?v=${VERSION}`;
      script.onload=resolve;
      script.onerror=()=>reject(new Error(`Falha ao carregar ${src}`));
      document.head.appendChild(script);
    }));
  });
  chain.then(()=>window.Dev?.ready()).catch(error=>{
    console.error(error);
    alert('Não foi possível carregar os recursos de desenvolvimento. Atualize a página e tente novamente.');
  });
})();