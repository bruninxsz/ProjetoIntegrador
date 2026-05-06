<template>
  <div class="cadastro-container">
    <Menu @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="content">
      <div class="header-section">
        <h1>Cadastro de Funcionário</h1>
      </div>

      <form class="form-container">
        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" placeholder="Digite o nome completo" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>CPF</label>
            <input type="text" placeholder="000.000.000-00" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" placeholder="(00) 00000-0000" />
          </div>
          <div class="form-group">
            <label>Cargo</label>
            <input type="text" placeholder="Digite o cargo" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data de Admissão</label>
            <input type="date" />
          </div>
          <div class="form-group">
            <label>Departamento</label>
            <select>
              <option>Selecione um departamento</option>
              <option>Gerência</option>
              <option>Operacional</option>
              <option>Administrativo</option>
            </select>
          </div>
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
  name: 'CadastroFuncionario',
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
  box-shadow: 0 0 5px rgba(196, 0, 0, 0.1);
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
