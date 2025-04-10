import { GetTodayRewardRes } from '@rimgosu/libs';
import { create } from 'zustand';

export type TodayRewardStore = {
  todayReward: GetTodayRewardRes | null;
  setTodayReward: (todayReward: GetTodayRewardRes) => void;
};

export const useTodayRewardStore = create<TodayRewardStore>((set) => ({
  todayReward: null,
  setTodayReward: (todayReward) => set({ todayReward }),
}));
