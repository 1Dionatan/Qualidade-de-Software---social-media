# SQA Social Media API

API REST desenvolvida em Spring Boot que serve como backend da aplicação. Ele gerencia autenticação, usuários, posts curtidos e integração com a API pública [DummyJSON](https://dummyjson.com/docs).

## Visão Geral

- Java 17
- Spring Boot 3.4
- Spring Web
- Spring Data JPA
- MySQL em desenvolvimento
- Maven

A API roda por padrão em `http://localhost:8080`.

## Dependências

As principais dependências do projeto (definidas no `pom.xml`):

```xml
<!-- Framework web para APIs REST -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA para persistência de dados -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Driver MySQL para produção -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Parser JSON para consumir APIs externas -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>

```

## Banco de Dados

### MySQL (Configuração Padrão)

O projeto está configurado por padrão para usar **MySQL**. São criadas 2 tabelas:

#### `user`
- `id` (PK) - Long, auto incremento
- `email` - String
- `password` - String

#### `user_post_reaction`
- `id` (PK) - Long, auto incremento
- `user_id` - Long (FK para user)
- `post_id` - Long (ID do post do DummyJSON)

### Configuração do MySQL

No arquivo `src/main/resources/application.properties`:

```properties
spring.application.name=demo
spring.datasource.url=jdbc:mysql://localhost:3306/<SEU_BANCO_DE_DADOS>
spring.datasource.username=<SEU_USUARIO_DB>
spring.datasource.password=<SUA_SENHA_DB>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

1. Crie um banco de dados no MySQL
2. Substitua `<SEU_BANCO_DE_DADOS>` pelo nome do banco
3. Substitua `<SEU_USUARIO_DB>` pelo usuário do MySQL
4. Substitua `<SUA_SENHA_DB>` pela senha do MySQL

*Exemplo:*
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/social_media
spring.datasource.username=root
spring.datasource.password=12345
```

### Migrando para PostgreSQL

Para usar **PostgreSQL** ao invés de MySQL:

#### 1. Alterar dependência no `pom.xml`

Remova:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

Adicione:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### 2. Alterar `application.properties`

```properties
spring.application.name=demo
spring.datasource.url=jdbc:postgresql://localhost:5432/<SEU_BANCO_DE_DADOS>
spring.datasource.username=<SEU_USUARIO_DB>
spring.datasource.password=<SUA_SENHA_DB>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

*Exemplo:*
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/social_media
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### Outros Bancos de Dados

Verificar respectiva documentação

## Como Rodar

Pré-requisitos:

- Java 17+
- MySQL rodando
- Maven ou o wrapper `./mvnw`

Clone o repositório

```bash
git clone <url-do-repositorio>
cd api
```

Execute:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

## Endpoints

Autenticação:

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/reset-password`

Posts:

- `GET /posts`
- `GET /posts/liked`
- `POST /posts/{postId}/like`

*Exemplo:*

```bash
curl "http://localhost:8080/posts?userId=1&limit=10&skip=0"
```

## Estrutura do Projeto

```
api/
├── src/
│   ├── main/
│   │   ├── java/com/demoapp/demo/
│   │   │   ├── config/                     # Configurações (RestTemplate)
│   │   │   ├── controller/                 # Controllers REST (AuthController, PostController)
│   │   │   ├── dto/                        # Data Transfer Objects
│   │   │   ├── model/                      # Entidades JPA (User, UserPostReaction)
│   │   │   ├── repository/                 # Repositórios JPA
│   │   │   ├── service/                    # Lógica de negócio
│   │   │   └── DemoApplication.java        # Classe principal
│   │   └── resources/
│   │       └── application.properties      # Configurações da aplicação
├── pom.xml                                 # Dependências Maven
└── README.md                               # Documentação
```

## Referências

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [DummyJSON](https://dummyjson.com/docs)
