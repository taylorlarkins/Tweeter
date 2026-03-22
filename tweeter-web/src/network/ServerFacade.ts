import {
  FollowActionRequest,
  FollowActionResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://wqfyievo5m.execute-api.us-east-1.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/getFollowees");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/getFollowers");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest,
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/getIsFollowerStatus");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follow/getFolloweeCount");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  public async getFollowerCount(
    request: GetFollowCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follow/getFollowerCount");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  public async follow(request: FollowActionRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }

  public async unfollow(
    request: FollowActionRequest,
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown server error");
    }
  }
}
