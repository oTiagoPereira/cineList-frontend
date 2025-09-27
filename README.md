# CineList Frontend

## Descrição do Projeto

O CineList Frontend é a interface de usuário para o aplicativo CineList, que permite aos usuários explorar filmes, salvar favoritos, visualizar recomendações e gerenciar suas listas de filmes. Ele se comunica com o backend para obter dados de filmes e gerenciar autenticação.

## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

```
frontend/
├── public/                # Arquivos estáticos (ex.: logo, favicon)
├── src/                   # Código-fonte principal
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks personalizados
│   ├── layout/            # Layouts principais
│   ├── pages/             # Páginas da aplicação
│   ├── routes/            # Configuração de rotas
│   ├── services/          # Serviços para chamadas à API
│   ├── style/             # Estilos globais
│   └── utils/             # Funções utilitárias
├── package.json           # Dependências e scripts do projeto
├── vite.config.js         # Configuração do Vite
└── README.md              # Documentação do projeto
```

## Configuração e Execução

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

### Passos para rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/oTiagoPereira/cineList-frontend.git
   ```
2. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação no navegador em `http://localhost:5173`.

### Build para Produção

Para gerar os arquivos otimizados para produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.

## Componentes e Páginas

### Componentes

- **Button**: Botão reutilizável.
- **Header**: Cabeçalho da aplicação.
- **Footer**: Rodapé da aplicação.
- **MovieCard**: Exibe informações de um filme.
- **Notification**: Sistema de notificações.

### Páginas

- **Home**: Página inicial com filmes populares.
- **Login**: Tela de autenticação.
- **Cadastro**: Tela de registro de novos usuários.
- **MinhaLista**: Lista de filmes salvos pelo usuário.
- **Recomendacao**: Página de recomendações de filmes.
- **MovieDetails**: Detalhes de um filme específico.

## Funcionalidades do Site

No CineList, os usuários podem:

- **Explorar Filmes Populares**: Descubra os filmes mais populares do momento.
- **Pesquisar Filmes**: Encontre filmes específicos pelo nome.
- **Visualizar Detalhes de Filmes**: Veja informações detalhadas, como sinopse, elenco e avaliações.
- **Salvar Filmes**: Adicione filmes à sua lista pessoal de favoritos.
- **Gerenciar Lista de Filmes**: Marque filmes como assistidos ou remova-os da lista.
- **Receber Recomendações**: Obtenha sugestões de filmes com base em suas preferências.
- **Autenticação de Usuário**: Crie uma conta ou faça login para acessar recursos personalizados.

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature/bugfix:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
