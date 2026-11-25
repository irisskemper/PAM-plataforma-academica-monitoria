document.addEventListener("DOMContentLoaded", function () {
  // --- Avatar dropdown ---
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

  // --- Fechar modal ao clicar fora dele (no overlay) ---
  document
    .getElementById("modalOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) fecharModal();
    });
});

// ─── Estado interno do modal ─────────────────────────────────────
var _modalId = null;
var _modalAcao = null;

function avaliarItem(id, acao) {
  var card = document.querySelector('[data-id="' + id + '"]');
  if (!card) return;

  _modalId = id;
  _modalAcao = acao;

  var ehMaterial = id.startsWith("mat-");
  var verbo = acao === "aprovado" ? "aprovar" : "recusar";
  var tipo = ehMaterial ? "esse material" : "esse monitor";

  document.getElementById("modalTexto").textContent =
    "Deseja " + verbo + " " + tipo + "?";

  document.getElementById("modalSub").textContent =
    acao === "aprovado"
      ? "O material será aprovado e o item será removido da lista."
      : "O material será removido da lista.";

  var btnConfirmar = document.getElementById("modalBtnConfirmar");
  btnConfirmar.textContent =
    acao === "aprovado" ? "Sim, aprovar" : "Sim, recusar";
  btnConfirmar.className = "modal__btn modal__btn--" + acao;

  document.getElementById("modalOverlay").classList.add("aberto");
}

function confirmarModal() {
  var id = _modalId;
  var acao = _modalAcao;

  fecharModal();

  var card = document.querySelector('[data-id="' + id + '"]');
  if (!card) return;

  // o comentário é escrito no próprio card do material (monitores não têm)
  var campoComentario = card.querySelector(".material-card__comentario");
  var comentario = campoComentario ? campoComentario.value.trim() : "";

  if (acao === "aprovado") {
    salvarItemAceito(id, card, comentario);
  } else if (campoComentario) {
    // material recusado também guarda o comentário: é onde o professor
    // explica pro monitor o motivo da recusa
    salvarMaterialRecusado(id, card, comentario);
  }

  card.remove();
  mostrarToast(
    acao === "aprovado" ? "Material aprovado." : "Material recusado.",
  );
  _modalId = null;
  _modalAcao = null;
}

function fecharModal() {
  document.getElementById("modalOverlay").classList.remove("aberto");
}

function salvarItemAceito(id, card, comentario) {
  var isMaterial = id.startsWith("mat-");

  if (isMaterial) {
    var disciplina = card.querySelector(".material-card__disciplina");
    var monitor = card.querySelector(".material-card__monitor");
    var arquivoNome = card.querySelector(".material-card__arquivo-nome");
    var arquivoTipo = card.querySelector(".material-card__arquivo-tipo");

    localStorage.setItem(
      "pam_aceito_" + id,
      JSON.stringify({
        tipo: "material",
        disciplina: disciplina ? disciplina.textContent.trim() : "",
        monitor: monitor ? monitor.textContent.trim() : "",
        arquivoNome: arquivoNome ? arquivoNome.textContent.trim() : "",
        arquivoTipo: arquivoTipo ? arquivoTipo.textContent.trim() : "PDF",
        comentario: comentario || "",
      }),
    );
  } else {
    var nome = card.querySelector(".monitor-card__nome");
    var discipl = card.querySelector(".monitor-card__disciplina");
    var email = card.querySelector(".monitor-card__email");
    var matricula = card.querySelector(".monitor-card__matricula");

    localStorage.setItem(
      "pam_aceito_" + id,
      JSON.stringify({
        tipo: "monitor",
        nome: nome ? nome.textContent.trim() : "",
        disciplina: discipl ? discipl.textContent.trim() : "",
        email: email ? email.textContent.trim() : "",
        matricula: matricula ? matricula.textContent.trim() : "",
      }),
    );
  }
}

function salvarMaterialRecusado(id, card, comentario) {
  var disciplina = card.querySelector(".material-card__disciplina");
  var monitor = card.querySelector(".material-card__monitor");
  var arquivoNome = card.querySelector(".material-card__arquivo-nome");

  localStorage.setItem(
    "pam_recusado_" + id,
    JSON.stringify({
      tipo: "material",
      disciplina: disciplina ? disciplina.textContent.trim() : "",
      monitor: monitor ? monitor.textContent.trim() : "",
      arquivoNome: arquivoNome ? arquivoNome.textContent.trim() : "",
      comentario: comentario,
    }),
  );
}

function abrirMaterial(arquivo) {
  mostrarToast("Abrindo: " + arquivo);
}

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
