import api from "@/service/api";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  ResetPasswordRequest,
} from "@/service/types";

async function signIn(data: SignInRequest): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>("/auth/signin", data);
  return response.data;
}

async function signUp(data: SignUpRequest): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>("/auth/signup", data);
  return response.data;
}

async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await api.post("/auth/reset-password", data);
}

export const authService = {
  signIn,
  signUp,
  resetPassword,
};
