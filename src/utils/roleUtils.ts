// src/utils/roleUtils.ts
import { Role } from '@/types';

export const hasRole = (userRoles: Role[] | undefined, requiredRole: Role): boolean => {
  return userRoles?.includes(requiredRole) || false;
};

export const isAdmin = (userRoles: Role[] | undefined): boolean => {
  return hasRole(userRoles, 'ROLE_ADMIN');
};