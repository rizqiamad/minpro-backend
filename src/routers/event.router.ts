import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { upload } from "..";
import { verifyToken } from "../middlewares/verify";

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
      verifyToken,
      upload.single("image"),
      this.eventController.createEvent
    );
    this.router.get("/display", this.eventController.getEventsDisplay);

    this.router.get("/:id", this.eventController.getEventDetail);
    this.router.get("/review/:id", this.eventController.getEventId);
  }

  getRouter(): Router {
    return this.router;
  }
}
