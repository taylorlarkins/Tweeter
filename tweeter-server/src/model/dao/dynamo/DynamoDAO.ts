import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDAO {
  private static docClient: DynamoDBDocumentClient | undefined;

  protected get client(): DynamoDBDocumentClient {
    if (!DynamoDAO.docClient) {
      const rawClient = new DynamoDBClient({
        region: process.env.AWS_REGION ?? "us-east-1",
      });
      DynamoDAO.docClient = DynamoDBDocumentClient.from(rawClient);
    }
    return DynamoDAO.docClient;
  }

  protected async put(params: PutCommandInput): Promise<void> {
    await this.client.send(new PutCommand(params));
  }

  protected async get(
    params: GetCommandInput,
  ): Promise<Record<string, unknown> | undefined> {
    const result = await this.client.send(new GetCommand(params));
    return result.Item as Record<string, unknown> | undefined;
  }

  protected async query(params: QueryCommandInput): Promise<{
    items: Record<string, unknown>[];
    lastKey: Record<string, unknown> | undefined;
  }> {
    const result = await this.client.send(new QueryCommand(params));
    return {
      items: (result.Items ?? []) as Record<string, unknown>[],
      lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
    };
  }

  protected async delete(params: DeleteCommandInput): Promise<void> {
    await this.client.send(new DeleteCommand(params));
  }

  protected async update(params: UpdateCommandInput): Promise<void> {
    await this.client.send(new UpdateCommand(params));
  }

  protected async batchWrite(
    tableName: string,
    items: Record<string, unknown>[],
  ): Promise<void> {
    const BATCH_SIZE = 25;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const chunk = items.slice(i, i + BATCH_SIZE);
      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: chunk.map((item) => ({
              PutRequest: { Item: item },
            })),
          },
        }),
      );
    }
  }
}
