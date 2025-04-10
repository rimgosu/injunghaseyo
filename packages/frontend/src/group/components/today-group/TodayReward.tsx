import { GetTodayRewardRes } from '@rimgosu/libs';
import { number2Won } from '../../../common/common.util';

type RewardProps = {
  todayReward: GetTodayRewardRes | null;
};

export const TodayReward = ({ todayReward }: RewardProps) => {
  return (
    <div className="flex flex-col gap-16 h-screen">
      <div className="flex justify-center items-center gap-2 flex-col">
        <p className="text-gray-600 text-3xl">받을 금액</p>
        <p className="text-green-600 text-4xl">
          {number2Won(todayReward?.todayReward ?? 0)}
        </p>
      </div>
    </div>
  );
};
