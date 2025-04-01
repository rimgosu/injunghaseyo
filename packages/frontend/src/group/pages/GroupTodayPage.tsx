import { useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useTodayGroupStore } from '../stores/useTodayGroupStore';
import { useEffect } from 'react';
import { BaseLayout } from '../../common/BaseLayout';

export const GroupTodayPage = () => {
  const { groupId } = useParams();
  const { getToday } = useGroups();
  const { todayGroup, setTodayGroup } = useTodayGroupStore();

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
        <div>
          <div>상단</div>
          <div>하단</div>
        </div>
      }
    >
      인증
    </BaseLayout>
  );
};
