# 📋 Desafio Full Stack Veritas — Quadro Kanban

Um aplicativo full-stack moderno para gerenciar tarefas em estilo Kanban (arrastar e soltar entre colunas). Construído com **React 19 + TypeScript** no frontend e **Go** no backend, containerizado com **Docker** e pronto para produção.

![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-Go%201.25-cyan)
![Docker](https://img.shields.io/badge/Docker-Compose-important)

---

## 🚀 Quick Start

### Pré-requisitos

- **Docker** e **Docker Compose** instalados 

### Opção 1: Com Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/ThalysonKaraujo/desafio-fullstack-veritas.git
cd desafio-fullstack-veritas

# Inicie os serviços
docker compose up --build

# Acesse
# Frontend: http://localhost
# Backend API: http://localhost:8080
```

### Opção 2: Desenvolvimento Local

#### Backend (Go)

```bash
cd backend
go run main.go

# Server inicia em http://localhost:8080
```

#### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev

# Dev server em http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
desafio-fullstack-veritas/
├── backend/                 # Servidor Go
│   ├── Dockerfile           # Build containerizado
│   ├── .dockerignore        # Otimizações de build
│   ├── main.go              # Entry point
│   ├── handlers.go          # Rotas e lógica de API
│   ├── models.go            # Tipos (Task, Status)
│   ├── handlers_test.go     # Testes de integração
│   ├── handlers_unit_test.go# Testes unitários
│   ├── go.mod               # Dependências
│   └── go.sum               # Lock de versões
│
├── frontend/                # Aplicação React
│   ├── Dockerfile           # Build (Node → Nginx)
│   ├── .dockerignore        # Otimizações de build
│   ├── nginx.conf           # Configuração de servidor web
│   ├── src/
│   │   ├── App.tsx          # Componente raiz
│   │   ├── main.tsx         # React DOM render
│   │   ├── api/
│   │   │   └── tasks.ts     # Client HTTP (Axios)
│   │   ├── components/      # Componentes React
│   │   │   ├── Board.tsx    # Kanban board com DnD
│   │   │   ├── TaskCard.tsx # Card de tarefa
│   │   │   ├── TaskDetailModal.tsx  # Modal de edição
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── KanbanContext.tsx    # Global state (React Context)
│   │   └── index.css        # Estilos globais
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript config
│
├── docker-compose.yml       # Orquestração de containers
└── .gitignore               # Arquivos ignorados no git
```

---

## 🏗️ Arquitetura

### Backend (Go + Chi Router)

- **In-Memory Repository**: Armazena tarefas em `map[string]Task` com `sync.RWMutex` para thread-safety
- **CORS habilitado**: Permite requisições do frontend (ou qualquer origem com `*`)
- **REST API**:
  - `POST /tasks` — Criar tarefa
  - `GET /tasks` — Listar todas as tarefas
  - `GET /tasks/{id}` — Obter tarefa específica
  - `PUT /tasks/{id}` — Atualizar tarefa (status, título, descrição)
  - `DELETE /tasks/{id}` — Deletar tarefa

### Frontend (React 19 + TypeScript + Styled Components)

- **React Context API**: Gerenciamento global de estado (colunas, tarefas, loading, erros)
- **Drag & Drop**: `@dnd-kit` com `DragOverlay` para feedback visual fluido
- **Componentes Modulares**:
  - `Board`: Grid de colunas com `SortableContext`
  - `TaskCard`: Card da tarefa com truncamento de texto
  - `TaskDetailModal`: Edição in-line de título/descrição
  - `CreateTaskModal`: Criar nova tarefa com status inicial
  - `CreateTaskButton`: FAB (Floating Action Button)
- **Styled Components**: Estilos CSS-in-JS com tema responsivo
- **Axios**: Client HTTP com interceptors e error handling centralizado

### Comunicação Frontend ↔ Backend

```
Frontend (React Context)
  ↓ Axios POST/PUT/DELETE/GET
Backend (Go REST API)
  ↓ Response JSON
Frontend (setState → Re-render)
```

**Mapeamento de Status**:

- Frontend: `'todo' | 'in-progress' | 'done'` (camelCase)
- Backend: `"A Fazer" | "Em Progresso" | "Concluído"` (Português)
- Conversão automática em `api/tasks.ts`

---

## 🐳 Docker & Containerização

### Frontend Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Build com Node 20
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps  # Reproducível com lockfile
COPY . .
RUN npm run build

# Stage 2: Serve com Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefícios**:

- Imagem final ~50MB (apenas Nginx + assets estáticos)
- Build reproducível (npm ci em vez de install)
- Assets comprimidos com gzip (nginx)

### Backend Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Build com Go 1.25
FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./...

# Stage 2: Runtime minimalista
FROM alpine:3.18
RUN apk add --no-cache ca-certificates
RUN addgroup -S app && adduser -S -G app app
COPY --from=build /server /app/server
USER app
EXPOSE 8080
CMD ["/app/server"]
```

**Benefícios**:

- Binário estático (CGO_ENABLED=0) → roda em Alpine mínimo
- Imagem final ~15MB
- Usuário não-root para segurança
- Ca-certificates para TLS/HTTPS

### Docker Compose

```yaml
services:
  backend:
    build: ./backend
    ports: ["8080:8080"]
    environment:
      - GO_ENV=production

  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on:
      - backend
```

---

## 🛠️ Decisões Técnicas

### 1. **In-Memory Storage (sem banco de dados)**

- ✅ **Vantagem**: Simplicidade, sem dependências externas, deploy rápido
- ❌ **Limitação**: Dados perdidos ao reiniciar (veja "Limitações" abaixo)

### 2. **React Context API (não Redux/Zustand)**

- ✅ **Vantagem**: Zero dependências extras, suficiente para escala atual
- ⚠️ **Escala**: Considerar Zustand/Redux se o estado crescer muito

### 3. **Drag & Drop com @dnd-kit**

- ✅ **Vantagem**: Moderno, acessível, suporta multi-touch
- ✅ **DragOverlay**: Card flutua ao arrastar (UX premium)

### 4. **Styled Components**

- ✅ **Vantagem**: Temas dinâmicos, colocalização de estilos
- ✅ **Performance**: CSS minificado, sem classe conflicts

### 5. **Go com Chi Router**

- ✅ **Vantagem**: Performático, compilável, bom para microsserviços
- ✅ **Simplicidade**: Sem framework pesado (Express-like)

### 6. **Multi-stage Docker Builds**

- ✅ **Imagens pequenas**: Frontend 50MB, Backend 15MB
- ✅ **Segurança**: User não-root, sem ferramentas de build na imagem final

---

## 📝 API Endpoints

### Criar Tarefa

```http
POST /tasks
Content-Type: application/json

{
  "title": "Implementar feature X",
  "description": "Detalhes da feature",
  "status": "A Fazer"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Implementar feature X",
  "description": "Detalhes da feature",
  "status": "A Fazer",
  "created_at": "2025-11-11T10:30:00Z"
}
```

### Listar Tarefas

```http
GET /tasks

Response 200:
{
  "550e8400-e29b-41d4-a716-446655440000": { ... },
  "550e8400-e29b-41d4-a716-446655440001": { ... }
}
```

### Atualizar Tarefa

```http
PUT /tasks/{id}
Content-Type: application/json

{
  "title": "Implementar feature X (revisado)",
  "description": "Novos detalhes",
  "status": "Em Progresso"
}

Response 200: { updated task object }
```

### Deletar Tarefa

```http
DELETE /tasks/{id}

Response 204 No Content
```

---

## ⚠️ Limitações Conhecidas

### 1. **Tasks sem associação a eventos**

**Problema**: Tarefas são apenas títulos + descrição + status. Não há:

- Datas de início/fim
- Prioridades
- Assignees (responsáveis)
- Sub-tarefas
- Histórico de mudanças
- Comentários/Eventos de atividade
- 📌 **Impacto**: Funcionalidade básica apenas; ferramentas como Jira, Trello, Linear têm muito mais.
- 🔧 **Solução futura**: Adicionar modelo `Event` + `SubTask` + `Assignee` e refatorar schema.

### 2. **Sem autenticação/autorização**

**Problema**: CORS permite `*`; qualquer um pode criar/editar/deletar tarefas.

- 📌 **Impacto**: Apenas playground; nunca expor em produção sem auth.
- 🔧 **Solução futura**: JWT + OAuth2, permissões por usuário/equipe.

### 3. **Sem validação avançada no backend**

**Problema**: Backend valida apenas `Title != ""` e `Status válido`.

- 🔧 **Solução futura**: Validação com `validator` library, rate-limiting, sanitização.

### 4. **Sem testes E2E**

**Problema**: Só há testes unitários Go; frontend não tem testes.

- 🔧 **Solução futura**: Cypress/Playwright para UI, melhorar coverage Go.

## 🧪 Testes

### Rodar testes Go

```bash
cd backend
go test ./... -v
```

**Cobertura**:

- `handlers_test.go`: Integração (CRUD flow)
- `handlers_unit_test.go`: Unitários (validação de status, defaults)

### Rodar linter frontend

```bash
cd frontend
npm run lint
npm run format
```

---

### Build com Docker

```bash
# Images já prontas no docker-compose.yml
docker compose build --no-cache

# Inspect
docker images | grep desafio

# Tag para registry (ex: Docker Hub)
docker tag desafio-fullstack-veritas-backend:latest myusername/kanban-backend:v1.0
docker tag desafio-fullstack-veritas-frontend:latest myusername/kanban-frontend:v1.0

# Push
docker push myusername/kanban-backend:v1.0
docker push myusername/kanban-frontend:v1.0
```

---

## 📚 Stack & Dependências

### Backend

- **Go 1.25** — Linguagem
- **chi/v5** — HTTP router
- **google/uuid** — ID generation
- **rs/cors** — CORS middleware

### Frontend

- **React 19** — UI framework
- **TypeScript 5.9** — Type safety
- **Vite 7** — Build tool
- **Styled Components 6** — CSS-in-JS
- **@dnd-kit** — Drag & drop
- **Axios** — HTTP client
- **ESLint + Prettier** — Code quality

### DevOps

- **Docker** — Containerização
- **Docker Compose** — Orquestração
- **Nginx** — Web server (frontend)
- **Alpine** — Base images (minimalistas)

---

## 📞 Contato

- **GitHub**: [@ThalysonKaraujo](https://github.com/ThalysonKaraujo)
