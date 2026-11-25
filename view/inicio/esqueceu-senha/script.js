// domínios aceitos (os mesmos da tela de login)
const DOMINIOS_INSTITUCIONAIS = ["@discente.ifpe.edu.br", "@docente.ifpe.edu.br"];

// envia o código pro email digitado
function enviarCodigo() {
  const emailInput = document.getElementById("email");
  const fieldEmail = document.getElementById("field-email");
  const erroEmail = document.getElementById("erro-email");

  const email = emailInput.value.trim().toLowerCase();

  // valida email institucional (mesmo padrão do login)
  const valido = DOMINIOS_INSTITUCIONAIS.some(
    (d) => email.endsWith(d) && email.length > d.length,
  );

  if (!valido) {
    fieldEmail.classList.add("invalido");
    erroEmail.classList.add("visivel");
    return;
  }

  fieldEmail.classList.remove("invalido");
  erroEmail.classList.remove("visivel");

  // por enquanto só redireciona pra tela de código, sem chamada de backend ainda
  window.location.href =
    "../codigo-senha/index.html?email=" + encodeURIComponent(email);
}

// Enter no campo também avança
document.getElementById("email").addEventListener("keydown", (e) => {
  if (e.key === "Enter") enviarCodigo();
});
