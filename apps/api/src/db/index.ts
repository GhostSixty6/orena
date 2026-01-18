export { PrismaService } from "./prisma.service";
export { User, Session, Role } from "@prisma/client";
export type { Prisma } from "@prisma/client";

// Session with user relation included (returned by jwt.strategy)
import type { User, Session } from "@prisma/client";
export type SessionWithUser = Session & { user: User };
