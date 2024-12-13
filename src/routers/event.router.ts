import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { upload } from "..";

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.eventController.getEvents);
    this.router.post(
      "/",
      upload.single("image"),
      this.eventController.createEvent
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
