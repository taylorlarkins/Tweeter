import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(
    _token: string,
    alias: string,
  ): Promise<UserDto | null> {
    const user = FakeData.instance.findUserByAlias(alias);
    return user == null ? null : user.dto;
  }

  public async login(
    _alias: string,
    _password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async logout(_token: string): Promise<void> {
    // TODO: Invalidate the auth token on the server
  }

  public async register(
    _firstName: string,
    _lastName: string,
    _alias: string,
    _password: string,
    _userImageBase64: string,
    _imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }
}
