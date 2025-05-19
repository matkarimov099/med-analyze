export interface RegisterCredentials {
  phone: string;
  password: string;
  firstname: string;
  lastname: string;
  birthday?: string;
}

export interface CurrentUser {
  id: string;
  phone: string;
  firstname: string;
  lastname: string;
  birthday?: string;
}

export interface ServerError {
  message: string;
  error_code?: string;
}
