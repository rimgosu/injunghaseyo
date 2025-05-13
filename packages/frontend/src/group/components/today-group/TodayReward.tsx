import {
  GetMyCharacter,
  GetTodayRewardRes,
  ModifiedGetTodayRes,
} from '@rimgosu/libs';
import { number2Won } from '../../../common/common.util';

type RewardProps = {
  todayReward: GetTodayRewardRes | null;
  myCharacter: GetMyCharacter | null;
  todayGroup: ModifiedGetTodayRes | null;
};

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center justify-center gap-2">
    <p className="text-2xl text-gray-500">{label}</p>
    <p className="text-4xl text-green-600">{value}</p>
  </div>
);

export const TodayReward = ({
  todayReward,
  myCharacter,
  todayGroup,
}: RewardProps) => {
  const calculateProgress = () => {
    if (!myCharacter) return 0;

    const total = myCharacter.nextExp - myCharacter.previousExp;
    const current = myCharacter.currentExp - myCharacter.previousExp;
    return (current / total) * 100;
  };

  return (
    <div className="flex flex-col gap-16">
      <InfoBox
        label="총 인증한 일 수"
        value={`${todayGroup?.completedDate.length}일`}
      />
      <InfoBox
        label="받을 금액"
        value={number2Won(todayReward?.todayReward ?? 0)}
      />
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-center">
          <img
            src={myCharacter?.characterImage}
            alt="character"
            width="200"
            height="200"
          />
        </div>
        <div className="flex flex-col gap-1 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl text-green-500">
                레벨 {myCharacter?.currentLevel}
              </span>
            </div>
            <div className="relative">
              <div className="relative h-12 w-full rounded-lg border border-gray-300">
                <div
                  className="flex h-full items-center justify-center rounded-lg bg-green-300 text-center text-xl text-white"
                  style={{
                    width: `${calculateProgress()}%`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl text-gray-500">
                  {myCharacter?.currentExp}exp
                </div>
              </div>
              <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-sm text-gray-500">
                <span>{myCharacter?.previousExp}exp</span>
                <span>{myCharacter?.nextExp}exp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
