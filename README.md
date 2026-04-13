# Blubber Baron

This project has:

- a Next.js frontend
- a Spring Boot backend in `backend/`
- a MySQL database running with Docker
- optional SQL scripts if you want to create the database manually in MySQL Workbench

The frontend already points to the backend URL:

- `http://localhost:8081/api`

## What You Need To Install

You already know the frontend side, so for backend and database setup install these:

### 1. Java

Install:

- Java 8 or newer

Recommended:

- Java 17 LTS

Check if Java is installed:

```powershell
java -version
```

### 2. Maven

Install:

- Apache Maven

Check if Maven is installed:

```powershell
mvn -version
```

If `mvn` is not recognized, Maven is not installed or not added to your PATH.

### 3. Docker Desktop

Install:

- Docker Desktop for Windows

After installing, start Docker Desktop and wait until it says Docker is running.

Check Docker:

```powershell
docker --version
docker compose version
```

### 4. MySQL Workbench

Optional, but useful if you want to create and inspect the database manually.

### 5. VS Code Extensions

Helpful extensions for this project:

- `Extension Pack for Java`
- `Spring Boot Extension Pack`
- `Docker`

These are not strictly required, but they make backend work much easier in VS Code.

## Project Structure

- `src/` = frontend
- `backend/` = Spring Boot backend
- `docker-compose.yml` = MySQL database container

## First-Time Setup

You now have two database options:

1. Docker MySQL
2. MySQL Workbench with your own local MySQL server

### 1. Open the project in VS Code

Open:

- the project root folder

That means the folder containing:

- `src`
- `backend`
- `docker-compose.yml`

### 2. Choose how you want to run MySQL

#### Option A: Docker

Start Docker Desktop before starting the database.

#### Option B: MySQL Workbench

Make sure you already have a local MySQL Server installed and accessible from MySQL Workbench.

If you use Workbench, run these scripts in order:

1. [docs/mysql-schema.sql](C:/Users/domin/Downloads/project%20(1)/docs/mysql-schema.sql)
2. [docs/mysql-seed.sql](C:/Users/domin/Downloads/project%20(1)/docs/mysql-seed.sql)

That creates the database, tables, and sample data manually.

### 3. Start the MySQL database

If you use Docker, run this from the project root in the VS Code terminal:

```powershell
docker compose up -d mysql
```

This starts MySQL in the background.

To check if it is running:

```powershell
docker ps
```

You should see a container named:

- `blubber-baron-mysql`

If you use MySQL Workbench instead, you do not need Docker for the database.

### 4. Configure the backend database connection

The backend is currently configured with these fixed values:

- host `localhost`
- port `3306`
- database `tablename`
- username `root`
- password `RootPasswort0815`
- backend port `8081`

That configuration is stored in:

- [backend/src/main/resources/application.yml](C:/Users/domin/Downloads/project%20(1)/backend/src/main/resources/application.yml)

If your MySQL Workbench setup uses the same values, you can start the backend directly in Eclipse without changing anything.

### 5. Start the Spring Boot backend

Open a new terminal in VS Code and run:

```powershell
cd backend
mvn spring-boot:run
```

If everything is correct, the backend should start on:

- `http://localhost:8081`

The API base URL is:

- `http://localhost:8081/api`

### 6. Start the frontend

From the project root:

```powershell
npm install
npm run dev
```

## Normal Daily Start

When you want to work on the project later, this is usually enough:

### Terminal 1: start database

```powershell
docker compose up -d mysql
```

### Terminal 2: start backend

```powershell
cd backend
mvn spring-boot:run
```

### Terminal 3: start frontend

```powershell
npm run dev
```

## How The Backend Works

The backend is a separate Spring Boot app inside:

- `backend/`

It handles:

- products
- reviews
- job offers
- job applications
- user profiles
- orders

Important files:

- `backend/pom.xml`
- `backend/src/main/resources/application.yml`
- `backend/src/main/java/com/blubberbaron/backend/controller/`
- `backend/src/main/java/com/blubberbaron/backend/service/`

## How The Database Works

You can use either Docker MySQL or your own local MySQL server from Workbench.

Docker uses:

- image: `mysql:8.0`
- port: `3306`
- database: `blubber_baron`
- username: `blubber_user`
- password: `blubber_pass`

Your backend is currently set to use:

- database: `tablename`
- username: `root`
- password: `RootPasswort0815`
- port: `8081`

These values are defined in:

- [docker-compose.yml](C:/Users/domin/Downloads/project%20(1)/docker-compose.yml)
- [backend/src/main/resources/application.yml](C:/Users/domin/Downloads/project%20(1)/backend/src/main/resources/application.yml)

Workbench/manual SQL scripts:

- [docs/mysql-schema.sql](C:/Users/domin/Downloads/project%20(1)/docs/mysql-schema.sql)
- [docs/mysql-seed.sql](C:/Users/domin/Downloads/project%20(1)/docs/mysql-seed.sql)

## Useful Docker Commands

Start database:

```powershell
docker compose up -d mysql
```

Stop database:

```powershell
docker compose down
```

View logs:

```powershell
docker compose logs mysql
```

Restart database:

```powershell
docker compose restart mysql
```

## Useful Backend Commands

Start backend:

```powershell
cd backend
mvn spring-boot:run
```

Build backend:

```powershell
cd backend
mvn clean package
```

Run tests:

```powershell
cd backend
mvn test
```

## Common Problems

### `mvn` is not recognized

Cause:

- Maven is not installed
- or Maven is not in PATH

Fix:

- install Maven
- restart VS Code after installation

### Docker database does not start

Cause:

- Docker Desktop is not running
- port `3306` is already used

Fix:

- start Docker Desktop
- check if another MySQL instance is using port `3306`

### Backend cannot connect to database

Cause:

- MySQL container is not running
- backend started before Docker database was ready

Fix:

1. run `docker ps`
2. confirm `blubber-baron-mysql` is running
3. restart backend with `mvn spring-boot:run`

If you use Workbench instead of Docker:

1. confirm your local MySQL server is running
2. confirm the database `blubber_baron` exists
3. confirm username/password match the backend settings in `application.yml`

### Frontend loads but no data appears

Cause:

- backend is not running on port `8080`

Fix:

1. start MySQL
2. start backend
3. refresh frontend

## Notes

- The backend seeds sample products and job offers on first startup.
- The frontend now uses `NEXT_PUBLIC_API_URL=http://localhost:8081/api`.
- You do not need a separate local MySQL installation if you use Docker Desktop.
