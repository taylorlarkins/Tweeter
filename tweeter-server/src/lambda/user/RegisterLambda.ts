import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

const userService = new UserService();

export const handler = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBase64,
    request.imageFileExtension,
  );
  return { success: true, message: null, user, authToken };
};
