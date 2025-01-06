"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataRouter = void 0;
const express_1 = require("express");
const metadata_controller_1 = require("../controllers/metadata.controller");
class MetadataRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.metadataController = new metadata_controller_1.MetadataController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/event/:id", this.metadataController.getEventId);
    }
    getRouter() {
        return this.router;
    }
}
exports.MetadataRouter = MetadataRouter;
