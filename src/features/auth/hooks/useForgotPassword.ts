import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "../schema/resetPasswordSchema";

export function useResetPassword() {
  return useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });
}
