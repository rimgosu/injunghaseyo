import { useEffect, useState } from 'react';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';
import dayjs from 'dayjs';
import { useGroups } from '../../../hooks/useGroups';
import { ValidateCreateGroupElementBodyValidateTypeEnum } from '@rimgosu/libs';
import { errorMessage2String } from '../../../../common/common.util';

// 날짜가 선택 가능한지 확인하는 함수 추가
const isDateSelectable = (date: string) => {
  const now = dayjs().add(9, 'hour'); // KST 기준
  const threeDaysLater = now.add(4, 'day').startOf('day');
  const targetDate = dayjs(date);
  return (
    targetDate.isAfter(threeDaysLater) ||
    targetDate.isSame(threeDaysLater, 'day')
  );
};

export const CreateGroupStep3 = () => {
  const { formData, updateFormData, setError, setIsValid } =
    useCreateGroupStore();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = dayjs().add(9, 'hour'); // KST 기준
    const threeDaysLater = now.add(4, 'day').startOf('day');
    const currentMonthEnd = now.endOf('month');

    // 현재 달에 선택 가능한 날짜가 있는지 확인
    const hasSelectableDatesInCurrentMonth =
      threeDaysLater.isBefore(currentMonthEnd);

    // 선택 가능한 날짜가 없으면 다음 달을 반환
    return hasSelectableDatesInCurrentMonth ? now : now.add(1, 'month');
  });
  const [lastSelectedDate, setLastSelectedDate] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const { validateCreateGroupElement } = useGroups();

  useEffect(() => {
    const validate = async () => {
      const res = await validateCreateGroupElement({
        validateValue: formData.dates,
        validateType: ValidateCreateGroupElementBodyValidateTypeEnum.DATES,
      });

      if (res.error) {
        setError(errorMessage2String(res.error.message));
        setIsValid(false);
      } else {
        setError(null);
        setIsValid(true);
      }
    };
    validate();
  }, [formData.dates]);

  // 달력에 표시할 날짜들 생성
  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentMonth.daysInMonth();

    const calendar = [];
    const prevMonthDays = startOfMonth.subtract(1, 'month').daysInMonth();

    // 이전 달의 날짜들
    for (let i = prevMonthDays - startDay + 1; i <= prevMonthDays; i++) {
      const prevMonthDate = currentMonth
        .subtract(1, 'month')
        .date(i)
        .format('YYYY-MM-DD');
      calendar.push({
        date: i,
        isCurrentMonth: false,
        isSelected: formData.dates.includes(prevMonthDate),
        isSelectable: isDateSelectable(prevMonthDate),
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = currentMonth.date(i).format('YYYY-MM-DD');
      calendar.push({
        date: i,
        isCurrentMonth: true,
        isSelected: formData.dates.includes(currentDate),
        isSelectable: isDateSelectable(currentDate),
      });
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - calendar.length; // 6주 달력을 위해 42칸 확보
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = currentMonth
        .add(1, 'month')
        .date(i)
        .format('YYYY-MM-DD');
      calendar.push({
        date: i,
        isCurrentMonth: false,
        isSelected: formData.dates.includes(nextMonthDate),
        isSelectable: isDateSelectable(nextMonthDate),
      });
    }

    return calendar;
  };

  const handleDateClick = (
    day: number,
    isCurrentMonth: boolean,
    event: React.MouseEvent,
  ) => {
    const clickedDate = isCurrentMonth
      ? currentMonth.date(day).format('YYYY-MM-DD')
      : day > 15
        ? currentMonth.subtract(1, 'month').date(day).format('YYYY-MM-DD')
        : currentMonth.add(1, 'month').date(day).format('YYYY-MM-DD');

    // 선택 불가능한 날짜인 경우 early return
    if (!isDateSelectable(clickedDate)) return;

    if (event.shiftKey && lastSelectedDate) {
      // shift 키가 눌린 경우 범위 선택
      const date1 = dayjs(lastSelectedDate);
      const date2 = dayjs(clickedDate);

      const start = date1.isBefore(date2) ? date1 : date2;
      const end = date1.isBefore(date2) ? date2 : date1;

      const dateRange = [];
      let current = start;

      while (current.isBefore(end) || current.isSame(end, 'day')) {
        dateRange.push(current.format('YYYY-MM-DD'));
        current = current.add(1, 'day');
      }

      const newDates = Array.from(new Set([...formData.dates, ...dateRange]));
      updateFormData({ dates: newDates });
    } else {
      // 일반 클릭의 경우 토글
      const newDates = formData.dates.includes(clickedDate)
        ? formData.dates.filter((date) => date !== clickedDate)
        : [...formData.dates, clickedDate];

      updateFormData({ dates: newDates });
    }

    setLastSelectedDate(clickedDate);
  };

  const handleDayHeaderClick = (dayIndex: number) => {
    const newDates = formData.dates.filter((date) => {
      const dayjs_date = dayjs(date);
      return dayjs_date.day() !== dayIndex;
    });
    updateFormData({ dates: newDates });
  };

  // 최소/최대 날짜 계산
  const getDateRange = () => {
    if (formData.dates.length === 0) return null;

    const sortedDates = [...formData.dates].sort();
    return {
      min: dayjs(sortedDates[0]).format('YYYY년 MM월 DD일'),
      max: dayjs(sortedDates[sortedDates.length - 1]).format(
        'YYYY년 MM월 DD일',
      ),
    };
  };

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const handleReset = () => {
    updateFormData({ dates: [] });
    setLastSelectedDate(null);
  };

  const dateRange = getDateRange();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth((prev) => prev.subtract(1, 'month'))}
          className="px-4 py-2"
        >
          이전
        </button>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">
            {currentMonth.format('YYYY년 MM월')}
          </span>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="rounded-full p-1.5 transition-colors duration-200 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
            {showTooltip && (
              <div className="absolute z-10 right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Shift + 클릭: 여러 날짜 선택</li>
                  <li>• 월-일: 해당 요일 선택 해제</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setCurrentMonth((prev) => prev.add(1, 'month'))}
          className="px-4 py-2"
        >
          다음
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={day}
            onClick={() => handleDayHeaderClick(index)}
            className={`text-center py-2 font-medium cursor-pointer hover:bg-gray-100 ${
              index === 0 ? 'text-red-500' : ''
            }`}
          >
            {day}
          </div>
        ))}

        {getDaysInMonth().map((item, index) => (
          <button
            key={index}
            onClick={(e) => handleDateClick(item.date, item.isCurrentMonth, e)}
            disabled={!item.isSelectable}
            className={`
              rounded-lg p-2 text-center
              ${!item.isCurrentMonth ? 'text-gray-300' : ''}
              ${
                !item.isSelectable
                  ? 'text-gray-400 cursor-not-allowed'
                  : item.isCurrentMonth && index % 7 === 0
                    ? 'text-red-500'
                    : ''
              }
              ${item.isSelected ? 'bg-green-100 text-green-600' : ''}
            `}
          >
            {item.date}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
          >
            초기화
          </button>
        </div>
        {dateRange && (
          <div className="text-sm text-gray-600 text-right">
            {dateRange.min} - {dateRange.max}
          </div>
        )}
      </div>
    </div>
  );
};
