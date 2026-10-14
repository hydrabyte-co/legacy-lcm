import { PipeTransform } from '@nestjs/common';

export class TransformPipe implements PipeTransform {
  transform(value: any) {
    console.log(value);
    return value;
  }
}
