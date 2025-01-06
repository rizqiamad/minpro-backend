"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphRouter = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const verify_1 = require("../middlewares/verify");
class GraphRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.graphController = new dashboard_controller_1.GraphController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/eventaktif", verify_1.verifyToken, this.graphController.getActiveEvent);
        this.router.get("/graphevent", verify_1.verifyToken, this.graphController.getCourses);
        this.router.get("/graphtransaction", verify_1.verifyToken, this.graphController.getTransactionGraph);
        this.router.get("/totaltransaction", verify_1.verifyToken, this.graphController.getTotalTransaction);
    }
    getRouter() {
        return this.router;
    }
}
exports.GraphRouter = GraphRouter;
