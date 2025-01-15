import { JoinRole, ProfilePhoto, User } from '@prisma/client';
import { GetGroupsRes } from '../dtos/get-groups-res.dto';
import { JoinStatus, GroupStatus } from '../utils/enums';
import { GroupWith } from '../utils/types';

describe('GetGroupsRes', () => {
  const mockUser: User & { profilePhoto: ProfilePhoto[] } = {
    id: 1,
    uuid: 'test-uuid',
    email: 'test@example.com',
    nickname: 'testUser',
    introduction: '등록된 소개말이 없습니다.',
    refreshToken: null,
    eventAgree: true,
    password: 'hashedPassword',
    salt: 'salt',
    provider: null,
    role: 'USER',
    status: 'ACTIVE',
    lastLogin: null,
    lastPwdChanged: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    loginFailCount: 0,
    profilePhoto: [],
  };

  beforeEach(() => {
    // 테스트를 위해 현재 시간을 2024-03-10으로 고정
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-10'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('그룹 목록을 올바르게 변환해야 함', () => {
      // Given
      const mockGroups: GroupWith[] = [
        {
          id: 1,
          title: '테스트 그룹',
          price: 30000,
          description: '테스트 설명',
          proofMethod: [
            {
              id: 1,
              method: '인증 방법',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              groupId: 1,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            {
              id: 1,
              date: '2024-03-20',
              groupId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            {
              id: 2,
              date: '2024-03-21',
              groupId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            {
              id: 3,
              date: '2024-03-22',
              groupId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ],
          groupTagMap: [
            {
              id: 1,
              groupId: 1,
              tagId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 1,
                name: '운동',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
            {
              id: 2,
              groupId: 1,
              tagId: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 2,
                name: '건강',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
          ],
          join: [
            {
              id: 1,
              userId: 1,
              groupId: 1,
              joinRole: JoinRole.HOST,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: mockUser,
            },
            {
              id: 2,
              userId: 2,
              groupId: 1,
              joinRole: JoinRole.ATTENDEE,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: { ...mockUser, id: 2 },
            },
          ],
        },
      ];

      // When
      const result = new GetGroupsRes(mockGroups, mockUser);

      // Then
      expect(result.groups).toHaveLength(1);
      expect(result.groups[0]).toEqual({
        id: 1,
        title: '테스트 그룹',
        price: 30000,
        description: '테스트 설명',
        proofMethod: ['인증 방법'],
        startDate: '2024-03-20',
        endDate: '2024-03-22',
        numberOfParticipants: 2,
        tags: ['운동', '건강'],
        joinStatus: JoinStatus.RESERVED,
        status: GroupStatus.NOT_STARTED,
      });
    });

    it('유저가 참여하지 않은 그룹은 NOT_JOINED 상태여야 함', () => {
      // Given
      const otherUser = { ...mockUser, id: 999 };
      const mockGroups: GroupWith[] = [
        {
          id: 1,
          title: '테스트 그룹',
          price: 30000,
          description: '테스트 설명',
          proofMethod: [
            {
              id: 1,
              method: '인증 방법',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              groupId: 1,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            {
              id: 1,
              groupId: 1,
              date: '2024-03-20',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ],
          groupTagMap: [
            {
              id: 1,
              groupId: 1,
              tagId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 1,
                name: '운동',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
          ],
          join: [
            {
              id: 1,
              userId: 1,
              groupId: 1,
              joinRole: JoinRole.ATTENDEE,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: mockUser,
            },
          ],
        },
      ];

      // When
      const result = new GetGroupsRes(mockGroups, otherUser);

      // Then
      expect(result.groups[0].joinStatus).toBe(JoinStatus.NOT_JOINED);
    });

    it('현재 진행중인 그룹은 IN_PROGRESS 상태여야 함', () => {
      // Given
      const today = new Date();
      const mockCurrentGroups = [
        {
          id: 1,
          title: '테스트 그룹',
          price: 30000,
          description: '테스트 설명',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            {
              id: 1,
              groupId: 1,
              date: new Date(today.setDate(today.getDate() - 1)).toISOString(),
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            {
              id: 2,
              groupId: 1,
              date: new Date(today.setDate(today.getDate() + 2)).toISOString(),
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ],
          groupTagMap: [
            {
              id: 1,
              groupId: 1,
              tagId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 1,
                name: '운동',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
          ],
          join: [
            {
              id: 1,
              userId: 1,
              groupId: 1,
              joinRole: JoinRole.ATTENDEE,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: mockUser,
            },
          ],
          proofMethod: [
            {
              id: 1,
              method: '인증 방법',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              groupId: 1,
            },
          ],
        },
      ];

      // When
      const result = new GetGroupsRes(mockCurrentGroups, mockUser);

      // Then
      expect(result.groups[0].status).toBe(GroupStatus.IN_PROGRESS);
      expect(result.groups[0].joinStatus).toBe(JoinStatus.IN_PROGRESS);
    });

    it('종료된 그룹은 COMPLETED 상태여야 함', () => {
      // Given
      const today = new Date();
      const mockCompletedGroups = [
        {
          id: 1,
          title: '테스트 그룹',
          price: 30000,
          description: '테스트 설명',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            {
              id: 1,
              groupId: 1,
              date: new Date(today.setDate(today.getDate() - 5)).toISOString(),
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            {
              id: 2,
              groupId: 1,
              date: new Date(today.setDate(today.getDate() - 3)).toISOString(),
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ],
          groupTagMap: [
            {
              id: 1,
              groupId: 1,
              tagId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 1,
                name: '운동',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
          ],
          join: [
            {
              id: 1,
              userId: 1,
              groupId: 1,
              joinRole: JoinRole.ATTENDEE,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: mockUser,
            },
          ],
          proofMethod: [
            {
              id: 1,
              method: '인증 방법',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              groupId: 1,
            },
          ],
        },
      ];

      // When
      const result = new GetGroupsRes(mockCompletedGroups, mockUser);

      // Then
      expect(result.groups[0].status).toBe(GroupStatus.COMPLETED);
      expect(result.groups[0].joinStatus).toBe(JoinStatus.COMPLETED);
    });

    it('사용자가 undefined일 때 모든 그룹의 joinStatus가 NOT_JOINED여야 함', () => {
      // Given
      const mockGroups = [
        {
          id: 1,
          title: '테스트 그룹 1',
          price: 30000,
          description: '테스트 설명 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            {
              id: 1,
              date: '2024-03-20',
              groupId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ],
          groupTagMap: [
            {
              id: 1,
              groupId: 1,
              tagId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 1,
                name: '운동',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
          ],
          join: [
            {
              id: 1,
              userId: 1,
              groupId: 1,
              joinRole: JoinRole.HOST,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: mockUser,
            },
          ],
          proofMethod: [
            {
              id: 1,
              method: '인증 방법',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              groupId: 1,
            },
          ],
        },
        {
          id: 2,
          title: '테스트 그룹 2',
          price: 40000,
          description: '테스트 설명 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          groupDate: [
            {
              id: 2,
              date: '2024-03-21',
              groupId: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          ],
          groupTagMap: [
            {
              id: 2,
              groupId: 2,
              tagId: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              tag: {
                id: 2,
                name: '건강',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              },
            },
          ],
          join: [
            {
              id: 2,
              userId: 2,
              groupId: 2,
              joinRole: JoinRole.ATTENDEE,
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              user: { ...mockUser, id: 2 },
            },
          ],
          proofMethod: [
            {
              id: 1,
              method: '인증 방법',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              groupId: 1,
            },
          ],
        },
      ];

      // When
      const result = new GetGroupsRes(mockGroups, undefined);

      // Then
      expect(result.groups).toHaveLength(2);
      result.groups.forEach((group) => {
        expect(group.joinStatus).toBe(JoinStatus.NOT_JOINED);
      });
    });
  });
});
