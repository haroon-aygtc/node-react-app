export interface Guest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
