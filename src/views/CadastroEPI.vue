<template>
  <div class="cadastro-container">
    <Menu @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="content">
      <div class="header-section">
        <h1>Cadastro de EPI</h1>
      </div>

      <form class="form-container">
        <div class="form-group">
          <label>Nome do EPI</label>
          <input type="text" placeholder="Digite o nome do EPI" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Código/SKU</label>
            <input type="text" placeholder="Digite o código do produto" />
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select>
              <option>Selecione uma categoria</option>
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
            <input type="number" placeholder="0" min="0" />
          </div>
          <div class="form-group">
            <label>Quantidade Mínima</label>
            <input type="number" placeholder="0" min="0" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data de Vencimento</label>
            <input type="date" />
          </div>
          <div class="form-group">
            <label>Valor Unitário (R$)</label>
            <input type="number" placeholder="0.00" step="0.01" min="0" />
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea placeholder="Digite a descrição do EPI" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label>Fornecedor</label>
          <input type="text" placeholder="Nome do fornecedor" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save">Salvar</button>
          <button type="reset" class="btn-cancel">Limpar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'CadastroEPI',
  components: {
    Menu,
    Sidebar
  },
  data() {
    return {
      sidebarOpen: false
    }
  }
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #c40000;
  box-shadow: 0 0 5px rgba(196, 0, 0, 0.1);
}

.form-group textarea {
  resize: vertical;
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

.btn-save,
.btn-cancel {
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background: #c40000;
  color: white;
}

.btn-save:hover {
  background: #a00000;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(196, 0, 0, 0.3);
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
