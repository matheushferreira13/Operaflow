document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'operaflow_pedidos';

  function seedDefaultPedidos() {
    return [
      { id: 'seed-1', pedidoId: '#11568', cliente: 'UltiTrans', status: 'andamento', prazo: '2026-03-26', valor: 'R$26.000,00', quantidade: 50, localEntrega: 'Av. Brasil, 1500, Centro', observacoes: 'Entrega na manhã', motorista: 'Carlos Silva', placaVeiculo: 'ABC-1234' },
      { id: 'seed-2', pedidoId: '#12444', cliente: 'RLM Transportadora', status: 'andamento', prazo: '2026-04-05', valor: 'R$16.500,00', quantidade: 30, localEntrega: 'Rua das Flores, 67, Jardim', observacoes: 'Agendar com 2 dias de antecedência', motorista: 'Ana Pereira', placaVeiculo: 'XYZ-5678' },
      { id: 'seed-3', pedidoId: '#00345', cliente: 'TripTrans', status: 'atraso', prazo: '2026-03-13', valor: 'R$22.300,00', quantidade: 40, localEntrega: 'Rodovia SP-123, Km 17', observacoes: 'Projeto especial', motorista: 'Ricardo Moura', placaVeiculo: 'DEF-9876' },
      { id: 'seed-4', pedidoId: '#00711', cliente: 'LogiFácil', status: 'concluido', prazo: '2026-03-15', valor: 'R$8.450,00', quantidade: 10, localEntrega: 'Av. Paulista, 2000 - São Paulo', observacoes: 'Urgente', motorista: 'Paula Souza', placaVeiculo: 'GHI-1010' },
      { id: 'seed-5', pedidoId: '#00712', cliente: 'TransCargo', status: 'andamento', prazo: '2026-03-18', valor: 'R$4.950,00', quantidade: 12, localEntrega: 'Rua 7 de Setembro, 120, Curitiba', observacoes: 'Acompanhar pelo tracking', motorista: 'João Alves', placaVeiculo: 'JKL-1112' },
      { id: 'seed-6', pedidoId: '#00713', cliente: 'CargoMax', status: 'atraso', prazo: '2026-03-14', valor: 'R$12.300,00', quantidade: 22, localEntrega: 'Av. Brasil, 2100, Salvador', observacoes: 'Documento pendente', motorista: 'Fernanda Reis', placaVeiculo: 'MNO-1314' },
      { id: 'seed-7', pedidoId: '#00714', cliente: 'EntregaExpress', status: 'concluido', prazo: '2026-03-10', valor: 'R$28.200,00', quantidade: 60, localEntrega: 'Av. Oceanica, 500, Rio', observacoes: 'Entrega noturna', motorista: 'Rafael Costa', placaVeiculo: 'PQR-1516' },
      { id: 'seed-8', pedidoId: '#00715', cliente: 'BrasilFrete', status: 'andamento', prazo: '2026-03-24', valor: 'R$35.600,00', quantidade: 80, localEntrega: 'Rodovia BR-101, Km 31', observacoes: 'Bloqueio aduaneiro', motorista: 'Mateus Lima', placaVeiculo: 'STU-1718' },
      { id: 'seed-9', pedidoId: '#00716', cliente: 'LogServe', status: 'concluido', prazo: '2026-03-09', valor: 'R$6.950,00', quantidade: 14, localEntrega: 'Rua das Acácias, 10, Porto Alegre', observacoes: 'Retirada às 8h', motorista: 'Isabela Melo', placaVeiculo: 'VWX-1920' },
      { id: 'seed-10', pedidoId: '#00717', cliente: 'RotaSegura', status: 'andamento', prazo: '2026-03-22', valor: 'R$19.800,00', quantidade: 25, localEntrega: 'Av. Amazonas, 777, Manaus', observacoes: 'Acompanhar seguro', motorista: 'Carlos Freitas', placaVeiculo: 'YZA-2122' },
    ];
  }

  function getPedidosFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = seedDefaultPedidos();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    try {
      const parsed = JSON.parse(raw) || [];
      if (parsed.length === 0) {
        const seed = seedDefaultPedidos();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return parsed;
    } catch (error) {
      console.warn('Erro ao ler pedidos do storage em dashboard:', error);
      const seed = seedDefaultPedidos();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
  }

  function parseValor(valorTexto) {
    if (!valorTexto) return 0;
    const num = String(valorTexto)
      .toLowerCase()
      .replace(/[^0-9,\.]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.')
    ;
    if (!num || Number.isNaN(Number(num))) return 0;
    return Number(num);
  }

  function formatCurrency(amount) {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  }

  function renderKpis(pedidos) {
    const total = pedidos.length;
    const concluido = pedidos.filter((item) => item.status === 'concluido').length;
    const pendente = pedidos.filter((item) => item.status !== 'concluido').length;
    const receita = pedidos.reduce((acc, item) => acc + parseValor(item.valor), 0);
    const receitaConcluida = pedidos
      .filter((item) => item.status === 'concluido')
      .reduce((acc, item) => acc + parseValor(item.valor), 0);

    document.querySelector('#kpi-pedidos .kpi-value').textContent = total;
    document.querySelector('#kpi-entregas .kpi-value').textContent = concluido;
    document.querySelector('#kpi-pendencias .kpi-value').textContent = pendente;
    document.querySelector('#kpi-receita .kpi-value').textContent = formatCurrency(receita);
    document.querySelector('#kpi-receita .kpi-subvalue').textContent = `Concluídas: ${formatCurrency(receitaConcluida)}`;
  }

  function renderTabela(pedidos) {
    const tbody = document.querySelector('.table-card tbody');
    if (!tbody) return;

    const recentes = [...pedidos]
      .slice(-5)
      .reverse();

    tbody.innerHTML = recentes
      .map((pedido) => {
        const statusLabel = pedido.status === 'andamento' ? 'Em andamento' : pedido.status === 'atraso' ? 'Em atraso' : 'Concluído';
        const statusClass = pedido.status === 'andamento' ? 'status-andamento' : pedido.status === 'atraso' ? 'status-atraso' : 'status-concluido';
        return `
          <tr>
            <td>${pedido.pedidoId}</td>
            <td>${pedido.cliente}</td>
            <td><span class="status ${statusClass}">${statusLabel}</span></td>
            <td>${pedido.prazo}</td>
            <td class="valor">${pedido.valor}</td>
          </tr>
        `;
      })
      .join('');

    if (recentes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;">Nenhum pedido cadastrado.</td></tr>';
    }
  }

  function atualizarDashboard() {
    const pedidos = getPedidosFromStorage();
    renderKpis(pedidos);
    renderTabela(pedidos);
  }

  const btnVerTudo = document.querySelector('.table-card .btn-secundario');
  if (btnVerTudo) {
    btnVerTudo.addEventListener('click', () => {
      window.location.href = './pedidos.html';
    });
  }

  ['kpi-pedidos', 'kpi-entregas', 'kpi-pendencias', 'kpi-receita'].forEach((id) => {
    const card = document.getElementById(id);
    if (card) {
      card.addEventListener('click', () => {
        window.location.href = './pedidos.html';
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = './pedidos.html';
        }
      });
    }
  });

  atualizarDashboard();
});