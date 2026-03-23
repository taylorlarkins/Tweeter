import "isomorphic-fetch";
import {
  AuthToken,
  GetFollowCountRequest,
  PagedItemRequest,
  RegisterRequest,
  User,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

const REGISTER_REQUEST: RegisterRequest = {
  firstName: "Test",
  lastName: "User",
  alias: "@testuser",
  password: "password123",
  userImageBase64: "",
  imageFileExtension: "png",
};

describe("ServerFacade integration", () => {
  let facade: ServerFacade;
  let authToken: AuthToken;

  beforeAll(async () => {
    facade = new ServerFacade();
    const [, token] = await facade.register(REGISTER_REQUEST);
    authToken = token;
  });

  it("register returns Allen Anderson with a valid auth token", async () => {
    const [user, token] = await facade.register(REGISTER_REQUEST);
    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(user.alias).toBe("@allen");
    expect(token).toBeInstanceOf(AuthToken);
    expect(token.token).toBeTruthy();
  });

  it("getMoreFollowers returns a non-empty list of User objects", async () => {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    };
    const [users, hasMore] = await facade.getMoreFollowers(request);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0].alias).toBeTruthy();
    expect(typeof hasMore).toBe("boolean");
  });

  it("getFollowerCount returns a count greater than 0", async () => {
    const request: GetFollowCountRequest = {
      token: authToken.token,
      userAlias: "@allen",
    };
    const count = await facade.getFollowerCount(request);
    expect(count).toBeGreaterThan(0);
  });

  it("getFolloweeCount returns a count greater than 0", async () => {
    const request: GetFollowCountRequest = {
      token: authToken.token,
      userAlias: "@allen",
    };
    const count = await facade.getFolloweeCount(request);
    expect(count).toBeGreaterThan(0);
  });
});
