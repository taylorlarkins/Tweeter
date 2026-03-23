import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

const userService = new UserService();

export const handler = async (
  request: GetUserRequest,
): Promise<GetUserResponse> => {
  const user = await userService.getUser(request.token, request.alias);
  return { success: true, message: null, user };
};
