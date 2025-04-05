import { useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useTodayGroupStore } from '../stores/useTodayGroupStore';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { TodayGroupTopNavBar } from '../components/today-group/TodayGroupTopNavBar';
import { TodayGroupTopNavBarEnum } from '../utils/types';
import { TodayProof } from '../components/today-group/TodayProof';

export const GroupTodayPage = () => {
  const { groupId } = useParams();
  const { getToday } = useGroups();
  const { todayGroup, setTodayGroup } = useTodayGroupStore();
  const [selectedTodayGroupTopNavBar, setSelectedTodayGroupTopNavBar] =
    useState<TodayGroupTopNavBarEnum>(TodayGroupTopNavBarEnum.PROOF);

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
    <BaseLayout
      headerElement={
        <TodayGroupTopNavBar
          selected={selectedTodayGroupTopNavBar}
          setSelected={setSelectedTodayGroupTopNavBar}
        />
      }
    >
      {selectedTodayGroupTopNavBar === TodayGroupTopNavBarEnum.PROOF && (
        <TodayProof todayGroup={todayGroup} />
      )}
    </BaseLayout>
  );
};
