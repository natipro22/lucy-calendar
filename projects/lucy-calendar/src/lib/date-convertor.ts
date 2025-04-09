import { Injectable } from "@angular/core";

enum EpochOffset {
    AmeteAlem = -285019,
    AmeteMihret = 1723856,
    Coptic = 1824665,
    Gregorian = 1721426,
    Unset = -1
}
const nMonths: number = 12;

const monthDays: number[] = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const JD_EPOCH_OFFSET_AMETE_ALEM: number = -285019; // ዓ/ዓ
const JD_EPOCH_OFFSET_AMETE_MIHRET: number = 1723856; // ዓ/ም
const JD_EPOCH_OFFSET_COPTIC: number = 1824665;
const JD_EPOCH_OFFSET_GREGORIAN: number = 1721426;

export const monthNames: string[] = [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚይዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];
export const dayNames: string[] = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];


export function toGregorian(param: { year: number, month: number, day: number }): Date {
    const { year, month, day } = param;

    const era: number = year <= 0 ? JD_EPOCH_OFFSET_AMETE_ALEM : JD_EPOCH_OFFSET_AMETE_MIHRET;

    let jdn = ethiopicToJdn({ year, month, day, era });
    const date = jdnToGregorian(jdn);
    return new Date(Date.UTC(date[0], date[1] - 1, date[2]));
}

export function toEthiopian(gcDate: Date): { year: number, month: number, day: number } {
    const jdn = gregorianToJdn(gcDate.getFullYear(), gcDate.getMonth() + 1, gcDate.getDate());
    return jdnToEthiopic(jdn, guessEraFromJDN(jdn));
}

function quotient(i: number, j: number): number {
    return Math.floor(i / j);
}

function mod(i: number, j: number): number {
    return i - j * quotient(i, j);
}
function guessEraFromJDN(jdn: number): number {
    return (jdn >= (JD_EPOCH_OFFSET_AMETE_MIHRET + 365)) ? JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
}
export function isEthiopianLeapYear(year: number) {
    return year % 4 === 3; // Ethiopian leap years are multiples of 4 with a remainder of 3
}
function isGregorianLeap(year: number): boolean {
    return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
}

function gregorianToJdn(year: number, month: number, day: number): number {
    const s = quotient(year, 4) - quotient(year - 1, 4) - quotient(year, 100) + quotient(year - 1, 100) + quotient(year, 400) - quotient(year - 1, 400);

    const t = quotient(14 - month, 12);

    const n = 31 * t * (month - 1) + (1 - t) * (59 + s + 30 * (month - 3) + quotient((3 * month - 7), 5)) + day - 1;

    const j = JD_EPOCH_OFFSET_GREGORIAN + 365 * (year - 1) + quotient(year - 1, 4) - quotient(year - 1, 100) + quotient(year - 1, 400) + n;

    return j;
}

function jdnToEthiopic(jdn: number, era?: number): { year: number, month: number, day: number } {
    era = era ?? guessEraFromJDN(jdn);
    const r = mod((jdn - era), 1461);
    const n = mod(r, 365) + 365 * quotient(r, 1460);

    const year = 4 * quotient((jdn - era), 1461) + quotient(r, 365) - quotient(r, 1460);;
    const month = quotient(n, 30) + 1;
    const day = mod(n, 30) + 1;
    return { year, month: Number(month), day: Number(day) };
}

function ethCopticToJdn(year: number, month: number, day: number, era: number): number {
    return (era + 365) + 365 * (year - 1) + quotient(year, 4) + 30 * month + day - 31;
}

function jdnToGregorian(j: number): number[] {
    const r2000: number = mod((j - JD_EPOCH_OFFSET_GREGORIAN), 730485);
    const r400: number = mod((j - JD_EPOCH_OFFSET_GREGORIAN), 146097);
    const r100: number = mod(r400, 36524);
    const r4: number = mod(r100, 1461);

    let n: number = mod(r4, 365) + 365 * quotient(r4, 1460);
    const s: number = quotient(r4, 1095);

    const aprime: number = 400 * quotient((j - JD_EPOCH_OFFSET_GREGORIAN), 146097) + 100 * quotient(r400, 36524) + 4 * quotient(r100, 1461) + quotient(r4, 365) - quotient(r4, 1460) - quotient(r2000, 730484);;
    const year: number = aprime + 1;
    const t: number = quotient((364 + s - n), 306);
    const month: number = t * (quotient(n, 31) + 1) + (1 - t) * (quotient((5 * (n - s) + 13), 153) + 1);

    n += 1 - quotient(r2000, 730484);
    let day = n;

    if ((r100 == 0) && (n == 0) && (r400 != 0)) {
        let month = 12;
        day = 31;
    }
    else {
        monthDays[2] = (isGregorianLeap(year)) ? 29 : 28;
        for (let i = 1; i <= nMonths; ++i) {
            if (n <= monthDays[i]) {
                day = n;
                break;
            }
            n -= monthDays[i];
        }
    }

    return [year, month, day];
}

function ethiopicToJdn(param: { year: number, month: number, day: number, era: number }): number {
    return ethCopticToJdn(param.year, param.month, param.day, param.era);
}

function copticToGregorian(year: number, month: number, day: number): number[] {
    let jdn = ethiopicToJdn({ year, month, day, era: JD_EPOCH_OFFSET_COPTIC });
    return jdnToGregorian(jdn);
}

function gregorianToCoptic(year: number, month: number, day: number): { year: number, month: number, day: number } {
    let jdn = gregorianToJdn(year, month, day);
    return jdnToEthiopic(jdn, JD_EPOCH_OFFSET_COPTIC);
}

function copticToJdn(year: number, month: number, day: number): number {
    return ethCopticToJdn(year, month, day, JD_EPOCH_OFFSET_COPTIC);
}