# 🏆 Orena (Open Arena)

Orena is a tournament management system that allows anyone to host their own esports (or any) competitions.

This project aims to provide everyone with an easy-to-deploy and easy-to-use tournament hosting platform. Unlike platforms like Toornament or Challonge where you host your competitions alongside other organisers, this deploys your own platform, no shared spaces, no pricing models, no paid-for features.

The goal is that the only cost to running this platform would be the hosting, but with platforms like Vercel, this could be very little to nothing at all.

## ✨ Features

- **Knockout (Single, Double Elimination) Tournaments**: Coming Soon.

- **Round Robin Tournaments**: Coming Soon.

- **User Registration, Roles (Admin, Visitor)**: Coming Soon.

- **Team Management**: Coming Soon.

- **Game Management**: Coming Soon.

- **Rules Management**: Coming Soon.

- **Free Agents system**: Coming Soon.

- **Posts & Activity system**: Coming Soon.

## 🛠️ Development Components

- **TurboRepo**: Simplifies the management of multiple interconnected repositories within a single project.

- **NestJS**: The backend of the application.

- **Nuxt + Vite**: The frontend is based on Nuxt(Vue) and Vite.

- **TypeScript**: The entire project is written in TypeScript, enhancing code safety and facilitating refactoring and maintenance.

- **Docker**: Docker is utilized to containerize and manage application deployment.

- **Shared Package**: The repository incorporates a shared package to enhance code reusability and maintainability.

- **Test Configuration with Vitest and Jest**: The repository includes a pre-configured setup for testing using Vitest and Jest. You can easily write and run unit tests for your Vue components and TypeScript code. Simply utilize the provided test configuration and harness the power of Vitest's rapid testing capabilities along with Jest's robust testing framework.

## 📋 Prerequisites

Suggested global installations for the development environment:

- [pnpm](https://pnpm.io/pnpm-cli)
- [nest-cli](https://docs.nestjs.com/cli/overview)

## 🚀 Getting Started

```bash

# 1. Clone the repository
git clone https://github.com/GhostSixty6/orena.git

# 2. Enter your newly-cloned folder
cd orena

# 3. Install dependencies and build packages
pnpm install

# 4. Dev: Run web with hot reload
pnpm dev-web # or make dev-web

# 5. Dev: Run API project with hot reload
# Note that you need to create the .env file in the project root directory beforehand

# You should copy the .env.example file and rename it to .env
cp .env.example .env

# Then you can configure database access and other server settings
pnpm dev-api # or make dev-api

# 6. Or run API and WEB projects with hot reload parallel
pnpm dev # or make dev

```

## 🐳 Getting Started with Docker

```bash

# 1. Clone the repository
git clone https://github.com/GhostSixty6/orena.git

# 2. Enter your newly-cloned folder
cd orena

# 3. Install dependencies and build packages
pnpm install

# 4. Copy .env.example to .env.local and configure the desired variables:
# Change DATABASE_HOST to "postgres"
cp .env.example .env.local

# 5. Build image:
make docker-build-local

# 6. Run API and WEB projects development process with hot reload in docker container
make docker-run-local

```

## ⚙️ Environment Variables

### .env.example Configuration

```bash
# Frontend: API server connection configuration
VITE_WEB_DEFAULT_LOCALE="en"
VITE_WEB_API_URL="http://localhost"
VITE_WEB_API_PORT=3000

# Backend public url
API_PUBLIC_URL=http://localhost:3000

# HTTP / HTTPS server config
API_HTTP_PORT=3000

# Cross-Origin Resource Sharing domain origins
# More info: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
API_HTTP_CORS=["http://localhost", "http://localhost:8080", "http://localhost:8081", "http://localhost:8082"]

# Keys required for hashing passwords and tokens
# They should be filled with random, unique strings
API_SECRETS_PWDSALT="123456"
API_SECRETS_JWT="123456"

# Database type: postgres, mysql, sqlite etc.
# More info: https://typeorm.io
DATABASE_TYPE="postgres"

# Database connection config
DATABASE_HOST="localhost"
DATABASE_PORT=5432

# Database name and user credentials
DATABASE_NAME="turbonv"
DATABASE_USER="postgres"
DATABASE_PASSWORD="root"

# Disable this in the production version of the application
# More info: https://typeorm.io/faq#how-do-i-update-a-database-schema
DATABASE_ENABLE_SYNC=true
```

## 📜 Top-Level Scripts

#### 🔧 Development

- `dev` - run all applications simultaneously with hot reload
- `dev-api` - run API project with hot reload
- `dev-web` - run WEB project with hot reload

#### 📦 Build

- `build` - build all packages and applications
- `build-api` - build API project application
- `build-web` - build WEB project application

#### ▶️ Running

- `start` - start all applications
- `start-api` - start API project application
- `start-web` - boot up a local static web server that serves the files from dist

#### 🧰 Common

- `test` - run tests for all packages and applications
- `lint` - lint all packages and applications
- `clean` - remove dist directory from all packages and applications

## 🐛 Enhancements and Bug Reports

If you find a bug, or have an enhancement in mind please post [issues](https://github.com/GhostSixty6/orena/issues) on GitHub.

## 🤝 Contribution

If you have ideas for enhancing this project or want to add new features, feel free to submit pull requests.

## 💝 Donations

Instead of donating to the developers, we ask that you consider donating to any of the below charities:

- [AACGL (Animal Anti-Cruelty League)](https://www.aacl.co.za/donate/)
- [Four Paws South Africa](https://www.four-paws.org.za/)
- [Animal Welfare Society of South Africa](https://awscape.org.za/)

## 🙏 Acknowledgements

After working for 8 years in the esports industry, I wanted to take my experience and build a platform open for anyone to use.
In addition to all of the packages, frameworks and libraries that make this project possible, some additional acknowledgements are:

### 💡 Inspiration

- [Challengermode](https://www.challengermode.com/)
- [Faceit](https://www.faceit.com/en/home)
- [Challonge](https://challonge.com/)
- [Toornament](https://www.toornament.com/)

### 🔨 Tools

- [VSCode](https://code.visualstudio.com/)
- [Photopea](https://www.photopea.com/)
- [Hoppscotch](https://hoppscotch.io/)

## 📄 License

Orena is provided under the MIT license.
