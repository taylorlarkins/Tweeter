import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import * as bcryptjs from "bcryptjs";
import { IAuthTokenDao } from "../dao/interface/IAuthTokenDao";
import { IS3Dao } from "../dao/interface/IS3Dao";
import { IUserDao } from "../dao/interface/IUserDao";
import { Service } from "./Service";

const SALT_ROUNDS = 10;

export class UserService extends Service {
  private readonly userDao: IUserDao;
  private readonly authTokenDao: IAuthTokenDao;
  private readonly s3Dao: IS3Dao;

  constructor() {
    super();
    this.userDao = this.factory.getUserDao();
    this.authTokenDao = this.factory.getAuthTokenDao();
    this.s3Dao = this.factory.getS3Dao();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const hash = await this.userDao.getPasswordHash(alias);
    if (hash === null) {
      throw new Error("[bad-request] Invalid alias or password");
    }

    const match = await bcryptjs.compare(password, hash);
    if (!match) {
      throw new Error("[bad-request] Invalid alias or password");
    }

    const user = await this.userDao.getUser(alias);
    if (!user) {
      throw new Error(
        "[internal-server-error] User not found after successful auth"
      );
    }

    const authToken = AuthToken.Generate();
    await this.authTokenDao.putAuthToken(authToken.token, authToken.timestamp, alias);

    return [user, authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const imageUrl = await this.s3Dao.uploadImage(
      alias,
      userImageBase64,
      imageFileExtension
    );
    const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);

    await this.userDao.createUser(firstName, lastName, alias, passwordHash, imageUrl);

    const user: UserDto = { alias, firstName, lastName, imageUrl };
    const authToken = AuthToken.Generate();
    await this.authTokenDao.putAuthToken(authToken.token, authToken.timestamp, alias);

    return [user, authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    await this.authTokenDao.deleteAuthToken(token);
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authService.validateToken(token);
    return this.userDao.getUser(alias);
  }
}
