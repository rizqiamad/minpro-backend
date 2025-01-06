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
exports.UserAuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = require("bcrypt");
const user_services_1 = require("../services/user.services");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailer_1 = require("../services/mailer");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
class UserAuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword, full_name, email, dob, jenis_kelamin, no_handphone, ref_code, } = req.body;
                // Validate passwords match
                if (password !== confirmPassword)
                    throw { message: "Passwords do not match" };
                // Check if the user already exists
                const user = yield (0, user_services_1.findUser)(full_name, email);
                if (user)
                    throw { message: "Username or email has already been used" };
                // Hash the password
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                // Create the new user
                const newUser = yield prisma_1.default.user.create({
                    data: {
                        password: hashPassword,
                        full_name,
                        email,
                        dob,
                        jenis_kelamin,
                        no_handphone,
                        ref_code: null, // Clear the referral code for the new user
                        refer_by: ref_code, // Save the ID of the referring user
                    },
                });
                // Generate a verification token
                const payload = { id: newUser.id, role: "user" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "24h" });
                // Verification email link
                const link = `${process.env.BASE_URL_FE}verify/user/${token}`;
                // Compile the email template
                const templatePath = path_1.default.join(__dirname, "../templates", "verifyUser.html");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ full_name: req.body.full_name, link });
                // Send verification email
                yield mailer_1.transporter.sendMail({
                    from: "loket.com",
                    to: req.body.email,
                    subject: "Selamat Datang di loket.com",
                    html,
                });
                // Respond to the client
                res.status(201).send({
                    message: "Registration successful, please check your email to verify",
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const user = yield (0, user_services_1.findUser)(data, data);
                if (!user)
                    throw { message: "Account not found" };
                if (!user.isVerified)
                    throw { message: "Your account is not verified yet" };
                const isValidPass = yield (0, bcrypt_1.compare)(password, user.password);
                if (!isValidPass)
                    throw { message: "Incorrect password" };
                const payload = { id: user.id, role: "user" };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "24h" });
                res.status(200).send({
                    message: "Login User success",
                    token,
                    user,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                console.log(token);
                const verifiedUser = ((0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY));
                console.log(verifiedUser);
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: verifiedUser.id },
                });
                if (!user)
                    throw new Error("User not found");
                if (user.refer_by) {
                    const referringUser = yield prisma_1.default.user.findFirst({
                        where: { AND: [{ ref_code: user.refer_by }, { isVerified: true }] },
                    });
                    if (!referringUser)
                        throw new Error("Invalid or expired referral code");
                    // Add 10,000 points t the referring user
                    yield prisma_1.default.point.create({
                        data: {
                            user_id: referringUser.id,
                            total: 10000,
                            active: true,
                            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Set expiry date
                        },
                    });
                    // Create a coupon for the verified user
                    yield prisma_1.default.coupon.create({
                        data: {
                            user_id: user.id,
                            active: true,
                            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
                        },
                    });
                }
                yield prisma_1.default.user.update({
                    where: { id: verifiedUser.id },
                    data: { isVerified: true, ref_code: (0, user_services_1.generateReferralCode)() },
                });
                res
                    .status(200)
                    .send({ message: "Account has been verified and code is generated" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.UserAuthController = UserAuthController;
