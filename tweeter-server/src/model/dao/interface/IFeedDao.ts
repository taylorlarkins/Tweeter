import { StatusDto } from "tweeter-shared";

export interface IFeedDao {
  putFeedItems(followerAliases: string[], status: StatusDto): Promise<void>;

  getPageOfFeedItems(
    followerAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]>;
}
