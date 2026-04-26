# 🚀 Guia Passo-a-Passo — Deploy do ServiVizinhos no Render

Este guia explica em **detalhes**, do zero, como colocar o **ServiVizinhos** no ar usando a plataforma [Render.com](https://render.com) com o arquivo `render.yaml` já configurado neste repositório.

A aplicação possui **3 componentes**:

| Componente | Tecnologia                | Onde será hospedado |
|------------|---------------------------|---------------------|
| Backend    | FastAPI (Python)          | Render — Web Service |
| Frontend   | React (build estático)    | Render — Static Site |
| Database   | MongoDB                   | MongoDB Atlas (free) |

---

## ✅ Pré-requisitos

1. Conta gratuita no [GitHub](https://github.com)
2. Conta gratuita no [Render](https://render.com) (faça login com GitHub)
3. Conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

---

## 🪜 Passo 1 — Subir o código no GitHub

No painel do Emergent, clique em **“Save to GitHub”** (canto superior do chat) e siga as instruções para criar um repositório público ou privado.

> ⚠️ Importante: o arquivo `render.yaml` está na **raiz** do projeto. Ele é detectado automaticamente pelo Render.

---

## 🪜 Passo 2 — Criar um banco MongoDB Atlas (grátis)

1. Acesse https://cloud.mongodb.com → **Build a Database** → escolha o plano **M0 (Free)**.
2. Selecione um provedor (AWS) e a região mais próxima do Brasil (ex: `São Paulo` ou `N. Virginia`).
3. Em **Database Access**, crie um usuário:
   - Username: `servivizinhos`
   - Password: gere uma senha forte e **anote**
4. Em **Network Access**, clique em **Add IP Address → Allow access from anywhere** (`0.0.0.0/0`).
5. Volte em **Database** → clique em **Connect → Drivers** → copie a *connection string*. Ela parece com:

```
mongodb+srv://servivizinhos:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Substitua `<password>` pela senha que você criou e **guarde essa string** — é o seu `MONGO_URL`.

---

## 🪜 Passo 3 — Importar o Blueprint no Render

1. Acesse https://dashboard.render.com
2. Clique em **New +** → **Blueprint**
3. Conecte sua conta GitHub e selecione o repositório do ServiVizinhos
4. O Render vai detectar automaticamente o arquivo `render.yaml` e mostrar **2 serviços**:
   - `servivizinhos-backend` (Web Service Python)
   - `servivizinhos-frontend` (Static Site)
5. Clique em **Apply**

---

## 🪜 Passo 4 — Configurar variáveis de ambiente do Backend

Quando o deploy iniciar, o Render vai pedir o valor da variável **`MONGO_URL`** (marcada como `sync: false` por segurança).

1. No painel do serviço `servivizinhos-backend` → aba **Environment**
2. Cole o valor copiado no Passo 2:
   ```
   MONGO_URL = mongodb+srv://servivizinhos:SUA_SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. As demais variáveis já vêm prontas do `render.yaml`:
   - `DB_NAME = servivizinhos`
   - `SECRET_KEY` é gerada automaticamente
   - `CORS_ORIGINS = *`

Clique em **Save Changes**. O backend será reimplantado.

---

## 🪜 Passo 5 — Confirmar URL do Backend e atualizar o Frontend

1. Aguarde o backend ficar com status **Live**.
2. Copie a URL pública dele, normalmente:
   ```
   https://servivizinhos-backend.onrender.com
   ```
3. Vá no serviço `servivizinhos-frontend` → aba **Environment**
4. Confirme que `REACT_APP_BACKEND_URL` aponta para essa URL exata.
5. Se você mudou o nome do serviço, edite a variável e clique em **Manual Deploy → Deploy latest commit** para reconstruir o frontend com o novo valor.

---

## 🪜 Passo 6 — Testar a aplicação

1. Abra a URL pública do frontend, ex:
   ```
   https://servivizinhos-frontend.onrender.com
   ```
2. Clique em **Cadastrar-se** → crie uma conta de teste.
3. Faça login → você deve ser redirecionado para `/feed`.
4. Para validar a API, acesse:
   ```
   https://servivizinhos-backend.onrender.com/api/
   ```
   Deve retornar uma resposta JSON simples (não 404).

---

## 🛠️ Troubleshooting comum

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| Backend dá **502/Timeout** após 1 min ocioso | Plano free do Render dorme | Espere 30s na primeira requisição (cold start) |
| Erro de **CORS** no console | URL do backend errada no frontend | Revise `REACT_APP_BACKEND_URL` no env do frontend e refaça o deploy |
| Login não funciona / 401 | `MONGO_URL` inválida | Cheque IP whitelist do Atlas e a senha do usuário |
| Frontend mostra tela branca | Build não gerou `index.html` | Vá em Logs → confirme `yarn build` sem erros |
| Erro `Module not found` no build | Dependência ausente | Confira `frontend/package.json` e `backend/requirements.txt` |

---

## 💰 Custo estimado

- Render Free: **2 serviços grátis** (com sleep após 15 min de inatividade)
- MongoDB Atlas M0: **512 MB grátis**
- Total: **R$ 0,00**

Para evitar o sleep do plano free, você pode upgradear para o **Render Starter ($7/mês)** ou usar um cron-pinger (ex: UptimeRobot pingando `/api/` a cada 5 min).

---

## 📦 Resumo do `render.yaml`

```yaml
services:
  - name: servivizinhos-backend  # FastAPI
    runtime: python
    rootDir: backend
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT

  - name: servivizinhos-frontend # React build
    runtime: static
    rootDir: frontend
    buildCommand: yarn install && yarn build
    staticPublishPath: build
```

Pronto! Sua aplicação está no ar. 🎉
