# AgentPKG API

Backend API for AgentPKG - an npm-like package registry for AI agents.

## Features

- **User Authentication**: JWT-based token authentication with bcrypt password hashing
- **Organization Management**: Multi-tenant org system with role-based access control
- **Agent Publishing**: Version-controlled agent publishing with semver support
- **Cloud Storage**: GCP Cloud Storage integration for agent file storage
- **Rate Limiting**: IP-based rate limiting to prevent abuse
- **Security**: Helmet.js security headers, CORS, input validation with Zod

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: GCP Cloud Storage
- **Authentication**: API token-based (SHA-256 hashed)
- **Validation**: Zod schemas
- **Logging**: Pino

## Prerequisites

- Bun installed
- Docker (for PostgreSQL)
- GCP account with Cloud Storage bucket
- GCP service account credentials

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=4000
API_BASE_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agentpkg

# GCP Storage
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=agentpkg-registry
GCP_KEY_FILE=./gcp-service-account.json

# Security
API_TOKEN_SECRET=your-secret-key-min-32-chars
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_PUBLISH_MAX=10
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

Verify PostgreSQL is running:

```bash
docker-compose ps
```

### 4. Run Migrations

```bash
bun run db:migrate
```

### 5. Seed Database (Optional)

```bash
bun run db:seed
```

This creates a test user:
- **Email**: test@agentpkg.dev
- **Password**: testpassword123
- **Username**: testuser
- **Orgs**: testuser, demo-org

### 6. Start Development Server

```bash
bun run dev
```

The API will be available at `http://localhost:4000`

## Available Scripts

- `bun run dev` - Start development server with watch mode
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run db:migrate` - Run database migrations
- `bun run db:migrate:deploy` - Deploy migrations (production)
- `bun run db:seed` - Seed database with test data
- `bun run db:studio` - Open Prisma Studio
- `bun run db:generate` - Generate Prisma client
- `bun run db:reset` - Reset database (warning: deletes all data)
- `bun run lint` - Run ESLint
- `bun run type-check` - Run TypeScript type checking

## API Endpoints

### Health Check

```
GET /health
```

Returns API health status.

### Authentication

#### Register User

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

Creates a user, default org, and returns an API token.

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Returns an API token.

#### Create Additional Token

```
POST /auth/token
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "CI/CD Token"
}
```

#### List Tokens

```
GET /auth/tokens
Authorization: Bearer <token>
```

#### Revoke Token

```
DELETE /auth/token
Authorization: Bearer <token>
Content-Type: application/json

{
  "tokenId": "token_id_here"
}
```

#### Get Current User

```
GET /auth/me
Authorization: Bearer <token>
```

### Organizations

#### Create Organization

```
POST /orgs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "my-org"
}
```

#### List User's Organizations

```
GET /orgs
Authorization: Bearer <token>
```

#### Get Organization Details

```
GET /orgs/:orgName
Authorization: Bearer <token>
```

#### Add Member to Organization

```
POST /orgs/:orgName/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here"
}
```

Requires organization owner role.

### Agents

#### Publish Agent

```
POST /agents/publish
Authorization: Bearer <token>
Content-Type: application/json

{
  "org": "my-org",
  "name": "my-agent",
  "version": "0.1.0",
  "content": "---\nname: My Agent\n...",
  "description": "A helpful agent",
  "checksum": "sha256_hash_optional"
}
```

Requires org membership.

#### Get Latest Version

```
GET /agents/@:org/:name
```

Returns latest version with signed download URL.

#### List Versions

```
GET /agents/@:org/:name/versions
```

#### Get Specific Version

```
GET /agents/@:org/:name/:version
```

#### List Org Agents

```
GET /agents/@:org
```

## Database Schema

### Models

- **User** - User accounts with bcrypt hashed passwords
- **Org** - Organizations (namespaces for agents)
- **OrgMember** - User-org membership with roles (owner/member)
- **Agent** - Agent metadata with latest version tracking
- **AgentVersion** - Versioned agent files with GCS paths
- **ApiToken** - API tokens (SHA-256 hashed) with last used tracking

### Relationships

- User → Org (one-to-many via ownership)
- User ↔ Org (many-to-many via OrgMember)
- Org → Agent (one-to-many)
- Agent → AgentVersion (one-to-many)
- User → ApiToken (one-to-many)

## Security

### Password Security
- Bcrypt hashing with configurable rounds (default: 10)
- Passwords never logged or returned in responses

### Token Security
- 64-character random hex tokens
- Stored as SHA-256 hashes in database
- Constant-time comparison to prevent timing attacks
- Last used timestamp tracking

### Input Validation
- Zod schemas validate all inputs
- Regex validation for names (lowercase, numbers, hyphens)
- Semver validation for versions
- 200KB file size limit for agents

### Rate Limiting
- General: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Publish endpoint: 10 requests per 15 minutes
- IP-based tracking

### CORS
- Configurable allowed origins
- Credentials support for authenticated requests

### Security Headers
- Helmet.js for security headers
- HSTS, XSS protection, etc.

## GCP Cloud Storage

### Bucket Structure

```
agentpkg-registry/
└── myorg/
    └── test-agent/
        ├── 0.1.0/
        │   └── agent.agent.md
        └── 0.2.0/
            └── agent.agent.md
```

### Signed URLs
- 15-minute expiry for downloads
- Generated on-demand for each request

### Service Account
- Place `gcp-service-account.json` in the API root
- Requires Storage Object Admin role on the bucket

## Development

### Prisma Studio

Open Prisma Studio to view/edit database:

```bash
bun run db:studio
```

### Database Migrations

Create a new migration:

```bash
bunx prisma migrate dev --name migration_name
```

### Logs

Logs are output in JSON format (production) or pretty format (development).

## Testing

### Manual Testing with curl

#### Register and Login

```bash
# Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Publish Agent

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:4000/agents/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "org": "testuser",
    "name": "my-agent",
    "version": "0.1.0",
    "content": "---\nname: My Agent\n---\n\n# My Agent\n\nThis is a test agent.",
    "description": "A test agent"
  }'
```

#### Fetch Agent

```bash
curl http://localhost:4000/agents/@testuser/my-agent
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `API_TOKEN_SECRET` (32+ characters)
3. Configure GCP service account with minimal permissions
4. Use production database (not localhost)
5. Set appropriate `CORS_ORIGIN`
6. Run `bun run db:migrate:deploy` (not `db:migrate`)
7. Build: `bun run build`
8. Start: `bun run start`

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### GCP Storage Issues

- Verify service account has correct permissions
- Check bucket name in `.env`
- Ensure service account key file exists

### Port Already in Use

```bash
# Kill process on port 4000 (macOS/Linux)
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

## License

MIT
