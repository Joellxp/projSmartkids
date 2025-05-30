# Backend - SmartKids

API REST do sistema SmartKids, desenvolvida em [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/) e [Sequelize](https://sequelize.org/).  
Gerencia autenticação, usuários, viagens, estudantes, pagamentos, arquivos e relatórios.

---

## Estrutura de Pastas

```
backend/
├── controllers/        # Lógica das rotas (users, trips, payments, etc)
├── database/           # Configuração do banco de dados (db.js)
├── logs/               # Logs de auditoria e sistema
├── middleware/         # Middlewares de autenticação e autorização
├── models/             # Modelos Sequelize (User, Trip, Payment, etc)
├── routes/             # Rotas da API (userRoutes, tripRoutes, etc)
├── services/           # Serviços auxiliares (e-mail, etc)
├── uploads/            # Arquivos enviados (PDFs, fotos)
├── utils/              # Funções utilitárias (ex: auditLog)
├── .env                # Variáveis de ambiente (NÃO versionado)
├── .gitignore
├── database.sqlite     # Banco SQLite local (NÃO versionado)
├── package.json
├── README.md
└── server.js           # Ponto de entrada da API
```

---

## Como rodar o backend

1. **Pré-requisitos:**  
   - Node.js 18+  
   - npm 9+

2. **Instale as dependências:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure as variáveis de ambiente:**  
   Crie um arquivo `.env` com as chaves necessárias, por exemplo:
   ```
   JWT_SECRET=sua_chave_secreta
   DB_STORAGE=./database.sqlite
   ```

4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   O backend estará disponível em [http://localhost:3001](http://localhost:3001).

---

## Principais diretórios e arquivos

- **controllers/**  
  Lógica das rotas (users, trips, payments, reports, students, etc).

- **models/**  
  Modelos Sequelize: User, Trip, Payment, TripStudent.

- **routes/**  
  Rotas RESTful para cada domínio (userRoutes, tripRoutes, paymentRoutes, etc).

- **middleware/**  
  Middlewares de autenticação JWT e controle de acesso por papel.

- **uploads/**  
  Armazena arquivos enviados (PDFs, fotos de perfil).

- **logs/**  
  Logs de auditoria e sistema.

- **database/**  
  Configuração do banco de dados SQLite.

- **utils/**  
  Funções auxiliares (ex: auditLog.js).

- **server.js**  
  Ponto de entrada da aplicação Express.

---

## Autenticação e Permissões

- Utiliza JWT para autenticação.
- Papéis de usuário: `admin`, `condutor`, `responsavel`, `common`.
- Rotas protegidas por middleware de autenticação e autorização.

---

## Endpoints principais

Veja a documentação detalhada abaixo ou no próprio arquivo `README.md`:

- **/login** — Autenticação e geração de token JWT.
- **/users** — CRUD de usuários, upload de foto.
- **/trips** — CRUD de viagens, adicionar estudante, marcar presença.
- **/payments** — CRUD de pagamentos, marcar como pago.
- **/files** — Upload, listagem e remoção de arquivos PDF.
- **/reports** — Relatórios administrativos.
- **/students** — Histórico de presença de estudantes.

---

## Observações

- Todos os endpoints (exceto `/login`) exigem autenticação JWT.
- Parâmetros `page` e `limit` são opcionais para paginação.
- Para uploads, use `multipart/form-data`.
- O banco padrão é SQLite, mas pode ser adaptado para outros bancos via Sequelize.

---

## Contribuição

Pull requests são bem-vindos!  
Para contribuir, crie uma branch, faça suas alterações e envie um PR.

---

## Licença

Este projeto é acadêmico e não possui licença comercial.

---