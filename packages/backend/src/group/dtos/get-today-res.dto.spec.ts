import { GroupProgressStatus, ProofType } from '@prisma/client';
import { GetTodayRes } from './get-today-res.dto';
import { GroupWithToday } from '../utils/types';
import { createMock } from '@golevelup/ts-jest';

describe('GetTodayRes', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-10'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('그룹 정보를 올바르게 변환해야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithToday>({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofMethod: [
          {
            contents: '인증방법 1',
            type: ProofType.CHECK_LOCATION,
            fromMin: 0,
            toMin: 2400,
            groupProgress: [
              {
                id: 1,
                proofPhoto: {
                  url: 'photo1.jpg',
                },
              },
            ],
          },
        ],
        groupDate: [
          {
            date: '2024-03-15',
            groupProgress: [
              {
                status: GroupProgressStatus.COMPLETED,
              },
            ],
          },
        ],
      });

      // When
      const result = new GetTodayRes(mockGroup);

      // Then
      expect(result).toMatchObject({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofs: [
          {
            proofMethod: {
              contents: '인증방법 1',
              type: ProofType.CHECK_LOCATION,
              fromMin: 0,
              toMin: 2400,
            },
            proofPhoto: 'photo1.jpg',
            groupProgressId: 1,
          },
        ],
        groupDate: ['2024-03-15'],
        completedDate: ['2024-03-15'],
      });
    });

    it('빈 인증 방법이 주어졌을 때 빈 배열을 반환해야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithToday>({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofMethod: [],
        groupDate: [],
      });

      // When
      const result = new GetTodayRes(mockGroup);

      // Then
      expect(result.proofs).toEqual([]);
    });

    it('인증 사진이 없는 경우 null을 반환해야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithToday>({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofMethod: [
          {
            contents: '인증방법 1',
            type: ProofType.CHECK_LOCATION,
            fromMin: 0,
            toMin: 2400,
            groupProgress: [
              {
                id: 1,
                proofPhoto: null,
              },
            ],
          },
        ],
        groupDate: [],
      });

      // When
      const result = new GetTodayRes(mockGroup);

      // Then
      expect(result.proofs[0].proofPhoto).toBeNull();
    });

    it('여러 인증 방법이 있을 때 모두 올바르게 변환되어야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithToday>({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofMethod: [
          {
            contents: '인증방법 1',
            type: ProofType.CHECK_LOCATION,
            fromMin: 0,
            toMin: 2400,
            groupProgress: [
              {
                id: 1,
                proofPhoto: {
                  url: 'photo1.jpg',
                },
              },
            ],
          },
          {
            contents: '인증방법 2',
            type: ProofType.CHECK_LOCATION,
            fromMin: 0,
            toMin: 2400,
            groupProgress: [
              {
                id: 2,
                proofPhoto: {
                  url: 'photo2.jpg',
                },
              },
            ],
          },
        ],
        groupDate: [],
      });

      // When
      const result = new GetTodayRes(mockGroup);

      // Then
      expect(result.proofs).toHaveLength(2);
      expect(result.proofs[0]).toEqual({
        proofMethod: {
          contents: '인증방법 1',
          type: ProofType.CHECK_LOCATION,
          fromMin: 0,
          toMin: 2400,
        },
        proofPhoto: 'photo1.jpg',
        groupProgressId: 1,
      });
      expect(result.proofs[1]).toEqual({
        proofMethod: {
          contents: '인증방법 2',
          type: ProofType.CHECK_LOCATION,
          fromMin: 0,
          toMin: 2400,
        },
        proofPhoto: 'photo2.jpg',
        groupProgressId: 2,
      });
    });

    it('완료된 날짜와 전체 날짜가 올바르게 구분되어야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithToday>({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofMethod: [],
        groupDate: [
          {
            date: '2024-03-15',
            groupProgress: [
              {
                id: 1,
                status: GroupProgressStatus.COMPLETED,
              },
            ],
          },
          {
            date: '2024-03-16',
            groupProgress: [
              {
                id: 2,
                status: GroupProgressStatus.PENDING,
              },
            ],
          },
          {
            date: '2024-03-17',
            groupProgress: [
              {
                id: 3,
                status: GroupProgressStatus.COMPLETED,
              },
            ],
          },
        ],
      });

      // When
      const result = new GetTodayRes(mockGroup);

      // Then
      expect(result.groupDate).toEqual([
        '2024-03-15',
        '2024-03-16',
        '2024-03-17',
      ]);
      expect(result.completedDate).toEqual(['2024-03-15', '2024-03-17']);
    });

    it('그룹 날짜가 없을 때 빈 배열을 반환해야 함', () => {
      // Given
      const mockGroup = createMock<GroupWithToday>({
        title: '테스트 그룹',
        description: '테스트 설명',
        proofMethod: [],
        groupDate: [],
      });

      // When
      const result = new GetTodayRes(mockGroup);

      // Then
      expect(result.groupDate).toEqual([]);
      expect(result.completedDate).toEqual([]);
    });
  });
});
