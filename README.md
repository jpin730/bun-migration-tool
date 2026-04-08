# Bun Migration Tool

This repository contains a personal migration tool from Firebase to MongoDB Atlas and Cloudinary, built with Bun.

## Getting Started

1. **Install Bun:**

   Follow the instructions on the [Bun website](https://bun.sh/) to install Bun on your machine.

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
