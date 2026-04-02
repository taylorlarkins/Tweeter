export interface IFollowDao {
  getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<[string[], boolean]>;

  getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<[string[], boolean]>;

  getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;

  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  getAllFollowers(followeeAlias: string): Promise<string[]>;
}
