import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

const userService = new UserService();

export const handler = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const [user, authToken] = await userService.login(
    request.alias,
    request.password,
  );
  return { success: true, message: null, user, authToken };
};
