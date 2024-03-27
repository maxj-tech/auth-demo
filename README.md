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
