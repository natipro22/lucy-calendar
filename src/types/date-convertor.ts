import { Injectable } from "@angular/core";
import { error } from "console";

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
@Injectable({
    providedIn: 'root'
})
export class EthioDate {
    //    
    //	** ********************************************************************************
    //	**  Era Definitions and Private Data
    //	** ********************************************************************************
    //	

    private _jdOffset: number = JD_EPOCH_OFFSET_UNSET;

    // private _year: number = -1;
    // private _month: number = -1;
    // private _day: number = -1;
    private _dateIsUnset: boolean = true;

    //    
    //	** ********************************************************************************
    //	**  Constructors
    //	** ********************************************************************************
    //	

    // public SetEra(era: number): void {
    //     if ((JD_EPOCH_OFFSET_AMETE_ALEM == era) || (JD_EPOCH_OFFSET_AMETE_MIHRET == era)) {
    //         this._jdOffset = era;
    //     }
    //     else {
    //         throw Error("Unknown era: " + era + " must be either ዓ/ዓ or ዓ/ም.");
    //     }
    // }

    // public IsEraSet(): boolean {
    //     return (JD_EPOCH_OFFSET_UNSET == this._jdOffset) ? false : true;
    // }

    // public UnSetEra(): void {
    //     this._jdOffset = JD_EPOCH_OFFSET_UNSET;
    // }

    // public UnSet(): void {
    //     this.UnSetEra();
    //     this._dateIsUnset = true;
    // }

    // public IsDateSet(): boolean {
    //     return (this._dateIsUnset) ? false : true;
    // }

    public toEthiopian(gcDate: Date): number[] {
        let jdn = this.GregorianToJdn(gcDate.getFullYear(), gcDate.getMonth(), gcDate.getDay());
        return this.JdnToEthiopic(jdn, this.GuessEraFromJDN(jdn));
    }

    public toGregorian(param: { year: number, month: number, day: number }): Date {
        // console.log('input', param);
        // console.log("oooooo")
        // Implementation for other overloads ie : EthiopicToGregorian(options: { year: number; month: number; day: number; era?: number })
        const { year, month, day } = param;
        // let result;

        if (typeof year === 'undefined' || typeof month === 'undefined' || typeof day === 'undefined') {
            throw new Error("Invalid parameters");
        }

        const era: number = year <= 0 ? JD_EPOCH_OFFSET_AMETE_ALEM : JD_EPOCH_OFFSET_AMETE_MIHRET;

        let jdn = this.EthiopicToJdn({ year: param.year, month: param.month, day: param.day, era });
        const date = this.JdnToGregorian(jdn);
        // console.log('f-date', date);
        return new Date(Date.UTC(date[0], date[1] - 1, date[2]));
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
        return (jdn >= (JD_EPOCH_OFFSET_AMETE_MIHRET + 365)) ? JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
    }

    private IsGregorianLeap(year: number): boolean {
        return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
    }

    public JdnToGregorian(j: number): number[] {
        const r2000: number = this.Mod((j - JD_EPOCH_OFFSET_GREGORIAN), 730485);
        const r400: number = this.Mod((j - JD_EPOCH_OFFSET_GREGORIAN), 146097);
        const r100: number = this.Mod(r400, 36524);
        const r4: number = this.Mod(r100, 1461);

        let n: number = this.Mod(r4, 365) + 365 * this.Quotient(r4, 1460);
        const s: number = this.Quotient(r4, 1095);

        const aprime: number = 400 * this.Quotient((j - JD_EPOCH_OFFSET_GREGORIAN), 146097) + 100 * this.Quotient(r400, 36524) + 4 * this.Quotient(r100, 1461) + this.Quotient(r4, 365) - this.Quotient(r4, 1460) - this.Quotient(r2000, 730484);;
        const year: number = aprime + 1;
        const t: number = this.Quotient((364 + s - n), 306);
        const month: number = t * (this.Quotient(n, 31) + 1) + (1 - t) * (this.Quotient((5 * (n - s) + 13), 153) + 1);
        //        
        //		int day    = t * ( n - s - 31*month + 32 )
        //		           + ( 1 - t ) * ( n - s - 30*month - this.quotient((3*month - 2), 5) + 33 )
        //		;
        //		

        // int n2000 = this.quotient( r2000, 730484 );
        n += 1 - this.Quotient(r2000, 730484);
        let day = n;

        if ((r100 == 0) && (n == 0) && (r400 != 0)) {
            let month = 12;
            day = 31;
        }
        else {
            monthDays[2] = (this.IsGregorianLeap(year)) ? 29 : 28;
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

    public GregorianToJdn(year: number, month: number, day: number): number {
        const s = this.Quotient(year, 4) - this.Quotient(year - 1, 4) - this.Quotient(year, 100) + this.Quotient(year - 1, 100) + this.Quotient(year, 400) - this.Quotient(year - 1, 400);;

        const t = this.Quotient(14 - month, 12);

        const n = 31 * t * (month - 1) + (1 - t) * (59 + s + 30 * (month - 3) + this.Quotient((3 * month - 7), 5)) + day - 1;

        const j = JD_EPOCH_OFFSET_GREGORIAN + 365 * (year - 1) + this.Quotient(year - 1, 4) - this.Quotient(year - 1, 100) + this.Quotient(year - 1, 400) + n;

        return j;
    }

    public JdnToEthiopic(jdn: number, era?: number): number[] {
        era = era ?? this.GuessEraFromJDN(jdn);
        const r = this.Mod((jdn - era), 1461);
        const n = this.Mod(r, 365) + 365 * this.Quotient(r, 1460);

        const year = 4 * this.Quotient((jdn - era), 1461) + this.Quotient(r, 365) - this.Quotient(r, 1460);;
        const month = this.Quotient(n, 30) + 1;
        const day = this.Mod(n, 30) + 1;
        // this.set(year, Number(month), Number(day));
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
    private EthCopticToJdn(year: number, month: number, day: number, era: number): number {
        return (era + 365) + 365 * (year - 1) + this.Quotient(year, 4) + 30 * month + day - 31;
    }

    EthiopicToJdn(param: { year: number, month: number, day: number, era: number }): number {
        return this.EthCopticToJdn(param.year, param.month, param.day, param.era);
    }

    //    
    //	** ********************************************************************************
    //	**  Methods for the Coptic Calendar
    //	** ********************************************************************************
    //	
    //JAVA TO VB & C# CONVERTER WARNING: Method 'throws' clauses are not available in .NET:
    //ORIGINAL LINE: public int[] copticToGregorian() throws java.lang.ArithmeticException

    public CopticToGregorian(year: number, month: number, day: number): number[] {
        let jdn = this.EthiopicToJdn({ year, month, day, era: JD_EPOCH_OFFSET_COPTIC });
        return this.JdnToGregorian(jdn);
    }

    //JAVA TO VB & C# CONVERTER WARNING: Method 'throws' clauses are not available in .NET:
    //ORIGINAL LINE: public int[] gregorianToCoptic() throws java.lang.ArithmeticException
    public GregorianToCoptic(year: number, month: number, day: number): number[] {
        let jdn = this.GregorianToJdn(year, month, day);
        return this.JdnToEthiopic(jdn, JD_EPOCH_OFFSET_COPTIC);
    }

    public CopticToJdn(year: number, month: number, day: number): number {
        return this.EthCopticToJdn(year, month, day, JD_EPOCH_OFFSET_COPTIC);
    }
}