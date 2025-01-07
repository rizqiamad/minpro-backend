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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../services/cloudinary");
class EventController {
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = 8;
                const { sorts = "asc", page = "1", cat, search, c } = req.query;
                const filter = {
                    AND: [{ Ticket: { some: {} } }, { end_date: { gte: new Date() } }],
                };
                if (cat)
                    filter.category = cat;
                if (search)
                    filter.name = { contains: `${search}`, mode: "insensitive" };
                if (c) {
                    filter.location = {
                        city: { city: { equals: `${c}`, mode: "insensitive" } },
                    };
                }
                const totalEvent = yield prisma_1.default.event.aggregate({
                    where: filter,
                    _count: { _all: true },
                });
                const total_page = Math.ceil(totalEvent._count._all / +limit);
                const events = yield prisma_1.default.event.findMany({
                    where: filter,
                    take: limit,
                    skip: +limit * (+page - 1),
                    orderBy: { start_date: sorts },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        start_date: true,
                        end_date: true,
                        type: true,
                        organizer: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                        Ticket: {
                            select: {
                                price: true,
                            },
                            orderBy: {
                                price: "asc",
                            },
                            take: 1,
                        },
                    },
                });
                res.status(200).send({ total_page, page, result: events });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "Image does'nt exist" };
                if (req.user)
                    throw { message: "User is not granted" };
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "events");
                req.body.image = secure_url;
                const _b = req.body, { city, name_place, address } = _b, restBody = __rest(_b, ["city", "name_place", "address"]);
                console.log(req.body);
                let findCity = yield prisma_1.default.city.findFirst({
                    where: { city: { equals: city, mode: "insensitive" } },
                });
                let newCity = false;
                if (!findCity) {
                    findCity = yield prisma_1.default.city.create({
                        data: { city: `${city[0].toUpperCase()}${city.slice(1)}` },
                    });
                    newCity = true;
                }
                let findLocation = yield prisma_1.default.location.findFirst({
                    where: { address: { equals: address, mode: "insensitive" } },
                });
                if ((findLocation === null || findLocation === void 0 ? void 0 : findLocation.name_place) !== name_place || !findLocation || newCity) {
                    findLocation = yield prisma_1.default.location.create({
                        data: { name_place, address, city_id: findCity.id },
                    });
                }
                const organizer_id = (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id;
                if (restBody.coupon_seat) {
                    restBody.coupon_seat = Number(restBody.coupon_seat);
                }
                const { id } = yield prisma_1.default.event.create({
                    data: Object.assign(Object.assign({}, restBody), { location_id: findLocation.id, organizer_id }),
                });
                res
                    .status(200)
                    .send({ message: "Your event has been set", event_id: id });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { end_date, type } = req.query;
                const eventSelect = {
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
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    description: true,
                    terms_condition: true,
                };
                const event = yield prisma_1.default.event.findUnique({
                    where: { id: req.params.id },
                    select: Number(type)
                        ? { type: true }
                        : Number(end_date)
                            ? { end_date: true }
                            : eventSelect,
                });
                res.status(200).send({ result: event });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield prisma_1.default.event.findUnique({
                    where: { id: req.params.id },
                });
                res.status(200).send({ result: event });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventsDisplay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = {
                    AND: [{ Ticket: { some: {} } }, { end_date: { gte: new Date() } }],
                };
                const events = yield prisma_1.default.event.findMany({
                    take: 5,
                    where: filter,
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        start_date: true,
                        end_date: true,
                        type: true,
                        organizer: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                        Ticket: {
                            select: {
                                price: true,
                            },
                            orderBy: {
                                price: "asc",
                            },
                            take: 1,
                        },
                    },
                });
                res.status(200).send({ result: events });
            }
            catch (err) {
                console.log(err);
                res.status(200).send(err);
            }
        });
    }
}
exports.EventController = EventController;
