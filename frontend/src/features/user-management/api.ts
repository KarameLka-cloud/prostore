export interface AdminUser {
  id: number;
  login: string;
  name: string;
  email: string;
}

export interface UpdateAdminUser {
  login: string;
  name: string;
  email: string;
  password?: string;
}
