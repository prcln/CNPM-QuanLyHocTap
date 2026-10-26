// src/components/auth/register-form.tsx
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

import { registerApi, saveAuthUser } from "@/services/auth";
import {
  AuthError,
  RegisterFormValuesSchema,
} from "@/types/auth";

import type {
  AuthUser,
  RegisterFormValuesType,
} from "@/types/auth";

export function RegisterForm({
  onRegisterSuccess,
}: {
  onRegisterSuccess: (user: AuthUser) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterFormValuesType>({
    resolver: zodResolver(RegisterFormValuesSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerApi,
    onSuccess: (user) => {
      saveAuthUser(user);
      onRegisterSuccess(user);
    },
    onError: (error) => {
      if (error instanceof AuthError) {
        if (error.field) {
          form.setError(error.field, { message: error.message });
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError("Có lỗi xảy ra, vui lòng thử lại");
      }
    },
  });

  function onSubmit(values: RegisterFormValuesType) {
    setFormError(null);
    mutate(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
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
                    <Input placeholder="vd: sinhvien01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="vd: sinhvien01@school.edu.vn" {...field} />
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
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
              {isPending ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
