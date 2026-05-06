<template>
    <header class="sticky top-0 bg-white flex justify-between w-full shadow-lg p-4 z-50">
      <div>
        <img src=" ../assets/logo.png" class="w-[140px] hover:scale-105">
      </div>

      <div class="flex justify-between gap-12">
        <div class="text-gray-800 font-medium text-base my-auto hover:text-red-600">
          Funcionalidades
        </div>
        <div class="text-gray-800 font-medium text-base my-auto hover:text-red-600">
          Contato
        </div>
        <router-link to="/Dashboard">
          <button
            class="bg-red-700 rounded-xl px-10 text-white h-[50px] my-auto font-medium text-base hover:scale-[1.02]">
            Entrar
          </button>
        </router-link>
      </div>

    </header>


</template>

export default {
  name: 'Header',
}