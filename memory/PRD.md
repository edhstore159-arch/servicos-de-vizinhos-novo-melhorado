# ServiVizinhos - PRD (Product Requirements Document)

## Problema Original
Construir uma aplicação chamada "servivizinhos" inspirada no allovoisins.com - um marketplace de serviços locais e empregos em Português Brasileiro.

## Arquitetura
- **Frontend:** React + Tailwind CSS + shadcn/ui + react-router-dom
- **Backend:** FastAPI + MongoDB (motor async)
- **Auth:** JWT (python-jose + passlib/bcrypt)
- **Deploy:** Preparado para Render

## Stack Técnica
- Frontend: porta 3000, React CRA
- Backend: porta 8001, FastAPI
- DB: MongoDB local (`MONGO_URL`)
- Google Maps API: `AIzaSyDUxe-HLztnRiQ8mFew15NCs2TWBUJ8Jl0`

## O que foi implementado (Fev 2026)

### Páginas adaptadas do .zip de referência
- **PublicarDemanda (/publicar):** Formulário multi-campo (descrição, fotos, vídeo, endereço, orçamento, categoria) com upload local
- **EditarPerfil (/editar-perfil):** Edição com geolocalização + foto, salva via PUT /api/users/me
- **Ofertantes (/ofertantes):** Lista de prestadores com busca, filtros por categoria e CTAs (Contatar/Ligar)
- **BottomNav (mobile):** Navegação inferior estilo app nativo, oculta em desktop e em /admin
- **render.yaml + DEPLOY_RENDER.md:** Blueprint pronto + guia passo-a-passo em PT-BR para hospedar no Render

## O que foi implementado (Abril 2026)

### Autenticação Real (JWT)
- Registro multi-etapas (Particular/Autônomo/Empresa)
- Login com email/senha
- Tokens JWT com expiração de 7 dias
- Contexto React (AuthContext) para gerenciamento de sessão
- Rotas protegidas (/feed, /mensagens, etc.)
- Logout funcional

### Páginas
- **Landing/NewHome (/):** Página inicial para não-autenticados com modais de login e registro multi-etapas
- **Feed (/feed):** Feed interativo de pedidos públicos com botões Curtir/Recomendar/Responder funcionais, upload de fotos nos pedidos, publicação de novos pedidos, temáticas do momento, sidebar com formulário
- **Mensagens (/mensagens):** Chat 3 colunas com botões de ação funcionais (Recusar com modal, Agendar com data/hora, Pagamento com valor, Ver tudo com opções extra), envio de mensagens e fotos
- **Empregos (/empregos):** Busca de empregos
- **Mapa (/mapa):** Mapa de prestadores
- **Assinatura/Abonamento:** Planos de assinatura
- **Admin Dashboard:** Painel administrativo

### Backend Endpoints Reais
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/forgot-password` - Solicitar código de recuperação
- `POST /api/auth/reset-password` - Alterar senha com código

## Backlog (Prioritizado)

### P0 - Crítico
- [ ] Implementar backend real para CRUD de pedidos/demandas
- [ ] Persistir mensagens no backend (atualmente mock)

### P1 - Importante
- [ ] Integração Google Maps funcional
- [ ] Buscador automático de empregos
- [ ] Admin Dashboard endpoints reais
- [ ] Perfil de usuário editável

### P2 - Desejável
- [ ] Integração de pagamentos (Pix/Cartão)
- [ ] Sistema de avaliações
- [ ] Upload de fotos real
- [ ] Notificações em tempo real

### P3 - Futuro
- [ ] App mobile
- [ ] Sistema de créditos
- [ ] Chat em tempo real (WebSocket)

## Dados Mockados
- Posts/pedidos no feed (Home.jsx)
- Conversas/mensagens (Mensagens.jsx)
- Prestadores no mapa (Mapa.jsx)
- Empregos (Empregos.jsx)

## Credenciais de Teste
- Email: teste@teste.com / Senha: 123456
- Email: maria2@teste.com / Senha: 123456

## Configuração de Email Pix
- Email: johnsonbaby45@hotmail.com (não visível ao usuário final)
