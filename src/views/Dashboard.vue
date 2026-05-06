<template>
  <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
  <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
  <div class="app-container">

    <!-- Main -->
    <main class="main-content">
      <!-- Cards -->
      <div class="cards-grid">
        <div class="card">
          <h2>0</h2>
          <p>TOTAL</p>
        </div>

        <div class="card">
          <h2>0</h2>
          <p>Próximos Vencimento</p>
        </div>

        <div class="card">
          <h2>0</h2>
          <p>Vencidos</p>
        </div>

        <div class="card">
          <h2>0</h2>
          <p>Em Promoção</p>
        </div>

        <div class="card">
          <h2>0</h2>
          <p>Descarte</p>
        </div>
      </div>

      <!-- Filters -->
      <section class="table-container">
        <div class="filters">
          <div class="field">
            <label>Buscar</label>
            <input type="text" placeholder="Filtrar nome..." />
          </div>

          <div class="field">
            <label>Período</label>
            <input type="text" placeholder="Selecione período" />
          </div>

          <div class="field">
            <label>Situação</label>
            <select>
              <option>Todos</option>
            </select>
          </div>

          <button class="export-btn">Exportar</button>
        </div>

        <!-- Empty Table -->
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CA</th>
              <th>Data Vencimento</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="empty-state">
                Nenhum registro encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <h2>SENAI</h2>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../components/Menu.vue';
import Sidebar from '../components/Sidebar.vue';

const sidebarOpen = ref(false);

// Tela estática sem dados populados
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



.breadcrumb {
  background: white;
  padding: 12px 25px;
}

.main-content {
  padding: 25px;
  flex: 1;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.card h2 {
  color: #c40000;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field input,
.field select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.export-btn {
  background: #c40000;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  align-self: end;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #c40000;
  color: white;
}

th,
td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.empty-state {
  padding: 40px;
  color: #777;
}

.footer {
  background: #c40000;
  color: white;
  padding: 15px 25px;
  font-size: 24px;
  font-style: italic;
}
</style>
