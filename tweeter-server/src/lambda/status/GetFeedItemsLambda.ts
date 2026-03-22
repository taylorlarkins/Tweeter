import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

const statusService = new StatusService();

export const handler = async (
  request: PagedStatusItemRequest,
): Promise<PagedStatusItemResponse> => {
  const [items, hasMore] = await statusService.loadMoreFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem,
  );
  return { success: true, message: null, items, hasMore };
};
