import { FollowService } from "../../model/service/FollowService";
import { makePagedUserItemHandler } from "./PagedUserItemHandlerFactory";

const followService = new FollowService();
export const handler = makePagedUserItemHandler(
  followService.loadMoreFollowers.bind(followService),
);
