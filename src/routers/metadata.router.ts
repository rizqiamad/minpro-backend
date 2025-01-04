import { Router } from "express";
import { MetadataController } from "../controllers/metadata.controller";

export class MetadataRouter {
  private router: Router;
  private metadataController: MetadataController;

  constructor() {
    this.router = Router();
    this.metadataController = new MetadataController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/event/:id", this.metadataController.getEventId);
  }

  getRouter(): Router {
    return this.router;
  }
}
