type TotalProofDatesProps = {
  groupDate: string[];
  completedDate: string[];
};

export const TotalProofDates = ({
  groupDate,
  completedDate,
}: TotalProofDatesProps) => {
  // 달력에 표시할 날짜들을 요일에 맞게 정렬
  const sortedDates = [...groupDate].sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const firstDate = new Date(sortedDates[0]);
  const startDay = firstDate.getDay();

  // 첫 주와 다음 주의 모든 날짜 계산
  const allWeekDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(firstDate);
    date.setDate(date.getDate() - startDay + i);
    return date.toISOString().split('T')[0];
  });

  // 달력 배열 생성 (2주치)
  const calendar = allWeekDates.map((date) => {
    return sortedDates.includes(date) ? date : null;
  });

  return (
    <div className="mt-4 grid grid-cols-7 gap-2">
      {/* 요일 헤더 */}
      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
        <div key={day} className="text-center font-medium">
          {day}
        </div>
      ))}

      {/* 달력 날짜들 */}
      {calendar.map((date, index) => {
        const currentDate = allWeekDates[index];

        if (!date) {
          return (
            <div
              key={`empty-${index}`}
              className="aspect-square flex items-center justify-center text-gray-300"
            >
              {new Date(currentDate).getDate()}
            </div>
          );
        }

        const isCompleted = completedDate.includes(date);
        return (
          <div
            key={date}
            className={`aspect-square flex items-center justify-center rounded-lg border ${
              isCompleted
                ? 'bg-green-100 border-green-200'
                : 'bg-gray-100 border-gray-200'
            }`}
          >
            {new Date(date).getDate()}
          </div>
        );
      })}
    </div>
  );
};
