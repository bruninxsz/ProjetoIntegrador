<template>
  <div class="login-container">
    <div class="login-card">
      <div class="top-line"></div>

      <h1>Bem-vindo</h1>
      
      <p class="subtitle">
        Entre com suas credenciais para acessar sua conta
      </p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Email</label>
          <input
            v-model="Email"
            type="text"
            placeholder="seu.email@exemplo.com"
          />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input
            v-model="senha"
            type="password"
            placeholder="***********"
          />
        </div>

        <button type="submit">
          Entrar
        </button>

        <a href="#" class="forgot-password">
          Esqueceu sua senha?
        </a>
      </form>

      <footer>
        © 2026 SGEE - Sistema Gerenciador de Estoque de EPIs.Todos os direitos reservados.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const Email = ref('')
const senha = ref('')

const handleLogin = () => {
  console.log({
    Email: Email.value,
    senha: senha.value
  })

  // Aqui você conecta com API ou Supabase
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.login-container {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.login-card {
  width: 100%;
  max-width: 700px;
}

.top-line {
  width: 140px;
  height: 5px;
  background: #e00000;
  margin-bottom: 25px;
  margin-top: 20px;
}

h1 {
  font-size: 50px;
  font-weight: bold;
  color: #000;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  color: #0000007d;
  margin-bottom: 30px;
}

form {
  width: 85%;
}

.input-group {
  margin-bottom: 33px;
}

label {
  display: block;
  font-size: 22px;
  color: #111;
  margin-bottom: 14px;
}

input {
  width: 100%;
  height: 72px;
  border: 1px solid #9d9d9d;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 20px;
  background-color: #67656514;
  color: #000000;
}

input::placeholder {
  color: #bdbdbd;
}

button {
  width: 100%;
  height: 72px;
  border: none;
  border-radius: 22px;
  background: #e00000;
  color: white;
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  opacity: 0.92;
}

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 22px;
  color: #e00000;
  text-decoration: none;
  font-size: 22px;
  font-weight: 600;
  margin-left: 20px;
}

footer {
  margin-top: 90px;
  padding-top: 25px;
  border-top: 1px solid #333;
  text-align: center;
  font-size: 14px;
  color: #222;
}

/* Responsivo */
@media (max-width: 768px) {
  h1 {
    font-size: 42px;
    margin-bottom: 50px;
  }

  input,
  button {
    height: 65px;
    font-size: 20px;
  }

  button {
    font-size: 28px;
  }

  label,
  .forgot-password,
  footer {
    font-size: 18px;
  }
}
</style>