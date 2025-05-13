import { useEffect, useState } from 'react';
import { useGroups } from '../../hooks/useGroups';
import { GetGalleryRes, ProofForGalleryProofTypeEnum } from '@rimgosu/libs';
import { CursorArrowRaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ymd2Human } from '../../../common/common.util';
import { useNavigate } from 'react-router-dom';
import { useCheckSignInStore } from '../../../auth/stores/useCheckSignInStore';

interface GalleryPageProps {
  groupId: number;
}

const ImgByProofType = ({
  proof,
  proofPhoto,
}: {
  proof: ProofForGalleryProofTypeEnum;
  proofPhoto?: string | null;
}) => {
  switch (proof) {
    case ProofForGalleryProofTypeEnum.UPLOAD_PHOTO:
      if (!proofPhoto) {
        return null;
      }
      return <img src={proofPhoto} alt="proof photo" />;

    case ProofForGalleryProofTypeEnum.CLICK_BUTTON:
      return <CursorArrowRaysIcon strokeWidth={0.5} className="p-6" />;

    case ProofForGalleryProofTypeEnum.CHECK_LOCATION:
      return <MapPinIcon strokeWidth={0.5} className="p-6" />;

    default:
      return null;
  }
};

export const GalleryPage = ({ groupId }: GalleryPageProps) => {
  const [gallery, setGallery] = useState<GetGalleryRes[] | null>(null);
  const { checkSignInRes } = useCheckSignInStore();
  const { getGallery } = useGroups();
  const navigate = useNavigate();

  const fetchGallery = async () => {
    const res = await getGallery(groupId);
    if (res.data) {
      setGallery(res.data);
    }
  };

  const handleParticipantClick = (participantId: number) => {
    if (participantId === checkSignInRes.userId) {
      navigate('/user/profile');
    } else {
      navigate(`/user/${participantId}/profile`);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  if (
    !gallery ||
    gallery.length === 0 ||
    gallery.every((g) => g.proofsForGallery.length === 0)
  ) {
    return <div className="text-xl text-gray-600">등록된 사진이 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-12">
      {gallery.map((g) => {
        if (g.proofsForGallery.length === 0) {
          return null;
        }
        return (
          <div className="flex flex-col gap-2">
            <div className="text-xl">{ymd2Human(g.date)}</div>
            <div className="grid grid-cols-3 gap-3">
              {g.proofsForGallery.map((p) => (
                <div className="relative flex items-center justify-center rounded-2xl border border-gray-300 p-4">
                  <ImgByProofType
                    key={p.id}
                    proof={p.proofType}
                    proofPhoto={p.proofPhoto}
                  />
                  <div
                    className="absolute bottom-2 right-2 flex cursor-pointer items-end gap-1"
                    onClick={() => handleParticipantClick(p.participant.id)}
                  >
                    <div className="text-md text-gray-500">
                      {p.participant.nickname}
                    </div>
                    <img
                      src={p.participant.profilePhoto}
                      alt="profile photo"
                      className="h-10 w-10 rounded-full border-2 border-gray-500 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
