/* =============================================
   PAM – script.js (Professor)
   ============================================= */

// ── Utilitário de toast ────────────────────────────────────────────────
function mostrarToast(msg, duracao = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("visivel");
  setTimeout(() => toast.classList.remove("visivel"), duracao);
}

// ── Avatar dropdown ────────────────────────────────────────────────────
const btnAvatar = document.getElementById("btnAvatar");
const menuAvatar = document.getElementById("menuAvatar");

btnAvatar.addEventListener("click", (e) => {
  e.stopPropagation();
  const aberto = menuAvatar.classList.toggle("aberto");
  btnAvatar.setAttribute("aria-expanded", aberto);
});

document.addEventListener("click", (e) => {
  if (!menuAvatar.contains(e.target) && !btnAvatar.contains(e.target)) {
    menuAvatar.classList.remove("aberto");
    btnAvatar.setAttribute("aria-expanded", "false");
  }
});

// Esc fecha o menu do avatar e os modais abertos
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  menuAvatar.classList.remove("aberto");
  btnAvatar.setAttribute("aria-expanded", "false");
  document.querySelectorAll(".modal-overlay.aberto").forEach((el) => {
    el.classList.remove("aberto");
  });
});

// ao sair, esquece o perfil escolhido no login
document
  .querySelector(".avatar-menu__item--sair")
  .addEventListener("click", () => {
    sessionStorage.removeItem("pam_perfil");
  });

// ── Foto de perfil (único campo editável) ───────────────────────────────
const btnEditarFoto = document.getElementById("btnEditarFoto");
const inputFoto = document.getElementById("inputFoto");
const fotoPreview = document.getElementById("fotoPreview");
const fotoNome = document.getElementById("fotoNome");
const navAvatarImg = document.getElementById("navAvatarImg");
const btnSalvar = document.getElementById("btnSalvar");

btnEditarFoto.addEventListener("click", () => {
  inputFoto.click();
});

inputFoto.addEventListener("change", () => {
  const arquivo = inputFoto.files && inputFoto.files[0];
  if (!arquivo) return;

  const urlPreview = URL.createObjectURL(arquivo);
  fotoPreview.src = urlPreview;
  navAvatarImg.src = urlPreview;
  fotoNome.textContent = arquivo.name;
});

btnSalvar.addEventListener("click", () => {
  mostrarToast("Alterações salvas!");
});

// ── Excluir conta ─────────────────────────────────────────────────────
const btnExcluir = document.getElementById("btnExcluir");

btnExcluir.addEventListener("click", () => {
  document.getElementById("modalExcluir").classList.add("aberto");
});

document.getElementById("btnCancelarExcluir").addEventListener("click", () => {
  document.getElementById("modalExcluir").classList.remove("aberto");
});

document.getElementById("btnConfirmarExcluir").addEventListener("click", () => {
  document.getElementById("modalExcluir").classList.remove("aberto");
  sessionStorage.removeItem("pam_perfil");
  window.location.href = "../../inicio/login/index.html";
});

document.getElementById("modalExcluir").addEventListener("click", function (e) {
  if (e.target === this) this.classList.remove("aberto");
});

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
