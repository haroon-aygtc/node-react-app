/**
 * Utility functions to handle ID type conversions between Prisma and our models
 *
 * Prisma returns string IDs even for integer fields, so we need to convert them
 */

/**
 * Convert string or number ID to number for entity objects
 */
export function convertEntityId<T extends { id: any }>(entity: T): T & { id: number } {
  return {
    ...entity,
    id: safeNumberId(entity.id)
  };
}

/**
 * Convert string IDs to numbers for a collection of entities
 */
export function convertEntityIds<T extends { id: any }>(entities: T[]): (T & { id: number })[] {
  return entities.map(entity => convertEntityId(entity));
}

/**
 * Helper to handle Prisma query params - convert number to string for IDs
 */
export function idParam(id: number): number {
  return id; // No need to convert to string for newer Prisma versions
}

/**
 * Helper to get a safely typed number ID from any potential source
 */
export function safeNumberId(id: string | number): number {
  if (typeof id === 'number') return id; // Handle numbers as-is
  return Number(id); // Handle strings as numbers
}
