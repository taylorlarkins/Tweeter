import { IAuthTokenDao } from "../dao/interface/IAuthTokenDao";
import { DAOFactory } from "../dao/factory/DAOFactory";

const TOKEN_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes of inactivity
export class AuthorizationService {
  private readonly authTokenDao: IAuthTokenDao;

  constructor(factory: DAOFactory) {
    this.authTokenDao = factory.getAuthTokenDao();
  }

  async validateToken(token: string): Promise<void> {
    const storedTimestamp =
      await this.authTokenDao.getAuthTokenTimestamp(token);

    if (storedTimestamp === null) {
      throw new Error("[bad-request] Invalid or expired auth token");
    }

    const now = Date.now();
    if (now - storedTimestamp > TOKEN_TIMEOUT_MS) {
      await this.authTokenDao.deleteAuthToken(token);
      throw new Error("[bad-request] Auth token has expired");
    }

    await this.authTokenDao.updateAuthTokenTimestamp(token, now);
  }
}
