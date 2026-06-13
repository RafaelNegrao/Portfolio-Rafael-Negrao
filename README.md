# Portfolio — Rafael Negrão de Souza

Site de portfolio pessoal single-page, sem frameworks e sem build step.
HTML5 semântico, CSS moderno (Grid, Flexbox, variáveis, `clamp`) e
JavaScript vanilla. Tema claro/escuro com persistência, animações de
revelação via `IntersectionObserver` e layout mobile-first.

## Estrutura

```
/
├── index.html
├── style.css
├── script.js
└── assets/
    └── foto.jpg   ← adicione sua foto aqui (formato circular fica melhor com imagem quadrada)
```

> **Foto:** o `index.html` aponta para `assets/foto.jpg`. Há um placeholder
> em `assets/foto.svg` apenas como referência — coloque sua foto real como
> `assets/foto.jpg` (recomendado: imagem quadrada, ex.: 600×600px).

## Rodar localmente

Basta abrir o `index.html` no navegador. Para um servidor local opcional:

```bash
# Python
python -m http.server 8000
# depois acesse http://localhost:8000
```

## Deploy no GitHub Pages

1. **Crie o repositório** no GitHub com o nome exato:
   `RafaelNegrao.github.io`
   (o padrão `usuario.github.io` publica o site na raiz do domínio).

2. **Envie os arquivos** para a branch `main`:

   ```bash
   git init
   git add .
   git commit -m "Portfolio inicial"
   git branch -M main
   git remote add origin https://github.com/RafaelNegrao/RafaelNegrao.github.io.git
   git push -u origin main
   ```

3. **Ative o GitHub Pages:**
   - No repositório, vá em **Settings → Pages**.
   - Em **Build and deployment → Source**, selecione **Deploy from a branch**.
   - Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.

4. Aguarde ~1 minuto. O site ficará disponível em:
   **https://RafaelNegrao.github.io**

Cada novo `git push` para a `main` republica o site automaticamente.

## Personalização rápida

- **Cor de acento e fundos:** variáveis CSS no topo de `style.css`
  (`:root` e `[data-theme="light"]`).
- **Conteúdo:** tudo está em `index.html`, organizado por seção comentada.
- **Meta tags / Open Graph:** no `<head>` do `index.html`.
