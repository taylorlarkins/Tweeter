import { Status, StatusDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
  public async loadMoreFeedItems(
    _token: string,
    _userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [items.map((s) => s.dto), hasMore];
  }

  public async loadMoreStoryItems(
    _token: string,
    _userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [items.map((s) => s.dto), hasMore];
  }

  public async postStatus(
    _token: string,
    _newStatus: StatusDto,
  ): Promise<void> {
    // TODO: Call the server to post the status
  }
}
