"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const midtransClient = require("midtrans-client");
class TransactionController {
    createTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { base_price, coupon, point, final_price, ticketCart } = req.body;
                console.log(req.body);
                const transactionId = yield prisma_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    if (coupon) {
                        const coupon = yield prisma.coupon.findFirst({
                            where: { user_id: userId },
                        });
                        yield prisma.coupon.update({
                            where: { id: coupon === null || coupon === void 0 ? void 0 : coupon.id },
                            data: { active: false },
                        });
                    }
                    if (point) {
                        yield prisma.point.updateMany({
                            where: { user_id: userId },
                            data: { active: false },
                        });
                    }
                    const { id } = yield prisma.transaction.create({
                        data: {
                            user_id: userId,
                            base_price,
                            coupon,
                            point,
                            final_price,
                            expiresAt: new Date(new Date().getTime() + 30 * 60000),
                        },
                    });
                    yield Promise.all(ticketCart.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.qty > item.ticket.seats) {
                            throw new Error(`Insufficient seats for ticket ID: ${item.ticket.id}`);
                        }
                        yield prisma.ticketTransaction.create({
                            data: {
                                transaction_id: id,
                                ticket_id: item.ticket.id,
                                quantity: item.qty,
                                subtotal: item.qty * item.ticket.price,
                            },
                        });
                        yield prisma.ticket.update({
                            where: { id: item.ticket.id },
                            data: { seats: { decrement: item.qty } },
                        });
                    })));
                    return id;
                }));
                res
                    .status(200)
                    .send({ message: "Transaction created", order_id: transactionId });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getTransactionId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield prisma_1.default.transaction.findUnique({
                    where: { id: +req.params.id },
                    select: {
                        expiresAt: true,
                        coupon: true,
                        point: true,
                        base_price: true,
                        final_price: true,
                        Ticket_Transaction: {
                            select: {
                                quantity: true,
                                subtotal: true,
                                ticket: {
                                    select: {
                                        name: true,
                                        price: true,
                                        events: {
                                            select: {
                                                name: true,
                                                image: true,
                                                start_date: true,
                                                end_date: true,
                                                start_time: true,
                                                end_time: true,
                                                location: {
                                                    select: {
                                                        name_place: true,
                                                        address: true,
                                                        city: {
                                                            select: {
                                                                city: true,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                res.status(200).send({ result: transaction });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getSnapToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { order_id } = req.body;
                const item_details = [];
                const checkTransaction = yield prisma_1.default.transaction.findUnique({
                    where: { id: order_id },
                    select: { status: true, expiresAt: true, coupon: true, point: true },
                });
                if ((checkTransaction === null || checkTransaction === void 0 ? void 0 : checkTransaction.status) === "canceled")
                    throw "You cannot continue transaction, as your delaying transaction";
                const ticketTransaction = yield prisma_1.default.ticketTransaction.findMany({
                    where: { transaction_id: order_id },
                    include: {
                        ticket: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                for (const item of ticketTransaction) {
                    item_details.push({
                        id: item.ticket_id,
                        price: item.subtotal / item.quantity,
                        quantity: item.quantity,
                        name: item.ticket.name,
                    });
                }
                if (checkTransaction === null || checkTransaction === void 0 ? void 0 : checkTransaction.coupon) {
                    const coupon = yield prisma_1.default.coupon.findFirst({
                        where: { user_id: user === null || user === void 0 ? void 0 : user.id },
                    });
                    item_details.push({
                        id: coupon === null || coupon === void 0 ? void 0 : coupon.id,
                        price: -(req.body.base_price - checkTransaction.point) / 10,
                        quantity: 1,
                        name: "Coupon",
                    });
                }
                if (checkTransaction && (checkTransaction === null || checkTransaction === void 0 ? void 0 : checkTransaction.point) > 0) {
                    const points = yield prisma_1.default.point.findMany({
                        where: { user_id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id },
                        select: { total: true },
                        orderBy: { createdAt: "asc" },
                    });
                    item_details.push({
                        id: points[0].total,
                        price: -checkTransaction.point,
                        quantity: 1,
                        name: "Points",
                    });
                }
                const resMinutes = new Date(`${checkTransaction === null || checkTransaction === void 0 ? void 0 : checkTransaction.expiresAt}`).getTime() -
                    new Date().getTime();
                const snap = new midtransClient.Snap({
                    isProduction: false,
                    serverKey: `${process.env.MID_SERVER_KEY}`,
                });
                const parameters = {
                    transaction_details: req.body,
                    customer_details: {
                        first_name: user === null || user === void 0 ? void 0 : user.full_name,
                        email: user === null || user === void 0 ? void 0 : user.email,
                        phone: user === null || user === void 0 ? void 0 : user.no_handphone,
                    },
                    item_details,
                    page_expiry: {
                        duration: new Date(resMinutes).getMinutes(),
                        unit: "minutes",
                    },
                    expiry: {
                        unit: "minutes",
                        duration: new Date(resMinutes).getMinutes(),
                    },
                };
                const transaction = yield snap.createTransaction(parameters);
                res.status(200).send({ result: transaction.token });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    midtransWebHook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transaction_status, order_id } = req.body;
                const statusTransaction = transaction_status === "settlement"
                    ? "success"
                    : transaction_status === "pending"
                        ? "pending"
                        : "canceled";
                if (statusTransaction === "canceled") {
                    const tickets = yield prisma_1.default.ticketTransaction.findMany({
                        where: { transaction_id: +order_id },
                        select: {
                            quantity: true,
                            ticket_id: true,
                        },
                    });
                    for (const item of tickets) {
                        yield prisma_1.default.ticket.update({
                            where: { id: item.ticket_id },
                            data: { seats: { increment: item.quantity } },
                        });
                    }
                }
                yield prisma_1.default.transaction.update({
                    where: { id: +order_id },
                    data: {
                        status: statusTransaction,
                    },
                });
                res.status(200).send({ message: "Your transaction success" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.TransactionController = TransactionController;
