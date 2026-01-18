import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { zodV3ToOpenAPI } from 'nestjs-zod';
import type { ZodTypeAny } from 'zod';

export function ApiQueryZod(zodSchema: ZodTypeAny): MethodDecorator {
  const schema = (zodV3ToOpenAPI as any)(zodSchema);
  const decorators: MethodDecorator[] = [];

  for (const [key, schm] of Object.entries(schema.properties ?? {})) {
    decorators.push(
      ApiQuery({
        name: key,
        description: (schm as any).description,
        schema: schm,
      }),
    );
  }

  return applyDecorators(...decorators);
}
