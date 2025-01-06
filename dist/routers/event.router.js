"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const __1 = require("..");
const verify_1 = require("../middlewares/verify");
class EventRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.eventController = new event_controller_1.EventController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.eventController.getEvents);
        this.router.post("/", verify_1.verifyToken, __1.upload.single("image"), this.eventController.createEvent);
        this.router.get("/display", this.eventController.getEventsDisplay);
        this.router.get("/:id", this.eventController.getEventDetail);
        this.router.get("/review/:id", this.eventController.getEventId);
    }
    getRouter() {
        return this.router;
    }
}
exports.EventRouter = EventRouter;
