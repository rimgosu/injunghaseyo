import { useState } from 'react';
import { Input } from '../../../../common/components/Input';
import { useProofMethodStore } from '../../../stores/useProofMethodStore';
import { ProofMethodElem, ProofMethodElemTypeEnum } from '@rimgosu/libs';
import { ProofMethodSelector } from '../../../components/ProofMethodSelector';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TimeIgnoreCheckbox } from '../../../components/TimeIgnoreCheckbox';

export const CreateGroupStep2AddProofMethod = () => {
  const { addProofMethod, setCreateProofMethodMode: setMode } =
    useProofMethodStore();
  const [proofMethod, setProofMethod] = useState<ProofMethodElem>({
    contents: '',
    type: ProofMethodElemTypeEnum.UPLOAD_PHOTO,
    fromMin: 0,
    toMin: 2400,
  });
  const [isTimeIgnored, setIsTimeIgnored] = useState(false);

  const convertDayjsToMinutes = (time: dayjs.Dayjs | null) => {
    if (!time) return 0;
    return time.hour() * 60 + time.minute();
  };

  const convertMinutesToDayjs = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return dayjs().hour(hours).minute(mins);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col gap-4">
        <Input
          label="인증 내용"
          type="text"
          value={proofMethod.contents}
          name="인증 내용"
          onChange={(e) =>
            setProofMethod({ ...proofMethod, contents: e.target.value })
          }
        />

        <ProofMethodSelector
          value={proofMethod.type}
          onChange={(type) => setProofMethod({ ...proofMethod, type })}
        />

        <div className="flex flex-col gap-6 my-4">
          <TimeIgnoreCheckbox
            isTimeIgnored={isTimeIgnored}
            onChange={(checked) => {
              setIsTimeIgnored(checked);
              if (checked) {
                setProofMethod({
                  ...proofMethod,
                  fromMin: 0,
                  toMin: 2400,
                });
              }
            }}
          />

          <TimePicker
            label="인증 시간 (from)"
            value={convertMinutesToDayjs(proofMethod.fromMin)}
            onChange={(newValue) =>
              setProofMethod({
                ...proofMethod,
                fromMin: convertDayjsToMinutes(newValue),
              })
            }
            disabled={isTimeIgnored}
            ampm={false}
          />
          <TimePicker
            label="인증 시간 (to)"
            value={convertMinutesToDayjs(proofMethod.toMin)}
            onChange={(newValue) =>
              setProofMethod({
                ...proofMethod,
                toMin: convertDayjsToMinutes(newValue),
              })
            }
            disabled={isTimeIgnored}
            ampm={false}
          />
        </div>

        <button
          className="border p-4 border-green-400 rounded-lg text-green-500"
          onClick={() => {
            addProofMethod(proofMethod);
            setMode('view');
          }}
        >
          추가하기
        </button>
      </div>
    </LocalizationProvider>
  );
};
