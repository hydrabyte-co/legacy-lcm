import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { ObjectID } from 'mongodb';

export async function handleClassValidation(objectToValidate: any) {
  const validateResults = await validate(objectToValidate, {
    forbidNonWhitelisted: true,
  });
  if (validateResults) {
    if (validateResults.length > 0) {
      const messages = [];
      validateResults.forEach((vResult) => {
        const message = {};
        message[vResult.property] = { ...vResult.constraints };
        messages.push(message);
      });
      return new BadRequestException(messages);
    }
  }
  return undefined;
}

export function handleMongoDBObjectIdValidation(
  id: string,
): BadRequestException {
  if (ObjectID.isValid(id)) {
    return undefined;
  } else {
    return new BadRequestException([{ id: 'Invalid Object Id' }]);
  }
}
