import { User } from "@/db";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (_data, context: ExecutionContext): User | undefined => {
    const session = context.switchToHttp().getRequest().userSession;
    if (!session) return undefined;
    return session.user;
  },
);
