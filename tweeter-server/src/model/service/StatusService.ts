import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastTimestamp = lastItem?.timestamp ?? null;
    return this.factory
      .getFeedDao()
      .getPageOfFeedItems(userAlias, pageSize, lastTimestamp);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastTimestamp = lastItem?.timestamp ?? null;
    return this.factory
      .getStatusDao()
      .getPageOfStatuses(userAlias, pageSize, lastTimestamp);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.authService.validateToken(token);
    const statusDao = this.factory.getStatusDao();
    const feedDao = this.factory.getFeedDao();
    const followDao = this.factory.getFollowDao();

    await statusDao.putStatus(newStatus);

    const followers = await followDao.getAllFollowers(newStatus.user.alias);
    if (followers.length > 0) {
      await feedDao.putFeedItems(followers, newStatus);
    }
  }
}
