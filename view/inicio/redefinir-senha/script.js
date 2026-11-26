// Mostrar/esconder senha (funciona pros dois campos: "senha" e "confirma-senha")
function toggleSenha(campoId) {
  const input = document.getElementById(campoId);
  const icon = document.getElementById("eye-icon-" + campoId);
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

// redefine a senha do usuário
function redefinirSenha() {
  const senhaInput = document.getElementById("senha");
  const confirmaInput = document.getElementById("confirma-senha");
  const fieldSenha = document.getElementById("field-senha");
  const fieldConfirma = document.getElementById("field-confirma-senha");
  const erroSenha = document.getElementById("erro-senha");
  const erroConfirma = document.getElementById("erro-confirma-senha");

  const senha = senhaInput.value;
  const confirma = confirmaInput.value;
  let valido = true;

  // valida tamanho mínimo da senha
  if (senha.length < 6) {
    fieldSenha.classList.add("invalido");
    erroSenha.classList.add("visivel");
    valido = false;
  } else {
    fieldSenha.classList.remove("invalido");
    erroSenha.classList.remove("visivel");
  }

  // valida se as senhas coincidem
  if (confirma.length === 0 || confirma !== senha) {
    fieldConfirma.classList.add("invalido");
    erroConfirma.classList.add("visivel");
    valido = false;
  } else {
    fieldConfirma.classList.remove("invalido");
    erroConfirma.classList.remove("visivel");
  }

  if (valido) {
    // por enquanto só redireciona pro login, sem chamada de backend ainda
    window.location.href = "../login/index.html";
  }
}
