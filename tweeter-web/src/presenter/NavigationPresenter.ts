import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { View, Presenter } from "./Presenter";

export interface NavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
}

export class NavigationPresenter extends Presenter<NavigationView> {
  private service: UserService;

  public constructor(view: NavigationView) {
    super(view);
    this.service = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User,
    target: string,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(target);
      const featureUrl = this.extraxtFeatureUrl(target);
      console.log(featureUrl);

      const toUser = await this.service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featureUrl}/${toUser.alias}`);
        }
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  private extraxtFeatureUrl(value: string): string {
    if (value.indexOf("/feed") != -1) {
      return "/feed";
    } else if (value.indexOf("/story") != -1) {
      return "/story";
    } else if (value.indexOf("/followees") != -1) {
      return "/followees";
    } else {
      return "/followers";
    }
  }
}
