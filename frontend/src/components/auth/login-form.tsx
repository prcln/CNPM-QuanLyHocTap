// src/components/auth/login-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { loginApi, saveAuthUser } from "@/services/auth";
import {
  AuthError,
  LoginFormValuesSchema,
} from "@/types/auth";

import type {
  AuthUser,
  LoginFormValuesType,
} from "@/types/auth";


export function LoginForm({
  onLoginSuccess,
}: {
  onLoginSuccess: (user: AuthUser) => void;
}) {
    const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValuesType>({
  resolver: zodResolver(LoginFormValuesSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (user) => {
  saveAuthUser(user);
  onLoginSuccess(user);
},
  onError: (error) => {
  if (error instanceof AuthError) {
    if (error.field === "username" || error.field === "password") {
      form.setError(error.field, { message: error.message });
    } else {
      setFormError(error.message);
    }
  } else {
    setFormError("Có lỗi xảy ra, vui lòng thử lại");
  }
},
  });
function onSubmit(values: LoginFormValuesType) {
  setFormError(null);
    mutate(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="vd: sieunhandienquang@sis.hust.edu.vn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formError && (
              <p className="text-sm text-red-500" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
