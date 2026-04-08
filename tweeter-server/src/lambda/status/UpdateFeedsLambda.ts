import { SQSEvent } from "aws-lambda";
import { StatusDto } from "tweeter-shared";
import { DynamoFeedDao } from "../../model/dao/dynamo/DynamoFeedDao";

const feedDao = new DynamoFeedDao();

export const handler = async (event: SQSEvent): Promise<void> => {
  const startTime = Date.now();

  for (const record of event.Records) {
    const { status, followerAliases }: { status: StatusDto; followerAliases: string[] } =
      JSON.parse(record.body);
    await feedDao.putFeedItems(followerAliases, status);
  }

  // Throttle: ensure at least 1 second elapses per invocation to stay within 100 WCU/s
  const elapsed = Date.now() - startTime;
  if (elapsed < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
  }
};
