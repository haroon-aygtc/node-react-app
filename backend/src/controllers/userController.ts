import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) throw new NotFoundError('User not found');
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate that user exists before updating
  const exists = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!exists) throw new NotFoundError('User not found');

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate that user exists before deleting
  const exists = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!exists) throw new NotFoundError('User not found');

  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
