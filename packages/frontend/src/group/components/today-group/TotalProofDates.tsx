type TotalProofDatesProps = {
  groupDate: string[];
  completedDate: string[];
};

export const TotalProofDates = ({
  groupDate,
  completedDate,
}: TotalProofDatesProps) => {
  // KST로 날짜 변환하는 헬퍼 함수
  const toKSTDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9);
    return date.toISOString().split('T')[0];
  };

  // 현재 KST 날짜 구하기
  const getKSTToday = () => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().split('T')[0];
  };

  if (!groupDate.length) {
    return <div className="mt-4 text-gray-500">표시할 날짜가 없습니다.</div>;
  }

  // 유효한 날짜만 필터링 (KST 기준)
  const validDates = groupDate
    .filter((date) => {
      try {
        const d = new Date(date);
        return !isNaN(d.getTime());
      } catch {
        return false;
      }
    })
    .map(toKSTDate);

  if (!validDates.length) {
    return <div className="mt-4 text-gray-500">유효한 날짜가 없습니다.</div>;
  }

  // 달력에 표시할 날짜들을 요일에 맞게 정렬
  const sortedDates = validDates.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const firstDate = new Date(sortedDates[0]);
  const startDay = firstDate.getDay();

  // 첫 주와 다음 주의 모든 날짜 계산 (KST 기준)
  const allWeekDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(firstDate);
    date.setDate(date.getDate() - startDay + i);
    return toKSTDate(date.toISOString());
  });

  // 달력 배열 생성 (2주치)
  const calendar = allWeekDates.map((date) => {
    return sortedDates.includes(date) ? date : null;
  });

  return (
    <div className="mt-4 grid grid-cols-7 gap-2">
      {/* 요일 헤더 */}
      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
        <div
          key={day}
          className={`text-center font-medium ${
            day === '일' || day === '토' ? 'text-red-500' : ''
          }`}
        >
          {day}
        </div>
      ))}

      {/* 달력 날짜들 */}
      {calendar.map((date, index) => {
        const currentDate = allWeekDates[index];
        const today = getKSTToday();
        const isFutureDate = currentDate > today;
        const isToday = currentDate === today;

        if (!date) {
          return (
            <div
              key={`empty-${index}`}
              className="flex aspect-square items-center justify-center text-gray-300"
            >
              {new Date(currentDate).getDate()}
            </div>
          );
        }

        const isCompleted = completedDate.map(toKSTDate).includes(date);
        return (
          <div
            key={date}
            className={`flex aspect-square items-center justify-center rounded-lg border ${
              isToday
                ? isCompleted
                  ? 'border-2 border-green-500 bg-green-100'
                  : 'border-2 border-green-500'
                : isFutureDate
                  ? 'border-gray-200 bg-white'
                  : isCompleted
                    ? 'border-green-200 bg-green-100'
                    : 'border-gray-200 bg-gray-100'
            }`}
          >
            {new Date(date).getDate()}
          </div>
        );
      })}
    </div>
  );
};
