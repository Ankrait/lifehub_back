import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LabelDto } from 'src/labels/dto';

export class GroupPlanStatsDto {
  @ApiProperty()
  started: number;

  @ApiProperty()
  finished: number;
}

export class GroupStatsDto {
  @ApiProperty()
  notesCount: number;

  @ApiProperty()
  plansCount: GroupPlanStatsDto;
}

export class GroupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
  })
  image: string | null;
}

export class FullGroupDto extends GroupDto {
  @ApiProperty()
  stats: GroupStatsDto;

  @ApiProperty({
    isArray: true,
    type: LabelDto,
  })
  @IsArray()
  labels: LabelDto[];
}

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  image?: string;
}

export class UpdateGroupDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(16)
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  image?: string;
}
