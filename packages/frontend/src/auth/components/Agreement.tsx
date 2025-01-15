import React from 'react';

interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  required,
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      required={required}
      className="w-4 h-4 border-gray-300 rounded focus:ring-green-500"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

interface AgreementSectionProps {
  formData: {
    eventAgree: boolean;
    requireAgree: boolean;
    ageAgree: boolean;
    termsAgree: boolean;
    privacyAgree: boolean;
    marketingAgree: boolean;
    smsAgree: boolean;
    [key: string]: any;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  formData,
  onChange,
}) => {
  // 모든 필수 약관이 동의되었는지 확인
  const isAllRequiredAgreed =
    formData.ageAgree && formData.termsAgree && formData.privacyAgree;

  // 모든 선택 약관이 동의되었는지 확인
  const isAllOptionalAgreed = formData.marketingAgree && formData.smsAgree;

  // 전체 동의 상태 확인
  const isAllAgreed = isAllRequiredAgreed && isAllOptionalAgreed;

  const handleAllAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    // 모든 체크박스 상태를 한번에 업데이트
    const updateEvent = {
      target: {
        type: 'checkbox',
        checked: checked,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    // 필수 항목 업데이트
    onChange({
      ...updateEvent,
      target: { ...updateEvent.target, name: 'ageAgree' },
    });
    onChange({
      ...updateEvent,
      target: { ...updateEvent.target, name: 'termsAgree' },
    });
    onChange({
      ...updateEvent,
      target: { ...updateEvent.target, name: 'privacyAgree' },
    });

    // 선택 항목 업데이트
    onChange({
      ...updateEvent,
      target: { ...updateEvent.target, name: 'marketingAgree' },
    });
    onChange({
      ...updateEvent,
      target: { ...updateEvent.target, name: 'smsAgree' },
    });

    // requireAgree 상태 업데이트 (모든 필수항목이 체크된 경우에만 true)
    onChange({
      ...updateEvent,
      target: {
        ...updateEvent.target,
        name: 'requireAgree',
        checked: checked, // 전체 동의시에만 true가 됨
      },
    });

    // eventAgree 상태 업데이트
    onChange({
      ...updateEvent,
      target: {
        ...updateEvent.target,
        name: 'eventAgree',
        checked: checked,
      },
    });
  };

  // 개별 체크박스 변경 처리
  const handleIndividualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // 우선 해당 체크박스 상태 업데이트
    onChange(e);

    // 필수 약관 동의 상태 업데이트
    if (['ageAgree', 'termsAgree', 'privacyAgree'].includes(name)) {
      const willAllRequired =
        name === 'ageAgree'
          ? checked && formData.termsAgree && formData.privacyAgree
          : name === 'termsAgree'
            ? formData.ageAgree && checked && formData.privacyAgree
            : formData.ageAgree && formData.termsAgree && checked;

      onChange({
        ...e,
        target: {
          ...e.target,
          name: 'requireAgree',
          checked: willAllRequired,
        },
      });
    }

    // 선택 약관 동의 상태 업데이트
    if (['marketingAgree', 'smsAgree'].includes(name)) {
      const willAllOptional =
        name === 'marketingAgree'
          ? checked && formData.smsAgree
          : formData.marketingAgree && checked;

      onChange({
        ...e,
        target: {
          ...e.target,
          name: 'eventAgree',
          checked: willAllOptional,
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-medium mb-2">약관 동의</h3>
      <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          label="전체동의 (선택항목에 대한 동의 포함)"
          name="allAgree"
          checked={isAllAgreed}
          onChange={handleAllAgreeChange}
        />
        <div className="w-full h-px bg-gray-200 my-2" />
        <Checkbox
          label="만 14세 이상입니다(필수)"
          name="ageAgree"
          checked={formData.ageAgree}
          onChange={handleIndividualChange}
          required
        />
        <Checkbox
          label="이용 약관(필수)"
          name="termsAgree"
          checked={formData.termsAgree}
          onChange={handleIndividualChange}
          required
        />
        <Checkbox
          label="개인정보수집 및 이용 동의(필수)"
          name="privacyAgree"
          checked={formData.privacyAgree}
          onChange={handleIndividualChange}
          required
        />
        <Checkbox
          label="개인정보 마케팅 활용 동의"
          name="marketingAgree"
          checked={formData.marketingAgree}
          onChange={handleIndividualChange}
        />
        <Checkbox
          label="이벤트, 쿠폰, 특가 알림 및 SMS 등 수신"
          name="smsAgree"
          checked={formData.smsAgree}
          onChange={handleIndividualChange}
        />
      </div>
    </div>
  );
};
