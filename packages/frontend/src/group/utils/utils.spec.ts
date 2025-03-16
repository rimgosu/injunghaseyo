import { formatMinutesToTime } from './utils';

describe('formatMinutesToTime', () => {
  it('1440 넣으면 24:00 반환해야한다.', () => {
    expect(formatMinutesToTime(1440)).toBe('24:00');
  });
});
