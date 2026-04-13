# Spring Boot Backend

This backend exposes the REST API your Next.js frontend calls on `http://localhost:8081/api`.

## Stack

- Spring Boot 2.7
- Spring Data JPA
- MySQL 8

## Run

1. Start MySQL from the project root:

```powershell
docker compose up -d mysql
```

2. Make sure your local MySQL server is running and that the schema `tablename` exists.

3. Start the backend:

```powershell
cd backend
mvn spring-boot:run
```

The backend seeds sample products and job listings on first startup.
