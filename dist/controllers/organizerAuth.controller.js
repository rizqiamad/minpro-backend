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
exports.OrganizerAuthController = void 0;
const path_1 = __importDefault(require("path"));
const bcrypt_1 = require("bcrypt");
const organizer_services_1 = require("../services/organizer.services");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailer_1 = require("../services/mailer");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const prisma_1 = __importDefault(require("../prisma"));
class OrganizerAuthController {
    registerOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword, organizer_name, email, no_handphone } = req.body;
                if (password != confirmPassword)
                    throw "Password not match";
                const user = yield (0, organizer_services_1.findOrganizer)(organizer_name, email);
                if (user)
                    throw "organizer name or email has been used";
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                const newOrganizer = yield prisma_1.default.organizer.create({
                    data: {
                        password: hashPassword,
                        name: organizer_name,
                        email,
                        no_handphone,
                    },
                });
                const payload = { id: newOrganizer.id, role: "organizer" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "24h" });
                const link = `${process.env.BASE_URL_FE}verify/organizer/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "verifyOrganizer.html");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({
                    organizer_name: req.body.organizer_name,
                    link,
                });
                yield mailer_1.transporter.sendMail({
                    from: "loket.com",
                    to: email,
                    subject: "Welcome to loket.com",
                    html,
                });
                res
                    .status(201)
                    .send({ message: "Register User success, check your email to verify" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    loginOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const organizer = yield prisma_1.default.organizer.findFirst({
                    where: { OR: [{ name: data }, { email: data }] },
                });
                if (!organizer)
                    throw { message: "Organizer not found" };
                if (!organizer.isVerified)
                    throw { message: "Your account is not verified yet" };
                const isValidPass = yield (0, bcrypt_1.compare)(password, organizer.password);
                if (!isValidPass)
                    throw { message: "Incorrect password" };
                const payload = { id: organizer.id, role: "organizer" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "24h" });
                res.status(200).send({
                    message: "Login Organizer success",
                    token,
                    organizer,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    verifyOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const verifiedOrganizer = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
                yield prisma_1.default.organizer.update({
                    data: { isVerified: true },
                    where: { id: verifiedOrganizer.id },
                });
                res.status(200).send({ message: "Account has been verified" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.OrganizerAuthController = OrganizerAuthController;
