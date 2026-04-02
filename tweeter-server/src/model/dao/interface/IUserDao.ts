import { UserDto } from "tweeter-shared";

export interface IUserDao {
  createUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void>;

  getUser(alias: string): Promise<UserDto | null>;

  getPasswordHash(alias: string): Promise<string | null>;

  updateFollowerCount(alias: string, delta: number): Promise<void>;

  updateFolloweeCount(alias: string, delta: number): Promise<void>;

  getFollowerCount(alias: string): Promise<number>;

  getFolloweeCount(alias: string): Promise<number>;
}
