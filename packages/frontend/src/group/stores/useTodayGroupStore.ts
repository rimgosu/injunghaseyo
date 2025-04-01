import { GetTodayRes } from '@rimgosu/libs';
import { create } from 'zustand';

export type TodayGroupStore = {
  todayGroup: GetTodayRes | null;
  setTodayGroup: (todayGroup: GetTodayRes) => void;
};

export const useTodayGroupStore = create<TodayGroupStore>((set) => ({
  todayGroup: null,
  setTodayGroup: (todayGroup) => set({ todayGroup }),
}));
