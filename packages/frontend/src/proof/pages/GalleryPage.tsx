import { useEffect, useState, useRef } from 'react';
import { BaseLayout } from '../../common/BaseLayout';
import { BottomNavigationBar } from '../../common/components/BottomNavigationBar';
import { useProofHook } from '../hooks/useProofHook';
import {
  ProofControllerGetProofsParams,
  ProofForMainGallery,
} from '@rimgosu/libs';

export const GalleryPage = () => {
  const { getProofs } = useProofHook();
  const [proofs, setProofs] = useState<ProofForMainGallery[]>([]);
  const [query, setQuery] = useState<ProofControllerGetProofsParams>({
    cursor: 0,
    take: 15,
  });
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchProofs = async () => {
    if (!hasMore) return;

    const res = await getProofs(query);
    if (res.data) {
      setProofs((prev) => [...prev, ...res.data.items]);
      setQuery({
        ...query,
        cursor: res.data.nextCursor,
      });
      setHasMore(res.data.items.length === query.take);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProofs();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [query]);

  return (
    <BaseLayout
      bottomNavBar={
        <div className="flex justify-center items-center">
          <BottomNavigationBar />
        </div>
      }
      title="갤러리"
      padding=""
      paddingTop="0%"
    >
      <div className="grid grid-cols-3 gap-1">
        {proofs.map((proof) => (
          <div key={proof.proofId} className="aspect-square relative">
            <img
              src={proof.url}
              alt={proof.proofId.toString()}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div ref={observerTarget} className="h-10" />
    </BaseLayout>
  );
};
