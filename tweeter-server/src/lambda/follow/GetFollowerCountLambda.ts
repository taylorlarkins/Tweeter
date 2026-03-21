import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

const followService = new FollowService();

export const handler = async (
  request: GetFollowCountRequest,
): Promise<GetFollowCountResponse> => {
  const count = await followService.getFollowerCount(
    request.token,
    request.userAlias,
  );
  return { success: true, message: null, count };
};
