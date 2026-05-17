<template>
  <div class="cadastro-container">
    <Menu @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="content">
      <div class="header-section">
        <h1>Cadastro de Funcionário</h1>
      </div>

      <form class="form-container" @submit.prevent="salvarFuncionario">
        <div class="form-group">
          <label>Nome Completo</label>
          <input v-model="form.nome" type="text" placeholder="Digite o nome completo" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>CPF</label>
            <input
              v-model="form.cpf"
              type="text"
              placeholder="000.000.000-00"
              @input="mascaraCPF"
              @blur="tocado.cpf = true"
              maxlength="14"
              :class="{ 'input-erro': tocado.cpf && form.cpf && !cpfValido }"
            />
            <span class="msg-erro" v-if="tocado.cpf && form.cpf && !cpfValido">CPF incompleto (precisa de 11 dígitos)</span>
            <span class="msg-ok" v-if="tocado.cpf && form.cpf && cpfValido">CPF válido ✓</span>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Telefone</label>
            <input
              v-model="form.telefone"
              type="text"
              placeholder="(00) 00000-0000"
              @input="mascaraTelefone"
              @blur="tocado.telefone = true"
              maxlength="15"
              :class="{ 'input-erro': tocado.telefone && form.telefone && !telefoneValido }"
            />
            <span class="msg-erro" v-if="tocado.telefone && form.telefone && !telefoneValido">Telefone incompleto (precisa de 10 ou 11 dígitos)</span>
            <span class="msg-ok" v-if="tocado.telefone && form.telefone && telefoneValido">Telefone válido ✓</span>
          </div>
          <div class="form-group">
            <label>Cargo</label>
            <input v-model="form.cargo" type="text" placeholder="Digite o cargo" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data de Admissão</label>
            <input v-model="form.data_admissao" type="date" />
          </div>
          <div class="form-group">
            <label>Departamento</label>
            <select v-model="form.departamento">
              <option value="">Selecione um departamento</option>
              <option>Gerência</option>
              <option>Operacional</option>
              <option>Administrativo</option>
            </select>
          </div>
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

        <div v-if="loadingHistorico" class="historico-vazio">
          Carregando histórico...
        </div>

        <div v-else-if="historico.length === 0" class="historico-vazio">
          Nenhum funcionário cadastrado ainda.
        </div>

        <div v-else class="historico-table-wrapper">
          <table class="historico-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Admissão</th>
                <th>Cadastrado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historico" :key="item.id" class="historico-row">
                <td>{{ item.nome }}</td>
                <td>{{ item.cpf || '—' }}</td>
                <td>{{ item.email || '—' }}</td>
                <td>{{ item.telefone || '—' }}</td>
                <td>{{ item.cargo || '—' }}</td>
                <td>
                  <span v-if="item.departamento" class="badge">{{ item.departamento }}</span>
                  <span v-else>—</span>
                </td>
                <td>{{ formatarData(item.data_admissao) }}</td>
                <td>{{ formatarDataHora(item.created_at) }}</td>
                <td>
                  <button class="btn-excluir" @click="excluirFuncionario(item.id)" title="Excluir">🗑</button>
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
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import Menu from '../components/Menu.vue'
import Sidebar from '../components/Sidebar.vue'

const { supabase } = useSupabase()

const sidebarOpen = ref(false)
const loading = ref(false)
const loadingHistorico = ref(false)
const historico = ref([])

const form = ref({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  cargo: '',
  data_admissao: '',
  departamento: ''
})

const tocado = ref({
  cpf: false,
  telefone: false
})

// ─── Validações ───────────────────────────────────────────
const cpfValido = computed(() => form.value.cpf.replace(/\D/g, '').length === 11)
const telefoneValido = computed(() => {
  const n = form.value.telefone.replace(/\D/g, '').length
  return n === 10 || n === 11
})

// ─── Máscaras ─────────────────────────────────────────────
function mascaraCPF(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.value.cpf = v
}

function mascaraTelefone(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/, '($1) $2')
  v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  form.value.telefone = v
}

// ─── Supabase ─────────────────────────────────────────────
onMounted(() => carregarHistorico())

async function carregarHistorico() {
  loadingHistorico.value = true
  try {
    const { data, error } = await supabase
      .from('funcionarios')
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

async function salvarFuncionario() {
  if (form.value.cpf && !cpfValido.value) {
    tocado.value.cpf = true
    alert('CPF incompleto. Verifique e tente novamente.')
    return
  }
  if (form.value.telefone && !telefoneValido.value) {
    tocado.value.telefone = true
    alert('Telefone incompleto. Verifique e tente novamente.')
    return
  }

  loading.value = true
  try {
    const payload = { ...form.value }
    if (!payload.cpf) delete payload.cpf
    if (!payload.email) delete payload.email
    if (!payload.telefone) delete payload.telefone
    if (!payload.cargo) delete payload.cargo
    if (!payload.data_admissao) delete payload.data_admissao
    if (!payload.departamento) delete payload.departamento

    const { error } = await supabase.from('funcionarios').insert([payload])
    if (error) throw error

    alert('Funcionário cadastrado com sucesso!')
    resetForm()
    await carregarHistorico()
  } catch (err) {
    alert('Erro ao salvar: ' + err.message)
  } finally {
    loading.value = false
  }
}

async function excluirFuncionario(id) {
  if (!confirm('Deseja realmente excluir este funcionário?')) return
  try {
    // Envia o delete para o Supabase
    const { error, status } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id)
    
    if (error) throw error

    // Só removemos da tela se o banco de dados retornar status síncrono de sucesso (200 ou 204)
    if (status === 204 || status === 200) {
      historico.value = historico.value.filter(item => item.id !== id)
      alert('Funcionário excluído com sucesso!')
    } else {
      alert('Não foi possível excluir. Verifique as permissões de banco (RLS).')
    }
  } catch (err) {
    console.error('Erro detalhado:', err)
    alert('Erro ao excluir no banco de dados: ' + err.message)
  }
}

function resetForm() {
  form.value = { nome: '', cpf: '', email: '', telefone: '', cargo: '', data_admissao: '', departamento: '' }
  tocado.value = { cpf: false, telefone: false }
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

.header-section { 
  background: white; 
  padding: 20px; 
  border-radius: 8px; 
  margin-bottom: 30px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
}

.header-section h1 { 
  color: #c40000; 
  font-size: 28px; 
  margin: 0; 
}

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
.form-group select { 
  padding: 12px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  font-size: 14px; 
  transition: border-color 0.2s; 
}

.form-group input:focus,
.form-group select:focus { 
  outline: none; 
  border-color: #c40000; 
  box-shadow: 0 0 0 2px rgba(196,0,0,0.1); 
}

.input-erro { 
  border-color: #c40000; 
  background: #fff8f8; 
}

.msg-erro { 
  color: #c40000; 
  font-size: 12px; 
  margin-top: 4px; 
  font-weight: 500; 
}

.msg-ok { 
  color: #2e7d32; 
  font-size: 12px; 
  margin-top: 4px; 
  font-weight: 500; 
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
  font-size: 16px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.2s; 
}

.btn-save:hover:not(:disabled) { 
  background: #a00000; 
  transform: translateY(-2px); 
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
  font-size: 16px; 
  font-weight: 600; 
  cursor: pointer; 
}

.btn-cancel:hover { 
  background: #e0e0e0; 
}

.historico-container { 
  padding: 30px; 
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); 
  margin-top: 30px; 
  background: white;
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
  color: #792626; 
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
  background: #c40000; 
}

.historico-table th { 
  padding: 14px; 
  text-align: left; 
  font-weight: 700; 
  color: #ffffff; 
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
  padding: 12px 14px; 
  color: #333; 
  white-space: nowrap; 
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
    width: 100%; 
  }
}
</style>