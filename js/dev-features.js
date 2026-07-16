(()=>{
  const VERSION='3.0-admin-finance-fix-2';
  const files=[
    'js/dev-ui.js',
    'js/dev-orders.js',
    'js/dev-production.js',
    'js/dev-notifications.js',
    'js/dev-workflow.js',
    'js/v3-base.js',
    'js/v3-delete-fix.js',
    'js/v3-admin-finance.js'
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