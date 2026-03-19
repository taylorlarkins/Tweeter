import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { NavigateFunction } from "react-router-dom";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
  updateIsFollower: (value: boolean) => void;
  updateFolloweeCount: (value: number) => void;
  updateFollowerCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;
  private followingUserToastId: string;
  private unfollowingUserToastId: string;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
    this.followingUserToastId = "";
    this.unfollowingUserToastId = "";
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.updateIsFollower(false);
      } else {
        this.view.updateIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.updateFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.updateFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public async followDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.followingUserToastId = this.view.displayInfoMessage(
        `Following ${displayedUser.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.service.follow(
        authToken,
        displayedUser,
      );
      this.view.updateIsFollower(true);
      this.view.updateFollowerCount(followerCount);
      this.view.updateFolloweeCount(followeeCount);
    }, "follow user");
    this.view.deleteMessage(this.followingUserToastId);
    this.resetFollowingUserToastId();
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.unfollowingUserToastId = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken,
        displayedUser,
      );
      this.view.updateIsFollower(false);
      this.view.updateFollowerCount(followerCount);
      this.view.updateFolloweeCount(followeeCount);
    }, "unfollow user");
    this.view.deleteMessage(this.unfollowingUserToastId);
    this.resetUnfollowingUserToastId();
  }

  public switchToLoggedInUser(currentUser: User, pathname: string): void {
    this.view.setDisplayedUser(currentUser);
    this.view.navigate(`${this.getBaseUrl(pathname)}/${currentUser.alias}`);
  }

  private getBaseUrl(pathname: string): string {
    const segments = pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  private resetFollowingUserToastId() {
    this.followingUserToastId = "";
  }

  private resetUnfollowingUserToastId() {
    this.unfollowingUserToastId = "";
  }
}
