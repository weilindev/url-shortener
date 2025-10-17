# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This project uses **pnpm** as the package manager. Always use `pnpm` commands instead of npm or yarn.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (with auto-reload via tsx)
pnpm dev

# Type checking without emitting files
pnpm type-check

# Build for production
pnpm build

# Production server (requires build first)
pnpm start

# Code quality
pnpm run lint              # Check code with ESLint
pnpm run lint:fix          # Auto-fix ESLint issues
pnpm run format            # Format code with Prettier
pnpm run format:check      # Check code formatting
```

## Architecture Overview

### TypeScript & ES Modules

This project is written in **TypeScript** and uses ES Modules with `"type": "module"` in package.json.

**Important**: When importing TypeScript files in your source code, **always use the `.js` file extension** (not `.ts`), as TypeScript will resolve these to the compiled JavaScript files:

```typescript
// Correct - use .js extension even though source is .ts
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Incorrect - will fail
import routes from './routes/index';
import routes from './routes/index.ts';
```

**Development workflow**:
- Source files are in `src/` directory with `.ts` extension
- During development, `tsx` watches and executes TypeScript files directly
- For production, `tsc` compiles TypeScript to JavaScript in `dist/` directory
- The compiled output maintains ES Module format with `.js` extensions

### Application Structure

The application follows a layered architecture:

1. **Entry Point** (`src/index.ts`):
   - Initializes Express app
   - Loads environment variables via dotenv
   - Configures middleware (CORS, JSON parsing)
   - Mounts routes under `/api` prefix
   - Registers error handler middleware last

2. **Configuration** (`src/config/index.ts`):
   - Centralized configuration management with TypeScript interface
   - All environment variables are accessed through this module
   - Provides defaults for missing env vars
   - Type-safe configuration object

3. **Routes** (`src/routes/`):
   - All API routes are mounted under `/api` prefix (configured in `src/index.ts:19`)
   - New route modules should be imported and mounted in `src/routes/index.ts`
   - Example: `router.use('/users', userRoutes);`

4. **Middlewares** (`src/middlewares/`):
   - `errorHandler`: Express error handling middleware (must be registered last)
   - `asyncHandler`: Utility wrapper for async route handlers to catch errors
   - Type-safe with proper Request/Response/NextFunction types

5. **Types** (`src/types/`):
   - Shared TypeScript interfaces and types
   - Custom error types, API response types, domain models
   - Import types from here to maintain consistency

6. **Controllers** (`src/controllers/`): Business logic layer (currently empty, ready for implementation)

7. **Models** (`src/models/`): Data models layer (currently empty, ready for implementation)

### Error Handling Pattern

Use the `asyncHandler` wrapper for async route handlers to automatically catch errors:

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';

router.get('/example', asyncHandler(async (req: Request, res: Response) => {
  // Any errors thrown here will be caught and passed to errorHandler
  const data = await someAsyncOperation();
  res.json(data);
}));
```

The error handler middleware will:
- Return errors with status code (from `err.statusCode` or default 500)
- Include stack trace only in development mode
- Return standardized JSON error response

### Environment Variables

Required environment variables (see `.env.example`):
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `DATABASE_URL`: Database connection string
- `API_PREFIX`: API route prefix (default: /api)

Always copy `.env.example` to `.env` before starting development.

### URL Structure

- Health check: `GET /health` (direct route, not under /api)
- API routes: `GET /api/*` (all application routes)

## Code Quality Tools

This project uses the following code quality tools to maintain consistent code style and catch potential issues:

### Tools Configuration

- **ESLint** (v9 Flat Config): Lints TypeScript code with `typescript-eslint`
- **Prettier**: Formats code consistently
- **lint-staged**: Runs linters on git staged files
- **Husky**: Manages git hooks (pre-commit)

### Configuration Files

- `eslint.config.js` - ESLint flat config with TypeScript support
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `.lintstagedrc` - lint-staged configuration
- `../.husky/pre-commit` - Pre-commit hook (in project root)

### ESLint Rules

Key rules enforced:
- TypeScript strict type checking enabled
- Unused variables trigger warnings (except those prefixed with `_`)
- `no-var` enforced, prefer `const` over `let`
- `console.log` triggers warning (but `console.warn`, `console.error`, `console.info` allowed)
- No explicit `any` type (warning)

### Prettier Rules

- Single quotes
- Semicolons required
- 2 space indentation
- 100 character line width
- ES5 trailing commas
- Arrow functions always use parentheses
- LF line endings

### Pre-commit Hook

On every commit, the following happens automatically:
1. lint-staged runs on staged files only
2. ESLint checks and auto-fixes TypeScript files
3. Prettier formats all staged files
4. If any checks fail, the commit is blocked

### Important Notes for Development

- Always run `pnpm run format` before committing if you want to format all files
- Use `pnpm run lint:fix` to auto-fix linting issues
- The pre-commit hook only affects staged files
- If you need to bypass hooks (not recommended), use `git commit --no-verify`
