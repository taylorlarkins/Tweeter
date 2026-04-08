import { SQSEvent } from "aws-lambda";
import { StatusDto } from "tweeter-shared";
import { DynamoFollowDao } from "../../model/dao/dynamo/DynamoFollowDao";
import { SQSDao } from "../../model/dao/sqs/SQSDao";

const followDao = new DynamoFollowDao();
const sqsDao = new SQSDao();

const UPDATE_FEED_QUEUE_URL = process.env.UPDATE_FEED_QUEUE_URL!;
const PAGE_SIZE = 100;

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const { status }: { status: StatusDto } = JSON.parse(record.body);
    const authorAlias = status.user.alias;

    let lastFollowerAlias: string | null = null;
    let hasMore = true;
    let messageIndex = 0;

    while (hasMore) {
      const [followers, more] = await followDao.getPageOfFollowers(
        authorAlias,
        PAGE_SIZE,
        lastFollowerAlias
      );
      hasMore = more;

      if (followers.length > 0) {
        lastFollowerAlias = followers[followers.length - 1];
        await sqsDao.sendMessage(
          UPDATE_FEED_QUEUE_URL,
          JSON.stringify({ status, followerAliases: followers })
        );
        messageIndex++;
      }
    }
  }
};
