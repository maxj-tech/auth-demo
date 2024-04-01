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
- `npx prisma studio`: Browse your database, easily edit database contents via webapp at [`localhost:5555`](http://localhost:5555). _Hint:_ restart after changes to the prisma schema.

### [bcryptjs](https://www.npmjs.com/package/bcryptjs) 
A library for hashing and salting passwords. Used to securely store passwords in your database.

### [uuid](https://www.npmjs.com/package/uuid)
A library for generating unique identifiers (UUIDs), ensuring each identifier is distinct.

### [resend](https://www.npmjs.com/package/resend)
A library for sending transactional emails (e.g., welcome emails, password resets, order confirmations). Simplifies the process of composing and delivering emails from your application.

#### Setup [Resend](https://resend.com)
Assuming you already have a Github or Google Account, sign in, and:
1. create a team
1. generate key an API key
1. update your `.env` with `RESEND_API_KEY=...`
1. in order to send mails to other addresses than your own, you **must register a domain first**


### [Auth.js](https://authjs.dev)
- [prisma-adapter](https://authjs.dev/reference/adapter/prisma)
Links Prisma models to Auth.js, facilitating user authentication and authorization through database models.
- Add `AUTH_SECRET` to `.env` file, randomly generated using 
`openssl rand -hex 32`



## OAuth Configuration with GitHub and Google

### Setting Up OAuth with GitHub
1. **Create an OAuth Application**: Navigate to your GitHub account settings, access Developer Settings, then OAuth Apps, and create a new application.
2. **Configuration**:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization Callback URL**: `http://localhost:3000/api/auth/callback/github` - ensures GitHub authentication responses are correctly processed.
3. **Credentials**: Generate a new client secret. Then copy and paste your Client ID and Secret into the .env file for local development.

### Setting Up OAuth with Google
1. **Access Google Cloud Console**: Log into [Google Cloud Console](https://console.cloud.google.com), select or create a new project, and navigate to "APIs & Services".
2. **Configure OAuth Consent Screen**: Select "External" as the user type and provide required details like app name and contact emails. Proceed through the setup without needing to fill all fields.
3. **Create OAuth Client ID**:
   - **Application Type**: Choose "Web application".
   - **Authorized JavaScript Origins**: Add `http://localhost:3000` to handle responses from Google.
   - **Authorized Redirect URIs**: Include `http://localhost:3000/api/auth/callback/google` to correctly handle the OAuth flow.
4. **Store Credentials**: Similar to GitHub, Google will provide a Client ID and Secret. These should also be added to your `.env` file, securing your application’s ability to authenticate with Google.


## TODO
- describe contents of the .env and .env.local file
- refactor 2FA
   - if password is wrong, that error is shown after 2 fa cycle
   - code is way too complicated: 
      - login.ts, 
      - login-form.tsx







