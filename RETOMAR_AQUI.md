# 🐷 SOBRA NADA APP — Retomar Aqui

> Doc de continuidade. Leia isto e o `CONTEXTO.md` (roadmap detalhado) e você tem
> **todo o contexto** pra continuar sem reexplicar nada.
> Última atualização: **15/06/2026**.

---

## 1. O que é

App **pessoal** do Digo: controle financeiro + budgets + metas com **gamificação da renda**.
Muito visual, com gráficos. Roda como **HTML único**, pra adicionar na tela do iPhone.
Tom: divertido, "vibe gamer". Mascote é um **porquinho verde gordo, bravo e carismático**.

---

## 2. Estado atual (o que já está pronto)

**Fases 1 a 8 — COMPLETAS. Roadmap concluído.** O app é totalmente funcional, usável e
**instalável no iPhone** (PWA, offline).

- **Fase 1:** base do app (dark), navegação, dados em `localStorage`, Receitas, Metas,
  gamificação base, backup export/import JSON.
- **Fase 2:** Despesas por categoria, budgets mensais com alerta de estouro, gráfico
  receitas × despesas, card "Sobra do mês".
- **Fase 3 (Motor de Tempo):** compras parceladas ("Parcela 3/6"), recorrências de verdade
  (receita/gasto fixo), fontes de renda com tickets (VR/VA, T. Alimentação/Refeição),
  cartão (fechamento/vencimento) + fatura estimada, banner de "hoje", previsão dos
  próximos 6 meses.
- **Fase 4 (DNA do app):** **Merreca**, **mascote vivo** (5 humores), **XP por resultado**
  (não por digitar), streak diário "em dia", streak de meses no azul, **desafios mensais**
  (boss battles) e **galeria de conquistas**.
- **Fase 5 (Presentes):** aniversários (namorada/família) com **countdown** e **recorrência
  anual**; budget **integrado** (reserva no mês do aniversário, pesa na sobra/Merreca e na
  previsão); botão **"comprei"** vira gasto real em Compras + XP/conquista "Presenteador 🎁";
  **alerta no Painel** pra aniversários a ≤30 dias. Gestão na tela Metas. Schema → **v4**.
- **Fase 6 (Projetos de longo prazo):** as **Metas evoluíram** — ganham **custo + prazo +
  guardar/mês** e viram projeto. Form com **cálculo ao vivo** (custo+prazo → quanto/mês; ou
  quanto/mês → ETA). **Integrado**: o aporte mensal pesa na sobra/Merreca e na previsão;
  **alerta de ritmo** se não bate o prazo; **banner de compromisso** (aportes/mês vs sobra
  livre). Conquista "Sonho realizado 🏆". Schema → **v5** (`metas[].aporteMensal`).
- **Fase 7 (Carteiras VR/VA & Coach):** o vale é **restrito a comida** — virou **carteira com
  saldo** (VR=Refeição, VA=Alimentação) que acumula e abate gastos de Alimentação
  (alocação Refeição-first). A **Merreca foi corrigida** (`sobraLivreMes()` tira o vale do
  dinheiro livre). **Coach** dá dicas por regra falando pelo **mascote** (dica mais urgente)
  + card **"Coach da semana"** (foi bem / vigiar / ação). Carteiras são **calculadas**, sem
  mudança de schema (segue **v5**).
- **Fase 8 (PWA):** ícone do porquinho (verde escuro), `manifest.webmanifest`, `sw.js`
  (offline-first), metas + registro do SW no `index.html`. Caminhos relativos. Guia em
  `PUBLICAR.md` (GitHub Pages + instalar no iPhone).

**Falta só:** publicar (seguir o `PUBLICAR.md`) e fazer o **teste real no iPhone**.
👉 **Próximo passo: subir no GitHub Pages e instalar no Safari do iPhone.**

**Ideias pós-roadmap (v2):** há um **backlog aberto** no `CONTEXTO.md` (seção 5b) — importar
CSV, evolução do porquinho, conquistas sazonais/streak freeze, "Posso comprar isso?",
retrospectiva, previsão de fim de ano, lembretes de vencimento, categorias custom/temas,
card compartilhável. Cada uma pode virar uma "Fase 9+".

---

## 3. Glossário (termos do produto)

- **Merreca:** quanto dá pra gastar sem culpa. **Sobra livre** ÷ dias restantes (desde a
  Fase 7 já desconta o vale). Mostrada como "Merreca de hoje" e "Esta semana" no painel.
- **Sobra:** receitas do mês − gastos do mês (bruta, ainda exibida no card "Sobra do mês").
- **Sobra livre:** sobra tirando o vale (restrito) e a comida coberta por vale — base da Merreca.
- **Carteira (vale):** saldo de VR (Refeição) / VA (Alimentação) que acumula e abate gastos
  de Alimentação. Dinheiro restrito, não entra na Merreca.
- **Mascote vivo:** o porquinho muda de humor (neutro/bravo/ok/feliz/gordo) conforme a
  saúde financeira do mês.

---

## 4. Arquitetura técnica (pra continuar o código)

- **Um arquivo só:** `index.html` (HTML + CSS + JS num arquivo, sem build, sem servidor).
- **Dados:** tudo em `localStorage`, chave **`sobraNadaData`**, **schema v7**
  (`config.versaoSchema`). Função `migrate()` cuida de versões antigas sem perder dados.
  v6 adicionou `db.tamagotchi`; v7 adicionou `db.cartoes[]`, `db.emprestimos[]` e
  `compras[].cartaoId` (migrou o `cartao` único antigo pra lista).
- **SVGs embutidos:** mascote e logo estão **inline** no JS (constantes `MASCOTE_SVG` /
  `LOGO_SVG` → data URIs). O app **não depende** dos arquivos `.svg` externos pra mostrar
  a arte. (Os `.svg` ficam na pasta só pra editar a arte depois.)
- **Gráficos:** Chart.js via CDN (única dependência online; resolver na Fase 8 com offline).
- **Visual:** dark, verde, mobile-first. Navegação por abas embaixo: Painel, Receitas,
  Gastos, Metas, Ajustes. Botão **+** (FAB) abre uma "sheet" com abas Receita/Gasto/Meta/Desafio/Presente.

### Formato dos dados (`db`)
```
{
  receitas:  [ { id, tipo, valor, data, recorrente } ],
  despesas:  [ { id, categoria, valor, data, descricao } ],
  compras:   [ { id, descricao, categoria, total, parcelas, valorParcela, dataInicio } ],
  recorrencias:[ { id, tipo:receita|despesa, nome, categoria, valor, diaDoMes, inicio, ativo } ],
  fontesRenda:[],            // reservado (hoje fontes = recorrências de receita)
  cartao:    { fechamento, vencimento },
  desafios:  [ { id, tipo:categoria|sobra, categoria?, limite, mes, xp, resolvido, vitoria } ],
  presentes: [ { id, pessoa, dataAniversario, budget, ideia, compradoAno } ],  // Fase 5
  budgets:   { categoria: valorMensal },
  metas:     [ { id, nome, alvo, atual, prazo, aporteMensal, concluida } ],  // aporteMensal>0 = projeto (Fase 6)
  gamificacao: { xp, conquistas:[], streak, ultimoDia },
  config:    { moeda, tema, versaoSchema }
}
```

### Funções-chave no JS (pra se localizar)
- `totalReceitasMes(ym)` / `totalDespesasMes(ym)` — somam avulsos + recorrências + parcelas.
- `merreca()`, `humorMascote()`, `mesesNoAzul()`, `registrarCheckin()` — Fase 4.
- `parcelaNoMes()`, `addMonths()`, `faturaEstimada()` — Motor de Tempo.
- `resolveDesafios()` / `desafioStatus()` — desafios.
- `proxAniversario()` / `diasAteAniv()` / `presenteCompradoCiclo()` / `comprarPresente()` — Fase 5.
  A reserva do presente entra em `despesasNoMes()` (categoria Compras) no mês do aniversário.
- `projetoStatus()` / `mesesAtePrazo()` / `compromissoProjetos()` / `updateGoalHint()` — Fase 6.
  Metas com `aporteMensal>0` reservam esse valor em `despesasNoMes()` (categoria "Projetos")
  no mês atual e nos futuros, até concluir.
- `VALE_TIPOS` / `saldosVale()` / `valeRecebidoAte()` / `alimGastoAte()` / `sobraLivreMes()` — Fase 7.
  Carteiras calculadas (alocação Refeição-first); `merreca()` agora usa `sobraLivreMes()`.
- `coachTips()` / `coachTop()` / `resumoSemanal()` — coach (Agiota). O mascote fala `coachTop()`.
- `LEVELS` (10 níveis) · `NEG_LEVELS` + `nivelVermelho()` (−1 a −5) · `RABUGICE`/`falaBronca()`
  (pérolas do QUASE NADA, saem no vermelho leve e ~1/3 dos dias no azul).
- **Tamagotchi COMPLETO (9a+9b+9c):** `tamaEnergia()`/`fecharDia()` (cuidado diário) ·
  `faseAtual()`/`checkEvolucao()` (evolução em 5 fases por patrimônio) · `cofreInfo()`/
  `checkColecao()`/`MARCOS` (cofrinho + coleção). Estado em `db.tamagotchi`
  (`{ultimoFechamento,sequencia,recorde,totalFechamentos,fase,colecao}`).
- **Nomes:** mascote = **QUASE NADA**, coach = **Agiota**.
- **Cartões & crédito (v7):** `cartaoUsado()`/`faturaCartao()`/`renderCartoes()` (limite usado
  pelas parcelas em aberto) · `REF_JUROS`/`taxaImplicita()`/`emprestimoAnalise()` (veredito de
  juros abusivo vs mercado BR) · parcela de empréstimo pesa em `despesasNoMes()`.
- `renderAll()` chama todos os renders.

---

## 5. Decisões importantes (não mudar sem combinar)

- **NUNCA faremos** sincronização em nuvem nem integração bancária (Open Finance).
  Fica simples, offline, sem servidor.
- **XP premia RESULTADO** (conquistas, metas, estar em dia), não o ato de digitar.
- **Parcela** conta no mês em que cai (1ª parcela = mês da compra). Se um dia ligarmos ao
  cartão, dá pra deslocar pro mês da fatura.
- **Faseamento estratégico** pra economizar token: cada fase entrega algo usável; fatiar
  fases grandes; validar a lógica no sandbox antes de fechar.

---

## 6. Arquivos na pasta

- `index.html` — o app (é o que importa).
- `manifest.webmanifest`, `sw.js` — PWA (instalação + offline). **Subir junto no host.**
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` — ícones.
- `mascote.svg`, `logo.svg` — arte (já embutida no app; só pra editar / gerar ícones).
- `PUBLICAR.md` — passo a passo do GitHub Pages + instalar no iPhone.
- `CONTEXTO.md` — roadmap completo com backlog de todas as fases.
- `RETOMAR_AQUI.md` — este doc.

---

## 7. Como continuar (próxima sessão)

1. Diga: *"bora pra Fase 8"* (ou a fase que quiser) — o assistente lê este doc + `CONTEXTO.md`.
2. Fase 8 = `manifest.json` + ícone do porquinho + service worker (offline) + splash.
   Anda junto com **publicar a pasta** (ex.: GitHub Pages, grátis) pra virar app no iPhone.
3. Quirk conhecido: o sandbox de validação às vezes fica com cache defasado do arquivo;
   por isso validamos a lógica rodando os algoritmos isoladamente (sempre passou).
