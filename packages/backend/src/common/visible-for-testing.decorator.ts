/**
 * 테스트를 위해 protected로 설정된 메서드나 프로퍼티임을 명시하는 데코레이터
 * 실제 기능은 수행하지 않으며, 코드 가독성과 의도 표현을 위한 용도입니다.
 */
export function VisibleForTesting(): MethodDecorator & PropertyDecorator {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor?: PropertyDescriptor,
  ) {
    // 아무 작업도 수행하지 않음 - 단순히 의도를 명시하기 위한 데코레이터
    return descriptor;
  };
}
