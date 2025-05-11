import { TodayGroupTopNavBarEnum } from '../../utils/types';
import { XButton } from '../../../common/components/XButton';

type TodayGroupTopNavBarProps = {
  selected: TodayGroupTopNavBarEnum;
  setSelected: (selected: TodayGroupTopNavBarEnum) => void;
};

export const TodayGroupTopNavBar = ({
  selected,
  setSelected,
}: TodayGroupTopNavBarProps) => {
  return (
    <div className="flex w-full gap-4 items-center">
      <div className="grid grid-cols-3 gap-3 w-full">
        <button
          className={`rounded-lg border border-gray-300 px-4 py-3 text-center ${
            selected === TodayGroupTopNavBarEnum.PROOF
              ? 'bg-green-200'
              : 'bg-white'
          }`}
          onClick={() => setSelected(TodayGroupTopNavBarEnum.PROOF)}
        >
          인증
        </button>
        <button
          className={`rounded-lg border border-gray-300 px-4 py-3 text-center ${
            selected === TodayGroupTopNavBarEnum.REWARD
              ? 'bg-green-200'
              : 'bg-white'
          }`}
          onClick={() => setSelected(TodayGroupTopNavBarEnum.REWARD)}
        >
          레벨
        </button>
        <button
          className={`rounded-lg border border-gray-300 px-4 py-3 text-center ${
            selected === TodayGroupTopNavBarEnum.GALLERY
              ? 'bg-green-200'
              : 'bg-white'
          }`}
          onClick={() => setSelected(TodayGroupTopNavBarEnum.GALLERY)}
        >
          갤러리
        </button>
      </div>
      <div className="flex justify-end p-1">
        <XButton />
      </div>
    </div>
  );
};
