import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function handleValidationResult(validatetionResults): void {
  if (validatetionResults) {
    if (validatetionResults.length > 0) {
      const messages = [];
      validatetionResults.forEach((vResult) => {
        for (const key in vResult.constraints) {
          if (Object.prototype.hasOwnProperty.call(vResult.constraints, key)) {
            messages.push(vResult.constraints[key]);
          }
        }
      });
      throw new BadRequestException(messages);
    }
  }
}

export function validateObjectId(id: string): void {
  if (ObjectId.isValid(id) === false) {
    throw new BadRequestException('Invalid Object Id');
  }
}
