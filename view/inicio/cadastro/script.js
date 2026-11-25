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

let materiasEscolhidas = [];

function criarSeletor(perfil, container) {
  const multiplo = perfil === "professor";

  const select = document.createElement("select");
  select.className = "select-perfil";
  select.setAttribute(
    "aria-label",
    multiplo ? "Matérias que você leciona" : "Matéria em que você é monitor",
  );
  select.add(
    new Option(
      multiplo ? "Selecione uma matéria" : "Selecione sua matéria",
      "",
    ),
  );
  opcoesPorPerfil[perfil].forEach((o) => select.add(new Option(o, o)));
  container.appendChild(select);

  // monitor: só uma matéria
  if (!multiplo) {
    select.addEventListener("change", () => {
      materiasEscolhidas = select.value ? [select.value] : [];
      document.getElementById("erro-extra").classList.remove("visivel");
    });
    return;
  }

  // professor: várias matérias, uma de cada vez
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-adicionar";
  btn.textContent = "Adicionar matéria";
  const lista = document.createElement("div");
  lista.className = "chips";
  container.append(btn, lista);

  function desenhar() {
    lista.innerHTML = "";
    materiasEscolhidas.forEach((materia) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.appendChild(document.createTextNode(materia));
      const x = document.createElement("button");
      x.type = "button";
      x.setAttribute("aria-label", "Remover " + materia);
      x.textContent = "×";
      x.addEventListener("click", () => {
        materiasEscolhidas = materiasEscolhidas.filter((m) => m !== materia);
        desenhar();
      });
      chip.appendChild(x);
      lista.appendChild(chip);
    });
    // matéria já adicionada fica desabilitada no seletor
    Array.from(select.options).forEach((op) => {
      if (op.value) op.disabled = materiasEscolhidas.includes(op.value);
    });
  }

  btn.addEventListener("click", () => {
    if (!select.value || materiasEscolhidas.includes(select.value)) return;
    materiasEscolhidas.push(select.value);
    select.value = "";
    desenhar();
    document.getElementById("erro-extra").classList.remove("visivel");
  });
}

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
  materiasEscolhidas = [];

  if (perfil === "aluno") {
    opcoesPorPerfil.aluno.forEach((opcao) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "opcao-extra";
      input.value = opcao;
      label.appendChild(input);
      label.appendChild(document.createTextNode(opcao));
      container.appendChild(label);
    });
  } else {
    criarSeletor(perfil, container);
  }

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
  const qtdEscolhidas =
    perfilSelecionado === "aluno"
      ? document.querySelectorAll("#opcoes-extra input:checked").length
      : materiasEscolhidas.length;
  if (qtdEscolhidas === 0) {
    document.getElementById("erro-extra").classList.add("visivel");
    valido = false;
  } else {
    document.getElementById("erro-extra").classList.remove("visivel");
  }

  if (valido) {
    mostrarToast(
      "Dados validados! Cadastro demonstrativo, sem criação de conta.",
    );
    setTimeout(() => {
      window.location.href = "../login/index.html";
    }, 2000);
  }
}
