<template>
  <div>
    <!-- Overlay/Backdrop -->
    <div v-if="isOpen" class="sidebar-overlay" @click="closeSidebar"></div>
    
    <!-- Sidebar -->
    <div class="sidebar" :class="{ active: isOpen }">
    <nav class="nav-menu">
      <router-link to="/Dashboard" class="nav-item" @click="closeSidebar">
        📊 Dashboard
      </router-link>
      <router-link to="/CadastroFuncionario" class="nav-item" @click="closeSidebar">
        👥 Cadastro de Funcionário
      </router-link>
      <router-link to="/CadastroEPI" class="nav-item" @click="closeSidebar">
        🦺 Cadastro de EPI
      </router-link>
    </nav>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    closeSidebar() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 35;
}

.sidebar {
  position: fixed;
  left: -250px;
  top: 70px;
  width: 250px;
  height: calc(100vh - 70px);
  background: #333;
  color: white;
  padding: 20px 0;
  transition: left 0.3s ease;
  z-index: 40;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}

.sidebar.active {
  left: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.nav-item {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  border-bottom: 1px solid #555;
  transition: background 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: #555;
  color: #c40000;
}

.nav-item.router-link-active {
  background: #c40000;
  color: white;
}
</style>
