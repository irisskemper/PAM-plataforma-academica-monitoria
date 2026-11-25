// ─────────────────────────────────────────────────────────────
// script.js — Home do Aluno (PAM)
// ─────────────────────────────────────────────────────────────

// "DOMContentLoaded" garante que o JS só roda depois que o HTML
// terminou de ser lido pelo navegador. Sem isso, o código
// tentaria encontrar elementos que ainda não existem na página.
document.addEventListener("DOMContentLoaded", function () {
  // ── Dropdown do avatar ──────────────────────────────────────
  var btnAvatar = document.getElementById("btnAvatar");
  var menuAvatar = document.getElementById("menuAvatar");

  // Ao clicar no avatar: alterna a classe "aberto" no menu.
  // e.stopPropagation() impede que o clique chegue ao document
  // (senão o listener abaixo fecharia o menu na hora).
  btnAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    var aberto = menuAvatar.classList.toggle("aberto");
    btnAvatar.setAttribute("aria-expanded", aberto);
  });

  // Clicou em qualquer outro lugar da página → fecha o menu
  document.addEventListener("click", function () {
    menuAvatar.classList.remove("aberto");
    btnAvatar.setAttribute("aria-expanded", "false");
  });

  // Esc fecha o menu do avatar
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    menuAvatar.classList.remove("aberto");
    btnAvatar.setAttribute("aria-expanded", "false");
  });

  // ao sair, esquece o perfil escolhido no login
  document
    .querySelector(".avatar-menu__item--sair")
    .addEventListener("click", function () {
      sessionStorage.removeItem("pam_perfil");
    });

  // ── Botões "Ver mais" dos cards ─────────────────────────────
  // Por enquanto exibem um toast. Quando tiver a página de
  // materiais completa, substitua o mostrarToast() por:
  //   window.location.href = "materiais.html"
  document.querySelectorAll(".btn-ver-mais").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Evita que o clique no botão acione o card inteiro
      e.stopPropagation();
      mostrarToast("Em breve: mais arquivos aqui!");
    });
  });
  var campoBusca = document.getElementById("campoBusca");
  campoBusca.addEventListener("input", function () {
    var termo = this.value.toLowerCase();
    document.querySelectorAll(".material-card").forEach(function (card) {
      var disciplina = card
        .querySelector(".material-card__disciplina")
        .textContent.toLowerCase();
      card.style.display = disciplina.includes(termo) ? "" : "none";
    });
  });
});

// ─────────────────────────────────────────────────────────────
// abrirMaterial — chamada pelo onclick nos itens de arquivo
// Parâmetro: arquivo (string) — nome do arquivo clicado
// ─────────────────────────────────────────────────────────────
function abrirMaterial(arquivo) {
  // Por enquanto mostra um toast.
  // Quando tiver o arquivo real, troque por:
  //   window.open("arquivos/" + arquivo)
  mostrarToast("Abrindo: " + arquivo);
}

// ─────────────────────────────────────────────────────────────
// irParaDuvidas — chamada pelo botão ? de cada card
// ─────────────────────────────────────────────────────────────
function irParaDuvidas() {
  window.location.href = "../tira-duvidas/index.html";
}

// ─────────────────────────────────────────────────────────────
// mostrarToast — exibe uma mensagem flutuante por 2,5 segundos
// Parâmetro: mensagem (string) — o texto a exibir
// ─────────────────────────────────────────────────────────────
function mostrarToast(mensagem) {
  var toast = document.getElementById("toast");
  toast.textContent = mensagem;

  // Adiciona "visivel" → CSS faz o toast aparecer com animação
  toast.classList.add("visivel");

  // setTimeout executa a função após o tempo em milissegundos.
  // 2500ms = 2,5 segundos. Depois disso, remove "visivel"
  // e o toast some suavemente pela transição CSS.
  setTimeout(function () {
    toast.classList.remove("visivel");
  }, 2500);
}

/* ---------- menu hambúrguer (responsividade v2.0) ---------- */
(function () {
  var navbar = document.querySelector(".navbar");
  var botao = document.getElementById("btnMenuMobile");
  var lista = document.getElementById("navLinks");
  var fundo = document.getElementById("navOverlay");
  if (!navbar || !botao || !lista) return;

  // mesma largura do CSS: até 960px o menu vira hambúrguer
  var telaPequena = window.matchMedia("(max-width: 960px)");

  function aberto() {
    return navbar.classList.contains("menu-aberto");
  }

  function abrir() {
    navbar.classList.add("menu-aberto");
    document.body.classList.add("menu-aberto");
    botao.setAttribute("aria-expanded", "true");
    botao.setAttribute("aria-label", "Fechar menu");
  }

  function fechar(devolverFoco) {
    if (!aberto()) return;
    navbar.classList.remove("menu-aberto");
    document.body.classList.remove("menu-aberto");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    if (devolverFoco) botao.focus();
  }

  botao.addEventListener("click", function () {
    if (aberto()) fechar(false);
    else abrir();
  });

  // clicar no fundo escuro fecha
  if (fundo) fundo.addEventListener("click", function () { fechar(false); });

  // clicar em qualquer lugar fora da navbar fecha
  document.addEventListener("click", function (e) {
    if (aberto() && !navbar.contains(e.target)) fechar(false);
  });

  // Esc fecha e devolve o foco para o botão
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fechar(true);
  });

  // se o foco sair da navbar (Tab), fecha
  navbar.addEventListener("focusout", function (e) {
    if (aberto() && e.relatedTarget && !navbar.contains(e.relatedTarget)) {
      fechar(false);
    }
  });

  // abrir o menu do avatar fecha o menu hambúrguer
  var avatar = document.getElementById("btnAvatar");
  if (avatar) avatar.addEventListener("click", function () { fechar(false); });

  // girou o celular ou aumentou a janela: volta ao menu normal
  function aoMudarTamanho(e) {
    if (!e.matches) fechar(false);
  }
  if (telaPequena.addEventListener) telaPequena.addEventListener("change", aoMudarTamanho);
  else telaPequena.addListener(aoMudarTamanho);
})();
