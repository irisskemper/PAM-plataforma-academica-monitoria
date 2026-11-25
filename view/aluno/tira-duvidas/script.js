// ─────────────────────────────────────────────────────────────
// script.js — Tira-dúvidas (PAM)
// JS independente: inclui navbar, toast e toda lógica da página
// ─────────────────────────────────────────────────────────────

var MAX_CHARS = 300;
var duvidasEnviadas = [];

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
});

// ── Contador de caracteres ────────────────────────────────────
function atualizarContador() {
  var textarea = document.getElementById("td-duvida");
  var contador = document.getElementById("tdContador");
  var atual = textarea.value.length;

  contador.textContent = atual + "/" + MAX_CHARS;

  if (atual >= MAX_CHARS * 0.9) {
    contador.classList.add("td-contador--aviso");
  } else {
    contador.classList.remove("td-contador--aviso");
  }
}

// ── Enviar dúvida ─────────────────────────────────────────────
function setErro(fieldId, erroId, mostrar) {
  document.getElementById(fieldId).classList.toggle("invalido", mostrar);
  document.getElementById(erroId).classList.toggle("visivel", mostrar);
}

function enviarDuvida() {
  var nome = document.getElementById("td-nome").value.trim();
  var email = document.getElementById("td-email").value.trim();
  var materia = document.getElementById("td-materia").value;
  var duvida = document.getElementById("td-duvida").value.trim();

  var valido = true;

  if (!nome) {
    setErro("field-td-nome", "erro-td-nome", true);
    valido = false;
  } else {
    setErro("field-td-nome", "erro-td-nome", false);
  }

  if (!email || !emailValido(email)) {
    setErro("field-td-email", "erro-td-email", true);
    valido = false;
  } else {
    setErro("field-td-email", "erro-td-email", false);
  }

  if (!materia) {
    setErro("field-td-materia", "erro-td-materia", true);
    valido = false;
  } else {
    setErro("field-td-materia", "erro-td-materia", false);
  }

  if (!duvida) {
    setErro("field-td-duvida", "erro-td-duvida", true);
    valido = false;
  } else {
    setErro("field-td-duvida", "erro-td-duvida", false);
  }

  if (!valido) return;

  duvidasEnviadas.push({ materia: materia, resumo: duvida });
  atualizarStatus();
  console.log("Dúvida enviada:", { nome, email, materia, duvida });
  mostrarToast("Dúvida registrada.");
  limparFormulario();
}

// ── Atualiza lista de status ──────────────────────────────────
function atualizarStatus() {
  var lista = document.getElementById("statusLista");
  var vazia = document.getElementById("statusVazia");

  if (vazia) vazia.remove();

  var ultima = duvidasEnviadas[duvidasEnviadas.length - 1];

  var item = document.createElement("div");
  item.className = "status-item";
  item.innerHTML =
    '<div class="status-item__info">' +
    '<span class="status-item__materia">' +
    ultima.materia +
    "</span>" +
    '<span class="status-item__resumo">' +
    escaparTexto(truncar(ultima.resumo, 45)) +
    "</span>" +
    "</div>" +
    '<span class="status-badge status-badge--enviada">Enviada!</span>';

  lista.appendChild(item);
}

// ── Toast ─────────────────────────────────────────────────────
function mostrarToast(mensagem) {
  var toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  setTimeout(function () {
    toast.classList.remove("visivel");
  }, 2500);
}

// ── Helpers ───────────────────────────────────────────────────
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function truncar(texto, limite) {
  return texto.length > limite ? texto.slice(0, limite) + "…" : texto;
}

function limparFormulario() {
  document.getElementById("td-nome").value = "";
  document.getElementById("td-email").value = "";
  document.getElementById("td-materia").value = "";
  document.getElementById("td-duvida").value = "";
  atualizarContador();
}

function escaparTexto(texto) {
  var el = document.createElement("span");
  el.textContent = texto;
  return el.innerHTML;
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
  if (fundo)
    fundo.addEventListener("click", function () {
      fechar(false);
    });

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
  if (avatar)
    avatar.addEventListener("click", function () {
      fechar(false);
    });

  // girou o celular ou aumentou a janela: volta ao menu normal
  function aoMudarTamanho(e) {
    if (!e.matches) fechar(false);
  }
  if (telaPequena.addEventListener)
    telaPequena.addEventListener("change", aoMudarTamanho);
  else telaPequena.addListener(aoMudarTamanho);
})();
