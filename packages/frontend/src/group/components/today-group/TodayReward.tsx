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
  <div className="flex justify-center items-center gap-2 flex-col">
    <p className="text-gray-500 text-2xl">{label}</p>
    <p className="text-green-600 text-4xl">{value}</p>
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
        <div className="flex flex-col gap-1 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">
                레벨 {myCharacter?.currentLevel}
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-8 border border-gray-300 bg-gray-200 rounded-lg">
                <div
                  className="h-full bg-green-400 rounded-lg"
                  style={{
                    width: `${calculateProgress()}%`,
                  }}
                />
              </div>
              <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-sm text-gray-500">
                <span>{myCharacter?.previousExp}</span>
                <span
                  className="absolute transform -translate-x-1/2"
                  style={{
                    left: `${calculateProgress()}%`,
                  }}
                >
                  {myCharacter?.currentExp}
                </span>
                <span>{myCharacter?.nextExp}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <svg
            xmlns={myCharacter?.characterImage}
            width="100"
            height="100"
            viewBox="0 0 24 24"
          />
        </div>
      </div>
    </div>
  );
};
