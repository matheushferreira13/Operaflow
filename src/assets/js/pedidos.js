document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'operaflow_pedidos';
  const btnNovoPedido = document.getElementById('btn-novo-pedido');
  const modalPedido = document.getElementById('modal-pedido');
  const modalClose = document.getElementById('modal-close');
  const formPedido = document.querySelector('.pedido-form');
  const tBody = document.getElementById('pedidos-tbody');
  const filtroPedidos = document.getElementById('filtro-pedidos');
  const modalDetalhes = document.getElementById('modal-detalhes');
  const modalDetalhesClose = document.getElementById('modal-det-close');

  function abrirModal() {
    resetForm();
    modalPedido.classList.add('modal-open');
    modalPedido.setAttribute('aria-hidden', 'false');
    formPedido.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function fecharModal() {
    modalPedido.classList.remove('modal-open');
    modalPedido.setAttribute('aria-hidden', 'true');
  }

  function getPedidosFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaultPedidos = [
      { id: generateId(), pedidoId: '#10001', cliente: 'TransAlpha', status: 'andamento', prazo: '2026-03-20', valor: 'R$5.320,00', quantidade: 18, localEntrega: 'Av. Rio Branco, 45, Rio de Janeiro', observacoes: 'Carga perecível', motorista: 'Marcio Souza', placaVeiculo: 'ABC-1001' },
      { id: generateId(), pedidoId: '#10002', cliente: 'Logisul', status: 'andamento', prazo: '2026-03-21', valor: 'R$9.760,00', quantidade: 25, localEntrega: 'Rua dos Pinheiros, 510, São Paulo', observacoes: 'Entrega AGP', motorista: 'Eduarda Silva', placaVeiculo: 'DEF-2002' },
      { id: generateId(), pedidoId: '#10003', cliente: 'NorteFlux', status: 'concluido', prazo: '2026-03-15', valor: 'R$13.350,00', quantidade: 30, localEntrega: 'Av. 7 de Setembro, 80, Curitiba', observacoes: 'Concluído antes do prazo', motorista: 'Jorge Lima', placaVeiculo: 'GHI-3003' },
      { id: generateId(), pedidoId: '#10004', cliente: 'InterCarga', status: 'atraso', prazo: '2026-03-16', valor: 'R$27.250,00', quantidade: 55, localEntrega: 'Rod. BR-101, Km 11, Salvador', observacoes: 'Atraso por trânsito', motorista: 'Fernanda Pires', placaVeiculo: 'JKL-4004' },
      { id: generateId(), pedidoId: '#10005', cliente: 'LatAmLog', status: 'andamento', prazo: '2026-03-24', valor: 'R$47.850,00', quantidade: 95, localEntrega: 'Av. Amazonas, 170, Manaus', observacoes: 'Carga aérea a ser transferida', motorista: 'Paulo Rocha', placaVeiculo: 'MNO-5005' },
      { id: generateId(), pedidoId: '#10006', cliente: 'EcoFrete', status: 'andamento', prazo: '2026-03-22', valor: 'R$3.950,00', quantidade: 12, localEntrega: 'Rua do Comércio, 210, Belém', observacoes: 'Entrega regular', motorista: 'Carla Sousa', placaVeiculo: 'PQR-6006' },
      { id: generateId(), pedidoId: '#10007', cliente: 'FrotaBrasil', status: 'concluido', prazo: '2026-03-18', valor: 'R$11.240,00', quantidade: 20, localEntrega: 'Av. Amazonas, 993, Boa Vista', observacoes: 'Sem intercorrências', motorista: 'Marcelo Dias', placaVeiculo: 'STU-7007' },
      { id: generateId(), pedidoId: '#10008', cliente: 'ViaSupply', status: 'atraso', prazo: '2026-03-19', valor: 'R$16.780,00', quantidade: 35, localEntrega: 'Av. dos Estudantes, 12, Porto Alegre', observacoes: 'Problema de documentação', motorista: 'Cintia Peres', placaVeiculo: 'VWX-8008' },
      { id: generateId(), pedidoId: '#10009', cliente: 'RotaFácil', status: 'andamento', prazo: '2026-03-23', valor: 'R$7.125,00', quantidade: 16, localEntrega: 'Av. Oceânica, 110, Rio de Janeiro', observacoes: 'Prioridade VIP', motorista: 'Bruno Fernandes', placaVeiculo: 'YZA-9009' },
      { id: generateId(), pedidoId: '#10010', cliente: 'LogMaster', status: 'concluido', prazo: '2026-03-14', valor: 'R$19.650,00', quantidade: 40, localEntrega: 'Rua dos Andradas, 300, Porto Alegre', observacoes: 'Entrega no horário', motorista: 'Daniela Nunes', placaVeiculo: 'BCD-1010' },
      { id: generateId(), pedidoId: '#10011', cliente: 'CargaExpress', status: 'andamento', prazo: '2026-03-25', valor: 'R$5.900,00', quantidade: 15, localEntrega: 'Av. Afonso Pena, 560, Belo Horizonte', observacoes: 'Reforçar monitoramento', motorista: 'Rafael Mendes', placaVeiculo: 'EFG-1111' },
      { id: generateId(), pedidoId: '#10012', cliente: 'TransLegal', status: 'atraso', prazo: '2026-03-17', valor: 'R$22.340,00', quantidade: 48, localEntrega: 'Rod. Vital Brasil, Km 27, São José', observacoes: 'Check-point aduaneiro', motorista: 'Sofia Oliveira', placaVeiculo: 'HIJ-1212' },
      { id: generateId(), pedidoId: '#10013', cliente: 'FreightNow', status: 'concluido', prazo: '2026-03-13', valor: 'R$28.980,00', quantidade: 60, localEntrega: 'Av. Getúlio Vargas, 190, Fortaleza', observacoes: 'Entrega concluída sem anomalias', motorista: 'Paula Moura', placaVeiculo: 'KLM-1313' },
      { id: generateId(), pedidoId: '#10014', cliente: 'SpeedCargo', status: 'andamento', prazo: '2026-03-26', valor: 'R$9.450,00', quantidade: 22, localEntrega: 'Rua do Mangue, 45, Vitória', observacoes: 'Em transito sob risco', motorista: 'Tiago Reis', placaVeiculo: 'NOP-1414' },
      { id: generateId(), pedidoId: '#10015', cliente: 'MercadoLog', status: 'andamento', prazo: '2026-03-27', valor: 'R$31.700,00', quantidade: 82, localEntrega: 'Av. Boa Viagem, 80, Recife', observacoes: 'Carga de alto valor', motorista: 'André Castro', placaVeiculo: 'QRS-1515' },
      { id: generateId(), pedidoId: '#10016', cliente: 'TransNorte', status: 'atraso', prazo: '2026-03-16', valor: 'R$13.050,00', quantidade: 36, localEntrega: 'Av. Joaquim Nabuco, 101, Natal', observacoes: 'Condições climáticas', motorista: 'Mariana Lopes', placaVeiculo: 'TUV-1616' },
      { id: generateId(), pedidoId: '#10017', cliente: 'RumoLog', status: 'concluido', prazo: '2026-03-12', valor: 'R$8.220,00', quantidade: 20, localEntrega: 'Rua do Sol, 150, Maceió', observacoes: 'Cliente satisfeito', motorista: 'Lucas Jorge', placaVeiculo: 'WXY-1717' },
      { id: generateId(), pedidoId: '#10018', cliente: 'SuperFrete', status: 'andamento', prazo: '2026-03-24', valor: 'R$17.980,00', quantidade: 34, localEntrega: 'Av. Duarte da Costa, 210, Belém', observacoes: 'Confirmado via SAP', motorista: 'Ricardo Vieira', placaVeiculo: 'ZAB-1818' },
      { id: generateId(), pedidoId: '#10019', cliente: 'GlobalCargo', status: 'concluido', prazo: '2026-03-11', valor: 'R$43.400,00', quantidade: 100, localEntrega: 'Av. dos Holandeses, 333, João Pessoa', observacoes: 'Sem ocorrências', motorista: 'Monica Lima', placaVeiculo: 'CDE-1919' },
      { id: generateId(), pedidoId: '#10020', cliente: 'UltraLog', status: 'andamento', prazo: '2026-03-28', valor: 'R$29.750,00', quantidade: 70, localEntrega: 'Av. Paulista, 900, São Paulo', observacoes: 'Rota otimizada', motorista: 'Gustavo Andrade', placaVeiculo: 'FGH-2020' }
    ];

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPedidos));
      return defaultPedidos;
    }

    try {
      const existing = JSON.parse(raw) || [];
      if (!Array.isArray(existing) || existing.length < 20) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPedidos));
        return defaultPedidos;
      }
      return existing;
    } catch (error) {
      console.warn('Não foi possível ler pedidos do storage, resetando', error);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPedidos));
      return defaultPedidos;
    }
  }

  function savePedidosToStorage(pedidos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  }

  function formatStatus(status) {
    if (status === 'andamento') return 'status-andamento';
    if (status === 'atraso') return 'status-atraso';
    if (status === 'concluido') return 'status-concluido';
    return 'status-andamento';
  }

  function generateId() {
    return 'pedido-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now();
  }

  function parseValor(valorTexto) {
    if (!valorTexto) return null;
    // remover R$, espaços e pontos; converter vírgula para ponto para parse float
    const num = String(valorTexto)
      .toLowerCase()
      .replace(/[^0-9,\.]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    if (!num || Number.isNaN(Number(num))) {
      return null;
    }

    return Number(num);
  }

  function formatCurrency(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      return '';
    }
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function renderTable(pedidos) {
    tBody.innerHTML = '';
    if (!pedidos || pedidos.length === 0) {
      tBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;">Nenhum pedido encontrado.</td></tr>';
      return;
    }

    pedidos.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.pedidoId}</td>
        <td><a href="#" class="cliente-link" data-id="${item.id}">${item.cliente}</a></td>
        <td><span class="status ${formatStatus(item.status)}">${item.status === 'andamento' ? 'Em andamento' : item.status === 'atraso' ? 'Em atraso' : 'Concluído'}</span></td>
        <td>${item.prazo}</td>
        <td class="valor">${item.valor}</td>
        <td><button class="btn-excluir" data-id="${item.id}" type="button">Excluir</button></td>
      `;
      tBody.appendChild(tr);
    });
  }

  let editIndex = null;

  function fecharDetalhes() {
    modalDetalhes.classList.remove('modal-open');
    modalDetalhes.setAttribute('aria-hidden', 'true');
  }

  function abrirDetalhes(pedido) {
    fecharModal(); // garante que o modal de criação/edição esteja fechado

    document.getElementById('det-pedido').textContent = pedido.pedidoId;
    document.getElementById('det-cliente').textContent = pedido.cliente;
    document.getElementById('det-status').textContent = pedido.status === 'andamento' ? 'Em andamento' : pedido.status === 'atraso' ? 'Em atraso' : 'Concluído';
    document.getElementById('det-prazo').textContent = pedido.prazo;
    document.getElementById('det-valor').textContent = pedido.valor;
    document.getElementById('det-quantidade').textContent = pedido.quantidade || '-';
    document.getElementById('det-entrega').textContent = pedido.localEntrega || '-';
    document.getElementById('det-obs').textContent = pedido.observacoes || '-';
    document.getElementById('det-motorista').textContent = pedido.motorista || '-';
    document.getElementById('det-placa').textContent = pedido.placaVeiculo || '-';

    document.getElementById('btn-editar-pedido').dataset.id = pedido.id;

    modalDetalhes.classList.add('modal-open');
    modalDetalhes.setAttribute('aria-hidden', 'false');
  }

  function abrirEdicao(id) {
    const pedidos = getPedidosFromStorage();
    const pedido = pedidos.find((item) => item.id === id);
    if (!pedido) return;

    editIndex = id;
    formPedido.querySelector('#pedido-id').value = pedido.pedidoId;
    formPedido.querySelector('#cliente').value = pedido.cliente;
    formPedido.querySelector('#status').value = pedido.status;
    formPedido.querySelector('#prazo').value = pedido.prazo;
    formPedido.querySelector('#quantidade').value = pedido.quantidade || 1;
    formPedido.querySelector('#local-entrega').value = pedido.localEntrega || '';
    formPedido.querySelector('#observacoes').value = pedido.observacoes || '';
    formPedido.querySelector('#motorista').value = pedido.motorista || '';
    formPedido.querySelector('#placa-veiculo').value = pedido.placaVeiculo || '';
    formPedido.querySelector('#valor').value = pedido.valor;

    document.getElementById('modal-title').textContent = 'Editar Pedido';
    modalPedido.classList.add('modal-open');
    modalPedido.setAttribute('aria-hidden', 'false');
  }

  function resetForm() {
    editIndex = null;
    document.getElementById('modal-title').textContent = 'Novo Pedido';
    formPedido.reset();
  }


  function getFilteredPedidos() {
    const query = filtroPedidos.value.trim().toLowerCase();
    if (!query) {
      return getPedidosFromStorage();
    }
    return getPedidosFromStorage().filter((item) => {
      return (
        item.pedidoId.toLowerCase().includes(query) ||
        item.cliente.toLowerCase().includes(query)
      );
    });
  }

  function refreshTable() {
    const pedidos = getFilteredPedidos();
    renderTable(pedidos);
  }

  const valorInput = formPedido.querySelector('#valor');

  valorInput.addEventListener('blur', () => {
    const valor = parseValor(valorInput.value);
    if (valor !== null) {
      valorInput.value = formatCurrency(valor);
    }
  });

  formPedido.addEventListener('submit', (event) => {
    event.preventDefault();

    const pedidoId = formPedido.querySelector('#pedido-id').value.trim();
    const cliente = formPedido.querySelector('#cliente').value.trim();
    const status = formPedido.querySelector('#status').value;
    const prazo = formPedido.querySelector('#prazo').value;
    const quantidade = Number(formPedido.querySelector('#quantidade').value);
    const localEntrega = formPedido.querySelector('#local-entrega').value.trim();
    const observacoes = formPedido.querySelector('#observacoes').value.trim();
    const valorRaw = formPedido.querySelector('#valor').value.trim();

    if (!pedidoId || !cliente || !status || !prazo || !quantidade || !localEntrega || !valorRaw) {
      alert('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    const valorNumero = parseValor(valorRaw);
    if (valorNumero === null) {
      alert('Informe um valor válido para o pedido (ex: 1200, 1.200,00).');
      return;
    }

    const valor = formatCurrency(valorNumero);

    const pedidos = getPedidosFromStorage();

    if (editIndex) {
      const idx = pedidos.findIndex((item) => item.id === editIndex);
      if (idx >= 0) {
        pedidos[idx] = {
          ...pedidos[idx],
          pedidoId,
          cliente,
          status,
          prazo,
          quantidade,
          localEntrega,
          observacoes,
          motorista: formPedido.querySelector('#motorista').value.trim(),
          placaVeiculo: formPedido.querySelector('#placa-veiculo').value.trim(),
          valor,
        };
      }
    } else {
      pedidos.unshift({
        id: generateId(),
        pedidoId,
        cliente,
        status,
        prazo,
        quantidade,
        localEntrega,
        observacoes,
        motorista: formPedido.querySelector('#motorista').value.trim(),
        placaVeiculo: formPedido.querySelector('#placa-veiculo').value.trim(),
        valor,
      });
    }

    savePedidosToStorage(pedidos);

    resetForm();
    fecharModal();
    refreshTable();
  });

  btnNovoPedido.addEventListener('click', abrirModal);
  modalClose.addEventListener('click', fecharModal);

  modalPedido.addEventListener('click', (event) => {
    if (event.target === modalPedido) {
      fecharModal();
    }
  });

  const btnEditarPedido = document.getElementById('btn-editar-pedido');

  modalDetalhesClose.addEventListener('click', fecharDetalhes);

  modalDetalhes.addEventListener('click', (event) => {
    if (event.target === modalDetalhes) {
      fecharDetalhes();
    }
  });

  btnEditarPedido.addEventListener('click', () => {
    const id = btnEditarPedido.dataset.id;
    if (id) {
      modalDetalhes.classList.remove('modal-open');
      modalDetalhes.setAttribute('aria-hidden', 'true');
      abrirEdicao(id);
    }
  });

  modalDetalhes.addEventListener('click', (event) => {
    if (event.target === modalDetalhes) {
      modalDetalhes.classList.remove('modal-open');
      modalDetalhes.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modalPedido.classList.contains('modal-open')) {
        fecharModal();
      }
      if (modalDetalhes.classList.contains('modal-open')) {
        modalDetalhes.classList.remove('modal-open');
        modalDetalhes.setAttribute('aria-hidden', 'true');
      }
    }
  });

  tBody.addEventListener('click', (event) => {
    const linkCliente = event.target.closest('.cliente-link');
    if (linkCliente) {
      event.preventDefault();
      event.stopPropagation();
      const id = linkCliente.dataset.id;
      if (id) {
        const pedidos = getPedidosFromStorage();
        const pedido = pedidos.find((item) => item.id === id);
        if (pedido) abrirDetalhes(pedido);
      }
      return;
    }

    const deleteButton = event.target.closest('.btn-excluir');
    if (!deleteButton) return;

    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }

    const id = deleteButton.dataset.id;
    if (!id) return;

    const pedidos = getPedidosFromStorage();
    const updated = pedidos.filter((item) => item.id !== id);
    savePedidosToStorage(updated);
    refreshTable();
  });

  filtroPedidos.addEventListener('input', refreshTable);

  refreshTable();
});
