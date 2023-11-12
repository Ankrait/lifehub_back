import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class GroupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  image?: string;
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
