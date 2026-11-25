# Plataforma Acadêmica de Monitoria

Versão 2.0 (responsiva)

## Abrir o projeto
Extraia o ZIP inteiro e abra index.html na pasta principal. Também pode usar a extensão Live Server do VS Code.

No login, escolha o perfil (Aluno, Monitor ou Professor). Aluno e Monitor entram com email terminado em @discente.ifpe.edu.br; Professor entra com email terminado em @docente.ifpe.edu.br. Qualquer senha não vazia é aceita, pois a conferência da senha depende do backend.

## Organização
Cada página tem o seu próprio html, css e js, sem arquivos compartilhados entre páginas.

- view/inicio: login, cadastro, esqueceu-senha, codigo-senha e redefinir-senha.
- view/aluno, view/monitor, view/professor: páginas de cada perfil.
- view/aluno/ajuda, view/monitor/ajuda, view/professor/ajuda: central de ajuda de cada perfil, cada uma com seu próprio html, css, js e imagens.

## Central de ajuda
Cada perfil tem 4 caixinhas de pergunta e resposta, prontas para receber o texto (basta trocar o conteúdo dentro de cada `faq-card` no index.html). O botão "Continua com dúvida? Clique aqui" abre uma janela para escrever a dúvida e mostra a confirmação de envio.

O email que recebe as dúvidas fica na constante `EMAIL_SUPORTE`, no topo do script.js de cada central de ajuda (hoje é o fictício pamsuporte@gmail.com).

## Limites
O envio da dúvida, o cadastro, a recuperação de senha, os materiais e os avisos ainda não passam por servidor: não há autenticação, envio de email nem comunicação entre usuários. A maior parte das alterações desaparece ao recarregar. A validação do professor guarda o resultado e o comentário de cada material no localStorage, mas a home do monitor ainda não lê esses dados. As fontes originais continuam carregadas por CDN; sem internet o navegador utiliza a fonte alternativa.

## Versão 2.0: responsividade
Todas as 18 telas foram ajustadas para celular, tablet e telas grandes. Cada página continua independente: o bloco novo fica no final do style.css (comentário "RESPONSIVIDADE v2.0") e, nas telas logadas, no final do script.js.

- Telas logadas: até 960px a navbar vira menu hambúrguer (botão `btnMenuMobile`, painel `navLinks`, fundo `navOverlay`). Fecha com Esc, clique fora ou ao aumentar a janela. A navbar fica fixa no topo.
- Telas de início: cartões sem aperto entre 931px e 1100px, cadastro sem rolagem interna no celular, ícone de olho corrigido, campos com 16px no celular (o iPhone não dá zoom).
- Corrigido: no tira-dúvidas os cards do FAQ sumiam no celular.
- Área segura do iPhone (notch) e celular deitado tratados.
- Os ajustes antigos de tela pequena foram mantidos; o bloco v2.0 vem depois e sobrescreve.
