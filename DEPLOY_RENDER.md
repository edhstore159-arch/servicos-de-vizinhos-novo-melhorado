# 🚀 Deploy do ServiVizinhos no Render — Guia Definitivo

## 🔴 Erro que ocorreu no seu deploy

Pelo log que você enviou:
```
grpcio-status 1.76.0 depends on protobuf<7.0.0 and >=6.31.1
ERROR: ResolutionImpossible
==> Build failed
```

**Causa**: o `backend/requirements.txt` estava com **124 dependências** desnecessárias (pandas, numpy, boto3, stripe, google-genai, litellm, black, pytest...) que entram em conflito de versão entre si quando o Render tenta instalar.

**✅ JÁ CORRIGIDO**: o arquivo agora tem apenas as **12 dependências reais** que o backend usa.

---

## 📋 Checklist rápido antes de fazer deploy

Antes de tudo, garanta que:
- [x] `backend/requirements.txt` está enxuto (✅ corrigido)
- [x] `render.yaml` está na raiz do projeto
- [x] Suas mudanças foram **enviadas para o GitHub** (clique em **"Save to GitHub"** no Emergent)
- [ ] Você criou um cluster grátis no MongoDB Atlas e tem a `connection string`

---

## 🪜 Passo a passo (5 minutos)

### **1. Criar MongoDB grátis (M0 Free Tier)**

1. Vá para https://cloud.mongodb.com → **Sign in / Try free**
2. Clique em **"+ Create"** → **M0 (FREE)**
3. Provider: **AWS** | Region: **São Paulo** ou **Virginia (us-east-1)**
4. Clique em **"Create Deployment"**
5. Aparece popup **"Connect to your application"**:
   - Username: `servivizinhos`
   - Password: clique em **"Autogenerate Secure Password"** → **anote a senha** (tipo: `aB3xZ7yQ2kP9wM`)
6. Clique em **"Create Database User"**
7. Vá no menu lateral → **Network Access** → **+ ADD IP ADDRESS** → **ALLOW ACCESS FROM ANYWHERE** (`0.0.0.0/0`) → **Confirm**
8. Volte em **Database** → botão **Connect** → **Drivers** → copie a string que aparece:
   ```
   mongodb+srv://servivizinhos:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
9. **Substitua `<db_password>`** pela senha que você anotou. Resultado final:
   ```
   mongodb+srv://servivizinhos:aB3xZ7yQ2kP9wM@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

⚠️ **Guarde essa string completa**. Você vai usá-la no Render.

---

### **2. Garantir que o código está no GitHub**

No painel do Emergent → clique em **"Save to GitHub"** (ícone do GitHub no chat) → siga os passos para enviar.

Confirme em https://github.com/SEU_USUARIO/SEU_REPO que aparecem os arquivos:
- `render.yaml` na raiz
- `backend/requirements.txt` (com apenas ~12 linhas)
- `frontend/package.json`

---

### **3. Criar o Blueprint no Render**

1. Acesse https://dashboard.render.com → faça login com GitHub
2. **+ New** (canto superior direito) → **Blueprint**
3. Conecte sua conta do GitHub se ainda não estiver
4. Selecione o repositório do ServiVizinhos
5. Render detecta automaticamente o `render.yaml` e mostra **2 serviços**:
   - 🐍 `servivizinhos-backend` (Python)
   - ⚛️ `servivizinhos-frontend` (Static)
6. Em **Blueprint Name** escreva `servivizinhos` → **Apply**

---

### **4. Configurar a variável MONGO_URL no Backend**

Quando o blueprint for aplicado, o Render vai pedir o valor da variável `MONGO_URL` (que é `sync: false` no yaml por segurança).

1. Clique no serviço **`servivizinhos-backend`** → menu lateral **Environment**
2. Encontre a linha `MONGO_URL` → clique em **Edit**
3. Cole sua connection string completa:
   ```
   mongodb+srv://servivizinhos:SUA_SENHA@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
4. Clique em **Save Changes** — o backend será redeploy automático

⚠️ **As outras variáveis** (`DB_NAME`, `SECRET_KEY`, `CORS_ORIGINS`) já vêm preenchidas pelo `render.yaml`. Não mexa nelas.

---

### **5. Aguardar o deploy do Backend (~3 minutos)**

Vá em **Logs** do `servivizinhos-backend` e aguarde aparecer:
```
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:10000
```

Status no topo da página deve mudar de **Building** → **Live** (bolinha verde).

✅ Teste abrindo no navegador:
```
https://servivizinhos-backend.onrender.com/api/
```
Deve retornar:
```json
{"message":"AlloVoisins Clone API is running","version":"1.0.0"}
```

---

### **6. Configurar URL do Backend no Frontend**

1. Vá no serviço **`servivizinhos-frontend`** → **Environment**
2. Confirme que `REACT_APP_BACKEND_URL` está exatamente igual à URL pública do seu backend, ex:
   ```
   https://servivizinhos-backend.onrender.com
   ```
3. Se a URL for diferente (porque o nome ficou tipo `servivizinhos-backend-abc1`), corrija aqui e clique em **Save Changes** → **Manual Deploy → Deploy latest commit**

---

### **7. Testar a aplicação**

Depois que o frontend ficar **Live**, abra:
```
https://servivizinhos-frontend.onrender.com
```

Faça o teste:
1. ✅ Página inicial carrega
2. ✅ Clique em **Cadastrar-se** → preencha → **Cadastrar**
3. ✅ Faça login → deve redirecionar para `/feed`
4. ✅ Publique um pedido → deve aparecer no feed

---

## 🛠️ Troubleshooting

| Erro | Causa | Como resolver |
|------|-------|---------------|
| `ResolutionImpossible` no pip | requirements.txt inchado | ✅ **Já corrigido** — só refaça push para GitHub |
| `Build failed` no frontend | Build Command com `frontend/ $ ` antes do comando | No Render → frontend → Settings → Build Command: deixe **apenas** `yarn install && yarn build` (sem prefixo) |
| Backend dorme após 15min | Plano Free | Use UptimeRobot pingando `/api/` a cada 5 min, OU upgrade para Starter ($7/mês) |
| Erro 401 no login | `MONGO_URL` errada | Cheque IP whitelist do Atlas e a senha na connection string |
| Erro CORS no console | URL do backend errada no frontend | Edite `REACT_APP_BACKEND_URL` e refaça deploy do frontend |
| Tela branca no frontend | Build não gerou `index.html` | Logs → confirme `yarn build` ok; cheque se `staticPublishPath: build` está no yaml |
| `Module not found` | `frontend/package.json` faltando dep | Adicione com `yarn add NOME` localmente, faça push |

---

## 🔧 Configurações que devem estar no Render

### Backend (`servivizinhos-backend`)
| Campo | Valor |
|-------|-------|
| Runtime | Python |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/api/` |

### Frontend (`servivizinhos-frontend`)
| Campo | Valor |
|-------|-------|
| Runtime | Static Site |
| Root Directory | `frontend` |
| Build Command | `yarn install && yarn build` |
| Publish Directory | `build` |

⚠️ **Atenção na tela de Settings (sua segunda screenshot)**: o campo **"Build Command"** deve conter **somente** `yarn install && yarn build`. Se estiver com `frontend/ $ yarn install && yarn build`, apague o `frontend/ $ ` (é prompt visual, não faz parte do comando).

---

## 💰 Custo total: **R$ 0,00**

- Render Free × 2 serviços
- MongoDB Atlas M0 (512 MB)
- Limite: app dorme após 15 min → 30-50s de cold start na primeira request

---

## ✅ Resumo: o que mudou nesta correção

1. **`backend/requirements.txt`** reduzido de 124 → 12 dependências (sem mais conflito)
2. **`render.yaml`** com `rootDir`, healthcheck e rewrite SPA configurados
3. **Este guia** com troubleshoot dos erros que apareceram

**Próximo passo agora**: clique em **"Save to GitHub"** no Emergent → vá no Render → clique em **Manual Deploy → Deploy latest commit** no `servivizinhos-backend`. Em ~3 min ele estará no ar. 🚀
