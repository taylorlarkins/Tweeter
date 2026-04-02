import { StatusDto } from "tweeter-shared";
import { IFeedDao } from "../dao/interface/IFeedDao";
import { IFollowDao } from "../dao/interface/IFollowDao";
import { IStatusDao } from "../dao/interface/IStatusDao";
import { Service } from "./Service";

export class StatusService extends Service {
  private readonly statusDao: IStatusDao;
  private readonly feedDao: IFeedDao;
  private readonly followDao: IFollowDao;

  constructor() {
    super();
    this.statusDao = this.factory.getStatusDao();
    this.feedDao = this.factory.getFeedDao();
    this.followDao = this.factory.getFollowDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastTimestamp = lastItem?.timestamp ?? null;
    return this.feedDao.getPageOfFeedItems(userAlias, pageSize, lastTimestamp);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastTimestamp = lastItem?.timestamp ?? null;
    return this.statusDao.getPageOfStatuses(userAlias, pageSize, lastTimestamp);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.authService.validateToken(token);

    await this.statusDao.putStatus(newStatus);

    const followers = await this.followDao.getAllFollowers(newStatus.user.alias);
    if (followers.length > 0) {
      await this.feedDao.putFeedItems(followers, newStatus);
    }
  }
}
