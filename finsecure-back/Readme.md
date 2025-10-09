# 💰 Backend - FinSecure

Este projeto é o backend de uma aplicação web de finanças pessoais, responsável por gerenciar **categorias** e **transações**.
Ele foi desenvolvido utilizando **Node.js** com **Express**, aplicando uma estrutura modular para facilitar a manutenção e escalabilidade.

**Última Atualização:** 09 Out. 2025

---

## 🔧 Linguagem e Tecnologias Utilizadas

```bash
- Javascript                # Linguagem utilizada
- Node.js                   # Ambiente de execução de JavaScript no servidor
- Express.js                # Framework web para APIs RESTful
- MySQL                     # Banco de dados relacional
- Sequelize                 # Abstração e manipulação de dados
- bcryptjs                  # Criptografia de senhas 
- JWT                       # Autenticação com tokens seguros
```

---

## 📁 Estrutura do Projeto

```bash
finSecure-back/ 
│-- src/ 
│ ├── config/               # Configurações do projeto (DB, .env, etc.)
│ ├── controllers/          # Lógica de controle de cada rota
│ ├── errors/               # Erros, logs com mensagens e status
│ ├── middlewares/          # Autenticação
│ ├── models/               # Entidades do Sequelize (tabelas do banco) 
│ ├── routes/               # Rotas da API agrupadas por módulo
│ ├── utils/                # Links do hypermidia
│ ├── server.js             # Inicialização do servidor
```

---

## ⚙️ Configuração do Projeto

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/Felipe-G-Schmitt/finSecure
   ```

2. **Abra a pasta**  
   ```bash
   cd finSecure/finsecure-back
   ```

3. **Instalar dependências**  
   ```bash
   npm install
   ```

4. **Crie o arquivo .env**:
   ```env
   DB_NAME=finSecure
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_DIALECT=mysql
   DB_LOGGING=true
  
   API_PORT=3001
   JWT_SECRET_KEY=glcodelab
   ```

5. **Iniciar servidor**  
   ```bash
   npm start
   ```
Servidor rodando em: http://localhost:3001

> ⚠️ Rodar o XAMPP com o MYSQL ativo e com o banco de dados informado criado. 

> ❗O servidor rodará na porta **3001** por padrão.

---

## 📌 Endpoints

### 🔑 Autenticação
- `POST /register` – Cadastro de novo usuário
- `POST /login` – Login e retorno do token JWT

### 👤 Usuários (`/api/users`)
- `GET /api/users` – Listar todos os usuários
- `GET /api/users/:id` – Buscar usuário por ID
- `POST /api/users` – Cadastro de novo usuário
- `PUT /api/users/:id` – Atualizar usuário
- `DELETE /api/users/:id` – Deletar usuário

### 📃 Categorias (`/api/categories`)
- `GET /api/categories` – Listar todas as categorias
- `GET /api/categories/:id` – Buscar categoria por ID
- `POST /api/categories` – Cadastro de nova categoria
- `PUT /api/categories/:id` – Atualizar categoria
- `DELETE /api/categories/:id` – Deletar categoria

### 💰 Transações (`/api/transactions`)
- `GET /api/transactions` – Listar todas as transações
- `GET /api/transactions/:id` – Buscar transação por ID
- `POST /api/transactions` – Criação de nova transação
- `PUT /api/transactions/:id` – Atualizar transação
- `DELETE /api/transactions/:id` – Deletar transação

> Todos os endpoints (exceto `/register` e `/login`) exigem token JWT válido.

---

## 🧪 Testes com Postman

Recomenda-se o uso do **Postman** para testar os endpoints. Crie uma nova requisição, adicione o token JWT no campo de headers:

```
Authorization: Bearer <seu_token>
```

---

## 📝 Licença

Projeto desenvolvido para fins educacionais e pode ser utilizado livremente para estudos.

---

## 💻 Equipe

Este projeto foi desenvolvido por:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/drypzz">
        <img src="https://avatars.githubusercontent.com/u/79218936?v=4" width="100px;" alt="Foto de Gustavo"/>
        <br />
        <sub><b>Gustavo (@drypzz)</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/function404">
        <img src="https://avatars.githubusercontent.com/u/79523461?v=4" width="100px;" alt="Foto de Lincoln"/>
        <br />
        <sub><b>Lincoln (@function404)</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Felipe-G-Schmitt">
        <img src="https://avatars.githubusercontent.com/u/79218944?v=4" width="100px;" alt="Foto de Felipe Schmitt"/>
        <br />
        <sub><b>Felipe Schmitt (@Felipe-G-Schmitt)</b></sub>
      </a>
    </td>
  </tr>
</table>