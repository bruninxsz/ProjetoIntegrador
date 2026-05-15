<template>
  <div class="cadastro-container">
    <Menu @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="content">
      <div class="header-section">
        <h1>Cadastro de EPI</h1>
      </div>

      <form class="form-container" @submit.prevent="salvarEPI">
        <div class="form-group">
          <label>Nome do EPI</label>
          <input v-model="form.nome_epi" type="text" placeholder="Ex: Luva de Raspa" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Código/SKU (CA)</label>
            <input v-model="form.ca" type="text" placeholder="Digite o CA" />
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="form.categoria">
              <option value="">Selecione uma categoria</option>
              <option>Proteção da Cabeça</option>
              <option>Proteção dos Olhos</option>
              <option>Proteção Auditiva</option>
              <option>Proteção Respiratória</option>
              <option>Proteção das Mãos</option>
              <option>Proteção dos Pés</option>
              <option>Proteção Corporal</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Quantidade em Estoque</label>
            <input v-model.number="form.quantidade" type="number" min="0" />
          </div>
          <div class="form-group">
            <label>Quantidade Mínima</label>
            <input v-model.number="form.qtd_minima" type="number" min="0" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data de Vencimento</label>
            <input v-model="form.data_vencimento" type="date" />
          </div>
          <div class="form-group">
            <label>Valor Unitário (R$)</label>
            <input v-model.number="form.valor_unitario" type="number" step="0.01" min="0" />
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.descricao" placeholder="Descrição do EPI" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label>Fornecedor</label>
          <input v-model="form.fornecedor" type="text" placeholder="Nome do fornecedor" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
          <button type="button" class="btn-cancel" @click="resetForm">Limpar</button>
        </div>
      </form>

      <!-- HISTÓRICO -->
      <div class="historico-container">
        <div class="historico-header">
          <h2>Histórico de Cadastros</h2>
          <span class="historico-count">{{ historico.length }} registro(s)</span>
        </div>

        <div v-if="loadingHistorico" class="historico-loading">
          Carregando histórico...
        </div>

        <div v-else-if="historico.length === 0" class="historico-vazio">
          Nenhum EPI cadastrado ainda.
        </div>

        <div v-else class="historico-table-wrapper">
          <table class="historico-table">
            <thead>
              <tr>
                <th>Nome do EPI</th>
                <th>CA</th>
                <th>Categoria</th>
                <th>Qtd. Estoque</th>
                <th>Qtd. Mínima</th>
                <th>Vencimento</th>
                <th>Valor Unit.</th>
                <th>Fornecedor</th>
                <th>Cadastrado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historico" :key="item.id" class="historico-row">
                <td>{{ item.nome_epi }}</td>
                <td>{{ item.ca || '—' }}</td>
                <td>
                  <span class="badge">{{ item.categoria || '—' }}</span>
                </td>
                <td>
                  <span :class="['qtd', item.quantidade <= item.qtd_minima ? 'qtd-baixa' : 'qtd-ok']">
                    {{ item.quantidade }}
                  </span>
                </td>
                <td>{{ item.qtd_minima }}</td>
                <td>{{ formatarData(item.data_vencimento) }}</td>
                <td>{{ formatarValor(item.valor_unitario) }}</td>
                <td>{{ item.fornecedor || '—' }}</td>
                <td>{{ formatarDataHora(item.created_at) }}</td>
                <td>
                  <button class="btn-excluir" @click="excluirEPI(item.id)" title="Excluir">
                    🗑
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import Menu from '../components/Menu.vue'
import Sidebar from '../components/Sidebar.vue'

const { supabase } = useSupabase()

const sidebarOpen = ref(false)
const loading = ref(false)
const loadingHistorico = ref(false)
const historico = ref([])

const form = ref({
  nome_epi: '',
  ca: '',
  categoria: '',
  quantidade: 0,
  qtd_minima: 0,
  data_vencimento: '',
  valor_unitario: 0,
  descricao: '',
  fornecedor: ''
})

// Carrega histórico ao montar o componente
onMounted(() => {
  carregarHistorico()
})

async function carregarHistorico() {
  loadingHistorico.value = true
  try {
    const { data, error } = await supabase
      .from('cadastro_epi')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    historico.value = data
  } catch (err) {
    console.error('Erro ao carregar histórico:', err.message)
  } finally {
    loadingHistorico.value = false
  }
}

async function salvarEPI() {
  loading.value = true
  try {
    const payload = { ...form.value }

    if (!payload.data_vencimento) delete payload.data_vencimento
    if (!payload.ca) delete payload.ca
    if (!payload.descricao) delete payload.descricao
    if (!payload.fornecedor) delete payload.fornecedor
    if (!payload.categoria) delete payload.categoria

    const { error } = await supabase
      .from('cadastro_epi')
      .insert([payload])

    if (error) throw error

    alert('EPI cadastrado com sucesso!')
    resetForm()
    await carregarHistorico() // atualiza o histórico após salvar
  } catch (err) {
    alert('Erro ao salvar: ' + err.message)
  } finally {
    loading.value = false
  }
}

async function excluirEPI(id) {
  if (!confirm('Deseja excluir este registro?')) return
  try {
    const { error } = await supabase
      .from('cadastro_epi')
      .delete()
      .eq('id', id)

    if (error) throw error
    historico.value = historico.value.filter(item => item.id !== id)
  } catch (err) {
    alert('Erro ao excluir: ' + err.message)
  }
}

function resetForm() {
  form.value = {
    nome_epi: '',
    ca: '',
    categoria: '',
    quantidade: 0,
    qtd_minima: 0,
    data_vencimento: '',
    valor_unitario: 0,
    descricao: '',
    fornecedor: ''
  }
}

function formatarData(data) {
  if (!data) return '—'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarDataHora(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR')
}

function formatarValor(valor) {
  if (!valor && valor !== 0) return '—'
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<style scoped>
.cadastro-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  padding: 30px;
  margin-top: 20px;
}

/* Formulário */
.form-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px; 
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #c40000;
  box-shadow: 0 0 0 2px rgba(196,0,0,0.1); 
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px; 
}

.form-actions {
  display: flex; 
  gap: 10px; 
  margin-top: 30px; 
}

.btn-save { 
  background: #c40000; 
  color: white; 
  padding: 12px 30px; 
  border: none; 
  border-radius: 4px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: background 0.2s; 
}

.btn-save:hover:not(:disabled) { 
  background: #a00000; 
}

.btn-save:disabled { 
  opacity: 0.7; 
  cursor: not-allowed; 
}

.btn-cancel { 
  background: #f0f0f0; 
  color: #333; 
  padding: 12px 30px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: background 0.2s; 
}

.btn-cancel:hover { 
  background: #e0e0e0; 
}

/* Histórico */
.historico-container { 
  background: white; 
  padding: 30px; 
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
  margin-top: 30px; 
}

.historico-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  margin-bottom: 20px; 
}

.historico-header h2 { 
  color: #c40000; 
  font-size: 22px; 
  margin: 0; 
}

.historico-count { 
  background: #f0f0f0; 
  color: #555; 
  font-size: 13px; 
  padding: 4px 12px; 
  border-radius: 20px; 
  font-weight: 600; 
}

.historico-loading,
.historico-vazio { 
  text-align: center; 
  color: #999; 
  padding: 40px; 
  font-size: 15px; 
}

.historico-table-wrapper { 
  overflow-x: auto; 
}

.historico-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 14px; 
}

.historico-table thead tr { 
  background: #fafafa; 
  border-bottom: 2px solid #eee; 
}

.historico-table th { 
  padding: 12px 14px; 
  text-align: left; 
  font-weight: 700; 
  color: #555; 
  white-space: nowrap; 
}
.historico-row { 
  border-bottom: 1px solid #f0f0f0; 
  transition: background 0.15s; 
}

.historico-row:hover { 
  background: #fff8f8; 
}

.historico-table td { 
  padding: 12px 14px; color: #333; white-space: nowrap; 
}

.badge { 
  background: #fff0f0; 
  color: #c40000; 
  border: 1px solid #ffd0d0; 
  border-radius: 12px; 
  padding: 3px 10px; 
  font-size: 12px; 
  font-weight: 600; 
}

.qtd { 
  font-weight: 700; 
  padding: 3px 10px; 
  border-radius: 12px; 
  font-size: 13px; 
}

.qtd-ok { 
  background: #e8f5e9; 
  color: #2e7d32; 
}

.qtd-baixa { 
  background: #fff3e0; 
  color: #e65100; 
}

.btn-excluir { 
  background: none; 
  border: none; 
  cursor: pointer; 
  font-size: 16px; 
  padding: 4px 8px; 
  border-radius: 4px; 
  transition: background 0.15s; 
}

.btn-excluir:hover { 
  background: #fff0f0; 
  }
  
</style>