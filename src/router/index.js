//importando o Vue Roter
import {createRouter, createWebHistory} from 'vue-router';

//Importando os componentes das páginas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'; 
import Dashboard from '../views/Dashboard.vue'; 
import CadastroFuncionario from '../views/CadastroFuncionario.vue';
import CadastroEPI from '../views/CadastroEPI.vue'; 



//Definindo as rotas
const routes = [
    {
        path:'/',                 // Rota para a página
        component: Home           // Apelido para chamar depois
    },

    {
        path:'/Login',
        component: Login
    },

    {
        path:'/Dashboard',
        component: Dashboard
    },

    {
        path:'/CadastroFuncionario',
        component: CadastroFuncionario
    },

    {
        path:'/CadastroEPI',
        component: CadastroEPI
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

export default router;