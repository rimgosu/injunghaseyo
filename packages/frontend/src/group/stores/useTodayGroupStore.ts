import { ModifiedGetTodayRes } from '@rimgosu/libs';
import { create } from 'zustand';

export type TodayGroupStore = {
  todayGroup: ModifiedGetTodayRes | null;
  setTodayGroup: (todayGroup: ModifiedGetTodayRes) => void;
};

export const useTodayGroupStore = create<TodayGroupStore>((set) => ({
  todayGroup: null,
  setTodayGroup: (todayGroup) => set({ todayGroup }),
}));
