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
const JD_EPOCH_OFFSET_UNSET: number = -1;

export function toGregorian(param: { year: number, month: number, day: number }): Date {
    const { year, month, day } = param;

    const era: number = year <= 0 ? JD_EPOCH_OFFSET_AMETE_ALEM : JD_EPOCH_OFFSET_AMETE_MIHRET;

    let jdn = EthiopicToJdn({ year: param.year, month: param.month, day: param.day, era });
    const date = JdnToGregorian(jdn);
    // console.log('f-date', date);
    return new Date(Date.UTC(date[0], date[1] - 1, date[2]));
}

export function toEthiopian(gcDate: Date): { year: number, month: number, day: number } {
    console.log('selected date', gcDate.getFullYear(), gcDate.getMonth() + 1, gcDate.getDate());
    const jdn = GregorianToJdn(gcDate.getFullYear(), gcDate.getMonth() + 1, gcDate.getDate());
    return JdnToEthiopic(jdn, GuessEraFromJDN(jdn));
}

function Quotient(i: number, j: number): number {
    return Math.floor(i / j);
}

function Mod(i: number, j: number): number {
    return i - j * Quotient(i, j);
}
function GuessEraFromJDN(jdn: number): number {
    return (jdn >= (JD_EPOCH_OFFSET_AMETE_MIHRET + 365)) ? JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
}

function IsGregorianLeap(year: number): boolean {
    return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
}

function GregorianToJdn(year: number, month: number, day: number): number {
    const s = Quotient(year, 4) - Quotient(year - 1, 4) - Quotient(year, 100) + Quotient(year - 1, 100) + Quotient(year, 400) - Quotient(year - 1, 400);

    const t = Quotient(14 - month, 12);

    const n = 31 * t * (month - 1) + (1 - t) * (59 + s + 30 * (month - 3) + Quotient((3 * month - 7), 5)) + day - 1;

    const j = JD_EPOCH_OFFSET_GREGORIAN + 365 * (year - 1) + Quotient(year - 1, 4) - Quotient(year - 1, 100) + Quotient(year - 1, 400) + n;

    return j;
}

function JdnToEthiopic(jdn: number, era?: number): { year: number, month: number, day: number } {
    era = era ?? GuessEraFromJDN(jdn);
    const r = Mod((jdn - era), 1461);
    const n = Mod(r, 365) + 365 * Quotient(r, 1460);

    const year = 4 * Quotient((jdn - era), 1461) + Quotient(r, 365) - Quotient(r, 1460);;
    const month = Quotient(n, 30) + 1;
    const day = Mod(n, 30) + 1;
    return { year, month: Number(month), day: Number(day) };
}

function EthCopticToJdn(year: number, month: number, day: number, era: number): number {
    return (era + 365) + 365 * (year - 1) + Quotient(year, 4) + 30 * month + day - 31;
}

function JdnToGregorian(j: number): number[] {
    const r2000: number = Mod((j - JD_EPOCH_OFFSET_GREGORIAN), 730485);
    const r400: number = Mod((j - JD_EPOCH_OFFSET_GREGORIAN), 146097);
    const r100: number = Mod(r400, 36524);
    const r4: number = Mod(r100, 1461);

    let n: number = Mod(r4, 365) + 365 * Quotient(r4, 1460);
    const s: number = Quotient(r4, 1095);

    const aprime: number = 400 * Quotient((j - JD_EPOCH_OFFSET_GREGORIAN), 146097) + 100 * Quotient(r400, 36524) + 4 * Quotient(r100, 1461) + Quotient(r4, 365) - Quotient(r4, 1460) - Quotient(r2000, 730484);;
    const year: number = aprime + 1;
    const t: number = Quotient((364 + s - n), 306);
    const month: number = t * (Quotient(n, 31) + 1) + (1 - t) * (Quotient((5 * (n - s) + 13), 153) + 1);
    //        
    //		int day    = t * ( n - s - 31*month + 32 )
    //		           + ( 1 - t ) * ( n - s - 30*month - quotient((3*month - 2), 5) + 33 )
    //		;
    //		

    // int n2000 = quotient( r2000, 730484 );
    n += 1 - Quotient(r2000, 730484);
    let day = n;

    if ((r100 == 0) && (n == 0) && (r400 != 0)) {
        let month = 12;
        day = 31;
    }
    else {
        monthDays[2] = (IsGregorianLeap(year)) ? 29 : 28;
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

function EthiopicToJdn(param: { year: number, month: number, day: number, era: number }): number {
    return EthCopticToJdn(param.year, param.month, param.day, param.era);
}

function CopticToGregorian(year: number, month: number, day: number): number[] {
    let jdn = EthiopicToJdn({ year, month, day, era: JD_EPOCH_OFFSET_COPTIC });
    return JdnToGregorian(jdn);
}

function GregorianToCoptic(year: number, month: number, day: number): { year: number, month: number, day: number } {
    let jdn = GregorianToJdn(year, month, day);
    return JdnToEthiopic(jdn, JD_EPOCH_OFFSET_COPTIC);
}

function CopticToJdn(year: number, month: number, day: number): number {
    return EthCopticToJdn(year, month, day, JD_EPOCH_OFFSET_COPTIC);
}