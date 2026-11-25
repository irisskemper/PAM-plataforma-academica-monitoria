// Guarda qual card está prestes a ser apagado, entre o clique na
// lixeira e a confirmação no modal (mesmo padrão do perfil do monitor).
var cardParaExcluir = null;

document.addEventListener("DOMContentLoaded", function () {
  // avatar
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

  // Esc fecha o menu do avatar e os modais abertos
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    menuAvatar.classList.remove("aberto");
    btnAvatar.setAttribute("aria-expanded", "false");
    document.querySelectorAll(".modal-overlay.aberto").forEach(function (el) {
      el.classList.remove("aberto");
    });
  });

  // ao sair, esquece o perfil escolhido no login
  document
    .querySelector(".avatar-menu__item--sair")
    .addEventListener("click", function () {
      sessionStorage.removeItem("pam_perfil");
    });

  // fecha modal ao clicar fora do card branco
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("aberto");
      }
    });
  });

  // checa se o painel de materiais já começa vazio
  atualizarEstadoVazioMateriais();
});

// abrir material
function abrirMaterial(arquivo) {
  mostrarToast("Abrindo: " + arquivo);
}

// ─────────────────────────────────────────────────────────────
// EXCLUSÃO DE MATERIAL
// ─────────────────────────────────────────────────────────────

// Chamada pelo botão de lixeira de cada card. Guarda uma
// referência ao card clicado e abre o modal de confirmação.
function abrirModalExcluir(botao) {
  cardParaExcluir = botao.closest(".material-card");
  document.getElementById("modalExcluir").classList.add("aberto");
}

function fecharModalExcluir() {
  document.getElementById("modalExcluir").classList.remove("aberto");
  cardParaExcluir = null;
}

// Chamada pelo botão "Sim, apagar" do modal.
function confirmarExclusao() {
  if (cardParaExcluir) {
    cardParaExcluir.remove();
    mostrarToast("Material apagado.");
    atualizarEstadoVazioMateriais();
  }
  fecharModalExcluir();
}

// Mostra a mensagem "Nenhum material enviado." quando o grid
// de materiais fica sem nenhum card.
function atualizarEstadoVazioMateriais() {
  var grid = document.getElementById("materiaisGrid");
  var mensagem = document.getElementById("estadoVazioMateriais");
  if (!grid || !mensagem) return;

  var temItens = grid.children.length > 0;
  grid.hidden = !temItens;
  mensagem.hidden = temItens;
}

// notificação
function mostrarToast(mensagem) {
  var toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("visivel");
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
