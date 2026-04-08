import {
  SQSClient,
  SendMessageCommand,
  SendMessageBatchCommand,
} from "@aws-sdk/client-sqs";

export class SQSDao {
  private static sqsClient: SQSClient | undefined;

  private get client(): SQSClient {
    if (!SQSDao.sqsClient) {
      SQSDao.sqsClient = new SQSClient({
        region: process.env.AWS_REGION ?? "us-east-1",
      });
    }
    return SQSDao.sqsClient;
  }

  async sendMessage(queueUrl: string, body: string): Promise<void> {
    await this.client.send(
      new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: body })
    );
  }

  async sendMessageBatch(
    queueUrl: string,
    entries: Array<{ id: string; body: string }>
  ): Promise<void> {
    const BATCH_SIZE = 10; // SQS max batch size
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const chunk = entries.slice(i, i + BATCH_SIZE);
      await this.client.send(
        new SendMessageBatchCommand({
          QueueUrl: queueUrl,
          Entries: chunk.map((e) => ({ Id: e.id, MessageBody: e.body })),
        })
      );
    }
  }
}
