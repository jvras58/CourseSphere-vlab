import { Permission } from '@prisma/client';

export function hasPermission(
  permissions: Permission[],
  action: string,
  subject: string
): boolean {
  return permissions.some(
    (p) =>
      (p.action === action && p.subject === subject) ||
      (p.action === 'manage' && p.subject === 'all')
  );
}