import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";

export class ExampleRouter {
  private router: Router;
  private exampleController: ExampleController;

  constructor() {
    this.router = Router();
    this.exampleController = new ExampleController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.exampleController.getData);
  }

  getRouter(): Router {
    return this.router;
  }
}
