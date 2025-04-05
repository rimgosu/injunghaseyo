import {
  CameraIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { ModifiedGetTodayRes, ProofMethodElemTypeEnum } from '@rimgosu/libs';
import { formatMinutesToTime } from '../../utils/utils';
import { TotalProofDates } from './TotalProofDates';
import { useGroups } from '../../hooks/useGroups';

type TodayProofProps = {
  todayGroup: ModifiedGetTodayRes | null;
  groupId: number;
};

export const TodayProof = ({ todayGroup, groupId }: TodayProofProps) => {
  const { uploadProofPhoto, uploadProofButton, uploadProofLocation } =
    useGroups();

  const handleProofSubmit = (proof: any) => {
    const params = {
      groupId,
      progressId: proof.groupProgressId,
    };

    switch (proof.proofMethod.type) {
      case ProofMethodElemTypeEnum.UPLOAD_PHOTO:
        // 파일 선택 input을 트리거하는 로직 필요
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            await uploadProofPhoto(params, file);
          }
        };
        fileInput.click();
        break;

      case ProofMethodElemTypeEnum.CLICK_BUTTON:
        uploadProofButton(params);
        break;

      case ProofMethodElemTypeEnum.CHECK_LOCATION:
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              await uploadProofLocation({
                ...params,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('위치 정보를 가져오는데 실패했습니다:', error);
              alert(
                '위치 정보를 가져오는데 실패했습니다. 위치 권한을 확인해주세요.',
              );
            },
          );
        } else {
          alert('이 브라우저에서는 위치 확인을 지원하지 않습니다.');
        }
        break;
    }
  };

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
              <button
                key={index}
                className="flex gap-2 justify-between p-4 border border-gray-300 rounded-2xl"
                onClick={() => handleProofSubmit(proof)}
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
              </button>
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
