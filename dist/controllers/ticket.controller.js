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
exports.TicketController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class TicketController {
    getTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield prisma_1.default.ticket.findMany({
                    where: { event_id: req.params.eventId },
                });
                res.status(200).send({ result: tickets });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReqBody = Object.assign(Object.assign({}, req.body), { seats: Number(req.body.seats), event_id: req.params.eventId });
                yield prisma_1.default.ticket.create({ data: newReqBody });
                res.status(200).send({ message: "Ticket has been created" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.TicketController = TicketController;
