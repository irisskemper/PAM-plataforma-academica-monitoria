// ─────────────────────────────────────────────────────────────
// script.js — Home do Monitor (PAM)
// ─────────────────────────────────────────────────────────────

// Guarda qual card está prestes a ser apagado, entre o clique na
// lixeira e a confirmação no modal.
var cardParaExcluir = null;

// Guarda o nome do arquivo escolhido no input, entre a seleção
// e a confirmação no modal de "Adicionar material".
var arquivoParaAdicionar = null;

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

  // ── Fecha modal ao clicar fora do card branco ───────────────
  // Cada .modal-overlay tem esse mesmo comportamento: clicar no
  // fundo escurecido fecha o modal, clicar dentro do card não.
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("aberto");
      }
    });
  });

  // ── Botão "+ Adicionar material" abre o seletor de arquivo ──
  var btnAdicionarMaterial = document.getElementById("btnAdicionarMaterial");
  var inputArquivo = document.getElementById("inputArquivoMaterial");

  btnAdicionarMaterial.addEventListener("click", function () {
    inputArquivo.click();
  });

  // Quando o monitor escolhe um arquivo, mostramos o modal de
  // confirmação antes de "enviar" de fato.
  inputArquivo.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      arquivoParaAdicionar = this.files[0].name;
      document.getElementById("textoConfirmarMaterial").textContent =
        "Deseja adicionar " + arquivoParaAdicionar + "?";
      document.getElementById("modalAdicionarMaterial").classList.add("aberto");
    }
  });

  // ── Botão "+ Adicionar aviso" abre o formulário ─────────────
  document
    .getElementById("btnAdicionarAviso")
    .addEventListener("click", function () {
      document.getElementById("modalAdicionarAviso").classList.add("aberto");
    });

  // Checa se algum painel já começa vazio (ex: sem materiais)
  atualizarEstadoVazio("materiaisGrid", "estadoVazioMateriais");
  atualizarEstadoVazio("avisosLista", "estadoVazioAvisos");
});

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
    atualizarEstadoVazio("materiaisGrid", "estadoVazioMateriais");
  }
  fecharModalExcluir();
}

// ─────────────────────────────────────────────────────────────
// ADIÇÃO DE MATERIAL
// ─────────────────────────────────────────────────────────────

function fecharModalAdicionarMaterial() {
  document.getElementById("modalAdicionarMaterial").classList.remove("aberto");
  // limpa o input pra permitir escolher o mesmo arquivo de novo depois
  document.getElementById("inputArquivoMaterial").value = "";
  arquivoParaAdicionar = null;
}

// Chamada pelo botão "Sim, adicionar" do modal. Cria um novo
// card já com status "Pendente", já que todo material novo
// precisa passar pela aprovação do professor antes de ficar
// visível pros alunos.
function confirmarAdicaoMaterial() {
  if (!arquivoParaAdicionar) {
    fecharModalAdicionarMaterial();
    return;
  }

  var grid = document.getElementById("materiaisGrid");

  var card = document.createElement("article");
  card.className = "material-card";
  card.setAttribute("data-status", "pendente");
  card.innerHTML =
    '<div class="material-card__topo">' +
    '  <div class="material-card__icone-wrap">' +
    '    <img src="images/code-icon.png" alt="" class="material-card__icone" />' +
    "  </div>" +
    '  <div class="material-card__info-topo">' +
    '    <p class="material-card__disciplina">Nova disciplina</p>' +
    '    <p class="material-card__monitor">Monitor 1</p>' +
    "  </div>" +
    '  <button class="material-card__lixeira" aria-label="Apagar material" onclick="abrirModalExcluir(this)">' +
    '    <img src="images/delete-icon.png" alt="" class="material-card__lixeira-icone" />' +
    "  </button>" +
    "</div>" +
    '<div class="arquivo-item">' +
    '  <img src="images/page-icon.png" alt="" class="arquivo-item__icone" />' +
    "  <div>" +
    '    <p class="arquivo-item__nome">' +
    escaparHtml(arquivoParaAdicionar) +
    "</p>" +
    '    <p class="arquivo-item__tipo">PDF</p>' +
    "  </div>" +
    "</div>" +
    '<span class="status-badge status-badge--pendente">Pendente</span>' +
    '<p class="material-card__comentario-label">Comentário do professor:</p>' +
    '<div class="material-card__comentario material-card__comentario--vazio">' +
    "  Aguardando aprovação do professor." +
    "</div>";

  grid.prepend(card);

  mostrarToast("Material adicionado à demonstração. Sem envio de arquivo.");
  atualizarEstadoVazio("materiaisGrid", "estadoVazioMateriais");
  fecharModalAdicionarMaterial();
}

// ─────────────────────────────────────────────────────────────
// ADIÇÃO DE AVISO
// ─────────────────────────────────────────────────────────────

function fecharModalAdicionarAviso() {
  document.getElementById("modalAdicionarAviso").classList.remove("aberto");
  document.getElementById("campoTextoAviso").value = "";
}

function confirmarAdicaoAviso() {
  var texto = document.getElementById("campoTextoAviso").value.trim();

  if (!texto) {
    mostrarToast("Escreva o aviso antes de publicar.");
    return;
  }

  var lista = document.getElementById("avisosLista");

  var card = document.createElement("article");
  card.className = "aviso-card";
  card.innerHTML =
    '<p class="aviso-card__texto">' +
    escaparHtml(texto) +
    "</p>" +
    '<p class="aviso-card__data">Enviado em ' +
    formatarDataHoje() +
    "</p>";

  lista.prepend(card);

  mostrarToast("Aviso publicado!");
  atualizarEstadoVazio("avisosLista", "estadoVazioAvisos");
  fecharModalAdicionarAviso();
}

// Formata a data de hoje no padrão dd/mm/aaaa
function formatarDataHoje() {
  var hoje = new Date();
  var dia = String(hoje.getDate()).padStart(2, "0");
  var mes = String(hoje.getMonth() + 1).padStart(2, "0");
  var ano = hoje.getFullYear();
  return dia + "/" + mes + "/" + ano;
}

// Evita que texto digitado pelo monitor quebre o HTML da página
function escaparHtml(texto) {
  var div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ─────────────────────────────────────────────────────────────
// ESTADO VAZIO
// Mostra a mensagem "Nenhum ... enviado." quando a lista/grid
// correspondente não tem nenhum card dentro.
// ─────────────────────────────────────────────────────────────
function atualizarEstadoVazio(idContainer, idMensagem) {
  var container = document.getElementById(idContainer);
  var mensagem = document.getElementById(idMensagem);
  var temItens = container.children.length > 0;

  container.hidden = !temItens;
  mensagem.hidden = temItens;
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
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
