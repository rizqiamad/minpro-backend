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
exports.UserProfileController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../services/cloudinary");
class UserProfileController {
    getUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(200).send({ result: user });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventsUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (req.organizer)
                    throw { message: "Organizer is not granted" };
                const filter = {};
                filter.Ticket = {
                    some: {
                        Ticket_Transaction: {
                            some: {
                                transaction: {
                                    AND: [{ user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { status: "success" }],
                                },
                            },
                        },
                    },
                };
                const { type } = req.query;
                if (type === "active") {
                    filter.end_date = {
                        gte: new Date(),
                    };
                }
                else if (type === "unactive") {
                    filter.end_date = {
                        lt: new Date(),
                    };
                }
                const events = yield prisma_1.default.event.findMany({
                    where: filter,
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        start_date: true,
                        end_date: true,
                        type: true,
                    },
                });
                res.status(200).send({ result: events });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getTicketsUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tickets = yield prisma_1.default.ticket.findMany({
                    where: {
                        AND: [
                            { event_id: req.params.id },
                            {
                                Ticket_Transaction: {
                                    some: {
                                        transaction: {
                                            AND: [{ user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { status: "success" }],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                    },
                });
                res.status(200).send({ result: tickets });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getAmountTicketsUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const amountTickets = yield prisma_1.default.ticketTransaction.aggregate({
                    where: {
                        AND: [
                            {
                                transaction: {
                                    AND: [{ user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { status: "success" }],
                                },
                            },
                            { ticket_id: +req.params.id },
                        ],
                    },
                    _sum: { quantity: true },
                });
                res.status(200).send({ result: amountTickets._sum.quantity });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getUserCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const coupon = yield prisma_1.default.coupon.findFirst({
                    where: {
                        AND: [
                            { user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                            { expiresAt: { gte: new Date() } },
                            { active: true },
                        ],
                    },
                    select: { active: true },
                });
                res.status(200).send({ result: coupon === null || coupon === void 0 ? void 0 : coupon.active });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getPointsUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const points = yield prisma_1.default.point.aggregate({
                    where: {
                        AND: [
                            { user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                            { active: true },
                            { expiresAt: { gte: new Date() } },
                        ],
                    },
                    _sum: { total: true },
                });
                res.status(200).send({ result: points._sum.total });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    editAvatarCloud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "failed, file is empty" };
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "avatar");
                yield prisma_1.default.user.update({
                    data: { avatar: secure_url },
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(200).send({ message: "Avatar has been edited" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.UserProfileController = UserProfileController;
