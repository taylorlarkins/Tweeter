import { FollowService } from "../../model/service/FollowService";
import { makeFollowActionHandler } from "./HandlerFactories";

const followService = new FollowService();
export const handler = makeFollowActionHandler(
  followService.unfollow.bind(followService),
);
