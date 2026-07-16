(()=>{
const HIDDEN_KEY='nm_v3_hidden_clients';
const hidden=()=>{try{return JSON.parse(localStorage.getItem(HIDDEN_KEY)||'[]')}catch{return[]}};
const saveHidden=a=>localStorage.setItem(HIDDEN_KEY,JSON.stringify([...new Set(a)]));
const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");

window.deleteClientV3=id=>{
 const clients=V3?.getClients?.()||[];
 const c=clients.find(x=>x.id===id);
 if(!c)return alert('Cliente não encontrado.');
 const linked=Dev.all().filter(p=>(c.phone&&p.phone===c.phone)||p.client===c.name).length;
 const detail=linked?`\n\nOs ${linked} pedido(s) vinculados serão mantidos.`:'';
 if(!confirm(`Excluir o cliente ${c.name}?${detail}`))return;
 const saved=clients.filter(x=>x.id!==id&&x.source==='cadastro');
 V3.saveClients(saved);
 saveHidden([...hidden(),id]);
 renderClients();
};

window.deleteOrderV3=id=>{
 const p=Dev.all().find(x=>x.id===id);
 if(!p)return alert('Pedido não encontrado.');
 if(!confirm(`Excluir definitivamente o pedido de ${p.client}?\n\nPagamentos, histórico e dados de produção desse pedido também serão removidos.`))return;
 Dev.save(Dev.all().filter(x=>x.id!==id));
 if(window.currentOrderId===id)window.currentOrderId=null;
 refreshHome();
 openScreen('orders');
};

window.renderClients=()=>{
 const a=(V3?.getClients?.()||[]).sort((x,y)=>x.name.localeCompare(y.name));
 clientsList.innerHTML=a.length?a.map(c=>{
  const ps=Dev.all().filter(p=>(c.phone&&p.phone===c.phone)||p.client===c.name);
  const id=esc(c.id);
  return `<div class="list-card v3-action-card"><div class="list-icon">👤</div><div class="list-body"><div class="list-title">${c.name}</div><div class="list-sub">${c.phone||'-'} • ${ps.length} pedido(s) • ${R(ps.reduce((s,p)=>s+p.total,0))}</div><div class="v3-card-actions"><button type="button" class="btn btn-outline" onclick="openClientModal('${id}')">Editar</button><button type="button" class="btn btn-danger" onclick="deleteClientV3('${id}')">Excluir</button></div></div></div>`;
 }).join(''):'Nenhum cliente cadastrado.';
};

window.renderOrders=()=>{
 const q=(orderSearch.value||'').toLowerCase();
 const fc=window.filterCommercial?.value||'',fp=window.filterPayment?.value||'',fd=window.filterDate?.value||'';
 const a=Dev.all().filter(p=>{const commercial=p.commercialStatus||(window.Workflow?Workflow.commercial(p):'');return [p.client,p.event,p.status,Dev.payState(p)].join(' ').toLowerCase().includes(q)&&(!fc||commercial===fc)&&(!fp||Dev.payState(p)===fp)&&(!fd||p.deliveryDate===fd)});
 ordersList.innerHTML=a.length?a.map(p=>`<div class="list-card v3-action-card" onclick="showDetails(${p.id})"><div class="list-icon">📅</div><div class="list-body"><div class="list-title">${p.client}</div><div class="list-sub">${p.event||'Evento'} • ${D(p.deliveryDate)} • ${R(p.total)}<br>${p.commercialStatus||(window.Workflow?Workflow.commercial(p):'Orçamento')} • ${Dev.payState(p)}</div><div class="v3-card-actions"><button type="button" class="btn btn-outline" onclick="event.stopPropagation();showDetails(${p.id})">Abrir</button><button type="button" class="btn btn-danger" onclick="event.stopPropagation();deleteOrderV3(${p.id})">Excluir</button></div></div><span class="status ${p.status==='Cancelado'?'cancel':p.status==='Finalizado'?'ok':'pending'}">${p.status}</span></div>`).join(''):'Nenhum pedido encontrado.';
};

const baseShow=window.showDetails;
window.showDetails=id=>{
 baseShow(id);
 setTimeout(()=>{
  const root=document.getElementById('detailsContent');
  if(!root||root.querySelector('.v3-delete-detail'))return;
  const actions=root.querySelector('.btn-row:last-child')||root;
  actions.insertAdjacentHTML('beforeend',`<button type="button" class="btn btn-danger v3-delete-detail" onclick="deleteOrderV3(${id})">Excluir pedido</button>`);
 },50);
};

const oldOpen=window.openScreen;
window.openScreen=id=>{oldOpen(id);if(id==='clients')renderClients();if(id==='orders')renderOrders();};
if(document.getElementById('clients')?.classList.contains('active'))renderClients();
if(document.getElementById('orders')?.classList.contains('active'))renderOrders();
})();