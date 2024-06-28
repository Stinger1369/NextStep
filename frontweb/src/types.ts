// src/types.ts

export interface ApiError {
  message: string;
  status?: number;
  [key: string]: any;
}
