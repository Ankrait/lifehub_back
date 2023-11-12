import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class PlanDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  dateTo: Date;

  @ApiProperty()
  groupId: number;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  labelId?: number;
}

export class CreatePlanDto {
  @ApiProperty({
    default: 'Текст плана',
  })
  @IsString()
  message: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;

  @ApiProperty()
  @IsInt()
  groupId: number;
}

export class UpdatePlanDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTo?: Date;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  labelId?: number;
}
