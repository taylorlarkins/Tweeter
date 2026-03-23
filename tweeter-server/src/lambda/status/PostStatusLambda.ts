import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

const statusService = new StatusService();

export const handler = async (
  request: PostStatusRequest,
): Promise<TweeterResponse> => {
  await statusService.postStatus(request.token, request.newStatus);
  return { success: true, message: null };
};
