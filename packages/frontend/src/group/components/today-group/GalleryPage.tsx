import { useEffect, useState } from 'react';
import { useGroups } from '../../hooks/useGroups';
import { GetGalleryRes, ProofForGalleryProofTypeEnum } from '@rimgosu/libs';
import { CursorArrowRaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

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
  console.log('proof:', proof, 'proofPhoto:', proofPhoto);

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
  const { getGallery } = useGroups();

  useEffect(() => {
    const fetchGallery = async () => {
      const res = await getGallery(groupId);
      if (res.data) {
        setGallery(res.data);
      }
    };
    fetchGallery();
  }, []);

  if (!gallery) {
    return <div>등록된 사진이 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-12">
      {gallery.map((g) => (
        <div className="flex flex-col gap-2">
          <div className="text-xl">{g.date}</div>
          <div className="grid grid-cols-3 gap-3">
            {g.proofsForGallery.map((p) => (
              <div className="flex items-center justify-center border border-gray-300 p-4 rounded-2xl relative">
                <ImgByProofType
                  key={p.id}
                  proof={p.proofType}
                  proofPhoto={p.proofPhoto}
                />
                <div className="absolute bottom-1 left-1 flex gap-2 bg-green-200 border rounded-2xl px-2">
                  <img
                    src={p.participant.profilePhoto}
                    alt="profile photo"
                    className="w-10 h-10 rounded-full border border-gray-600 p-1 flex gap-2 items-center justify-center"
                  />
                  <div className="text-lg flex items-center">
                    {p.participant.nickname}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
