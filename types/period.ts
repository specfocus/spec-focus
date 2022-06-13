export const PERIOD_DAILY = "daily";
export const PERIOD_MONTHLY = "monthly";
export const PERIOD_WEEKLY = "weekly";
export const PERIODS = [PERIOD_DAILY, PERIOD_WEEKLY, PERIOD_MONTHLY] as const;

export type PeriodType = typeof PERIODS[number];

export class Period {
  static UTC(d: Date): [number, number, number, number] {
    return [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCDay()];
  }

  constructor(readonly d: Date) {
    const [year, month, date, day] = Period.UTC(d);

    this.date = new Date(year, month, date);

    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    this.date.setUTCDate(date + 4 - day || 7);

    this.day = 1 + (this.date.getTime() - Date.UTC(year, 0, 1)) / 86400000;
    this.week = Math.ceil(this.day / 7);
    this.month = month + 1;
    this.year = year;
  }

  readonly date: Date;
  readonly day: number;
  readonly month: number;
  readonly week: number;
  readonly year: number;

  get daily(): string {
    return `${this.year}-${String(this.day).padStart(3, "0")}`;
  }

  get monthly(): string {
    return `${this.year}-${String(this.month).padStart(2, "0")}`;
  }

  get weekly(): string {
    return `${this.year}-${String(this.week).padStart(2, "0")}`;
  }

  toString(type: PeriodType) {
    return this[type];
  };
}
