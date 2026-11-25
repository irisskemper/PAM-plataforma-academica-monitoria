const digitos = document.querySelectorAll(".digito");
const erroCodigo = document.getElementById("erro-codigo");

// pega o email vindo da tela anterior pela URL (?email=...), se existir
const email = new URLSearchParams(window.location.search).get("email");
if (email) {
  document.getElementById("email-destino").textContent = email;
}

// começa com o cursor no primeiro dígito
digitos[0].focus();

// tira o destaque de erro de todas as caixinhas
function limparErro() {
  digitos.forEach((c) => c.classList.remove("invalido"));
  erroCodigo.classList.remove("visivel");
}

// navegação automática entre os campos do código
digitos.forEach((campo, index) => {
  campo.addEventListener("input", () => {
    campo.value = campo.value.replace(/[^0-9]/g, "");
    limparErro();

    if (campo.value && index < digitos.length - 1) {
      digitos[index + 1].focus();
    }
  });

  campo.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !campo.value && index > 0) {
      digitos[index - 1].focus();
    }
    if (e.key === "Enter") confirmarCodigo();
  });

  // colar o código inteiro (ex.: "1234") preenche as caixinhas de uma vez
  campo.addEventListener("paste", (e) => {
    e.preventDefault();
    const numeros = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, digitos.length - index);

    numeros.split("").forEach((numero, i) => {
      digitos[index + i].value = numero;
    });

    limparErro();
    digitos[Math.min(index + numeros.length, digitos.length - 1)].focus();
  });
});

// confirma o código digitado
function confirmarCodigo() {
  const codigo = Array.from(digitos)
    .map((c) => c.value)
    .join("");

  if (codigo.length < digitos.length) {
    digitos.forEach((c) => {
      if (!c.value) c.classList.add("invalido");
    });
    erroCodigo.classList.add("visivel");
    return;
  }

  // por enquanto só redireciona pra tela de nova senha, sem chamada de backend ainda
  window.location.href = "../redefinir-senha/index.html";
}
