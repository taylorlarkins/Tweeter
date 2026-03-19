import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  clearPostBox: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService;
  private postingStatusToastId: string;

  public constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
    this.postingStatusToastId = "";
  }

  public async submitPost(
    currentUser: User,
    authToken: AuthToken,
    post: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      this.postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());
      await this.service.postStatus(authToken!, status);
      this.view.clearPostBox();
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");
    this.view.deleteMessage(this.postingStatusToastId);
    this.resetPostingStatusToastId();
  }

  public get service() {
    return this._service;
  }

  private resetPostingStatusToastId() {
    this.postingStatusToastId = "";
  }
}
