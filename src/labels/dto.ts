import { ApiProperty } from '@nestjs/swagger';
import { LabelEnum } from '@prisma/client';
import { IsEnum, IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class LabelDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty({
    enum: LabelEnum,
    default: 'ALL',
  })
  @IsEnum(LabelEnum)
  type: LabelEnum;
}

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

  @ApiProperty()
  @IsInt()
  groupId: number;
}
