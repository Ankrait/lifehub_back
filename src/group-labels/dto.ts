import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ActionGroupLabelDto {
  @ApiProperty()
  @IsInt()
  groupId: number;

  @ApiProperty()
  @IsInt()
  labelId: number;
}
