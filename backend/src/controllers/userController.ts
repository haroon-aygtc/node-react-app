import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import * as userService from '../services/userService.js';
import * as userRepository from '../repositories/userRepository.js';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // Extract user data from request body
  const { email, password, fullName, isActive, roleIds } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Create user
  const user = await userService.createUser({
    email,
    password,
    fullName: fullName || null,
    isActive: isActive !== undefined ? isActive : true,
    roleIds: roleIds || []
  });

  res.status(201).json(user);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate that user exists before updating
  const exists = await userRepository.getUserById(req.params.id);
  if (!exists) throw new NotFoundError('User not found');

  // Extract role IDs if present in the request
  const { roles, ...userData } = req.body;

  // Update user basic information
  const user = await userRepository.updateUser(req.params.id, userData);

  // Update roles if provided
  if (roles && Array.isArray(roles)) {
    await userService.assignRolesToUser(req.params.id, roles);
  }

  // Get updated user with roles
  const updatedUser = await userService.getUserById(req.params.id);
  res.json(updatedUser);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate that user exists before deleting
  const exists = await userRepository.getUserById(req.params.id);
  if (!exists) throw new NotFoundError('User not found');

  await userRepository.deleteUser(req.params.id);
  res.status(204).send();
});

export const getUserRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await userService.getUserRoles(req.params.id);
  res.json(roles);
});

export const assignRolesToUser = asyncHandler(async (req: Request, res: Response) => {
  const { roleIds } = req.body;

  if (!roleIds || !Array.isArray(roleIds)) {
    throw new BadRequestError('Role IDs array is required');
  }

  const result = await userService.assignRolesToUser(req.params.id, roleIds);
  res.json(result);
});

export const addRoleToUser = asyncHandler(async (req: Request, res: Response) => {
  const { roleId } = req.body;

  if (!roleId) {
    throw new BadRequestError('Role ID is required');
  }

  const result = await userService.addRoleToUser(req.params.id, roleId);
  res.json(result);
});

export const removeRoleFromUser = asyncHandler(async (req: Request, res: Response) => {
  const { roleId } = req.body;

  if (!roleId) {
    throw new BadRequestError('Role ID is required');
  }

  const result = await userService.removeRoleFromUser(req.params.id, roleId);
  res.json(result);
});
