# xml_reader_front

Este é o projeto front-end para o aplicativo XML Reader.

## Pré-requisitos

Certifique-se de ter os seguintes pré-requisitos instalados em seu sistema:

- Node.js: [Download Node.js](https://nodejs.org/)
- Angular CLI: Execute `npm install -g @angular/cli` para instalar o Angular CLI globalmente.

## Configuração do Projeto

Siga estas etapas para configurar e executar o projeto localmente:

Clone o repositório:

```bash
git clone https://github.com/SirCabral/xml_reader_front.git
```

Instale as dependências:

```bash
npm install
```

Configure o Backend
Acesse o arquivo app.component.ts e configure as conexões com o backend.

```ts
  // BackEnd Config
  private host = 'localhost';
  private port = '8082';
  private apiRoute = '';
```

## Executando o Projeto

Após configurar o projeto, você pode executá-lo com o seguinte comando:

```bash
ng serve
```

Isso iniciará o servidor de desenvolvimento. Abra seu navegador e acesse http://localhost:4200/ para ver o projeto em execução.
