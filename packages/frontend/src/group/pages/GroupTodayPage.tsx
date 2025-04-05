import { useNavigate, useParams } from 'react-router-dom';
import { useGroups } from '../hooks/useGroups';
import { useTodayGroupStore } from '../stores/useTodayGroupStore';
import { useEffect } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { TodayGroupTopNavBar } from '../components/TodayGroupTopNavBar';

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
        <div className="flex flex-col gap-2">
          <h3 className="text-xl text-center">오늘의 인증</h3>
          {todayGroup?.proofs.map((proof) => (
            // <div key={proof.}>
            //   <img src={proof.imageUrl} alt={proof.title} />
            //   <p>{proof.title}</p>
            //   <p>{proof.description}</p>
            // </div>
            <div>1</div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};
