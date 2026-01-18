import { SessionWithUser } from "@/db";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthSession = createParamDecorator(
  (_data, context: ExecutionContext): SessionWithUser | null => {
    return context.switchToHttp().getRequest().userSession ?? null;
  },
);
