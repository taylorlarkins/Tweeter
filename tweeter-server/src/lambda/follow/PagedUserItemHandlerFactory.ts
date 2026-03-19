import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";

type PagedUserLoader = (
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: UserDto | null,
) => Promise<[UserDto[], boolean]>;

export function makePagedUserItemHandler(
  loader: PagedUserLoader,
): (request: PagedUserItemRequest) => Promise<PagedUserItemResponse> {
  return async (request) => {
    const [items, hasMore] = await loader(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem,
    );
    return { success: true, message: null, items, hasMore };
  };
}
