import { User } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  public constructor(view: AuthenticationView) {
    super(view);
  }

  public async doLogin(
    alias: string,
    password: string,
    originalUrl: string | undefined,
  ) {
    this.doAuthenticationOperation(
      () => {
        return this.service.login(alias, password);
      },
      (user: User) => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
    );
  }
}
