import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";

type PagedUserLoader = (
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: UserDto | null,
) => Promise<[UserDto[], boolean]>;

export function makePagedUserItemHandler(
  loader: PagedUserLoader,
): (request: PagedItemRequest<UserDto>) => Promise<PagedItemResponse<UserDto>> {
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
