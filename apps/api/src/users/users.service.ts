import crypto from "crypto";
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService, User, Role } from "@/db";
import { hashPassword } from "@/auth/utils/hash-password";
import { ConfigService } from "@nestjs/config";
import {
  UserProfileResponse,
  UserCreateDto,
  UserUpdateDto,
  UserUpdateSelfDto,
  UserUpdateSelfPasswordDto,
  PaginationResponse,
  PaginationDto,
} from "shared";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  getProfile(user: User): UserProfileResponse {
    const avatar = this.getAvatar(user.email);
    return {
      id: user.id,
      role: user.role as unknown as UserProfileResponse["role"],
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      position: user.position,
      avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  private getAvatar(email: string): string {
    const hash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");
    const avatar = `https://www.gravatar.com/avatar/${hash}?s=200&d=mp`;
    return avatar;
  }

  async updateSelf(
    user: User,
    userUpdateSelfDto: UserUpdateSelfDto,
  ): Promise<UserProfileResponse> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: userUpdateSelfDto.firstName,
        lastName: userUpdateSelfDto.lastName,
        position: userUpdateSelfDto.position,
      },
    });

    return this.getProfile(updatedUser);
  }

  async updateSelfPassword(
    user: User,
    userUpdateSelfPasswordDto: UserUpdateSelfPasswordDto,
  ): Promise<UserProfileResponse> {
    const oldHash = hashPassword(
      userUpdateSelfPasswordDto.password,
      this.configService.get<string>("secrets.pwdsalt"),
    );

    if (user.hash !== oldHash) {
      throw new ForbiddenException("Wrong password");
    }

    const newHash = hashPassword(
      userUpdateSelfPasswordDto.newPassword,
      this.configService.get<string>("secrets.pwdsalt"),
    );

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { hash: newHash },
    });

    return this.getProfile(updatedUser);
  }

  async createOne(userCreateDto: UserCreateDto): Promise<UserProfileResponse> {
    const countSameEmailUser = await this.prisma.user.count({
      where: { email: userCreateDto.email },
    });

    if (countSameEmailUser > 0)
      throw new ConflictException(
        "A user with this email address already exists",
      );

    const user = await this.prisma.user.create({
      data: {
        email: userCreateDto.email,
        hash: hashPassword(
          userCreateDto.password,
          this.configService.get<string>("secrets.pwdsalt"),
        ),
        firstName: userCreateDto.firstName,
        lastName: userCreateDto.lastName,
        role: userCreateDto.role as Role | undefined,
      },
    });

    return this.getProfile(user);
  }

  async getMany(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<UserProfileResponse>> {
    const where: Prisma.UserWhereInput = {};

    if (paginationDto.filter) {
      const filterLower = paginationDto.filter.toLowerCase();
      where.OR = [
        { firstName: { contains: filterLower, mode: "insensitive" } },
        { lastName: { contains: filterLower, mode: "insensitive" } },
        { email: { contains: filterLower, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];
    const direction = paginationDto.descending ? "desc" : "asc";

    switch (paginationDto.sortBy) {
      case "name":
        orderBy.push({ firstName: direction }, { lastName: direction });
        break;
      case "role":
        orderBy.push({ role: direction });
        break;
      case "createdAt":
        orderBy.push({ createdAt: direction });
        break;
      default:
        orderBy.push({ role: "asc" });
    }

    const [foundUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        take: paginationDto.take,
        skip: (paginationDto.page - 1) * paginationDto.take,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      page: paginationDto.page,
      pages: Math.ceil(total / paginationDto.take),
      total: total,
      elements: foundUsers.map(this.getProfile.bind(this)),
    };
  }

  async getOne(id: string): Promise<UserProfileResponse> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });

    if (!foundUser) throw new NotFoundException();
    return this.getProfile(foundUser);
  }

  async updateOne(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserProfileResponse> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });

    if (!foundUser) throw new NotFoundException();

    const data: Prisma.UserUpdateInput = {
      firstName: userUpdateDto.firstName,
      lastName: userUpdateDto.lastName,
      position: userUpdateDto.position,
      isActive: userUpdateDto.isActive,
      role: userUpdateDto.role as Role,
    };

    if (userUpdateDto.password.length) {
      data.hash = hashPassword(
        userUpdateDto.password,
        this.configService.get<string>("secrets.pwdsalt"),
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.getProfile(updatedUser);
  }

  async deleteOne(id: string): Promise<number> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return 1;
    } catch {
      throw new NotFoundException();
    }
  }
}
