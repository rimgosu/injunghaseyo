import { useState } from 'react';
import { useCreateGroupStore } from '../../../stores/useCreateGroupStore';
import dayjs from 'dayjs';

export const CreateGroupStep3 = () => {
  const { formData, updateFormData } = useCreateGroupStore();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [lastSelectedDate, setLastSelectedDate] = useState<string | null>(null);

  // 달력에 표시할 날짜들 생성
  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf('month');
    const startDay = startOfMonth.day(); // 0 = 일요일
    const daysInMonth = currentMonth.daysInMonth();

    const calendar = [];
    const prevMonthDays = startOfMonth.subtract(1, 'month').daysInMonth();

    // 이전 달의 날짜들
    for (let i = prevMonthDays - startDay + 1; i <= prevMonthDays; i++) {
      calendar.push({
        date: i,
        isCurrentMonth: false,
        isSelected: false,
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = currentMonth.date(i).format('YYYY-MM-DD');
      calendar.push({
        date: i,
        isCurrentMonth: true,
        isSelected: formData.dates.includes(currentDate),
      });
    }

    return calendar;
  };

  const handleDateClick = (day: number, event: React.MouseEvent) => {
    const clickedDate = currentMonth.date(day).format('YYYY-MM-DD');

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

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth((prev) => prev.subtract(1, 'month'))}
          className="px-4 py-2"
        >
          이전
        </button>
        <span className="text-lg font-semibold">
          {currentMonth.format('YYYY년 MM월')}
        </span>
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
            className={`text-center py-2 font-medium ${
              index === 0 ? 'text-red-500' : ''
            }`}
          >
            {day}
          </div>
        ))}

        {getDaysInMonth().map((item, index) => (
          <button
            key={index}
            onClick={(e) =>
              item.isCurrentMonth && handleDateClick(item.date, e)
            }
            className={`
              rounded-lg p-2 text-center
              ${!item.isCurrentMonth ? 'text-gray-300' : ''}
              ${item.isSelected ? 'bg-green-100 text-green-600' : ''}
              ${item.isCurrentMonth && index % 7 === 0 ? 'text-red-500' : ''}
            `}
          >
            {item.date}
          </button>
        ))}
      </div>
    </div>
  );
};
