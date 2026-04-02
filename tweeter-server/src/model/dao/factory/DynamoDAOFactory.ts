import { DynamoAuthTokenDao } from "../dynamo/DynamoAuthTokenDao";
import { DynamoFeedDao } from "../dynamo/DynamoFeedDao";
import { DynamoFollowDao } from "../dynamo/DynamoFollowDao";
import { DynamoStatusDao } from "../dynamo/DynamoStatusDao";
import { DynamoUserDao } from "../dynamo/DynamoUserDao";
import { IAuthTokenDao } from "../interface/IAuthTokenDao";
import { IFeedDao } from "../interface/IFeedDao";
import { IFollowDao } from "../interface/IFollowDao";
import { IS3Dao } from "../interface/IS3Dao";
import { IStatusDao } from "../interface/IStatusDao";
import { IUserDao } from "../interface/IUserDao";
import { S3Dao } from "../s3/S3Dao";
import { DAOFactory } from "./DAOFactory";

export class DynamoDAOFactory implements DAOFactory {
  getUserDao(): IUserDao {
    return new DynamoUserDao();
  }

  getFollowDao(): IFollowDao {
    return new DynamoFollowDao();
  }

  getStatusDao(): IStatusDao {
    return new DynamoStatusDao();
  }

  getFeedDao(): IFeedDao {
    return new DynamoFeedDao();
  }

  getAuthTokenDao(): IAuthTokenDao {
    return new DynamoAuthTokenDao();
  }

  getS3Dao(): IS3Dao {
    return new S3Dao();
  }
}
