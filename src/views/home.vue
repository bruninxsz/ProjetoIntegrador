<template>
  <div class="page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-left">
        <img src="../assets/logo.png" class="logo" alt="logo">
        <span class="brand">SGEE</span>
      </div>

      <div class="nav-right">
        <a href="#">Funcionalidades</a>
        <a href="#">Contato</a>
        <button class="btn-login">Entrar</button>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">

      <div class="hero-text">
        <h1>
          Gestão Inteligente<br>
          de EPIs
        </h1>

        <p>
          SGEE é a solução completa para controle, distribuição e conformidade
          de Equipamentos de Proteção Individual. Proteja seus colaboradores com
          tecnologia moderna e redução de riscos.
        </p>

        <div class="buttons">
          <button class="btn-primary">Comece agora</button>
          <button class="btn-outline">Saiba mais</button>
        </div>
      </div>

      <div class="hero-image">
        <img src="../assets/epi.png" alt="epi">
      </div>

    </section>

    <!-- FUNCIONALIDADES -->
    <section class="features">

      <h2>Funcionalidades Principais</h2>

      <p class="subtitle">
        Tudo que você precisa para gerenciar EPIs de forma eficiente e em conformidade com a legislação
      </p>

      <div class="grid">

        <div class="card">
          <div class="icon">📊</div>
          <h3>Controle de Estoque</h3>
          <p>
            Registre em tempo real o inventário de EPIs, níveis de estoque e alertas automáticos para reposição.
          </p>
        </div>

        <div class="card">
          <div class="icon">✔</div>
          <h3>Controle de Validade</h3>
          <p>
            Monitore a data de validade dos EPIs e receba alertas para substituição antes do vencimento.
          </p>
        </div>

        <div class="card">
          <div class="icon">🔄</div>
          <h3>Histórico de Movimentações</h3>
          <p>
            Registre automaticamente todas as entradas, saídas e devoluções de EPIs, com rastreabilidade completa das movimentações.
          </p>
        </div>

        <div class="card">
          <div class="icon">⚡</div>
          <h3>Manutenção Preventiva</h3>
          <p>
            Agende inspeções, manutenções e substituições de equipamentos com alertas automáticos.
          </p>
        </div>

        <div class="card">
          <div class="icon">👥</div>
          <h3>Gestão de Usuários</h3>
          <p>
            Controle permissões, histórico de entrega e uso de EPIs por colaborador e departamento.
          </p>
        </div>

        <div class="card">
          <div class="icon">🔒</div>
          <h3>Segurança Avançada</h3>
          <p>
            Autenticação segura, criptografia de dados e backup automático para máxima proteção.
          </p>
        </div>

      </div>

    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <img src="../assets/logo.png" class="logo-footer">
      <p class="footer-title">SGEE</p>
      <span>Sistema Gerenciador de Estoque de EPIs</span>
      <hr>
      <small>© 2026 SGEE - Sistema Gerenciador de Estoque de EPIs. Todos os direitos reservados.</small>
    </footer>

  </div>
</template>

<script>
export default {
  name: "home"
}
</script>