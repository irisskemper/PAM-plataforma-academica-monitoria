// 1s de respiro, depois desliza o painel pra esquerda
setTimeout(() => {
  const painel = document.getElementById("splash-panel");
  const login = document.getElementById("login");

  // mostra o login atrás antes de começar a animação
  login.classList.add("visible");

  // desliza o painel
  painel.classList.add("slid");
}, 1000);

// domínio de email que cada perfil precisa usar
// (monitor também é aluno, então usa o email de discente)
const DOMINIO_DO_PERFIL = {
  aluno: "@discente.ifpe.edu.br",
  monitor: "@discente.ifpe.edu.br",
  professor: "@docente.ifpe.edu.br",
};

const DOMINIOS_INSTITUCIONAIS = ["@discente.ifpe.edu.br", "@docente.ifpe.edu.br"];

// Mostrar/esconder senha
function toggleSenha() {
  const input = document.getElementById("senha");
  const icon = document.getElementById("eye-icon");
  const btn = icon.closest(".eye-btn");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "image/icon-eye-closed.png";
    btn.setAttribute("aria-label", "Ocultar senha");
  } else {
    input.type = "password";
    icon.src = "image/icon-eye-open.png";
    btn.setAttribute("aria-label", "Mostrar senha");
  }
}

// mostra a mensagem de erro geral do login, logo acima do botão
// (também serve pra quando o backend responder "email ou senha incorretos")
function mostrarErroLogin(mensagem) {
  const erroLogin = document.getElementById("erro-login");
  erroLogin.textContent = mensagem;
  erroLogin.classList.add("visivel");
}

function limparErroLogin() {
  const erroLogin = document.getElementById("erro-login");
  erroLogin.textContent = "";
  erroLogin.classList.remove("visivel");
}

// Login com email e senha
function fazerLogin() {
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const fieldEmail = document.getElementById("field-email");
  const fieldSenha = document.getElementById("field-senha");
  const erroEmail = document.getElementById("erro-email");
  const erroSenha = document.getElementById("erro-senha");

  const email = emailInput.value.trim().toLowerCase();
  const senha = senhaInput.value;
  const perfil = document.querySelector('input[name="perfil"]:checked').value;
  let valido = true;

  limparErroLogin();

  // valida email: precisa ser institucional (discente ou docente)
  const emailInstitucional = DOMINIOS_INSTITUCIONAIS.some(
    (d) => email.endsWith(d) && email.length > d.length,
  );
  if (!emailInstitucional) {
    fieldEmail.classList.add("invalido");
    erroEmail.classList.add("visivel");
    valido = false;
  } else {
    fieldEmail.classList.remove("invalido");
    erroEmail.classList.remove("visivel");
  }

  // valida senha
  // por enquanto só verifica se está vazia; a conferência com a senha
  // cadastrada vai ser feita pelo backend (POST /api/usuarios/login)
  if (senha.length === 0) {
    fieldSenha.classList.add("invalido");
    erroSenha.classList.add("visivel");
    valido = false;
  } else {
    fieldSenha.classList.remove("invalido");
    erroSenha.classList.remove("visivel");
  }

  if (!valido) return;

  // email institucional válido, mas de um tipo diferente do perfil escolhido
  if (!email.endsWith(DOMINIO_DO_PERFIL[perfil])) {
    mostrarErroLogin("Este email não corresponde ao perfil selecionado.");
    return;
  }

  sessionStorage.setItem("pam_perfil", perfil);
  window.location.href = "../../" + perfil + "/home-" + perfil + "/index.html";
}

// Enter em qualquer campo (email, senha ou perfil) também faz o login
document.querySelector(".login-card").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT") fazerLogin();
});

// ao trocar o perfil, some o erro geral (ele dependia do perfil antigo)
document.querySelectorAll('input[name="perfil"]').forEach((radio) => {
  radio.addEventListener("change", limparErroLogin);
});
