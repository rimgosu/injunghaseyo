import { useParams } from 'react-router-dom';

export const GetTodayPage = () => {
  const { groupId } = useParams();
  return <div>인증 보는 페이지입니다. {groupId}</div>;
};
