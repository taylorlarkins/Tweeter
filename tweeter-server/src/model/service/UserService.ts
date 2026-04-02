import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import * as bcryptjs from "bcryptjs";
import { Service } from "./Service";

const SALT_ROUNDS = 10;

export class UserService extends Service {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDao = this.factory.getUserDao();
    const authTokenDao = this.factory.getAuthTokenDao();

    const hash = await userDao.getPasswordHash(alias);
    if (hash === null) {
      throw new Error("[bad-request] Invalid alias or password");
    }

    const match = await bcryptjs.compare(password, hash);
    if (!match) {
      throw new Error("[bad-request] Invalid alias or password");
    }

    const user = await userDao.getUser(alias);
    if (!user) {
      throw new Error(
        "[internal-server-error] User not found after successful auth"
      );
    }

    const authToken = AuthToken.Generate();
    await authTokenDao.putAuthToken(authToken.token, authToken.timestamp, alias);

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
    const userDao = this.factory.getUserDao();
    const authTokenDao = this.factory.getAuthTokenDao();
    const s3Dao = this.factory.getS3Dao();

    const imageUrl = await s3Dao.uploadImage(
      alias,
      userImageBase64,
      imageFileExtension
    );
    const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);

    await userDao.createUser(firstName, lastName, alias, passwordHash, imageUrl);

    const user: UserDto = { alias, firstName, lastName, imageUrl };
    const authToken = AuthToken.Generate();
    await authTokenDao.putAuthToken(authToken.token, authToken.timestamp, alias);

    return [user, authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    await this.factory.getAuthTokenDao().deleteAuthToken(token);
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authService.validateToken(token);
    return this.factory.getUserDao().getUser(alias);
  }
}
