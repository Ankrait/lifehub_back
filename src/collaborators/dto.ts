import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class CollaboratorDto {
  @ApiProperty({
    enum: RoleEnum,
  })
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  role: RoleEnum;

  @ApiProperty()
  userName: string;
}

export class GetCollaboratorDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  groupId: number;
}

export class CreateCollaboratorDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  groupId: number;

  @ApiProperty({
    enum: RoleEnum,
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class DeleteCollaboratorDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  groupId: number;
}
