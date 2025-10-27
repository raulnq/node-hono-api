import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

const ENVSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
});

expand(config());

try {
  ENVSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Environment validation failed:\n';
    error.issues.forEach(issue => {
      const path = issue.path.join('.');
      message += `- ${path}: ${issue.message}\n`;
    });
    const e = new Error(message);
    e.stack = '';
    throw e;
  } else {
    console.error('Unexpected error during environment validation:', error);
    throw error;
  }
}

export const ENV = ENVSchema.parse(process.env);
