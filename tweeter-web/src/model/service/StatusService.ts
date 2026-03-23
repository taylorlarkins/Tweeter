import {
  AuthToken,
  Status,
  PagedItemRequest,
  StatusDto,
  PostStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const req: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };
    return await this.serverFacade.getMoreFeedItems(req);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const req: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };
    return await this.serverFacade.getMoreStoryItems(req);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const req: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };
    await this.serverFacade.postStatus(req);
  }
}
