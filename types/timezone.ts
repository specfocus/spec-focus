export type TimezoneType = string;

export class Timezone {
  static get local(): Timezone {
    return new Timezone(0, new Date().getTimezoneOffset());
  }

  static parse(tz: string) {
    const idx = tz.match(/^((?:Z|[+-])(?:2[0-3]|[01][0-9]):[0-5][0-9])$/)
      ? 4
      : tz.match(/^((?:Z|[+-])(?:2[0-3]|[01][0-9])[0-5][0-9])$/)
      ? 3
      : -1;

    if (idx === -1) {
      return new Timezone(0, 0);
    }

    const s = tz.substr(0, 1) === "-" ? -1 : 1;
    let h = parseInt(tz.substr(1, 2), 10);
    let m = parseInt(tz.substr(idx, 2), 10);

    if (h !== 0) {
      h *= s;
    } else {
      m *= s;
    }

    return new Timezone(h, m);
  }

  static sanitize(
    year: number,
    month: number,
    date: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: 0,
    milliseconds: number = 0
  ): Date {
    const d = new Date(Date.UTC(year, 0, 1));

    d.setMonth(month, date);
    d.setHours(hours, minutes, seconds, milliseconds);

    return d;
  }

  static sign(hours: number, minutes: number) {
    return hours !== 0 ? Math.sign(hours) : Math.sign(minutes);
  }

  static stringify(d: Date) {
    const dt = [
      String(d.getFullYear()),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");

    const tm = [
      String(d.getHours()).padStart(2, "0"),
      String(d.getMinutes()).padStart(2, "0"),
      String(d.getSeconds()).padStart(2, "0"),
    ].join(":");

    const ms = String(d.getMilliseconds()).padStart(3, "0").substr(0, 3);

    return `${dt}T${tm}.${ms}`;
  }

  constructor(hours: number, minutes: number) {
    const sign = Timezone.sign(hours, minutes);
    const total: number =
      hours < 0 ? hours * 60 + Math.abs(minutes) : hours * 60 + minutes;
    const abs = Math.abs(total);
    this.hours = (sign * Math.floor(abs / 60)) % 24;
    this.minutes = abs % 60;

    if (this.hours === 0) {
      this.minutes = sign * this.minutes;
    }

    const s = sign < 0 ? "-" : "+";
    const h = String(Math.abs(this.hours)).padStart(2, "0");
    const m = String(Math.abs(this.minutes)).padStart(2, "0");
    this.value = `${s}${h}:${m}`;
  }

  readonly hours: number;
  readonly minutes: number;
  readonly value: string;

  format(d: Date) {
    return Timezone.stringify(d) + this.value;
  }

  utc(d: Date) {
    return new Date(this.format(d));
  }
}
