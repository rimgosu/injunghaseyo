import { useEffect, useState } from 'react';
import {
  ProofMethodElem,
  ProofMethodElemTypeEnum,
  ValidateCreateGroupElementBodyValidateTypeEnum,
} from '@rimgosu/libs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useProofMethodStore } from '../../stores/useProofMethodStore';
import { useGroups } from '../../hooks/useGroups';
import { errorMessage2String } from '../../../common/common.util';
import { Input } from '../../../common/components/Input';
import { ProofMethodSelector } from '../ProofMethodSelector';
import { TimeIgnoreCheckbox } from '../TimeIgnoreCheckbox';
import { ValidationMessage } from '../../../common/components/ValidationMessage';

const convertDayjsToMinutes = (time: dayjs.Dayjs | null) => {
  if (!time) return 0;
  return time.hour() * 60 + time.minute();
};

const convertMinutesToDayjs = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return dayjs().hour(hours).minute(mins);
};

export const CreateGroupStep2AddProofMethod = () => {
  const { addProofMethod, setCreateProofMethodMode: setMode } =
    useProofMethodStore();
  const { validateCreateGroupElement } = useGroups();
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [proofMethod, setProofMethod] = useState<ProofMethodElem>({
    contents: '',
    type: ProofMethodElemTypeEnum.UPLOAD_PHOTO,
    fromMin: 0,
    toMin: 1440,
  });
  const [isTimeIgnored, setIsTimeIgnored] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const res = await validateCreateGroupElement({
        validateValue: [proofMethod],
        validateType:
          ValidateCreateGroupElementBodyValidateTypeEnum.PROOF_METHOD,
      });

      if (res.error) {
        setIsValid(false);
        if (proofMethod.contents !== '') {
          setError(errorMessage2String(res.error.message));
          return;
        }
        return;
      }

      setError(null);
      setIsValid(true);
    };
    validate();
  }, [proofMethod]);

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
                  toMin: 1440,
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
        {error && <ValidationMessage message={error} />}
        <button
          className={`border p-4 rounded-lg ${isValid ? 'border-green-400 text-green-500' : 'border-gray-400 text-gray-400'}`}
          onClick={() => {
            addProofMethod(proofMethod);
            setMode('view');
          }}
          disabled={!isValid}
        >
          추가하기
        </button>
      </div>
    </LocalizationProvider>
  );
};
