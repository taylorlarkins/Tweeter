import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IS3Dao } from "../interface/IS3Dao";

export class S3Dao implements IS3Dao {
  private readonly BUCKET =
    process.env.S3_BUCKET_NAME ?? "tweeter-user-images";
  private readonly client = new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  async uploadImage(
    alias: string,
    imageBase64: string,
    imageFileExtension: string
  ): Promise<string> {
    const imageBuffer = Buffer.from(imageBase64, "base64");
    const key = `${alias}.${imageFileExtension}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.BUCKET,
        Key: key,
        Body: imageBuffer,
        ContentType: this.getContentType(imageFileExtension),
      })
    );

    return `https://${this.BUCKET}.s3.amazonaws.com/${key}`;
  }

  private getContentType(extension: string): string {
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    return map[extension.toLowerCase()] ?? "application/octet-stream";
  }
}
