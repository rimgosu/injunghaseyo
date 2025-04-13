import { Logger } from '@nestjs/common';

export const ControllerLogging = () => {
  const logger = new Logger(ControllerLogging.name, {
    timestamp: true,
  });

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = propertyKey;

      logger.debug(`${className} ${methodName} started`);

      try {
        const result = await originalMethod.apply(this, args);
        logger.debug(`${className} ${methodName} completed`);
        return result;
      } catch (error) {
        logger.error(`${className} ${methodName} failed: ${error.message}`);
        throw error;
      }
    };

    return descriptor;
  };
};
