<template>
  <div class="page">
    <Menu @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <div class="layout-container">
      <header class="header-section">
        <h1>Painel de Controle de EPIs</h1>
        <p>Gestão de inventário e rastreabilidade de entregas.</p>
      </header>

      <div v-if="loadingEstoque || loading" class="info-banner">Sincronizando dados com o servidor...</div>

      <div class="dashboard-grid">
        <div class="card chart-card">
          <div class="card-header"><h3>Saúde do Inventário</h3></div>
          <div class="chart-container">
            <Pie 
              v-if="estoqueProcessado.length > 0" 
              :data="pieChartData" 
              :options="chartOptions" 
              :key="'pie-' + componentKey"
            />
            <div v-else class="placeholder">Aguardando dados...</div>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header"><h3>Níveis Críticos</h3></div>
          <div class="chart-container">
            <Bar 
              v-if="estoqueProcessado.length > 0" 
              :data="barChartData" 
              :options="chartOptions" 
              :key="'bar-' + componentKey"
            />
            <div v-else class="placeholder">Analisando níveis...</div>
          </div>
        </div>
      </div>

      <div class="card filter-card">
        <div class="filter-grid">
          <div class="form-group row-funcionario">
            <label>Funcionário</label>
            <select v-model="filtros.funcionario_id">
              <option value="">Todos os Colaboradores</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Data Início</label>
            <input type="date" v-model="filtros.data_inicio" />
          </div>
          <div class="form-group">
            <label>Data Fim</label>
            <input type="date" v-model="filtros.data_fim" />
          </div>
        </div>
        
        <div class="action-bar">
          <button class="btn btn-primary" @click="buscarTudo" :disabled="loading">🔄 Atualizar</button>
          <button class="btn btn-pdf" @click="exportarPDF" :disabled="entregas.length === 0">📄 Gerar PDF</button>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Funcionário</th>
                <th>EPI</th>
                <th class="text-center">Qtd</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in entregas" :key="e.id">
                <td>{{ formatarData(e.data_entrega) }}</td>
                <td><strong>{{ e.funcionarios?.nome || 'N/A' }}</strong></td>
                <td>{{ e.cadastro_epi?.nome_epi || 'EPI não vinculado' }}</td>
                <td class="text-center">{{ e.quantidade_entregue }}</td>
                <td class="text-center">
                  <span :class="e.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                    {{ e.assinatura_digital ? 'OK' : 'Pendente' }}
                  </span>
                </td>
              </tr>
              <tr v-if="entregas.length === 0">
                <td colspan="5" class="text-center">Nenhuma entrega encontrada.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { useSupabase } from '../composables/useSupabase'
import Menu from '../components/Menu.vue'
import Sidebar from '../components/Sidebar.vue'

const { supabase } = useSupabase()

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

// Estados Reativos
const entregas = ref([])
const funcionarios = ref([])
const estoqueProcessado = ref([])
const componentKey = ref(0)
const filtros = ref({ funcionario_id: '', data_inicio: '', data_fim: '' })

const sidebarOpen = ref(false)
const loading = ref(false)
const loadingEstoque = ref(false)

// Configurações do Gráfico
const chartOptions = { 
  responsive: true, 
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { boxWidth: 40, padding: 10 }
    }
  }
}

// Gráficos Computados
const pieChartData = computed(() => {
  const data = estoqueProcessado.value || []
  return {
    labels: ['OK', 'Baixo', 'Esgotado'],
    datasets: [{
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      data: [
        data.filter(i => i.quantidade >= 10).length,
        data.filter(i => i.quantidade < 10 && i.quantidade > 0).length,
        data.filter(i => i.quantidade <= 0).length
      ]
    }]
  }
})

const barChartData = computed(() => {
  const criticos = [...estoqueProcessado.value].sort((a, b) => a.quantidade - b.quantidade).slice(0, 5)
  return {
    labels: criticos.map(i => i.nome_epi || 'EPI Desconhecido'),
    datasets: [{ label: 'Estoque', backgroundColor: '#ef4444', data: criticos.map(i => i.quantidade) }]
  }
})

// Busca os EPIs e calcula as quantidades com base nas entregas
async function carregarEstoqueEfetivo() {
  loadingEstoque.value = true
  try {
    // Removemos a coluna que causou o erro 400. Buscamos apenas o que é garantido existir.
    const [resEpis, resEntregasGerais] = await Promise.all([
      supabase.from('cadastro_epi').select('id, nome_epi'), 
      supabase.from('entregas').select('epi_id, quantidade_entregue') 
    ])

    if (resEpis.error) throw resEpis.error
    if (resEntregasGerais.error) throw resEntregasGerais.error

    const todasEntregas = resEntregasGerais.data || []

    estoqueProcessado.value = (resEpis.data || []).map(epi => {
      // Soma o total que saiu desse EPI
      const totalEntregue = todasEntregas
        .filter(entrega => entrega.epi_id === epi.id)
        .reduce((acc, curr) => acc + (curr.quantidade_entregue || 0), 0)

      // Se seu banco tiver estoque fixo, mude o 50 para a quantidade padrão do seu almoxarifado
      const estoqueSimuladoInicial = 50 
      const quantidadeAtual = estoqueSimuladoInicial - totalEntregue

      return {
        id: epi.id,
        nome_epi: epi.nome_epi,
        quantidade: quantidadeAtual < 0 ? 0 : quantidadeAtual
      }
    })

    componentKey.value++
  } catch (err) {
    console.error("Erro ao calcular estoque:", err.message)
  } finally {
    loadingEstoque.value = false
  }
}

// Filtra e busca o histórico de entregas para listar na tabela
async function buscarEntregas() {
  loading.value = true
  try {
    let query = supabase
      .from('entregas')
      .select('*, funcionarios(nome), cadastro_epi(nome_epi, ca)')
      .order('data_entrega', { ascending: false })
      
    if (filtros.value.funcionario_id) query = query.eq('funcionario_id', filtros.value.funcionario_id)
    if (filtros.value.data_inicio) query = query.gte('data_entrega', filtros.value.data_inicio)
    if (filtros.value.data_fim) query = query.lte('data_entrega', filtros.value.data_fim)
    
    const { data, error } = await query
    if (error) throw error
    entregas.value = data || []
  } catch (err) {
    console.error("Erro entregas:", err.message)
  } finally {
    loading.value = false
  }
}

async function carregarFuncionarios() {
  const { data } = await supabase.from('funcionarios').select('id, nome').order('nome')
  funcionarios.value = data || []
}

function exportarPDF() {
  const doc = new jsPDF()
  doc.text('Relatório de Entregas', 14, 20)
  autoTable(doc, {
    startY: 30,
    head: [['Data', 'Funcionário', 'EPI', 'Qtd', 'Status']],
    body: entregas.value.map(e => [
      formatarData(e.data_entrega),
      e.funcionarios?.nome || 'N/A',
      e.cadastro_epi?.nome_epi || 'N/A',
      e.quantidade_entregue,
      e.assinatura_digital ? 'Assinado' : 'Pendente'
    ]),
  })
  doc.save('relatorio.pdf')
}

const buscarTudo = () => { carregarEstoqueEfetivo(); buscarEntregas(); }
const formatarData = (d) => d ? new Date(d).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '—'

onMounted(() => { carregarFuncionarios(); buscarTudo(); })
</script>

<style scoped>
/* Base sem padding geral para o Menu colar 100% no topo e lados */
.page {
  background-color: #f3f4f6;
  min-height: 100vh;
  width: 100%;
}

/* Espaçamento controlado apenas para o miolo do painel */
.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px; /* Margem interna perfeita igual à do print */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Estilo padrão dos Cards */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
}

/* Cabeçalho do conteúdo */
.header-section h1 { font-size: 1.6rem; font-weight: bold; color: #111827; margin: 0; }
.header-section p { color: #6b7280; margin: 5px 0 0 0; font-size: 0.95rem; }

/* Grid de Gráficos */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr 1fr; }
}

.chart-container {
  height: 260px;
  position: relative;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
}

/* Filtros */
.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

@media (min-width: 768px) {
  .filter-grid { grid-template-columns: 2fr 1fr 1fr; }
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

input, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  background-color: #fff;
}

/* Barra de Ações com botões perfeitamente divididos */
.action-bar {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (min-width: 640px) {
  .action-bar { 
    flex-direction: row; 
    width: 100%;
  }
}

.btn {
  padding: 12px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
}

.btn-primary { background: #3b82f6; }
.btn-primary:hover { background: #2563eb; }
.btn-pdf { background: #10b981; }
.btn-pdf:hover { background: #059669; }

/* Tabela */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th {
  background: #f9fafb;
  padding: 14px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 2px solid #f3f4f6;
}

.styled-table td {
  padding: 14px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.95rem;
  color: #1f2937;
}

/* Badges */
.badge {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
}
.badge-ok { background: #dcfce7; color: #16a34a; }
.badge-warn { background: #fee2e2; color: #dc2626; }

/* Banner */
.info-banner {
  background: #dbeafe;
  color: #1e40af;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.text-center { text-align: center; }
</style>