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
exports.ReviewController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ReviewController {
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = yield prisma_1.default.review.findFirst({
                    where: {
                        AND: [{ user_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { event_id: req.params.id }],
                    },
                });
                if (user)
                    throw { message: "You are just granted to give comment once" };
                yield prisma_1.default.review.create({
                    data: Object.assign(Object.assign({}, req.body), { user_id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, event_id: req.params.id }),
                });
                res.status(200).send({ message: "Review Created" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield prisma_1.default.review.findMany({
                    where: { event_id: req.params.id },
                    select: {
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: {
                            select: {
                                avatar: true,
                                full_name: true,
                            },
                        },
                    },
                });
                res.status(200).send({ result: reviews });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getAvg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avgRating = yield prisma_1.default.review.aggregate({
                    where: { events: { organizer_id: +req.params.id } },
                    _avg: { rating: true },
                });
                res.status(200).send({ result: avgRating._avg.rating });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.ReviewController = ReviewController;
