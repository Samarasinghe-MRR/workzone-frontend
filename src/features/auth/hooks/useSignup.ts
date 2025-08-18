import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "../schema/signupSchema";

export function useSignup() {
  return useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });
}
