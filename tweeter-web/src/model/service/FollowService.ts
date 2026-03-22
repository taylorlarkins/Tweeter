import {
  AuthToken,
  User,
  PagedUserItemRequest,
  IsFollowerRequest,
  GetFollowCountRequest,
  FollowActionRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const req: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };
    return await this.serverFacade.getMoreFollowees(req);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const req: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };
    return await this.serverFacade.getMoreFollowers(req);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const req: IsFollowerRequest = {
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias,
    };
    return await this.serverFacade.getIsFollowerStatus(req);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const req: GetFollowCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };
    return await this.serverFacade.getFolloweeCount(req);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const req: GetFollowCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };
    return await this.serverFacade.getFollowerCount(req);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const req: FollowActionRequest = {
      token: authToken.token,
      user: userToFollow.dto,
    };
    return await this.serverFacade.follow(req);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const req: FollowActionRequest = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };
    return await this.serverFacade.unfollow(req);
  }
}
