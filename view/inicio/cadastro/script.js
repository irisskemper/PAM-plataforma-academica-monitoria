let perfilSelecionado = null;

const opcoesPorPerfil = {
  professor: [
    "Arquitetura de Software",
    "Análise e Desenvolvimento de Software",
    "Design e Usabilidade",
    "Matemática IV",
  ],
  monitor: [
    "Arquitetura de Software",
    "Análise e Desenvolvimento de Software",
    "Design e Usabilidade",
    "Matemática IV",
  ],
  aluno: ["1º ano", "2º ano", "3º ano", "4º ano"],
};

function selecionarPerfil(perfil) {
  document.querySelectorAll(".btn-perfil").forEach((btn) => {
    btn.classList.remove("ativo");
  });

  document.getElementById("btn-" + perfil).classList.add("ativo");
  perfilSelecionado = perfil;

  document.getElementById("erro-perfil").classList.remove("visivel");

  // preenche as opções conforme o perfil
  const container = document.getElementById("opcoes-extra");
  container.innerHTML = "";

  opcoesPorPerfil[perfil].forEach((opcao) => {
    const label = document.createElement("label");

    const input = document.createElement("input");
    // aluno = radio (só uma turma), professor e monitor = checkbox (várias matérias)
    input.type = perfil === "professor" ? "checkbox" : "radio";
    input.name = "opcao-extra";
    input.value = opcao;

    label.appendChild(input);
    label.appendChild(document.createTextNode(opcao));
    container.appendChild(label);
  });

  document.getElementById("extra-perfil").style.display = "block";
  document.getElementById("erro-extra").classList.remove("visivel");
}

function toggleSenha(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.src = "image/icon-eye-closed.png";
  } else {
    input.type = "password";
    icon.src = "image/icon-eye-open.png";
  }
}

function mostrarToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

function setErro(fieldId, erroId, mostrar) {
  document.getElementById(fieldId).classList.toggle("invalido", mostrar);
  document.getElementById(erroId).classList.toggle("visivel", mostrar);
}

function fazerCadastro() {
  const nome = document.getElementById("nome").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirma = document.getElementById("confirma").value;

  let valido = true;

  if (nome.length < 3) {
    setErro("field-nome", "erro-nome", true);
    valido = false;
  } else {
    setErro("field-nome", "erro-nome", false);
  }

  if (matricula.length < 5) {
    setErro("field-matricula", "erro-matricula", true);
    valido = false;
  } else {
    setErro("field-matricula", "erro-matricula", false);
  }

  const dominios = ["@discente.ifpe.edu.br", "@docente.ifpe.edu.br"];
  const emailValido = dominios.some((d) => email.endsWith(d));
  if (!emailValido) {
    setErro("field-email", "erro-email", true);
    valido = false;
  } else {
    setErro("field-email", "erro-email", false);
  }

  if (senha.length < 6) {
    setErro("field-senha", "erro-senha", true);
    valido = false;
  } else {
    setErro("field-senha", "erro-senha", false);
  }

  if (confirma !== senha || confirma.length === 0) {
    setErro("field-confirma", "erro-confirma", true);
    valido = false;
  } else {
    setErro("field-confirma", "erro-confirma", false);
  }

  if (!perfilSelecionado) {
    document.getElementById("erro-perfil").classList.add("visivel");
    valido = false;
  }

  // valida matéria/turma
  const marcados = document.querySelectorAll("#opcoes-extra input:checked");
  if (marcados.length === 0) {
    document.getElementById("erro-extra").classList.add("visivel");
    valido = false;
  } else {
    document.getElementById("erro-extra").classList.remove("visivel");
  }

  if (valido) {
    mostrarToast("Dados validados! Cadastro demonstrativo, sem criação de conta.");
    setTimeout(() => {
      window.location.href = "../login/index.html";
    }, 2000);
  }
}
