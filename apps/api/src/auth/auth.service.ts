import { AuthLoginDto, AuthLoginResponse } from "shared";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from "express";
import { v4 as uuid } from "uuid";
import { sign } from "jsonwebtoken";
import { JwtPayload } from "./strategies/jwt.strategy";
import { hashPassword } from "./utils/hash-password";
import { PrismaService, User, Session, SessionWithUser } from "@/db";
import { UsersService } from "@/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async login(
    request: Request,
    response: Response,
    oldSession: SessionWithUser | null,
    authLoginDto: AuthLoginDto,
  ): Promise<AuthLoginResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: authLoginDto.email,
        hash: hashPassword(
          authLoginDto.password,
          this.configService.get<string>("secrets.pwdsalt"),
        ),
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid login data");
    }

    if (oldSession && oldSession.user.id !== user.id) {
      await this.logout(request, response, oldSession);
      oldSession = null;
    }

    let maxAge: number = 24 * 60 * 60 * 1000;
    if (authLoginDto.remember) maxAge = 365 * 24 * 60 * 60 * 1000;

    const expirationTime = Date.now() + maxAge;

    const session = await this.generateSession(
      oldSession,
      user,
      expirationTime,
      authLoginDto.cookies,
    );

    const signedToken = this.createToken(session.token);

    if (authLoginDto.cookies) {
      const secure =
        this.configService.get<boolean>("http.secure") ||
        request.header("X-Forwarded-Proto") === "https";

      response.cookie("jwt", signedToken, {
        secure: secure,
        sameSite: secure ? "none" : "lax",
        httpOnly: true,
        maxAge,
      });
    }

    const account = this.usersService.getProfile(session.user);

    return {
      token: authLoginDto.cookies ? undefined : signedToken,
      expirationTime,
      account,
    };
  }

  async logout(
    request: Request,
    response: Response,
    session: Session,
  ): Promise<boolean> {
    await this.prisma.session.delete({ where: { id: session.id } });

    const secure =
      this.configService.get<boolean>("http.secure") ||
      request.header("X-Forwarded-Proto") === "https";

    response.clearCookie("jwt", {
      secure: secure,
      sameSite: secure ? "none" : "lax",
      httpOnly: true,
    });

    return true;
  }

  private createToken(token: string): string {
    const payload: JwtPayload = {
      id: token,
    };

    const accessToken: string = sign(
      payload,
      this.configService.get<string>("secrets.jwt"),
    );
    return accessToken;
  }

  private async generateSession(
    existingSession: SessionWithUser | null,
    user: User,
    expirationTime: number,
    cookies: boolean,
  ): Promise<SessionWithUser> {
    let token: string;
    let sessionWithThisToken: Session | null = null;

    do {
      token = uuid() as string;
      sessionWithThisToken = await this.prisma.session.findFirst({
        where: { token },
      });
    } while (sessionWithThisToken);

    if (existingSession) {
      const updated = await this.prisma.session.update({
        where: { id: existingSession.id },
        data: {
          token,
          exp: BigInt(expirationTime),
          cookies,
        },
        include: { user: true },
      });
      return updated;
    } else {
      const created = await this.prisma.session.create({
        data: {
          userId: user.id,
          token,
          exp: BigInt(expirationTime),
          cookies,
        },
        include: { user: true },
      });
      return created;
    }
  }

  async cleanExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        exp: { lt: BigInt(Date.now()) },
      },
    });

    return result.count;
  }
}
