import { useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useTodayGroupStore } from '../stores/useTodayGroupStore';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { TodayGroupTopNavBar } from '../components/today-group/TodayGroupTopNavBar';
import { TodayGroupTopNavBarEnum } from '../utils/types';
import { TodayProof } from '../components/today-group/TodayProof';
import { useTodayRewardStore } from '../stores/useTodayRewardStore';
import { TodayReward } from '../components/today-group/TodayReward';

export const GroupTodayPage = () => {
  const { groupId } = useParams();
  const { getToday, getTodayReward } = useGroups();
  const { todayGroup, setTodayGroup } = useTodayGroupStore();
  const { todayReward, setTodayReward } = useTodayRewardStore();
  const [selectedTodayGroupTopNavBar, setSelectedTodayGroupTopNavBar] =
    useState<TodayGroupTopNavBarEnum>(TodayGroupTopNavBarEnum.PROOF);

  const fetchTodayGroup = async () => {
    const res = await getToday({ groupId: Number(groupId) });
    if (res.data) {
      setTodayGroup(res.data);
    }
  };

  const fetchTodayReward = async () => {
    const res = await getTodayReward(Number(groupId));
    if (res.data) {
      setTodayReward(res.data);
    }
  };

  useEffect(() => {
    fetchTodayGroup();
    fetchTodayReward();
  }, []);

  return (
    <BaseLayout
      overflowY=""
      headerElement={
        <TodayGroupTopNavBar
          selected={selectedTodayGroupTopNavBar}
          setSelected={setSelectedTodayGroupTopNavBar}
        />
      }
    >
      {selectedTodayGroupTopNavBar === TodayGroupTopNavBarEnum.PROOF && (
        <TodayProof
          todayGroup={todayGroup}
          groupId={Number(groupId)}
          onProofComplete={fetchTodayGroup}
        />
      )}
      {selectedTodayGroupTopNavBar === TodayGroupTopNavBarEnum.REWARD && (
        <TodayReward todayReward={todayReward} />
      )}
    </BaseLayout>
  );
};
