import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class FinanceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  value: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  isIncome: boolean;

  @ApiProperty()
  groupId: number;

  @ApiProperty({
    nullable: true,
    type: 'number',
  })
  labelId: number | null;
}

export class CreateFinanceDto {
  @ApiProperty({
    default: '100',
  })
  @IsString()
  value: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isIncome?: boolean;

  @ApiProperty()
  @IsInt()
  groupId: number;
}

export class UpdateFinanceDto {
  @ApiProperty({
    default: '100',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isIncome?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  labelId?: number;
}
