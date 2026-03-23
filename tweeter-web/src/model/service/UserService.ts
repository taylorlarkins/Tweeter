import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  GetUserRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService implements Service {
  private serverFacade: ServerFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    const req: GetUserRequest = { token: authToken.token, alias };
    return await this.serverFacade.getUser(req);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const req: LoginRequest = { alias, password };
    return await this.serverFacade.login(req);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const req: LogoutRequest = { token: authToken.token };
    await this.serverFacade.logout(req);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const userImageBase64 = Buffer.from(userImageBytes).toString("base64");
    const req: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBase64,
      imageFileExtension,
    };
    return await this.serverFacade.register(req);
  }
}
