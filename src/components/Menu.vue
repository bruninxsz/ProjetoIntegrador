<template>

        <header class="header">
      <div class="header-left">
        <button class="icon-btn" @click="toggleSidebar">☰</button>
        <div class="logo-section">
        <div>
        <img src="../assets/logoMenu.png" class="logo-img">
      </div>
          <div>
            <span class="logo-text">Sistema Gerenciador de Estoque de EPIs</span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <button class="icon-btn">🔔</button>
        <button class="icon-btn">❓</button>
        <button class="icon-btn">⚙</button>

        <div class="user-box">
          <div class="avatar">BI</div>
          <span>Bem-vinda, Beatriz</span>
        </div>
      </div>
    </header>
</template>

<script>
export default {
  name: 'Menu',
  emits: ['toggle-sidebar'],
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  }
}
</script>

<style>

.header {
  background: #c40000;
  color: white;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.logo-img {
  width: 10rem;
}

.logo-text {
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
}

.logo-circle {
  width: 40px;
  height: 40px;
  background: white;
  color: #c40000;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.avatar {
  width: 35px;
  height: 35px;
  background: white;
  color: #c40000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>