
//    
//	** ********************************************************************************
//	**  Era Definitions and Private Data
//	** ********************************************************************************
//	

import { Injectable } from "@angular/core";

const EpochOffset = {
    AmeteAlem: -285019,
    AmeteMihret: 1723856,
    Coptic: 1824665,
    Gregorian: 1721426,
    Unset: -1
};
const JD_EPOCH_OFFSET_AMETE_ALEM = -285019; // ዓ/ዓ
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856; // ዓ/ም
const JD_EPOCH_OFFSET_COPTIC = 1824665;
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;
const JD_EPOCH_OFFSET_UNSET = -1;

@Injectable({
    providedIn: 'root'
})
export class CustomDateConverter {
    gorgorianDate!: Date;
    ethiopianDate!: string;
    private _jdOffset = JD_EPOCH_OFFSET_UNSET;
    private _year = -1;
    private _month = -1;
    private _day = -1;
    private _dateIsUnset = true;

    private static nMonths = 12;

    private static monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //    
    //	** ********************************************************************************
    //	**  Constructors
    //	** ********************************************************************************
    //
    // constructor();
    // constructor(etDate?: string, gcDate?: Date) {
    //     if (etDate) {
    //         this.gorgorianDate = this.EthiopicToGregorian(etDate);
    //     } else if (gcDate) {
    //         this.ethiopianDate = this.GregorianToEthiopic(gcDate);
    //     }
    // }
    public set(year: number, month: number, day: number, era?: number): void {
        this._year = year;
        this._month = month;
        this._day = day;
        era ? this.setEra(era) : null;
        this._dateIsUnset = false;
    }

    public getDay(): number {
        return this._day;
    }

    public getMonth(): number {
        return this._month;
    }

    public getYear(): number {
        return this._year;
    }

    public getEra(): number {
        return this._jdOffset;
    }

    public getDate(): number[] {
        const date: number[] = [this._year, this._month, this._day, this._jdOffset];
        return date;
    }

    public setEra(era: number) {
        if ((JD_EPOCH_OFFSET_AMETE_ALEM == era) || (JD_EPOCH_OFFSET_AMETE_MIHRET == era)) {
            this._jdOffset = era;
        }
        else {
            throw (new Error("Unknown era: " + era + " must be either ዓ/ዓ or ዓ/ም."));
        }
    }

    isEraSet(): boolean {
        return (JD_EPOCH_OFFSET_UNSET == this._jdOffset) ? false : true;
    }
    public unsetEra(): void {
        this._jdOffset = JD_EPOCH_OFFSET_UNSET;
    }

    public unset(): void {
        this.unsetEra();
        this._year = -1;
        this._month = -1;
        this._day = -1;
        this._dateIsUnset = true;
    }

    public isDateSet(): boolean {
        return this._dateIsUnset ? false : true;
    }

    public getSplitted(etDate: string, pattern: string = "dd/mm/yyyy"): [number, number, number] {
        let day = 0, month = 0, year = 0;
        const patternList = pattern?.split('/') ?? [];
        const date = etDate.split('/');

        if (patternList.length === 1) {
            patternList.push(...patternList[0].split('-'));
        }

        if (date.length === 1) {
            date.push(...date[0].split('-'));
        }

        for (let i = 0; i < patternList.length; i++) {
            if (patternList[i] === 'mm') {
                month = parseInt(date[i]);
            } else if (patternList[i] === 'yyyy') {
                year = parseInt(date[i]);
            } else if (patternList[i] === 'dd') {
                day = parseInt(date[i]);
            } else {
                throw new Error('Invalid pattern');
            }
        }

        return [day, month, year];
    }
    //    
    //	** ********************************************************************************
    //	**  Conversion Methods To/From the Ethiopic & Gregorian Calendars
    //	** ********************************************************************************

    /// <summary>
    /// Converts Ethiopic date to Gregorian date. The Ethiopic date format should be dd/mm/yyyy
    /// </summary>
    /// <param name="etDate">Ethiopic date in dd/mm/yyyy format</param>
    /// <returns>Gregorian date in a DateTime instance</returns>



    public EthiopicToGregorian(date: string): Date;
    public EthiopicToGregorian(era: number): number[];
    public EthiopicToGregorian(options: { year: number; month: number; day: number; era?: number }): Date;
    public EthiopicToGregorian(param: string | number | { year?: number; month?: number; day?: number; era?: number }): Date | number[] {
        if (typeof param === 'string') {
            // Implementation for EthiopicToGregorian(string) overload
            let date = param.split('/');

            let day, month, year;
            if (date.length === 1) {
                date = date[0].split('-');
            }
            if (date.length !== 3) {
                throw new Error("Invalid date format");
            }

            day = parseInt(date[0]);
            month = parseInt(date[1]);
            year = parseInt(date[2]);

            const temp = this.EthiopicToGregorian({ year, month, day });

            const y = temp.getFullYear();
            const m = temp.getMonth();
            const d = temp.getDay();

            return new Date(Date.UTC(y, m - 1, d));
        }
        // Implementation for EthiopicToGregorian(era: number ) overload
        else if (typeof param === 'number') {

            if (this.isDateSet()) {
                throw new Error("Unset date.")
            } else {

                return this.EthiopicToGregorian({ year: this._year, month: this._month, day: this._day, era: param });
            }
        }
        else {
            // console.log("oooooo")
            // Implementation for other overloads ie : EthiopicToGregorian(options: { year: number; month: number; day: number; era?: number })
            const { year, month, day, era } = param;
            // let result;

            if (typeof year === 'undefined' || typeof month === 'undefined' || typeof day === 'undefined') {
                throw new Error("Invalid parameters");
            }

            if (typeof era !== 'undefined') {
                // console.log("for et");
                this.setEra(era);
                var result = this.EthiopicToGregorian({ year: year, month: month, day: day, era: this.getEra() });
                this.unsetEra();
                return result;
            } else {

                if (!this.isEraSet()) {

                    if (param.year! <= 0) {

                        this.setEra(JD_EPOCH_OFFSET_AMETE_ALEM);

                    } else {

                        this.setEra(JD_EPOCH_OFFSET_AMETE_MIHRET);
                    }
                }
                let jdn = this.EthiopicToJdn({ year: param.year!, month: param.month!, day: param.day! });
                const date = this.JdnToGregorian(jdn);
                return new Date(Date.UTC(date[0], date[1], date[2]));
            }
            // return result;
        }
    }

    // ##########
    public GregorianToEthiopic(): string;
    public GregorianToEthiopic(gcDate: Date): number[];
    public GregorianToEthiopic(options: { year: number, month: number, day: number }): number[];
    public GregorianToEthiopic(param?: Date | { year: number, month: number, day: number }): string | number[] {
        // first overload - GregorianToEthiopic()
        if (param === undefined) {
            if (this._dateIsUnset) {
                return this.GregorianToEthiopic(new Date());
            }
            return this.GregorianToEthiopic({ year: this._year, month: this._month, day: this._day });
        }
        // second overload - GregorianToEthiopic(gcDate: Date)
        else if (param instanceof Date) {
            try {
                const date = this.GregorianToEthiopic({ year: param.getFullYear(), month: param.getMonth() + 1, day: param.getDate() });
                // const result = `${date[2]}/${date[1]}/${date[0]}`;
                // return result;
                return date;
            } catch (error) {
                throw error;
            }
        }
        //third overload - GregorianToEthiopic(options: { year: number, month: number, day: number })
        else {

            const jdn = this.GregorianToJdn(param.year, param.month, param.day);
            return this.JdnToEthiopic(jdn, this.GuessEraFromJDN(jdn));
        }
    }

    //    
    //	** ********************************************************************************
    //	**  Conversion Methods To/From the Julian Day Number
    //	** ********************************************************************************
    //



    private Quotient(i: number, j: number): number {
        return Math.floor(i / j);
    }

    private Mod(i: number, j: number): number {
        return i - j * this.Quotient(i, j);
    }

    private GuessEraFromJDN(jdn: number): number {
        return jdn >= JD_EPOCH_OFFSET_AMETE_MIHRET + 365 ? JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
    }

    private IsGregorianLeap(year: number): boolean {
        return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
    }

    public JdnToGregorian(j: number): number[] {

        const r2000 = this.Mod(j - JD_EPOCH_OFFSET_GREGORIAN, 730485);
        const r400 = this.Mod(j - JD_EPOCH_OFFSET_GREGORIAN, 146097);
        const r100 = this.Mod(r400, 36524);
        const r4 = this.Mod(r100, 1461);

        let n = this.Mod(r4, 365) + 365 * this.Quotient(r4, 1460);
        const s = this.Quotient(r4, 1095);

        const aprime = 400 * this.Quotient(j - JD_EPOCH_OFFSET_GREGORIAN, 146097) + 100 * this.Quotient(r400, 36524) + 4 * this.Quotient(r100, 1461) + this.Quotient(r4, 365) - this.Quotient(r4, 1460) - this.Quotient(r2000, 730484);
        const year = aprime + 1;
        const t = this.Quotient(364 + s - n, 306);
        let month = t * (this.Quotient(n, 31) + 1) + (1 - t) * (this.Quotient(5 * (n - s) + 13, 153) + 1);

        n += 1 - this.Quotient(r2000, 730484);
        let day = n;

        if (r100 === 0 && n === 0 && r400 !== 0) {
            month = 12;
            day = 31;
        } else {

            CustomDateConverter.monthDays[2] = this.IsGregorianLeap(year) ? 29 : 28;
            for (let i = 1; i <= CustomDateConverter.nMonths; ++i) {
                if (n <= CustomDateConverter.monthDays[i]) {
                    day = n;
                    break;
                }
                n -= CustomDateConverter.monthDays[i];
            }
        }

        const output: number[] = [year, month, day];
        return output;
    }

    public GregorianToJdn(year: number, month: number, day: number): number {

        const s = this.Quotient(year, 4) - this.Quotient(year - 1, 4) - this.Quotient(year, 100) + this.Quotient(year - 1, 100) + this.Quotient(year, 400) - this.Quotient(year - 1, 400);
        const t = this.Quotient(14 - month, 12);
        const n = 31 * t * (month - 1) + (1 - t) * (59 + s + 30 * (month - 3) + this.Quotient(3 * month - 7, 5)) + day - 1;

        const j = JD_EPOCH_OFFSET_GREGORIAN + 365 * (year - 1) + this.Quotient(year - 1, 4) - this.Quotient(year - 1, 100) + this.Quotient(year - 1, 400) + n;

        return j;
    }

    toTwoDigits(num: number) {
        return num.toString().padStart(2, '0');
    }

    public JdnToEthiopic(jdn: number, era?: number): number[] {
        era = era ?? (this.isEraSet() ? this._jdOffset : this.GuessEraFromJDN(jdn))
        const r = this.Mod(jdn - era, 1461);
        const n = this.Mod(r, 365) + 365 * this.Quotient(r, 1460);

        const year = 4 * this.Quotient(jdn - era, 1461) + this.Quotient(r, 365) - this.Quotient(r, 1460);
        const month = this.toTwoDigits(this.Quotient(n, 30) + 1);
        const day = this.toTwoDigits(this.Mod(n, 30) + 1);
        this.set(year, Number(month), Number(day));
        return [year, Number(month), Number(day)];
    }

    ///    
    ///	 <summary>
    ///  Computes the Julian day number of the given Coptic or Ethiopic date.
    ///	 This method assumes that the JDN epoch offset has been set. This method
    ///	 is called by copticToGregorian and ethiopicToGregorian which will set
    ///	 the jdn offset context.
    ///	 </summary>
    ///	 <param name="year"> a year in the Ethiopic calendar </param>
    ///	 <param name="month"> a month in the Ethiopic calendar </param>
    ///	 <param name="date"> a date in the Ethiopic calendar
    ///	 </param>
    ///	 <returns> The Julian Day Number (JDN) </returns>
    ///	 
    EthCopticToJdn(year: number, month: number, day: number, era: number): number {
        var jdn = (era + 365) + 365 * (year - 1) + this.Quotient(year, 4) + 30 * month + day - 31;

        return jdn;
    }
    EthiopicToJdn(): number;
    EthiopicToJdn(era: number): number;
    EthiopicToJdn(options: { year: number, month: number, day: number, era?: number }): number;
    EthiopicToJdn(param?: number | { year: number, month: number, day: number, era?: number }): number {

        if (param === undefined) {

            if (this._dateIsUnset) throw Error("unset date")
            else return this.EthiopicToJdn({ year: this._year, month: this._month, day: this._day })
        }
        else if (typeof param === "number") {

            return this.EthiopicToJdn({ year: this._year, month: this._month, day: this._day, era: param });

        } else {

            if (param.era === undefined) {

                return (this.isEraSet()) ? this.EthCopticToJdn(param.year, param.month, param.day, this._jdOffset) : this.EthCopticToJdn(param.year, param.month, param.day, JD_EPOCH_OFFSET_AMETE_MIHRET);
            } else {
                return this.EthCopticToJdn(param.year, param.month, param.day, param.era);
            }
        }

    }


    //    
    //	** ********************************************************************************
    //	**  Methods for the Coptic Calendar
    //	** ********************************************************************************

    public CopticToGregorian(param?: { year: number, month: number, day: number }): number[] {
        if (param === undefined) {
            if (this._dateIsUnset) throw Error("Unset date")
            param = { year: this._year, month: this._month, day: this._day }
        }

        this.setEra(JD_EPOCH_OFFSET_COPTIC);
        const jdn: number = this.EthiopicToJdn({ year: param.year, month: param.month, day: param.day });
        return this.JdnToGregorian(jdn);

    }



    public GregorianToCoptic(param?: { year: number, month: number, day: number }): number[] {
        if (param === undefined) {
            if (this._dateIsUnset) throw Error("Unset date")
            param = { year: this._year, month: this._month, day: this._day }
        }
        this.setEra(JD_EPOCH_OFFSET_COPTIC);
        const jdn: number = this.GregorianToJdn(param.year, param.month, param.day);
        return this.JdnToEthiopic(jdn);
    }

    public CopticToJdn(year: number, month: number, day: number): number {
        return this.EthCopticToJdn(year, month, day, JD_EPOCH_OFFSET_COPTIC);
    }
}



export class EthiopicDateTime {
    private _incomingDay!: number;
    private _incomingMonth!: number;
    private _incomingYear!: number;
    private _incomingEra!: number;

    private _day!: number;
    private _month!: number;
    private _year!: number;
    private _era!: number;
    private _dayOfWeek!: string;

    public get Day(): number {
        return this._day;
    }

    public get Month(): number {
        return this._month;
    }

    public get Year(): number {
        return this._year;
    }

    private ec: CustomDateConverter = new CustomDateConverter();
    private monthNames: string[] = [
        "መስከረም",
        "ጥቅምት",
        "ኅዳር",
        "ታህሣሥ",
        "ጥር",
        "የካቲት",
        "መጋቢት",
        "ሚያዝያ",
        "ግንቦት",
        "ሰኔ",
        "ሐምሌ",
        "ነሐሴ",
        "ጳጉሜ",
    ];

    private monthNamesOr: string[] = [
        "Fulbaana",
        "Onkololeessa",
        "Sadaasa",
        "Mudde",
        "Amajjii",
        "Gurraandhala",
        "Bitootessa",
        "Eebla",
        "Caamsaa",
        "Waxabajjii",
        "Adoolessa",
        "Hagayya",
        "Qaam'ee",
    ];

    private dayNames: string[] = [
        "እሑድ",
        "ሰኞ",
        "ማክሰኞ",
        "ረቡዕ",
        "ሓሙስ",
        "ዓርብ",
        "ቅዳሜ",
    ];

    private eraNames: string[] = ["ዓ/ም", "ዓ/ዓ"];
    public month!: string;
    constructor(gcDateTime: Date);
    constructor(month: number, lang: string);
    constructor(day: number, month: number, year: number);
    constructor(dateString: string);
    constructor(
        arg1: Date | number | string,
        arg2?: number | string,
        arg3?: number,
        arg4?: number
    ) {
        if (typeof arg1 === "object" && arg1 instanceof Date) {
            const gcDateTime: Date = arg1;
            this._incomingDay = gcDateTime.getDate();
            this._incomingMonth = gcDateTime.getMonth() + 1;
            this._incomingYear = gcDateTime.getFullYear();
            this._incomingEra = JD_EPOCH_OFFSET_AMETE_MIHRET;
            this._dayOfWeek = this.getETDayOfWeek(gcDateTime);

            this.doConversion();
        } else if (typeof arg1 === "number" && typeof arg2 === "string") {
            const month: number = arg1;
            const lang: string = arg2;

            this.month = this.getETMonthNameAm(month, lang);
        } else if (
            typeof arg1 === "number" &&
            typeof arg2 === "number" &&
            typeof arg3 === "number"
        ) {
            const day: number = arg1;
            const month: number = arg2;
            const year: number = arg3;

            this._incomingDay = day;
            this._incomingMonth = month;
            this._incomingYear = year;

            this.doConversion();
        } else if (typeof arg1 === "string") {
            const dateString: string = arg1;

            try {
                const items: string[] = dateString.split("/");
                if (items.length === 3) {
                    this._incomingDay = parseInt(items[0], 10);
                    this._incomingMonth = parseInt(items[1], 10);
                    this._incomingYear = parseInt(items[2], 10);
                    this.doConversion();
                }
            } catch (e) {
                throw new Error("Invalid date supplied.");
            }
        }
    }

    private getETDayOfWeek(gcDateTime: Date): string {
        let dow = "";

        switch (gcDateTime.getDay()) {
            case 0:
                dow = this.dayNames[0];
                break;
            case 1:
                dow = this.dayNames[1];
                break;
            case 2:
                dow = this.dayNames[2];
                break;
            case 3:
                dow = this.dayNames[3];
                break;
            case 4:
                dow = this.dayNames[4];
                break;
            case 5:
                dow = this.dayNames[5];
                break;
            case 6:
                dow = this.dayNames[6];
                break;
        }
        return dow;
    }

    private getETMonthName(month: number): string {
        return this.monthNames[month - 1];
    }

    public getETMonthNameAm(month: number, lang: string): string {
        if (lang === "or") {
            return this.monthNamesOr[month - 1];
        } else {
            return this.monthNames[month - 1];
        }
    }

    private doConversion(): void {
        const result = this.ec.GregorianToEthiopic(
            {
                year: this._incomingYear,
                month: this._incomingMonth,
                day: this._incomingDay
            }
        );
        this._year = result[0];
        this._month = result[1];
        this._day = result[2];
    }

    public toGcDate(): Date {
        const result = this.ec.EthiopicToGregorian(
            {
                year: this._incomingYear,
                month: this._incomingMonth,
                day: this._incomingDay
            }
        );
        const year = result.getFullYear();
        const month = result.getMonth();
        const day = result.getDay();
        return new Date(Date.UTC(year, month - 1, day));
    }

    public static get Now(): EthiopicDateTime {
        return new EthiopicDateTime(new Date());
    }

    public toString(): string {
        return `${this._dayOfWeek} ${this.getETMonthName(
            this._month
        )} ${this._day} ${this._year} ${this.eraNames[0]}`;
    }

    public toShortDate(): string {
        return `${this._day} ${this._month} ${this._year}`;
    }

    public toMonthAndYearName(): string {
        return `${this.getETMonthName(this._month)} ${this._year}`;
    }
}
