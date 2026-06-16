# 📲 Publicar o SOBRA NADA APP e instalar no iPhone

O app agora é um **PWA**: depois de publicado numa URL `https`, dá pra "Adicionar à Tela de
Início" no iPhone e ele abre como app de verdade, com ícone do porquinho e funcionando
**offline**. O jeito mais simples e grátis é o **GitHub Pages**.

---

## Parte 1 — Subir no GitHub Pages (grátis)

1. **Conta GitHub.** Se não tiver, crie em https://github.com (gratuito).
2. **Novo repositório.** Clique em **New repository**.
   - Nome: `sobra-nada` (ou o que quiser).
   - Deixe **Public** (o Pages grátis precisa ser público).
   - Pode marcar "Add a README" — tanto faz.
   - **Create repository**.
3. **Subir os arquivos.** No repositório, clique em **Add file → Upload files** e arraste
   **todos os arquivos da pasta**:
   - Obrigatórios: `index.html`, `manifest.webmanifest`, `sw.js`,
     `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`.
   - Opcionais (notas de desenvolvimento, pode deixar de fora): `CONTEXTO.md`,
     `RETOMAR_AQUI.md`, `PUBLICAR.md`, `mascote.svg`, `logo.svg`.
   - Clique em **Commit changes**.
4. **Ativar o Pages.** Vá em **Settings → Pages**.
   - Em **Source**, escolha **Deploy from a branch**.
   - Branch: **main** · pasta: **/ (root)** · **Save**.
5. **Pegar o link.** Em ~1 minuto, aparece nessa mesma tela:
   `https://SEU-USUARIO.github.io/sobra-nada/`
   Abra pra conferir que carregou.

> ⚠️ O `index.html` precisa ficar na **raiz** do repositório (não dentro de subpasta),
> senão o link não acha o app.

---

## Parte 2 — Instalar no iPhone

1. No **Safari** do iPhone (tem que ser Safari), abra o link
   `https://SEU-USUARIO.github.io/sobra-nada/`.
2. Toque no botão **Compartilhar** (quadrado com seta pra cima).
3. Role e toque em **Adicionar à Tela de Início**.
4. Confirme o nome ("Sobra Nada") e toque em **Adicionar**.
5. Pronto: o ícone do porquinho aparece na tela inicial. Abre em tela cheia, sem barra do
   Safari, e funciona **offline** depois do primeiro acesso. 🐷

---

## Atualizar o app depois

Quando você (ou eu) mudar o `index.html` ou outro arquivo:

1. Suba o arquivo novo no GitHub (**Add file → Upload files** → commit, ele substitui).
2. Pra forçar o iPhone a pegar a versão nova (o service worker guarda cache), **troque o
   número da versão** no `sw.js`: a linha `const CACHE = 'sobra-nada-v8';` vira `...-v9`,
   `-v10`, etc. Suba o `sw.js` junto.
3. No iPhone, abra o app e feche; na segunda vez ele já estará atualizado.

---

## Notas

- **Backup continua importante.** Os dados ficam só no aparelho (no app instalado).
  Use **Ajustes → Exportar** de vez em quando pra guardar um backup `.json`.
- **HTTPS é automático** no GitHub Pages — é o que permite o app funcionar offline.
- Não precisa de loja, conta paga nem nada além da conta GitHub gratuita.
