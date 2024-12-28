import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.transactionController.createTransaction);
    this.router.post("/payment", this.transactionController.getSnapToken);
    this.router.post(
      "/midtrans-webhook",
      this.transactionController.midtransWebHook
    );
    this.router.get("/:id", this.transactionController.getTransactionId);
  }

  getRouter(): Router {
    return this.router;
  }
}
