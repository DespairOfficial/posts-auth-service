import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from '@nestjs/class-transformer';
import { validate, ValidationError, ValidatorOptions } from '@nestjs/class-validator';

function logParsedErrors(errors: ValidationError[]) {
  const messages = errors.map((err) => {
    if (err.children && err.children.length > 0) {
      logParsedErrors(err.children);
    } else {
      console.log(err);

      return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
    }
  });

  const message = messages.join('; ');

  throw new BadRequestException(message);
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const transformerOptions: ClassTransformOptions = {};
    let validatorOptions: ValidatorOptions = {};
    if (metadata.type != 'custom') {
      validatorOptions = { forbidNonWhitelisted: true, whitelist: true };
    }
    if (typeof value != 'object') {
      return value;
    }
    const obj = plainToClass(metadata.metatype, value, transformerOptions);

    if (!obj) {
      return obj;
    }

    const errors = await validate(obj, validatorOptions);
    if (errors.length) {
      logParsedErrors(errors);
    }

    return obj;
  }
}
