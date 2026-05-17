<template>
  <div class="entregas-container">
    <Menu @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <div class="content">
      <div class="header-section">
        <div>
          <h1>Entregas de EPI</h1>
          <p class="subtitulo">Registro de entrega de equipamentos aos funcionários</p>
        </div>
      </div>

      <!-- FORMULÁRIO -->
      <div class="form-container">
        <h2 class="form-titulo">Nova Entrega</h2>

        <div class="form-row">
          <div class="form-group">
            <label>Funcionário</label>
            <select v-model="form.funcionario_id" required>
              <option value="">Selecione o funcionário...</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">
                {{ f.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.epi_id" required>
              <option value="">Selecione o EPI...</option>
              <option v-for="e in epis" :key="e.id" :value="e.id">
                {{ e.nome_epi }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Quantidade</label>
            <input v-model.number="form.quantidade_entregue" type="number" min="1" />
          </div>
          <div class="form-group">
            <label>Data de Entrega</label>
            <input v-model="form.data_entrega" type="date" />
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="assinaturaConfirmada" />
            <span class="checkbox-custom"></span>
            Assinatura digital confirmada
          </label>
        </div>

        <div class="form-actions">
          <button class="btn-save" @click="registrarEntrega" :disabled="loading">
            {{ loading ? 'Registrando...' : 'Registrar Entrega' }}
          </button>
          <button class="btn-cancel" @click="resetForm">Limpar</button>
        </div>
      </div>

      <!-- HISTÓRICO -->
      <div class="historico-container">
        <div class="historico-header">
          <h2>Histórico de Entregas</h2>
          <span class="historico-count">{{ historico.length }} registro(s)</span>
        </div>

        <div v-if="loadingHistorico" class="historico-vazio">
          Carregando histórico...
        </div>

        <div v-else-if="historico.length === 0" class="historico-vazio">
          Nenhuma entrega registrada ainda.
        </div>

        <div v-else class="historico-table-wrapper">
          <table class="historico-table">
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>EPI</th>
                <th>QTD</th>
                <th>Data</th>
                <th>Assinatura</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historico" :key="item.id" class="historico-row">
                <td>{{ nomeFuncionario(item.funcionario_id) }}</td>
                <td>{{ nomeEPI(item.epi_id) }}</td>
                <td>{{ item.quantidade_entregue }}</td>
                <td>{{ formatarData(item.data_entrega) }}</td>
                <td>
                  <span :class="['badge-assinatura', item.assinatura_digital ? 'assinado' : 'pendente']">
                    {{ item.assinatura_digital ? 'Confirmada' : 'Pendente' }}
                  </span>
                </td>
                <td>
                  <span :class="['badge-status', item.status === 'OK' ? 'status-ok' : 'status-pendente']">
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-excluir" @click="excluirEntrega(item.id)" title="Excluir">🗑</button>
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

const funcionarios = ref([])
const epis = ref([])
const historico = ref([])
const assinaturaConfirmada = ref(false)

const hoje = new Date().toISOString().split('T')[0]

const form = ref({
  funcionario_id: '',
  epi_id: '',
  quantidade_entregue: 1,
  data_entrega: hoje,
})

onMounted(async () => {
  await Promise.all([carregarFuncionarios(), carregarEPIs(), carregarHistorico()])
})

async function carregarFuncionarios() {
  const { data, error } = await supabase.from('funcionarios').select('id, nome').order('nome')
  if (!error) funcionarios.value = data
}

async function carregarEPIs() {
  const { data, error } = await supabase.from('cadastro_epi').select('id, nome_epi').order('nome_epi')
  if (!error) epis.value = data
}

async function carregarHistorico() {
  loadingHistorico.value = true
  try {
    const { data, error } = await supabase
      .from('entregas')
      .select('*')
      .order('data_entrega', { ascending: false })
    if (error) throw error
    historico.value = data
  } catch (err) {
    console.error('Erro ao carregar histórico:', err.message)
  } finally {
    loadingHistorico.value = false
  }
}

async function registrarEntrega() {
  if (!form.value.funcionario_id) { alert('Selecione um funcionário.'); return }
  if (!form.value.epi_id) { alert('Selecione um EPI.'); return }
  if (form.value.quantidade_entregue < 1) { alert('Quantidade deve ser ao menos 1.'); return }

  loading.value = true
  try {
    const payload = {
      funcionario_id: form.value.funcionario_id,
      epi_id: form.value.epi_id,
      quantidade_entregue: form.value.quantidade_entregue,
      data_entrega: form.value.data_entrega || null,
      assinatura_digital: assinaturaConfirmada.value ? 'Confirmada' : null,
      status: assinaturaConfirmada.value ? 'OK' : 'Pendente'
    }

    const { error } = await supabase.from('entregas').insert([payload])
    if (error) throw error

    alert('Entrega registrada com sucesso!')
    resetForm()
    await carregarHistorico()
  } catch (err) {
    console.error('Erro detalhado:', JSON.stringify(err, null, 2))
    alert('Erro ao registrar: ' + err.message)
  } finally {
    loading.value = false
  }
}

async function excluirEntrega(id) {
  if (!confirm('Deseja excluir este registro?')) return
  try {
    const { error } = await supabase.from('entregas').delete().eq('id', id)
    if (error) throw error
    historico.value = historico.value.filter(i => i.id !== id)
  } catch (err) {
    alert('Erro ao excluir: ' + err.message)
  }
}

function resetForm() {
  form.value = { funcionario_id: '', epi_id: '', quantidade_entregue: 1, data_entrega: hoje }
  assinaturaConfirmada.value = false
}

function nomeFuncionario(id) {
  return funcionarios.value.find(f => f.id === id)?.nome || '—'
}

function nomeEPI(id) {
  return epis.value.find(e => e.id === id)?.nome_epi || '—'
}

function formatarData(data) {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.entregas-container { 
    min-height: 100vh; 
    background: #f5f5f5; 
}

.content { 
    padding: 30px; 
    margin-top: 20px; 
}

.header-section { 
    background: white; 
    padding: 20px 24px; 
    border-radius: 8px; 
    margin-bottom: 30px; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
}

.header-section h1 { 
    color: #c40000; 
    font-size: 28px; 
    margin: 0 0 4px; 
}

.subtitulo { 
    color: #777; 
    font-size: 14px; 
    margin: 0; 
}

.form-container { 
    background: white; 
    padding: 30px; 
    border-radius: 8px; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    margin-bottom: 30px; 
}

.form-titulo { 
    color: #333; 
    font-size: 18px; 
    margin: 0 0 24px; 
    padding-bottom: 12px; 
    border-bottom: 2px solid #f0f0f0; 
}

.form-group { 
    display: flex; 
    flex-direction: column; 
    margin-bottom: 20px; 
}

.form-group label { 
    font-weight: 600; 
    margin-bottom: 8px; 
    color: #333; 
    font-size: 14px; 
}

.form-group input,
.form-group select { 
    padding: 12px; 
    border: 1px solid #ddd; 
    border-radius: 4px; 
    font-size: 14px; 
    transition: border-color 0.2s; 
    background: white; 
}

.form-group input:focus,
.form-group select:focus { 
    outline: none; 
    border-color: #c40000; 
    box-shadow: 0 0 0 2px rgba(196,0,0,0.1); 
}

.form-row { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 20px; 
}

.checkbox-group { 
    flex-direction: row; 
    align-items: center; 
    margin-bottom: 24px; 
}

.checkbox-label { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    cursor: pointer; 
    font-weight: 600; 
    color: #333; 
    font-size: 14px; 
    user-select: none; 
}


.checkbox-custom 
{ width: 18px;
     height: 18px; 
     border: 2px solid #ddd; 
     border-radius: 3px; background: white; 
     transition: all 0.2s; flex-shrink: 0; 
     position: relative; 
    }

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom { 
    background: #c40000;
    border-color: #c40000; }
.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after { 
    content: '✓';
     position: absolute; 
     top: -2px; 
     left: 2px; 
     color: white; 
     font-size: 13px; 
     font-weight: 700; 
    }

.form-actions { 
    display: flex;
     gap: 10px; 
}

.btn-save { 
    background: #c40000;
     color: white;
     padding: 12px 30px; 
     border: none; 
     border-radius: 4px; 
     font-size: 15px; 
     font-weight: 700; 
     cursor: pointer; 
     transition: all 0.2s; 
}

.btn-save:hover:not(:disabled) { 
    background: #a00000;
     transform: translateY(-1px); 
     box-shadow: 0 4px 8px rgba(196,0,0,0.3); 
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
     font-size: 15px; 
     font-weight: 600; 
     cursor: pointer; 
     transition: background 0.2s; 
}

.btn-cancel:hover { 
    background: #e0e0e0; 
}

.historico-container { 
    background: white; 
    padding: 30px; 
    border-radius: 8px; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
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
    text-transform: uppercase; 
    font-size: 12px; 
    letter-spacing: 0.5px; 
}

.historico-row { 
    border-bottom: 1px solid #f0f0f0; 
    transition: background 0.15s;
}

.historico-row:hover { 
    background: #fff8f8; 
}

.historico-table td { 
    padding: 12px 14px; 
    color: #333; 
    white-space: nowrap; 
}

.badge-assinatura, .badge-status { 
    border-radius: 12px; 
    padding: 4px 12px; 
    font-size: 12px; 
    font-weight: 700; 
}

.assinado { 
    background: #e8f5e9; 
    color: #2e7d32; 
}

.pendente { 
    background: #fff8e1; 
    color: #e65100;
}

.status-ok { 
    background: #e8f5e9; 
    color: #2e7d32; 
}

.status-pendente { 
    background: #fff8e1;
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

@media (max-width: 768px) {
  .form-row { 
    grid-template-columns: 1fr; 
}

  .form-actions { 
    flex-direction: column; 
}

  .btn-save, .btn-cancel {
     width: 100%; text-align: center; 
}

}
</style>