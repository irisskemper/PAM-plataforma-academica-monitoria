// perfil desta página (acompanha a dúvida quando ela for enviada)
const PERFIL = "aluno";

// email que recebe as dúvidas (fictício por enquanto, troque aqui quando tiver o real)
const EMAIL_SUPORTE = "pamsuporte@gmail.com";

const btnAvatar = document.getElementById("btnAvatar");
const menuAvatar = document.getElementById("menuAvatar");
const btnSair = document.getElementById("btnSair");

const btnDuvida = document.getElementById("btnDuvida");
const modal = document.getElementById("modalDuvida");
const etapaEscrever = document.getElementById("etapaEscrever");
const etapaConfirmacao = document.getElementById("etapaConfirmacao");
const textoDuvida = document.getElementById("textoDuvida");
const erroDuvida = document.getElementById("erroDuvida");

// coloca o email de suporte em todos os lugares do texto onde ele aparece
document.querySelectorAll(".email-suporte").forEach((el) => {
  el.textContent = EMAIL_SUPORTE;
});

/* ---------- menu do avatar ---------- */

function alternarMenu() {
  const aberto = menuAvatar.classList.toggle("aberto");
  btnAvatar.setAttribute("aria-expanded", String(aberto));
}

function fecharMenu() {
  menuAvatar.classList.remove("aberto");
  btnAvatar.setAttribute("aria-expanded", "false");
}

btnAvatar.addEventListener("click", (e) => {
  e.stopPropagation(); // senão o clique fora (abaixo) fecha o menu na hora
  alternarMenu();
});

// clicar em qualquer outro lugar fecha o menu
document.addEventListener("click", fecharMenu);

// ao sair, esquece o perfil escolhido no login
btnSair.addEventListener("click", () => {
  sessionStorage.removeItem("pam_perfil");
});

/* ---------- janela da dúvida ---------- */

function limparErro() {
  textoDuvida.classList.remove("invalido");
  erroDuvida.classList.remove("visivel");
}

function abrirModal() {
  textoDuvida.value = "";
  limparErro();
  etapaEscrever.classList.remove("oculto");
  etapaConfirmacao.classList.add("oculto");
  modal.classList.add("aberto");
  textoDuvida.focus();
}

function fecharModal() {
  modal.classList.remove("aberto");
  btnDuvida.focus(); // devolve o foco pro botão que abriu a janela
}

// aqui entra o envio de verdade: quando o backend tiver a rota,
// o fetch (POST com o perfil e a mensagem) vai nessa função e o
// servidor manda o email pro EMAIL_SUPORTE
function enviarParaSuporte(perfil, mensagem) {
  return true;
}

function enviarDuvida() {
  const mensagem = textoDuvida.value.trim();

  if (mensagem === "") {
    textoDuvida.classList.add("invalido");
    erroDuvida.classList.add("visivel");
    textoDuvida.focus();
    return;
  }

  enviarParaSuporte(PERFIL, mensagem);

  // troca a janela pela confirmação
  etapaEscrever.classList.add("oculto");
  etapaConfirmacao.classList.remove("oculto");
  document.getElementById("btnFechar").focus();
}

btnDuvida.addEventListener("click", abrirModal);
document.getElementById("btnCancelar").addEventListener("click", fecharModal);
document.getElementById("btnFechar").addEventListener("click", fecharModal);
document.getElementById("btnEnviar").addEventListener("click", enviarDuvida);

// ao digitar, o aviso de erro some
textoDuvida.addEventListener("input", limparErro);

// clicar no fundo escuro fecha a janela
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});

// Esc fecha a janela e o menu
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("aberto")) fecharModal();
  fecharMenu();
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
