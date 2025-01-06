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
exports.GraphController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const monthCalendar_1 = require("../helpers/monthCalendar");
class GraphController {
    getActiveEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const event = yield prisma_1.default.event.findMany({
                    where: { organizer_id: id },
                });
                let months = [];
                let dataChart = [];
                for (const item of event) {
                    const month = new Date(item.start_date).getMonth();
                    months.push(month);
                    months.sort((a, b) => a - b);
                }
                for (const item of months) {
                    if (!JSON.stringify(dataChart).includes((0, monthCalendar_1.FormatMonth)(item))) {
                        dataChart.push({ month: (0, monthCalendar_1.FormatMonth)(item), active_event: 1 });
                    }
                    else {
                        dataChart[dataChart.length - 1].active_event += 1;
                    }
                }
                console.log(dataChart);
                res.status(200).send({ result: dataChart });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id;
                const event = yield prisma_1.default.event.findMany({
                    where: { organizer_id: id },
                });
                const eventTotal = event.length;
                console.log(eventTotal);
                res.status(200).send({ result: eventTotal });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getTransactionGraph(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const filter = {
                    AND: [
                        { status: "success" },
                        {
                            Ticket_Transaction: {
                                some: { ticket: { events: { organizer_id: (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id } } },
                            },
                        },
                    ],
                };
                const trans = yield prisma_1.default.transaction.findMany({
                    where: filter,
                    select: { final_price: true, createdAt: true },
                });
                res.status(200).send({ result: trans });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getTotalTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const filter = {
                    AND: [
                        { status: "success" },
                        {
                            Ticket_Transaction: {
                                some: { ticket: { events: { organizer_id: (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id } } },
                            },
                        },
                    ],
                };
                const trans = yield prisma_1.default.transaction.aggregate({
                    where: filter,
                    _count: { _all: true },
                });
                res.status(200).send({ result: trans._count._all });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.GraphController = GraphController;
