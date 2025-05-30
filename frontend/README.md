# Frontend - SmartKids

Este é o frontend do sistema SmartKids, desenvolvido em [React](https://react.dev/). Ele fornece a interface web para autenticação, cadastro, gerenciamento de usuários, viagens, pagamentos, arquivos e relatórios.

---

## Estrutura de Pastas

```
frontend/
├── build/                # Build de produção (gerado pelo npm run build)
├── public/               # Arquivos estáticos públicos
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/                  # Código-fonte React
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── reportWebVitals.js
│   ├── components/       # Componentes reutilizáveis
│   │   ├── base/         # Componentes base (Card, Button, Input, etc)
│   │   ├── files/        # Upload e listagem de arquivos
│   │   ├── layout/       # Layout, Sidebar, Header, etc
│   │   ├── pages/        # Páginas principais (Home, Login, etc)
│   │   ├── reports/      # Relatórios
│   │   ├── trips/        # Viagens
│   │   ├── users/        # Usuários
│   │   └── ...           # Outros componentes
│   ├── services/         # Serviços de API (axios, etc)
│   ├── styles/           # Temas e estilos globais
│   │   ├── GlobalStyle.js
│   │   └── theme.js
│   └── utils/            # Funções utilitárias
├── .gitignore
├── package.json
├── README.md
└── ...
```

---

## Como rodar o frontend

1. **Pré-requisitos:**  
   - Node.js 18+  
   - npm 9+

2. **Instale as dependências:**
   ```bash
   cd frontend
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   O app estará disponível em [http://localhost:3000](http://localhost:3000).

4. **Build de produção:**
   ```bash
   npm run build
   ```
   Os arquivos finais ficarão na pasta `/build`.

---

## Principais scripts

- `npm start` — Inicia o app em modo desenvolvimento.
- `npm run build` — Gera o build de produção.
- `npm test` — Executa os testes unitários.

---

## Principais diretórios e arquivos

- **src/components/**  
  Componentes reutilizáveis, organizados por domínio (base, layout, users, trips, etc).

- **src/services/**  
  Serviços de integração com a API backend (ex: axiosInstance.js).

- **src/styles/**  
  Temas e estilos globais (ThemeProvider, GlobalStyle).

- **src/App.js**  
  Componente principal, define rotas e lógica de autenticação.

- **src/index.js**  
  Ponto de entrada da aplicação React.

---

## Autenticação

- O frontend utiliza JWT para autenticação.
- O token é salvo no `sessionStorage` após login.
- O acesso a rotas é controlado via React Router e componentes protegidos.

---

## Observações

- O frontend consome a API do backend em [http://localhost:3001](http://localhost:3001).
- Para upload de arquivos, utilize o campo `file` em formulários.
- O layout é responsivo e adaptado para desktop e mobile.
- O tema principal utiliza as cores verde e bege.

---

## Contribuição

Pull requests são bem-vindos!  
Para contribuir, crie uma branch, faça suas alterações e envie um PR.

---

## Licença

Este projeto é acadêmico e não possui licença comercial.

---
