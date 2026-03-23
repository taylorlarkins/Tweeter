import {
  FollowActionRequest,
  FollowActionResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  PagedItemRequest,
  PagedItemResponse,
  UserDto,
} from "tweeter-shared";

type PagedItemLoader<T> = (
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: T | null,
) => Promise<[T[], boolean]>;

export function makePagedItemHandler<T>(
  loader: PagedItemLoader<T>,
): (request: PagedItemRequest<T>) => Promise<PagedItemResponse<T>> {
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

type FollowActionLoader = (
  token: string,
  user: UserDto,
) => Promise<[number, number]>;

export function makeFollowActionHandler(
  loader: FollowActionLoader,
): (request: FollowActionRequest) => Promise<FollowActionResponse> {
  return async (request) => {
    const [followerCount, followeeCount] = await loader(
      request.token,
      request.user,
    );
    return { success: true, message: null, followerCount, followeeCount };
  };
}

type FollowCountLoader = (token: string, userAlias: string) => Promise<number>;

export function makeFollowCountHandler(
  loader: FollowCountLoader,
): (request: GetFollowCountRequest) => Promise<GetFollowCountResponse> {
  return async (request) => {
    const count = await loader(request.token, request.userAlias);
    return { success: true, message: null, count };
  };
}
