import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

const userService = new UserService();

export const handler = async (
  request: LogoutRequest,
): Promise<LogoutResponse> => {
  await userService.logout(request.token);
  return { success: true, message: null };
};
