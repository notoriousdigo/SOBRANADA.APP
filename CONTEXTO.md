# 💰 SOBRA NADA APP — Doc de Contexto & Backlog

> App pessoal de controle financeiro, budgets e metas com gamificação da renda.
> Documento vivo: serve de "fonte da verdade" do projeto entre as sessões.

**Dono:** Digo · **Última atualização:** 15/06/2026 · **Status:** Fase 0 (planejamento)

---

## 1. Visão geral

Um app **pessoal** (uso individual do Digo) para organizar a vida financeira de forma
visual e divertida. A ideia central é transformar controle de dinheiro num "jogo":
metas com progresso, conquistas (XP/badges) e gráficos que mostram a renda crescendo.

O app cobre três frentes:

1. **Entradas de dinheiro** — salário, bônus, PLR, e quando cada um cai.
2. **Saídas planejadas** — budget de presentes (aniversários da namorada e família) e gastos.
3. **Objetivos** — metas de curto prazo (gamificadas) e projetos de longo prazo
   (trocar de carro, comprar aliança, etc.) com quanto guardar por mês.

---

## 1b. Glossário do app

- **Merreca:** o dinheiro disponível pra torrar sem culpa. É a sobra já descontada do que
  está comprometido (recorrências + parcelas), apresentada como *"Merreca de hoje"* e
  *"Merreca da semana"*. O número que responde "quanto eu posso gastar?". (Fase 4)
- **Sobra:** receita do mês − gastos do mês. A base de tudo. (Fase 2 ✅)
- **Mascote vivo:** o porquinho reage à sua saúde financeira (humor muda). (Fase 4)
- **QUASE NADA:** nome oficial do porquinho/mascote.
- **Agiota:** nome do coach financeiro (o card "Agiota da semana" e as dicas que QUASE NADA fala).

---

## 2. Princípios do projeto

- **Faseamento agressivo.** Cada fase entrega algo usável. Nada de construir tudo de uma vez —
  isso economiza tokens e deixa o app utilizável cedo.
- **Uma fase = um entregável testável.** Ao final de cada fase o app abre no iPhone e funciona.
- **Simplicidade técnica.** HTML/CSS/JS puro, sem build, sem servidor. Um arquivo (ou poucos).
- **Dados nunca se perdem.** Backup por export/import é prioridade já no início.
- **Visual primeiro.** Como é gamificado, a experiência visual importa tanto quanto a lógica.

---

## 3. Decisões técnicas (definidas)

| Tema | Decisão | Motivo |
|---|---|---|
| **Formato** | App HTML único, adicionado à tela inicial do iPhone (PWA "Add to Home Screen") | Sem loja, sem instalação, abre como app |
| **Armazenamento** | `localStorage` no próprio navegador do iPhone | Funciona offline, zero servidor, zero custo |
| **Backup** | Export/Import de arquivo JSON | localStorage some se limpar o Safari — backup protege os dados |
| **Visual** | Dark mode moderno, cara de fintech, cards e gráficos coloridos | Combina com a vibe gamer |
| **Gráficos** | Chart.js via CDN | Leve, bonito, funciona offline depois de cacheado |
| **Moeda** | Real (R$) | — |
| **Idioma** | Português (BR) | — |

### Pontos de atenção técnicos
- `localStorage` é por dispositivo e some se o histórico do Safari for limpo → **export/import resolve.**
- Para virar "app" de verdade no iPhone: meta tags PWA + `manifest.json` + ícone (Fase de polimento).
- Sem sincronização entre aparelhos nesta versão (decisão consciente; nuvem fica pra v2 se precisar).

---

## 4. Modelo de dados (rascunho inicial)

Tudo salvo num único objeto JSON no `localStorage` (chave `sobraNadaData`):

```
{
  receitas:  [ { id, tipo, valor, data, recorrente } ],
  despesas:  [ { id, categoria, valor, data, descrição } ],
  budgets:   { categoria: valorMensal },                          // v2
  metas:     [ { id, nome, alvo, atual, prazo, concluída } ],
  gamificacao: { xp, conquistas: [] },
  config:    { moeda, tema, versaoSchema },

  // --- planejado na Fase 3 (schema v3) ---
  compras:      [ { id, descricao, categoria, total, parcelas, valorParcela, dataInicio } ],
  recorrencias: [ { id, tipo: receita|despesa, nome, categoria, valor, diaDoMes, ativo } ],
  fontesRenda:  [ { id, nome, valor, diaRecebimento } ],          // salário, VR, VA…
  cartao:       { fechamento, vencimento },

  // --- fases futuras ---
  projetos:  [ { id, nome, custoEstimado, guardado, aporteMensal, prazoAlvo } ],
  presentes: [ { id, pessoa, dataAniversario, budget, ideia } ]
}
```

> Versionar o schema (`versaoSchema`) desde já facilita migrações futuras sem perder dados.
> **Atual: v2.** Fase 3 levará para v3 (parcelas, recorrências, fontes de renda, cartão).

---

## 5. Roadmap por fases

### 🟢 Fase 1 — MVP: Dashboard + Receitas + Metas/Gamificação *(foco atual)*
O coração do app. Ao final, o Digo já registra a renda e cria metas com progresso.

- Estrutura base do app (HTML único, tema dark, navegação entre telas)
- Camada de dados: salvar/carregar do `localStorage` + schema versionado
- **Receitas:** cadastrar salário, bônus, PLR com valor e data; marcar recorrência
- **Dashboard:** total do mês, gráfico de receitas, cards de resumo
- **Metas:** criar meta (nome, alvo, prazo), registrar progresso, barra visual
- **Gamificação base:** XP ao bater metas/registrar receita, nível, 1ª conquista
- **Backup:** botões de exportar/importar JSON

### 🟢 Fase 2 — Despesas & Budgets mensais *(entregue em 15/06/2026)*
- [x] Cadastro de despesas por categoria (8 categorias com ícone)
- [x] Budget mensal por categoria, editável inline, com alerta de estouro 🚨
- [x] Gráfico receitas × despesas (barras agrupadas, 6 meses) + card "Sobra do mês"
- [x] Conquistas novas: primeiro gasto, primeiro budget, "mês no azul" 💙
- Schema migrado para **v2** (campos `despesas[]` e `budgets{}`)

### 🟢 Fase 3 — Motor de Tempo & Recorrência *(entregue em 15/06/2026)*
Transforma o app de uma "foto do mês" num app que **entende o tempo**: parcelas com
início e fim, gastos/receitas fixos que se repetem, datas de cartão e recebimento, e
uma visão olhando pra frente. Princípio: o app sempre sabe que dia é, o que já acabou
e o que ainda vai pesar.

- **Compras parceladas:** ao lançar um gasto, opção "parcelar em N×". Gera N parcelas
  (uma por mês) a partir de uma data inicial. Exibe "Parcela 3/6 · termina em set/2026"
  e some automaticamente quando a última parcela é paga.
- **Recorrências de verdade:** receitas e gastos fixos (salário, tickets, aluguel,
  streaming) que se repetem todo mês sem relançar. O check "recorrente" passa a funcionar.
- **Fontes de renda configuráveis:** cadastrar salário, ticket alimentação, ticket
  refeição, VR/VA, etc., cada um com valor e **dia de recebimento**.
- **Datas do cartão:** dia de fechamento e dia de vencimento → o app projeta o que cai
  na próxima fatura.
- **Visão "Compromissos / Próximos meses":** tela que olha pra frente, lista o que ainda
  vai pesar (parcelas ativas + recorrências) e prevê a sobra dos próximos meses.

### 🟢 Fase 4 — DNA do app: Merreca, mascote vivo & XP por resultado *(entregue em 15/06/2026)*
- [x] **Merreca**: sobra do mês ÷ dias restantes → "Merreca de hoje" e "desta semana".
- [x] **Mascote vivo**: porquinho com 5 humores conforme a saúde do mês.
- [x] **XP premia resultado** (conquistas, metas, estar em dia), não o ato de digitar.
- [x] Streak diário "em dia", streak de meses no azul, desafios mensais (boss battles)
      e galeria de conquistas.

### 🟢 Fase 5 — Presentes & aniversários *(entregue em 15/06/2026)*
Planejar presentes de aniversário (namorada, família) de forma **integrada às finanças**.
- [x] Cadastro de presente: pessoa, data do aniversário, budget e ideia (aba 🎁 no +).
- [x] **Recorrência anual** com countdown ("faltam 10 dias") — gestão na tela Metas.
- [x] **Integrado**: o budget é reservado no mês do próximo aniversário, pesando na
      sobra/Merreca e aparecendo na previsão dos próximos meses (categoria Compras).
- [x] **Marcar "comprei"**: vira um gasto real em Compras, dá XP e a conquista
      "Presenteador 🎁"; o ciclo rola automaticamente pro aniversário do ano seguinte.
- [x] **Alerta no Painel**: aniversários a ≤30 dias aparecem destacados (≤15 dias em dourado).
- [x] Conquista "Primeiro presente planejado 🎁". Schema migrado para **v4** (campo `presentes[]`).

### 🟢 Fase 6 — Projetos de longo prazo *(entregue em 15/06/2026)*
Decisão: **evoluir as Metas** em vez de criar conceito separado. Uma meta vira "projeto"
quando ganha um **aporte mensal**.
- [x] Form de meta com **custo estimado + prazo + guardar/mês**, com hint de cálculo ao vivo
      (custo+prazo → quanto/mês; ou quanto/mês → data de chegada/ETA).
- [x] **Integrado**: o aporte mensal vira compromisso fixo — pesa na sobra/Merreca e na
      previsão dos próximos meses (categoria interna "Projetos"); some quando conclui.
- [x] **Alerta de ritmo**: avisa quando o ritmo atual não bate o prazo e quanto guardar/mês.
- [x] **Banner de compromisso** na tela Metas: soma dos aportes/mês vs sobra livre,
      alertando se os projetos não cabem no mês.
- [x] Aporte manual + barra (reaproveitado das Metas) e conquista "Sonho realizado 🏆".
- Schema → **v5** (campo `metas[].aporteMensal`).

### 🟢 Fase 7 — Carteiras VR/VA & Coach *(entregue em 15/06/2026)*
O dinheiro de vale é **restrito a comida** — não é "Merreca livre". Esta fase separa os vales
em carteiras com saldo e adiciona um coach que fala pelo mascote.
- [x] **Carteiras com saldo:** VR (Refeição) e VA (Alimentação), cada um com saldo próprio
      que entra todo mês e é abatido pelos gastos de Alimentação (alocação Refeição-first);
      a sobra **acumula** mês a mês. Card no Painel "Carteiras (vale)".
- [x] **Mapeamento auto por tipo:** receitas "VR/Ticket Refeição" → carteira Refeição;
      "VA/Ticket Alimentação" → carteira Alimentação (constante `VALE_TIPOS`).
- [x] **Merreca corrigida:** `sobraLivreMes()` tira o vale das receitas e não conta a comida
      coberta por vale → a Merreca passa a refletir só o **dinheiro livre de verdade**.
- [x] **Coach pelo mascote:** `coachTips()` por regras (vermelho, budget estourado, projetos
      acima da sobra, projeto atrasado, vale parado, aniversário ≤7d, poupança baixa); o
      porquinho fala a dica mais urgente no Painel.
- [x] **Resumo da semana:** card "Coach da semana" com o que foi bem, o que vigiar e a ação
      principal (`resumoSemanal()`).
- Sem mudança de schema (carteiras são **calculadas**, não armazenadas). Continua **v5**.

### 🟢 Fase 8 — PWA: vira app no iPhone *(entregue em 15/06/2026)*
Empacota o app pra ser **instalável** na tela inicial do iPhone e rodar **offline**.
- [x] **Ícone do porquinho** (verde escuro): `icon-192/512`, `icon-maskable-512`,
      `apple-touch-icon` (PNG gerados a partir do mascote SVG).
- [x] **manifest.webmanifest**: nome, ícones, `display:standalone`, cores, `start_url`/`scope`
      relativos (funciona em subpasta tipo GitHub Pages).
- [x] **Service worker (`sw.js`)**: cache offline-first dos arquivos locais + Chart.js do CDN;
      navegação cai no `index.html` quando offline.
- [x] index.html liga tudo (link do manifest, apple-touch-icon, registro do SW) e metas PWA.
- [x] **PUBLICAR.md**: passo a passo do GitHub Pages + como instalar no iPhone.
- Caminhos relativos → roda em qualquer host https sem ajuste.

> **Roadmap concluído.** Fora de escopo (v2, decisão consciente): sync em nuvem e Open Finance.
> Falta só o **teste real no iPhone** depois de publicar.

### 🟢 Extra entregue: Níveis estendidos & porquinho rabugento *(16/06/2026)*
- **10 níveis positivos** (era 6), por XP `(nível−1)²×60`: Pé-de-meia 🐷 (0) → Poupador 🪙 (60)
  → Investidor 📈 (240) → Estrategista 🧠 (540) → Magnata 💰 (960) → Tubarão das Finanças 🦈
  (1.500) → **Lobo de Wall-Street 🐺 (2.160)** → Barão do Bitcoin ₿ (2.940) → Rei do Cofre 👑
  (3.840) → Lenda Verde 🐉 (4.860). Const `LEVELS`.
- **Níveis NEGATIVOS (vermelho)** quando o mês fecha no negativo, const `NEG_LEVELS` + função
  `nivelVermelho()`: **−1 TÁ DURO DORME! 😴** (1º vermelhinho) → −2 Devendo 😡 → −3 Cheque
  Especial 🤬 → −4 Nome Sujo 💀 → −5 Buraco Negro ☠️. A gravidade vem do **% do rombo sobre a
  receita** e **afunda mais a cada mês seguido no vermelho**. O chip do topo fica vermelho e o
  mascote vai pra `mood-bravo`.
- **Personalidade rabugenta** (`RABUGICE`, `falaBronca()`, `diaSeed()`): as pérolas ("TÁ DURO?
  DORME!", "liga pro agiota", "pão e água, esquece sucrilhos"…) saem no **vermelho leve (−1/−2)**
  e também **~1/3 dos dias mesmo no azul** (estável por dia). Nos fundos (−3 a −5) vira **bronca
  pesada** (`XING_PESADO`). Zoeira esculhamba o gasto, nunca a pessoa, e sempre puxa reação.

---

## 5b. Backlog aberto (ideias pós-roadmap, v2)

Ideias aprovadas pelo Digo em 16/06/2026, sem ordem fixa ainda. Cada uma pode virar uma
"Fase 9+". Mantêm os princípios: offline, sem nuvem, sem integração bancária.

### ⚪ Menos digitação
- **Importar extrato CSV:** baixar o CSV do banco/cartão e lançar os gastos em lote, com
  sugestão de categoria. É **arquivo** (no espírito do export/import), **não** Open Finance.

### ⚪ Mais gamificação

#### 🐷 Porquinho Tamagotchi *(conceito desenvolvido com o Digo em 16/06/2026)*
Transformar o mascote de um *termômetro do mês* num **bichinho com estado diário** que você
cuida — pra dar aquele puxão de "preciso abrir hoje". Mantém o princípio do app:
o que é premiado é **resultado/disciplina**, não o ato de digitar.

> 🟢 **9a ENTREGUE (16/06/2026):** "Fechar o dia" + barra de **energia** (decai ~25%/dia parado)
> + **sequência** (recorde) + reação do QUASE NADA. Card no topo do Painel + sheet de fechamento
> (confirma "lancei tudo" = completude; compara com a Merreca do dia = disciplina). XP por
> resultado (8 dentro / 3 fora). Conquistas `tama1/tama7/tama30`. Schema → **v6**
> (`db.tamagotchi`).
>
> 🟢 **9b ENTREGUE (16/06/2026):** evolução em **5 fases** por **patrimônio guardado**
> (`patrimonioGuardado()` = soma `metas.atual`): Filhote 🐣 (0) → Jovem 🐷 (500) → Adulto 🐖
> (5k) → Turbinado 🐗 (20k) → Lendário 🐉 (50k). `faseAtual()` + `checkEvolucao()` (comemora +
> conquista `evoN` ao subir). O mascote **cresce** (img 54→92px), ganha **brilho** nas fases 3/4,
> badge da fase no card e **barra de progresso** pra próxima no card do tamagotchi. Mais animação
> (idle/bob/shake). Campo `db.tamagotchi.fase`.
>
> 🟢 **9c ENTREGUE (16/06/2026) — Tamagotchi COMPLETO:** **cofrinho** (jarra que enche, `.jar`)
> + **coleção** de 8 itens por marcos de patrimônio (`MARCOS`: R$100 🪙 → R$100k 🚀).
> `cofreInfo()` (fill % até o próximo marco) + `checkColecao()` (ganha item ao bater marco,
> guarda em `db.tamagotchi.colecao` — fica pra sempre, mesmo se resgatar). Seção "🐖 Cofrinho
> & Coleção" no fim do Painel com a jarra + grade (conquistados × bloqueados 🔒).

**Três eixos de estado:**
1. **Humor (mês)** — já existe: saúde financeira do mês = "clima de fundo" do porquinho.
2. **Cuidado/energia (dia)** — *novo*: barra diária que enche ao "fechar o dia" e decai se
   você some. Mistura **constância** (dias seguidos), **disciplina** (ficar dentro da
   Merreca) e **completude** (confirmar que lançou os gastos).
3. **Evolução (patrimônio + constância)** — fases: **filhote → jovem → adulto → lendário**,
   conforme patrimônio guardado e dias de cuidado acumulados.

**Ritual diário — "Fechar o dia" (~10s):** ao abrir, o porquinho pergunta
(a) *"Lançou tudo de hoje?"* → "tá tudo lançado" ou "lançar agora" (**completude dos dados** —
resolve o "validar se cadastrei todos os gastos"); e mostra (b) a **Merreca de hoje** pra você
confirmar se ficou dentro (**disciplina**). Fechou → energia cheia, sequência +1, reação
(😎 jantou bem / 🤢 comeu besteira se estourou).

**Tom: cobrança leve.** Se você some por dias, ele fica **carente/triste** (sem drama, sem
vergonha) pra puxar a volta. **Guarda-corpo:** a tristeza vem só do **sumiço**, NUNCA de saldo
baixo — no aperto ele é parceiro ("tamo junto"). Não morre, não dá bronca. **Streak freeze**
protege 1 tropeço.

**Recompensas (escolhidas):** evolução por fases · humor e animações ricas (mais estados/
reações) · **coleção/cofrinho** que enche visualmente conforme guarda + colecionáveis em marcos.

**Dados (localStorage):** novo `tamagotchi:{ ultimoFechamento, energia, fase, diasCuidado,
freezes, colecao:[] }` (migração de schema). 100% offline.
**Pendente p/ depois:** notificação diária no iPhone (Web Push exige PWA instalado + mais
trabalho; começa sem isso, a sequência + estado visível já seguram o hábito).

#### 🟢 Outras de gamificação *(entregue em 16/06/2026)*
- [x] **QUASE NADA mais vivo:** mascote agora é **SVG inline** (`mascoteInline()`) com **olhos
      que piscam** (`.qn-eyes`), idle balançando (`.qn-svg`), humor (feliz/bravo) e **reações
      one-shot** — pula (`reactMascote('hop')`) ao fechar o dia / guardar dinheiro, e dá um
      **pulo grande + confete** (`confete()`) ao subir de nível.
- [x] **Pacote de conquistas novas:** 🍔 carteira de vale · 💳 cartão · 💙 3/6/12 meses no azul ·
      🔥 100 dias em dia · 🏆 3 desafios vencidos · 🎁 5 presentes · 💪 guardou 40% num mês ·
      🚀 coleção completa · 🏴 Sobrevivente do Buraco Negro (saiu do −5).
- [x] **Sazonal:** 🎄 Dezembro no azul.
- [x] **Level-up comemorável:** confete + pulo do QUASE NADA + nome do nível no toast.
- [x] **QUASE NADA de corpo inteiro** *(16/06/2026)*: novo SVG inline sentado (`MASCOTE_FULL`)
      com cabeça/braço/orelhas/olhos/corpo em grupos animáveis. **Vida em repouso** via
      `setInterval(qnTick)`: gestos espontâneos (coçar a cabeça `g-scratch`, olhar `g-look`,
      orelha `g-ear`), respiração (`qn-body`), piscar (`qn-eyes`). **Balões de fala** que
      pipocam e somem (`falar()` + `.qn-bubble`, animação `bubblePop`) em vez de texto fixo;
      falas leves de repouso em `QN_FALAS`.
- [x] **Logo redesenhado:** nome correto **SOBRANADA.APP** — wordmark itálico pesado + chip
      verde ".APP" + emblema moeda-focinho (vibe elegante/rua). Removido o `LOGO_SVG` antigo.

### ⚪ Inteligência / coach turbinado
- **"Posso comprar isso?":** digita um preço → mostra o impacto na **Merreca** e nos
  **projetos** (ex.: "atrasa o carro em 1 mês").
- **Retrospectiva:** "seu mês/ano em revista" — maior gasto, categoria que mais cresceu,
  % poupado, recordes.
- **Previsão de fim de ano:** "no ritmo atual, em dez/2026 você terá R$X guardado".
- **Lembretes de vencimento:** contas e faturas com aviso/badge antes de vencer.

### ⚪ Personalização & social leve
- **Categorias customizáveis:** criar/renomear categorias e escolher ícone; **temas de cor**.
- **Card compartilhável do mês:** gera uma imagem bonita do resumo pra mandar pros amigos.

### 🟢 Cartões & crédito *(entregue em 16/06/2026 — schema v7)*
- [x] **Vários cartões & limite:** `cartoes:[]` (nome, fechamento, vencimento, limite),
      gerenciados em Ajustes. Compras parceladas ganham `cartaoId` (seletor no form de gasto).
      `cartaoUsado()` = soma das **parcelas em aberto** do cartão; Painel mostra **usado ×
      disponível** com barra + alerta perto/acima do limite, e a **fatura do mês** por cartão.
      Migração do `cartao` único antigo → primeiro item da lista.
- [x] **Empréstimos & juros:** `emprestimos:[]` (principal, parcela, nº, modalidade, data).
      `taxaImplicita()` resolve a **taxa mensal** por bisseção (PV/PMT/n); `emprestimoAnalise()`
      dá **juros total**, **peso na renda** e **veredito** comparando com `REF_JUROS` (taxas
      médias BR aprox., BACEN jun/2026: consignado 2%, pessoal 8,5%, financiamento 2,2%,
      cheque especial 8%, cartão 14,4% — editáveis no código): Bom / Justo / Caro / **Abusivo**.
      **Integrado:** a parcela entra em `despesasNoMes()` (categoria "Empréstimo") e pesa na
      sobra/Merreca/previsão. Form na aba 🏦 com hint ao vivo; seção no Painel.
