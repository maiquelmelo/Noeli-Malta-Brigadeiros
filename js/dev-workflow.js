(()=>{
 const COMMERCIAL={QUOTE:'Orçamento',WAIT:'Aguardando aprovação',CONFIRMED:'Confirmado',CANCELLED:'Cancelado'};
 const OPERATIONAL={IDLE:'Não iniciado',PRODUCTION:'Em produção',READY:'Pronto',DELIVERED:'Entregue'};
 function log(p,text){Dev.history(p,text)}
 function normalize(p){
  p=Dev.normalize(p);
  p.commercialStatus=p.commercialStatus||(p.status==='Cancelado'?COMMERCIAL.CANCELLED:['Aprovado','Entrada recebida','Em produção','Pronto','Entregue','Finalizado'].includes(p.status)?COMMERCIAL.CONFIRMED:p.status==='Aguardando aprovação'?COMMERCIAL.WAIT:COMMERCIAL.QUOTE);
  p.operationalStatus=p.operationalStatus||(p.status==='Em produção'?OPERATIONAL.PRODUCTION:p.status==='Pronto'?OPERATIONAL.READY:['Entregue','Finalizado'].includes(p.status)?OPERATIONAL.DELIVERED:OPERATIONAL.IDLE);
  return apply(p,false);
 }
 function requiredDeposit(p){return Number(p.total||0)*0.5}
 function apply(p,record=true){
  const old=p.status;
  const paid=Dev.paid(p),balance=Dev.balance(p);
  p.financialStatus=balance<=.009?'Quitado':paid>0?'Parcial':'Pendente';
  if(p.commercialStatus===COMMERCIAL.CANCELLED)p.status='Cancelado';
  else if(p.operationalStatus===OPERATIONAL.DELIVERED)p.status=balance<=.009?'Finalizado':'Entregue';
  else if(p.operationalStatus===OPERATIONAL.READY)p.status='Pronto';
  else if(p.operationalStatus===OPERATIONAL.PRODUCTION)p.status='Em produção';
  else if(p.commercialStatus===COMMERCIAL.CONFIRMED)p.status=paid>0?'Entrada recebida':'Aprovado';
  else if(p.commercialStatus===COMMERCIAL.WAIT)p.status='Aguardando aprovação';
  else p.status='Orçamento';
  if(record&&old&&old!==p.status)log(p,`Workflow atualizou o status de ${old} para ${p.status}`);
  return p;
 }
 Dev.workflow={COMMERCIAL,OPERATIONAL,normalize,apply,requiredDeposit};
 const baseAll=Dev.all;Dev.all=()=>baseAll().map(normalize);
 const baseSave=Dev.save;Dev.save=a=>baseSave(a.map(p=>apply(normalize(p),false)));
 window.workflowAction=(id,action)=>{
  const a=Dev.all(),p=a.find(x=>x.id===id);if(!p)return;
  const labels={send:'Orçamento enviado ao cliente',approve:'Orçamento aprovado',production:'Produção iniciada',ready:'Produção concluída',deliver:'Pedido entregue',cancel:'Pedido cancelado'};
  if(action==='send')p.commercialStatus=COMMERCIAL.WAIT;
  if(action==='approve')p.commercialStatus=COMMERCIAL.CONFIRMED;
  if(action==='production'){p.commercialStatus=COMMERCIAL.CONFIRMED;p.operationalStatus=OPERATIONAL.PRODUCTION}
  if(action==='ready')p.operationalStatus=OPERATIONAL.READY;
  if(action==='deliver')p.operationalStatus=OPERATIONAL.DELIVERED;
  if(action==='cancel')p.commercialStatus=COMMERCIAL.CANCELLED;
  log(p,labels[action]||action);apply(p);Dev.save(a);showDetails(id);refreshHome();
 };
 const baseCollect=window.collectOrder;window.collectOrder=()=>{
  const p=normalize(baseCollect());
  if(!editingId){p.commercialStatus=COMMERCIAL.QUOTE;p.operationalStatus=OPERATIONAL.IDLE;p.status='Orçamento'}
  return apply(p,false);
 };
 const baseSavePayment=window.savePayment;window.savePayment=()=>{
  const id=Number(paymentOrderId.value);baseSavePayment();
  setTimeout(()=>{const a=Dev.all(),p=a.find(x=>x.id===id);if(!p)return;if(Dev.paid(p)>0&&p.commercialStatus!==COMMERCIAL.CANCELLED)p.commercialStatus=COMMERCIAL.CONFIRMED;apply(p);Dev.save(a);if(currentOrderId===id)showDetails(id);},0);
 };
 const baseShow=window.showDetails;window.showDetails=id=>{
  baseShow(id);const p=Dev.all().find(x=>x.id===id),root=document.getElementById('detailsContent');if(!p||!root)return;
  const paid=Dev.paid(p),need=Math.max(requiredDeposit(p)-paid,0);
  const box=document.createElement('div');box.className='detail-box workflow-box';box.innerHTML=`<h3>Próxima ação</h3><div class="workflow-states"><span>Comercial: <strong>${p.commercialStatus}</strong></span><span>Produção: <strong>${p.operationalStatus}</strong></span><span>Financeiro: <strong>${p.financialStatus}</strong></span></div><div class="small workflow-hint">${need>0&&p.commercialStatus===COMMERCIAL.CONFIRMED?`Faltam ${R(need)} para completar a entrada sugerida de 50%.`:p.status==='Finalizado'?'Pedido concluído e quitado.':'Execute a ação realizada; o status será atualizado automaticamente.'}</div><div class="btn-row">${p.commercialStatus===COMMERCIAL.QUOTE?`<button class="btn btn-outline" onclick="workflowAction(${id},'send')">Enviar orçamento</button>`:''}${[COMMERCIAL.QUOTE,COMMERCIAL.WAIT].includes(p.commercialStatus)?`<button class="btn btn-primary" onclick="workflowAction(${id},'approve')">Cliente aprovou</button>`:''}${p.commercialStatus===COMMERCIAL.CONFIRMED&&p.operationalStatus===OPERATIONAL.IDLE?`<button class="btn btn-primary" onclick="workflowAction(${id},'production')">Iniciar produção</button>`:''}${p.operationalStatus===OPERATIONAL.PRODUCTION?`<button class="btn btn-primary" onclick="workflowAction(${id},'ready')">Produção concluída</button>`:''}${p.operationalStatus===OPERATIONAL.READY?`<button class="btn btn-primary" onclick="workflowAction(${id},'deliver')">Confirmar entrega</button>`:''}${!['Finalizado','Cancelado'].includes(p.status)?`<button class="btn btn-light" onclick="workflowAction(${id},'cancel')">Cancelar</button>`:''}</div>`;
  root.insertBefore(box,root.children[1]||null);
 };
 const oldInject=Dev.inject;Dev.inject=()=>{oldInject();const status=document.getElementById('orderStatus');if(status){const wrap=status.closest('.g2');if(wrap)wrap.querySelector('div:first-child').style.display='none'}const version=document.querySelector('#more .small');if(version)version.innerHTML='Brigadeiros e bem casados<br>Versão 3.0-dev — Workflow inteligente'};
})();