import {
  AuthResponse,
  AuthToken,
  FollowActionRequest,
  FollowActionResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LogoutRequest,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://wqfyievo5m.execute-api.us-east-1.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private throwIfError(response: TweeterResponse): void {
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  private async getPagedItems<T, D>(
    request: PagedItemRequest<D>,
    endpoint: string,
    fromDto: (dto: D | null) => T | null,
    emptyError: string,
  ): Promise<[T[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<D>,
      PagedItemResponse<D>
    >(request, endpoint);
    this.throwIfError(response);
    const items = response.items?.map((dto) => fromDto(dto) as T) ?? null;
    if (items == null) throw new Error(emptyError);
    return [items, response.hasMore];
  }

  private extractUserAuth(response: AuthResponse): [User, AuthToken] {
    return [
      User.fromDto(response.user) as User,
      AuthToken.fromDto(response.authToken) as AuthToken,
    ];
  }

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    return this.getPagedItems(
      request,
      "/follow/getFollowees",
      User.fromDto,
      "No followees found",
    );
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    return this.getPagedItems(
      request,
      "/follow/getFollowers",
      User.fromDto,
      "No followers found",
    );
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest,
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/getIsFollowerStatus");
    this.throwIfError(response);
    return response.isFollower;
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follow/getFolloweeCount");
    this.throwIfError(response);
    return response.count;
  }

  public async getFollowerCount(
    request: GetFollowCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follow/getFollowerCount");
    this.throwIfError(response);
    return response.count;
  }

  public async follow(request: FollowActionRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow/follow");
    this.throwIfError(response);
    return [response.followerCount, response.followeeCount];
  }

  public async unfollow(
    request: FollowActionRequest,
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow/unfollow");
    this.throwIfError(response);
    return [response.followerCount, response.followeeCount];
  }

  public async getMoreFeedItems(
    request: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    return this.getPagedItems(
      request,
      "/status/getFeedItems",
      Status.fromDto,
      "No feed items found",
    );
  }

  public async getMoreStoryItems(
    request: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    return this.getPagedItems(
      request,
      "/status/getStoryItems",
      Status.fromDto,
      "No story items found",
    );
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/postStatus");
    this.throwIfError(response);
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/getUser");
    this.throwIfError(response);
    return User.fromDto(response.user);
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/user/login");
    this.throwIfError(response);
    return this.extractUserAuth(response);
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/logout");
    this.throwIfError(response);
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthResponse
    >(request, "/user/register");
    this.throwIfError(response);
    return this.extractUserAuth(response);
  }
}
