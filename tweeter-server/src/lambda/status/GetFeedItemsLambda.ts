import { StatusService } from "../../model/service/StatusService";
import { makePagedItemHandler } from "../follow/HandlerFactories";

const statusService = new StatusService();
export const handler = makePagedItemHandler(
  statusService.loadMoreFeedItems.bind(statusService),
);
