import {
  CameraIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { ModifiedGetTodayRes, ProofMethodElemTypeEnum } from '@rimgosu/libs';
import { formatMinutesToTime } from '../../utils/utils';
import { TotalProofDates } from './TotalProofDates';

type TodayProofProps = {
  todayGroup: ModifiedGetTodayRes | null;
};

export const TodayProof = ({ todayGroup }: TodayProofProps) => {
  return (
    <div className="flex flex-col gap-12">
      <div className="h-full w-full flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{todayGroup?.title}</h2>
        <p className="text-gray-500">{todayGroup?.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl">오늘의 인증</h3>
        <div className="flex flex-col gap-4">
          {todayGroup?.proofs.map((proof, index) => {
            let icon = null;
            if (
              proof.proofMethod.type === ProofMethodElemTypeEnum.UPLOAD_PHOTO
            ) {
              icon = <CameraIcon strokeWidth={1} className="w-16" />;
            }
            if (
              proof.proofMethod.type === ProofMethodElemTypeEnum.CLICK_BUTTON
            ) {
              icon = <CursorArrowRaysIcon strokeWidth={1} className="w-16" />;
            }
            if (
              proof.proofMethod.type === ProofMethodElemTypeEnum.CHECK_LOCATION
            ) {
              icon = <MapPinIcon strokeWidth={1} className="w-16" />;
            }
            return (
              <div
                key={index}
                className="flex gap-2 justify-between p-4 border border-gray-300 rounded-2xl"
              >
                <div className="flex text-gray-600 gap-1 justify-center flex-col">
                  <div className="flex gap-1">
                    <p>인증 {index + 1}.</p>
                    <p>{proof.proofMethod.contents}</p>
                  </div>
                  <p>
                    인증 가능 시간:{' '}
                    {formatMinutesToTime(proof.proofMethod.fromMin)} -{' '}
                    {formatMinutesToTime(proof.proofMethod.toMin)}
                  </p>
                </div>
                <div className="flex justify-center">{icon}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-xl">인증 현황</h3>
        <TotalProofDates
          groupDate={todayGroup?.groupDate ?? []}
          completedDate={todayGroup?.completedDate ?? []}
        />
      </div>
    </div>
  );
};
