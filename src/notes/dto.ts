import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class NoteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  isImportant: boolean;

  @ApiProperty()
  groupId: number;
}

export class CreateNoteDto {
  @ApiProperty({
    default: 'Текст заметки',
  })
  @IsString()
  message: string;

  @ApiProperty()
  @IsInt()
  groupId: number;
}

export class UpdateNoteDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isImportant?: boolean;
}
