import { DAOFactory } from "../dao/factory/DAOFactory";
import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export abstract class Service {
  protected readonly factory: DAOFactory;
  protected readonly authService: AuthorizationService;

  constructor(factory: DAOFactory = new DynamoDAOFactory()) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }
}
