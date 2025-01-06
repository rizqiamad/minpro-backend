"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const verify_1 = require("../middlewares/verify");
class TransactionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.transactionController = new transaction_controller_1.TransactionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", verify_1.verifyToken, this.transactionController.createTransaction);
        this.router.post("/payment", verify_1.verifyToken, this.transactionController.getSnapToken);
        this.router.post("/midtrans-webhook", this.transactionController.midtransWebHook);
        this.router.get("/:id", this.transactionController.getTransactionId);
    }
    getRouter() {
        return this.router;
    }
}
exports.TransactionRouter = TransactionRouter;
