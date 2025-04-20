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
      return (
        <div>
          <CursorArrowRaysIcon strokeWidth={0.5} className="w-12" />
        </div>
      );

    case ProofForGalleryProofTypeEnum.CHECK_LOCATION:
      return (
        <div>
          <MapPinIcon strokeWidth={0.5} className="w-12" />
        </div>
      );

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
    <div className="flex flex-col gap-8">
      {gallery.map((g) => (
        <div className="flex flex-col gap-2">
          <div className="text-xl">{g.date}</div>
          <div className="grid grid-cols-3 gap-2">
            {g.proofsForGallery.map((p) => (
              <ImgByProofType
                key={p.id}
                proof={p.proofType}
                proofPhoto={p.proofPhoto}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
