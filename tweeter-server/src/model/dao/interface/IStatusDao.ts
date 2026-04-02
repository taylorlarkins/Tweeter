import { StatusDto } from "tweeter-shared";

export interface IStatusDao {
  putStatus(status: StatusDto): Promise<void>;

  getPageOfStatuses(
    authorAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]>;
}
