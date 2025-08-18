import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schema/loginSchema";

export function useLogin() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
}
