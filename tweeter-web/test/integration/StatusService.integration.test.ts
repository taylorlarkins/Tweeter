import "isomorphic-fetch";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("StatusService integration", () => {
  it("loadMoreStoryItems returns a non-empty page of Status objects", async () => {
    const service = new StatusService();
    const authToken = new AuthToken("fake-token", Date.now());

    const [statuses, hasMore] = await service.loadMoreStoryItems(
      authToken,
      "@allen",
      10,
      null,
    );

    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0]).toBeInstanceOf(Status);
    expect(statuses[0].post).toBeTruthy();
    expect(statuses[0].user).toBeInstanceOf(User);
    expect(typeof hasMore).toBe("boolean");
  });
});
