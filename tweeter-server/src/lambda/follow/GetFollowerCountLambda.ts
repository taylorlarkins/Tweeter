import { FollowService } from "../../model/service/FollowService";
import { makeFollowCountHandler } from "./HandlerFactories";

const followService = new FollowService();
export const handler = makeFollowCountHandler(
  followService.getFollowerCount.bind(followService),
);
