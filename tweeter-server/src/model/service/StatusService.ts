import { StatusDto } from "tweeter-shared";
import { IStatusDao } from "../dao/interface/IStatusDao";
import { SQSDao } from "../dao/sqs/SQSDao";
import { Service } from "./Service";

export class StatusService extends Service {
  private readonly statusDao: IStatusDao;
  private readonly sqsDao: SQSDao;

  constructor() {
    super();
    this.statusDao = this.factory.getStatusDao();
    this.sqsDao = new SQSDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastTimestamp = lastItem?.timestamp ?? null;
    return this.factory.getFeedDao().getPageOfFeedItems(userAlias, pageSize, lastTimestamp);
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
    await this.sqsDao.sendMessage(
      process.env.POST_STATUS_QUEUE_URL!,
      JSON.stringify({ status: newStatus })
    );
  }
}
