import { DAOFactory } from "../dao/factory/DAOFactory";

const TOKEN_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours of inactivity

export class AuthorizationService {
  private readonly factory: DAOFactory;

  constructor(factory: DAOFactory) {
    this.factory = factory;
  }

  async validateToken(token: string): Promise<void> {
    const authTokenDao = this.factory.getAuthTokenDao();
    const storedTimestamp = await authTokenDao.getAuthTokenTimestamp(token);

    if (storedTimestamp === null) {
      throw new Error("[bad-request] Invalid or expired auth token");
    }

    const now = Date.now();
    if (now - storedTimestamp > TOKEN_TIMEOUT_MS) {
      await authTokenDao.deleteAuthToken(token);
      throw new Error("[bad-request] Auth token has expired");
    }

    await authTokenDao.updateAuthTokenTimestamp(token, now);
  }
}
