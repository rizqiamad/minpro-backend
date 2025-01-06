"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatMonth = void 0;
const FormatMonth = (num) => {
    const month = [
        "January",
        "February",
        "March",
        "April",
        "Mei",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return month[num];
};
exports.FormatMonth = FormatMonth;
