<template>
  <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
  <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
  <div class="app-container">

    <main class="main-content">
      <!-- Cards -->
      <div class="cards-grid">
        <div class="card">
          <h2>{{ totalEPIs }}</h2>
          <p>TOTAL</p>
        </div>
        <div class="card">
          <h2>{{ emUso }}</h2>
          <p>Em Uso</p>
        </div>
        <div class="card">
          <h2>{{ proximosVencimento }}</h2>
          <p>Próximos Vencimentos</p>
        </div>
        <div class="card">
          <h2>{{ vencidos }}</h2>
          <p>Vencidos</p>
        </div>
      </div>

      <!-- Filtros + Tabela -->
      <section class="table-container">
        <div class="filters">
          <div class="field">
            <label>Buscar</label>
            <input v-model="filtroNome" type="text" placeholder="Filtrar nome..." />
          </div>

          <div class="field">
            <label>Situação</label>
            <select v-model="filtroSituacao">
              <option value="">Todos</option>
              <option value="ok">OK</option>
              <option value="vencendo">Próximo ao Vencimento</option>
              <option value="vencido">Vencido</option>
              <option value="sem_vencimento">Sem Vencimento</option>
            </select>
          </div>

          <button class="export-btn" @click="exportarCSV">Exportar</button>
        </div>

        <div v-if="loading" class="empty-state">Carregando...</div>

        <table v-else>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CA</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Qtd. Mínima</th>
              <th>Em Uso</th>
              <th>Data Vencimento</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="episFiltrados.length === 0">
              <td colspan="8" class="empty-state">Nenhum registro encontrado</td>
            </tr>
            <tr v-for="epi in episFiltrados" :key="epi.id">
              <td>{{ epi.nome_epi }}</td>
              <td>{{ epi.ca || '—' }}</td>
              <td>{{ epi.categoria || '—' }}</td>
              <td>
                <span :class="['qtd', epi.quantidade <= epi.qtd_minima ? 'qtd-baixa' : 'qtd-ok']">
                  {{ epi.quantidade }}
                </span>
              </td>
              <td>{{ epi.qtd_minima }}</td>
              <td>
                <span :class="['badge', quantidadeEmUso(epi.id) > 0 ? 'em-uso' : 'sem-uso']">
                  {{ quantidadeEmUso(epi.id) > 0 ? quantidadeEmUso(epi.id) + ' entregue(s)' : 'Não' }}
                </span>
              </td>
              <td>{{ formatarData(epi.data_vencimento) }}</td>
              <td>
                <span :class="['badge', situacaoClasse(epi.data_vencimento)]">
                  {{ situacaoTexto(epi.data_vencimento) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <footer class="footer">
      <h2>SENAI</h2>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import Header from '../components/Menu.vue'
import Sidebar from '../components/Sidebar.vue'

const { supabase } = useSupabase()

const sidebarOpen = ref(false)
const loading = ref(false)
const epis = ref([])
const entregas = ref([])
const filtroNome = ref('')
const filtroSituacao = ref('')

onMounted(() => carregarDados())

async function carregarDados() {
  loading.value = true
  try {
    const [resEPIs, resEntregas] = await Promise.all([
      supabase.from('cadastro_epi').select('*').order('nome_epi'),
      supabase.from('entregas').select('epi_id, quantidade_entregue')
    ])
    if (resEPIs.error) throw resEPIs.error
    if (resEntregas.error) throw resEntregas.error
    epis.value = resEPIs.data
    entregas.value = resEntregas.data
  } catch (err) {
    console.error('Erro ao carregar dados:', err.message)
  } finally {
    loading.value = false
  }
}

// ─── Cards ────────────────────────────────────────────────
const totalEPIs = computed(() => epis.value.length)

const emUso = computed(() => {
  const idsComEntrega = new Set(entregas.value.map(e => e.epi_id))
  return epis.value.filter(e => idsComEntrega.has(e.id)).length
})

const proximosVencimento = computed(() => {
  const hoje = new Date()
  const limite = new Date()
  limite.setDate(hoje.getDate() + 30)
  return epis.value.filter(e => {
    if (!e.data_vencimento) return false
    const venc = new Date(e.data_vencimento)
    return venc >= hoje && venc <= limite
  }).length
})

const vencidos = computed(() => {
  const hoje = new Date()
  return epis.value.filter(e => {
    if (!e.data_vencimento) return false
    return new Date(e.data_vencimento) < hoje
  }).length
})

// ─── Quantidade em uso por EPI ────────────────────────────
function quantidadeEmUso(epiId) {
  return entregas.value
    .filter(e => e.epi_id === epiId)
    .reduce((acc, e) => acc + (e.quantidade_entregue || 0), 0)
}

// ─── Filtros ──────────────────────────────────────────────
const episFiltrados = computed(() => {
  return epis.value.filter(e => {
    const nomeOk = e.nome_epi.toLowerCase().includes(filtroNome.value.toLowerCase())
    const situacao = getSituacao(e.data_vencimento)
    const situacaoOk = filtroSituacao.value === '' || situacao === filtroSituacao.value
    return nomeOk && situacaoOk
  })
})

// ─── Situação ─────────────────────────────────────────────
function getSituacao(dataVencimento) {
  if (!dataVencimento) return 'sem_vencimento'
  const hoje = new Date()
  const venc = new Date(dataVencimento)
  const limite = new Date()
  limite.setDate(hoje.getDate() + 30)
  if (venc < hoje) return 'vencido'
  if (venc <= limite) return 'vencendo'
  return 'ok'
}

function situacaoTexto(dataVencimento) {
  const map = { ok: 'OK', vencendo: 'Próximo ao Vencimento', vencido: 'Vencido', sem_vencimento: 'Sem Vencimento' }
  return map[getSituacao(dataVencimento)]
}

function situacaoClasse(dataVencimento) {
  return getSituacao(dataVencimento)
}

// ─── Formatação ───────────────────────────────────────────
function formatarData(data) {
  if (!data) return '—'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

// ─── Exportar CSV ─────────────────────────────────────────
function exportarCSV() {
  const cabecalho = ['Nome', 'CA', 'Categoria', 'Quantidade', 'Qtd. Mínima', 'Em Uso', 'Data Vencimento', 'Situação']
  const linhas = episFiltrados.value.map(e => [
    e.nome_epi,
    e.ca || '',
    e.categoria || '',
    e.quantidade,
    e.qtd_minima,
    quantidadeEmUso(e.id),
    formatarData(e.data_vencimento),
    situacaoTexto(e.data_vencimento)
  ])
  const csv = [cabecalho, ...linhas].map(l => l.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'epis.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
  font-family: Arial, sans-serif; 
}

.app-container { 
  min-height: 100vh; 
  background: #f5f5f5; 
  display: flex; 
  flex-direction: column; 
}

.main-content { 
  padding: 25px;
  flex: 1; 
}

/* Cards */
.cards-grid { 
  display: grid; 
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px; 
  margin-bottom: 25px; 
}

.card { background: white; 
  padding: 25px 20px; 
  border-radius: 8px; 
  text-align: center; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.08); 
}

.card h2 { 
  color: #c40000; 
  font-size: 36px; 
  margin-bottom: 6px; 
}

.card p { 
  color: #555; 
  font-size: 13px; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
}

/* Tabela */
.table-container { 
  background: white; 
  border-radius: 8px;
  overflow: hidden; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.08); 
}

.filters { 
  display: flex; 
  gap: 15px; 
  align-items: flex-end; 
  padding: 20px; 
  flex-wrap: wrap; 
}

.field { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
  flex: 1; 
  min-width: 150px; 
}

.field label { 
  font-size: 13px; 
  font-weight: 600; 
  color: #333; 
}

.field input,
.field select { 
  padding: 10px; 
  border: 1px solid #ddd; 
  border-radius: 5px; 
  font-size: 14px; 
}

.field input:focus,
.field select:focus { 
  outline: none; 
  border-color: #c40000; 
  box-shadow: 0 0 0 2px rgba(196,0,0,0.1); 
}

.export-btn { 
  background: #c40000; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 5px; 
  cursor: pointer; 
  font-weight: 600; 
  font-size: 14px; 
  transition: background 0.2s; 
  white-space: nowrap; 
}

.export-btn:hover { 
  background: #a00000; 
}

table { 
  width: 100%; 
  border-collapse: collapse; 
}

thead { 
  background: #c40000; 
  color: white; 
}

th, td { 
  padding: 14px 15px; 
  text-align: center; 
  border-bottom: 1px solid #eee; 
  font-size: 14px; 
}

th { 
  font-weight: 700; 
  font-size: 13px; 
  letter-spacing: 0.3px; 
}

tbody tr:hover { 
  background: #fff8f8; 
}

.empty-state { 
  padding: 40px; 
  color: #777; 
  text-align: center; 
}

/* Badges situação */
.badge { 
  border-radius: 12px; 
  padding: 4px 12px; 
  font-size: 12px; 
  font-weight: 700; 
}

.ok { 
  background: #e8f5e9; 
  color: #2e7d32; 
}

.vencendo { 
  background: #fff8e1; 
  color: #e65100; 
}

.vencido { 
  background: #ffebee; 
  color: #c40000; 
}

.sem_vencimento {
  background: #f0f0f0; 
  color: #777; 
}

.em-uso { 
  background: #e3f2fd; 
  color: #1565c0; 
}

.sem-uso { 
  background: #f0f0f0; 
  color: #777; 
}

/* Quantidade */
.qtd { 
  border-radius: 12px; 
  padding: 3px 10px; 
  font-size: 13px; 
  font-weight: 700; 
}

.qtd-ok { 
  background: #e8f5e9; 
  color: #2e7d32; 
}

.qtd-baixa { 
  background: #fff8e1; 
  color: #e65100; 
}

.footer { 
  background: #c40000; 
  color: white; 
  padding: 15px 25px; 
  font-size: 24px; 
  font-style: italic; 
}
  
</style>