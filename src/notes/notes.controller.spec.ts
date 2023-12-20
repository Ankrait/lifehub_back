import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { CreateNoteDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';

describe('NotesController', () => {
  const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
  let notesController: NotesController;
  let notesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService, CollaboratorsService],
    }).compile();

    notesController = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
  });

  describe('GetNoteById', () => {
    it('should return a note by id', async () => {
      const noteId = 1;
      const note = {
        id: noteId,
        message: 'Note 1',
        isImportant: false,
        groupId: 1,
      };

      jest
        .spyOn(notesController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(notesService, 'getById').mockResolvedValueOnce(note);

      const result = await notesController.GetNoteById(session, noteId);

      expect(result).toEqual(note);
    });

    it('should throw BadRequestException when no note access', async () => {
      jest.spyOn(notesController as any, 'checkUser').mockResolvedValue(false);

      await expect(notesController.GetNoteById(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getNotesByGroup', () => {
    it('should return notes by group', async () => {
      const groupId = 1;
      const notes = [
        {
          id: 1,
          message: 'Note 1',
          isImportant: false,
          groupId: groupId,
        },
        {
          id: 2,
          message: 'Note 2',
          isImportant: true,
          groupId: groupId,
        },
      ];

      jest
        .spyOn(notesController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(notesService, 'getByGroupId').mockResolvedValueOnce(notes);

      const result = await notesController.getNotesByGroup(session, groupId);

      expect(result).toEqual(notes);
    });

    it('should throw BadRequestException when no group access', async () => {
      jest.spyOn(notesController as any, 'checkUser').mockResolvedValue(false);

      await expect(notesController.getNotesByGroup(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createNote: CreateNoteDto = { message: 'New Note', groupId: 1 };
      const returnPlan = {
        id: 2,
        isImportant: false,
        ...createNote,
      };

      jest
        .spyOn(notesController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(notesService, 'create').mockResolvedValueOnce(returnPlan);

      const result = await notesController.createNote(session, createNote);

      expect(result).toEqual(returnPlan);
    });

    it('should throw BadRequestException when no group access', async () => {
      jest.spyOn(notesController as any, 'checkUser').mockResolvedValue(false);

      await expect(
        notesController.createNote(session, {
          message: 'New Note',
          groupId: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteNote', () => {
    it('should delete an existing note', async () => {
      const noteId = 1;

      jest
        .spyOn(notesController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(notesService, 'delete').mockResolvedValueOnce(undefined);

      await notesController.deleteNote(session, noteId);

      expect(notesService.delete).toHaveBeenCalledWith(noteId);
    });

    it('should throw BadRequestException when no note access', async () => {
      jest.spyOn(notesController as any, 'checkUser').mockResolvedValue(false);

      await expect(notesController.deleteNote(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when user is not an admin', async () => {
      jest
        .spyOn(notesController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.USER);

      await expect(notesController.deleteNote(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const noteId = 1;
      const updateNote = { message: 'Updated Note' };
      const returnNote = {
        id: noteId,
        isImportant: false,
        groupId: 1,
        ...updateNote,
      };

      jest
        .spyOn(notesController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(notesService, 'update').mockResolvedValueOnce(returnNote);

      const result = await notesController.updateNote(
        session,
        noteId,
        updateNote,
      );

      expect(result).toEqual(returnNote);
    });

    it('should throw BadRequestException when no note access', async () => {
      jest.spyOn(notesController as any, 'checkUser').mockResolvedValue(false);

      await expect(
        notesController.updateNote(session, 1, { message: 'Updated Note' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
