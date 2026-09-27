import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('allows a user with the required role', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]) } as unknown as Reflector;
    const context = {
      getHandler: jest.fn(), getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.ADMIN } }) }),
    } as unknown as ExecutionContext;
    expect(new RolesGuard(reflector).canActivate(context)).toBe(true);
  });

  it('denies a user without the required role', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]) } as unknown as Reflector;
    const context = {
      getHandler: jest.fn(), getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.CUSTOMER } }) }),
    } as unknown as ExecutionContext;
    expect(new RolesGuard(reflector).canActivate(context)).toBe(false);
  });
});
