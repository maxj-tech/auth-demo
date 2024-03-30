# Auth Demo
Playing around with fun stuff related to Authentication: SSO, OAuth2, PKCE, JWT and the like

This project aims to create a comprehensive system integrating Single Sign-On (SSO) with OAuth2, PKCE, and JWT, using Auth0 as the Identity Provider (IdP). 
The system includes a Next.js frontend application and several backend services, demonstrating both unprotected and protected routes. 
The application will support multiple IdPs, including Auth0, GitHub, and Google, and shall be deployed to Kubernetes with an exposed web interface.


## Components

- **Frontend**: A Next.js application with authenticated and unauthenticated pages.
- **Backend Service #1**: An ASP.NET service with both unprotected and protected routes.
- **Backend Service #2**: A supplementary service to expand the application's functionality.
- **API Gateway**: Routes requests to the appropriate backend service.
- **Kubernetes Deployment**: Ensures the application is scalable and accessible over the internet.

## Getting Started

Detailed instructions on setting up each component, authentication mechanisms, and deployment strategies will be added as the project progresses.

## Contributions

Contributions are welcome! Please refer to the contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## SaaS / PaaS used
### [neon.tech PostgreSQL](https://console.neon.tech)
- Create account, project and database.
- Copy and paste provided snippets into files `.env` and `schema.prisma`.
- Update `.gitignore` to include `.env`.


## Tools / Libs used
### Prisma
- `npx prisma init`: Initializes a new Prisma project by creating a new Prisma schema file in your project, which is used to define your database models and setup.
- `npx prisma generate`: Generates Prisma client code that can be used in your application to interact with your database through the defined models in your Prisma schema.
- `npx prisma db push`: Updates your database schema to match the schema defined in your Prisma model, without requiring migrations; suitable for development environments.
- `npx prisma migrate reset`: Resets the entire database.
- `npx prisma studio`: Browse your database via webapp at [`localhost:5555`](http://localhost:5555).

### [bcryptjs](https://www.npmjs.com/package/bcryptjs) 
A library for hashing and salting passwords. Used to securely store passwords in your database.


### [Auth.js](https://authjs.dev)
- [prisma-adapter](https://authjs.dev/reference/adapter/prisma)
Links Prisma models to Auth.js, facilitating user authentication and authorization through database models.
- Add `AUTH_SECRET` to `.env` file, randomly generated using 
`openssl rand -hex 32`





