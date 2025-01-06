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
exports.findUser = void 0;
exports.generateReferralCode = generateReferralCode;
const prisma_1 = __importDefault(require("../prisma"));
const crypto_1 = __importDefault(require("crypto"));
const findUser = (full_name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { OR: [{ full_name: full_name }, { email: email }] },
    });
    return user;
});
exports.findUser = findUser;
function generateReferralCode() {
    return crypto_1.default.randomBytes(6).toString("hex").toUpperCase();
}
