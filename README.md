# Bun Migration Tool

This repository contains a personal migration tool from Firebase to MongoDB Atlas and Cloudinary, built with Bun.

## Getting Started

1. **Use the correct Node.js version** via [fnm](https://github.com/Schniz/fnm) (recommended) or [nvm](https://github.com/nvm-sh/nvm):

   ```bash
   fnm use   # or: nvm use
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Run the application:**

   ```bash
   bun run start
   ```

## Linting & Formatting

Staged files are automatically linted with ESLint and formatted with Prettier on each commit. The commit is aborted if any issues remain unfixed.

For security reasons, scripts are ignored on install. For setting up Husky, run:

```bash
bun run prepare
```
