import dotenv from "dotenv";
import AppError from "../app/errorHelpers/appError";
import { stat } from "node:fs";
import status from "http-status";

// NODE = "development"
// # Environment variables declared in this file are NOT automatically loaded by Prisma.
// # Please add `import "dotenv/config";` to your `prisma.config.ts` file, or use the Prisma CLI with Bun
// # to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.

// # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
// # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

// PORT=8000
// DATABASE_URL="postgres://471fcbe7b64454200df7def947a3219a25c8d07fe62768bd6a2a08d1e6540306:sk_I4sGrH7jxv7zKjkjqcOrx@db.prisma.io:5432/postgres?sslmode=require"
// BETTER_AUTH_SECRET=kzczENZZYSKpXffudH6O2wyeSGrcV4c5
// BETTER_AUTH_URL=http://localhost:8000 # Base URL of your app
dotenv.config();
interface EnvConfig {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
}

const LoadEnvVarialbes = (): EnvConfig => {
    const requiredEnvVars = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
    ];
    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            throw new AppError(`Missing required environment variable: ${varName}`, status.INTERNAL_SERVER_ERROR);
        }
    });

    return {
        NODE_ENV: process.env.NODE_ENV  as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    };
}


export const envVars = LoadEnvVarialbes();
