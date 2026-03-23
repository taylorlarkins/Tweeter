import { UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { makePagedItemHandler } from "./HandlerFactories";

const followService = new FollowService();
export const handler = makePagedItemHandler<UserDto>(
  followService.loadMoreFollowees.bind(followService),
);
