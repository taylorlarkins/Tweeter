import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

const followService = new FollowService();

export const handler = async (
  request: FollowActionRequest,
): Promise<FollowActionResponse> => {
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.user,
  );
  return { success: true, message: null, followerCount, followeeCount };
};
