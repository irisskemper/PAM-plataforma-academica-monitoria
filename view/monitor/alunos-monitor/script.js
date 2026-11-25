// ─────────────────────────────────────────────────────────────
// script.js — Página Alunos (PAM)
// Página só de leitura: lista os alunos matriculados na
// disciplina do monitor e os avisos já enviados por ele.
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {
  // ── Dropdown do avatar ──────────────────────────────────────
  var btnAvatar = document.getElementById("btnAvatar");
  var menuAvatar = document.getElementById("menuAvatar");

  btnAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    var aberto = menuAvatar.classList.toggle("aberto");
    btnAvatar.setAttribute("aria-expanded", aberto);
  });

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

  // Checa se algum painel já começa vazio (ex: sem alunos ou avisos)
  atualizarEstadoVazio("alunosGrid", "estadoVazioAlunos");
  atualizarEstadoVazio("avisosLista", "estadoVazioAvisos");
});

// ─────────────────────────────────────────────────────────────
// ESTADO VAZIO
// Mostra a mensagem "Nenhum ... " quando a lista/grid
// correspondente não tem nenhum card dentro.
// ─────────────────────────────────────────────────────────────
function atualizarEstadoVazio(idContainer, idMensagem) {
  var container = document.getElementById(idContainer);
  var mensagem = document.getElementById(idMensagem);
  var temItens = container.children.length > 0;

  container.hidden = !temItens;
  mensagem.hidden = temItens;
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
