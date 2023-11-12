import { ApiProperty } from '@nestjs/swagger';
import { LabelEnum } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLabelDto {
  @ApiProperty({
    default: 'Тег',
  })
  @IsString()
  @MaxLength(16)
  @MinLength(3)
  text: string;

  @ApiProperty({
    enum: LabelEnum,
    default: 'ALL',
  })
  @IsEnum(LabelEnum)
  type: LabelEnum;
}
