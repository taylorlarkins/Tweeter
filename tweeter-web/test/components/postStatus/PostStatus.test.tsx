import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  let mockUser: User;
  let mockUserInstance: User;
  let mockAuthToken: AuthToken;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    mockUser = mock(User);
    mockUserInstance = instance(mockUser);
    mockAuthToken = mock(AuthToken);
    mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the post status and clear buttons both disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElement();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables post status and clear buttons when post status text field has text", async () => {
    const { user, postField, postButton, clearButton } =
      renderPostStatusAndGetElement();
    await user.type(postField, "This is a simple post.");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the post status text field is cleared", async () => {
    const { user, postField, postButton, clearButton } =
      renderPostStatusAndGetElement();
    await user.type(postField, "This is a simple post.");
    await user.click(clearButton);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with the correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const postText = "This is a simple post.";
    const { user, postField, postButton } = renderPostStatusAndGetElement(
      mockPresenterInstance,
    );

    await user.type(postField, postText);
    await user.click(postButton);
    verify(
      mockPresenter.submitPost(
        mockUserInstance,
        mockAuthTokenInstance,
        postText,
      ),
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(<PostStatus presenter={presenter} />);
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  renderPostStatus(presenter);
  const postField = screen.getByLabelText("postStatusField");
  const postButton = screen.getByLabelText("postStatusButton");
  const clearButton = screen.getByLabelText("clearButton");

  return { user, postField, postButton, clearButton };
}
