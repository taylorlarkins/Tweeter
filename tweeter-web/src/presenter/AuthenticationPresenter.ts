import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView extends View {
  authenticate: (user: User, authToken: AuthToken) => void;
  navigate: NavigateFunction;
}

export abstract class AuthenticationPresenter<
  T extends AuthenticationView,
> extends Presenter<T> {
  private _service: UserService = new UserService();

  protected get service() {
    return this._service;
  }

  protected async doAuthenticationOperation(
    authenticationOperation: () => Promise<[User, AuthToken]>,
    navigation: (user: User) => void,
    authenticationDescription: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await authenticationOperation();
      this.view.authenticate(user, authToken);
      navigation(user);
    }, authenticationDescription);
  }
}
