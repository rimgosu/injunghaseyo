import { useNavigate, useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useTodayGroupStore } from '../stores/useTodayGroupStore';
import { useEffect } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { TodayGroupTopNavBar } from '../components/TodayGroupTopNavBar';
import { ProofMethodElemTypeEnum } from '@rimgosu/libs';
import {
  CameraIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export const GroupTodayPage = () => {
  const { groupId } = useParams();
  const { getToday } = useGroups();
  const { todayGroup, setTodayGroup } = useTodayGroupStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayGroup = async () => {
      const res = await getToday({ groupId: Number(groupId) });

      if (res.data) {
        setTodayGroup(res.data);
      }
    };
    fetchTodayGroup();
  }, []);

  return (
    <BaseLayout headerElement={<TodayGroupTopNavBar />}>
      <div className="flex flex-col gap-12">
        <div className="h-full w-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{todayGroup?.title}</h2>
          <p className="text-gray-500">{todayGroup?.description}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl">오늘의 인증</h3>
          {todayGroup?.proofs.map((proof, index) => {
            let icon = null;
            if (
              proof.proofMethod.type === ProofMethodElemTypeEnum.UPLOAD_PHOTO
            ) {
              icon = <CameraIcon />;
            }
            if (
              proof.proofMethod.type === ProofMethodElemTypeEnum.CLICK_BUTTON
            ) {
              icon = <CursorArrowRaysIcon />;
            }
            if (
              proof.proofMethod.type === ProofMethodElemTypeEnum.CHECK_LOCATION
            ) {
              icon = <MapPinIcon />;
            }
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex text-gray-600 gap-1">
                  <p>인증 {index + 1}.</p>
                  <p>{proof.proofMethod.contents}</p>
                </div>
                <div className="w-36 h-36 text-center">{icon}</div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseLayout>
  );
};
