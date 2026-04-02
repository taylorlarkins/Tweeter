import { IAuthTokenDao } from "../interface/IAuthTokenDao";
import { IFeedDao } from "../interface/IFeedDao";
import { IFollowDao } from "../interface/IFollowDao";
import { IS3Dao } from "../interface/IS3Dao";
import { IStatusDao } from "../interface/IStatusDao";
import { IUserDao } from "../interface/IUserDao";

export interface DAOFactory {
  getUserDao(): IUserDao;
  getFollowDao(): IFollowDao;
  getStatusDao(): IStatusDao;
  getFeedDao(): IFeedDao;
  getAuthTokenDao(): IAuthTokenDao;
  getS3Dao(): IS3Dao;
}
