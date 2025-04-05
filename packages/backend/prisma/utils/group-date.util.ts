/**
 * @description 그룹 날짜 유틸리티
 *
 * * ymd: yyyy-mm-dd 꼴의 string
 * * ts: timestamp
 */
export class GroupDateUtil {
  private readonly offsetKstTs = 9 * 60 * 60 * 1000;
  private readonly offset1DayTs = 24 * 60 * 60 * 1000;

  before3Ymd: string;
  before2Ymd: string;
  before1Ymd: string;
  nowYmd: string;
  after1Ymd: string;
  after2Ymd: string;
  after3Ymd: string;

  constructor() {
    const nowTs = new Date().getTime() + this.offsetKstTs;
    this.before3Ymd = new Date(nowTs - 3 * this.offset1DayTs)
      .toISOString()
      .split('T')[0];

    this.before2Ymd = new Date(nowTs - 2 * this.offset1DayTs)
      .toISOString()
      .split('T')[0];

    this.before1Ymd = new Date(nowTs - this.offset1DayTs)
      .toISOString()
      .split('T')[0];

    this.nowYmd = new Date(nowTs).toISOString().split('T')[0];

    this.after1Ymd = new Date(nowTs + this.offset1DayTs)
      .toISOString()
      .split('T')[0];

    this.after2Ymd = new Date(nowTs + 2 * this.offset1DayTs)
      .toISOString()
      .split('T')[0];

    this.after3Ymd = new Date(nowTs + 3 * this.offset1DayTs)
      .toISOString()
      .split('T')[0];
  }

  get inProgressYmds(): string[] {
    return [this.before2Ymd, this.before1Ymd, this.nowYmd, this.after1Ymd];
  }

  get finishedYmds(): string[] {
    return [this.before1Ymd, this.before2Ymd, this.before3Ymd];
  }

  get notStartedYmds(): string[] {
    return [this.after1Ymd, this.after2Ymd, this.after3Ymd];
  }
}
