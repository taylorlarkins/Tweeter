import "isomorphic-fetch";
import { mock, instance, verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";
import { StatusService } from "../../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";

const TEST_ALIAS = "@test";
const TEST_PASSWORD = "test123";

describe("Post Status Integration Test", () => {
  jest.setTimeout(30000);
  let authToken: AuthToken;
  let currentUser: User;

  beforeAll(async () => {
    const userService = new UserService();
    [currentUser, authToken] = await userService.login(
      TEST_ALIAS,
      TEST_PASSWORD,
    );
  });

  it("displays success message and appends status to user's story", async () => {
    // 1. Create a ts-mockito mock of PostStatusView
    const mockView = mock<PostStatusView>();
    const viewInstance = instance(mockView);

    // 2. Create presenter with mock view
    const presenter = new PostStatusPresenter(viewInstance);

    // 3. Build a unique post so we can identify it in the story
    const postText = `Integration test post @ ${Date.now()}`;

    // 4. Submit the post via the presenter
    await presenter.submitPost(currentUser, authToken, postText);

    // 5. Verify the success message was displayed to the user
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();

    // 6. Fetch the user's story and confirm the new status appears
    const statusService = new StatusService();
    const [storyItems] = await statusService.loadMoreStoryItems(
      authToken,
      currentUser.alias,
      10,
      null,
    );

    const posted = storyItems.find((s) => s.post === postText);
    expect(posted).toBeDefined();
    expect(posted!.user.alias).toBe(currentUser.alias);
    expect(posted!.post).toBe(postText);
  });
});
