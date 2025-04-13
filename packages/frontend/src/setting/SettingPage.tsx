import { Link, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../common/BaseLayout';
import { XButton } from '../common/components/XButton';
import { useAuth } from '../auth/hooks/useAuth';
import { WithdrawModal } from './components/WithdrawModal';
import { useState } from 'react';

export const SettingPage = () => {
  const { signOut, withdraw } = useAuth();
  const navigate = useNavigate();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleSignOut = async () => {
    const res = await signOut();
    if (res.error) {
      return;
    }

    localStorage.removeItem('accessToken');
    navigate('/auth/login');
  };

  const handleWithdraw = async () => {
    handleSignOut();

    const res = await withdraw();
    if (res.error) {
      return;
    }

    navigate('/auth/login');
  };

  return (
    <BaseLayout title="설정" rightElement={<XButton />}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">계정 관리</h2>
          <div className="flex flex-col gap-1 text-xl">
            <Link to="/auth/change-password">- 비밀번호 변경</Link>
            <button
              className="text-left text-xl"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              - 회원 탈퇴
            </button>
            <button className="text-left text-xl" onClick={handleSignOut}>
              - 로그아웃
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">결제 관리</h2>
          <div className="flex flex-col gap-1 text-xl">
            <a href="#">- 신용/체크 카드 등록</a>
            <a href="#">- 인증 머니 인출</a>
          </div>
        </div>
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
      />
    </BaseLayout>
  );
};
