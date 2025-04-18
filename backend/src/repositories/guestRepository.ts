import prisma from '../config/prisma.js';
import type { Guest } from '../models/index.js';

export async function registerGuest(data: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
  // Since Guest is a custom type not directly mapped to a Prisma model,
  // we need to handle it differently
  const result = await prisma.$queryRaw`
    INSERT INTO Guest (fullName, email, phone)
    VALUES (${data.fullName}, ${data.email}, ${data.phone || null})
    RETURNING *
  `;
  return result[0] as Guest;
}

export async function getAllGuests(): Promise<Guest[]> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest`;
  return result as Guest[];
}

export async function getGuestById(id: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE id = ${id}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function updateGuest(id: string, data: Partial<Guest>): Promise<Guest> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`
    UPDATE Guest SET
    fullName = ${data.fullName},
    email = ${data.email},
    phone = ${data.phone || null}
    WHERE id = ${id}
    RETURNING *
  `;

  return result[0] as Guest;
}

export async function deleteGuest(id: string): Promise<void> {
  // Using raw query since Guest is a custom type
  await prisma.$queryRaw`DELETE FROM Guest WHERE id = ${id}`;
}

export async function getGuestByEmail(email: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE email = ${email}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByPhone(phone: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE phone = ${phone}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullName(fullName: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndEmail(fullName: string, email: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND email = ${email}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndPhone(fullName: string, phone: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND phone = ${phone}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndEmailAndPhone(fullName: string, email: string, phone: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND email = ${email} AND phone = ${phone}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndEmailAndPhoneAndAddress(fullName: string, email: string, phone: string, address: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND email = ${email} AND phone = ${phone} AND address = ${address}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndEmailAndPhoneAndAddressAndCity(fullName: string, email: string, phone: string, address: string, city: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND email = ${email} AND phone = ${phone} AND address = ${address} AND city = ${city}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndEmailAndPhoneAndAddressAndCityAndState(fullName: string, email: string, phone: string, address: string, city: string, state: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND email = ${email} AND phone = ${phone} AND address = ${address} AND city = ${city} AND state = ${state}`;
  return result.length ? (result[0] as Guest) : null;
}

export async function getGuestByFullNameAndEmailAndPhoneAndAddressAndCityAndStateAndZip(fullName: string, email: string, phone: string, address: string, city: string, state: string, zip: string): Promise<Guest | null> {
  // Using raw query since Guest is a custom type
  const result = await prisma.$queryRaw`SELECT * FROM Guest WHERE fullName = ${fullName} AND email = ${email} AND phone = ${phone} AND address = ${address} AND city = ${city} AND state = ${state} AND zip = ${zip}`;
  return result.length ? (result[0] as Guest) : null;
}
