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
exports.OrganizerProfileController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class OrganizerProfileController {
    getOrganizers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organizers = yield prisma_1.default.organizer.findMany({
                    take: 10,
                    select: {
                        name: true,
                        avatar: true,
                    },
                });
                res.status(200).send({ result: organizers });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getOrganizerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const organizer = yield prisma_1.default.organizer.findUnique({
                    where: { id: (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(200).send({ result: organizer });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    editOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.organizer.update({
                    data: req.body,
                    where: { id: +id },
                });
                res.status(200).send("Organizer updated");
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventsOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { type } = req.query;
                if (req.user)
                    throw { message: "User is not granted" };
                const filter = {};
                if (type === "active") {
                    filter.AND = [
                        { Ticket: { some: {} } },
                        { end_date: { gte: new Date() } },
                    ];
                }
                else if (type === "draft") {
                    filter.AND = [
                        { Ticket: { none: {} } },
                        { end_date: { gte: new Date() } },
                    ];
                }
                else if (type === "unactive") {
                    filter.end_date = { lt: new Date() };
                }
                const events = yield prisma_1.default.event.findMany({
                    where: Object.assign({ organizer_id: (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id }, filter),
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
}
exports.OrganizerProfileController = OrganizerProfileController;
