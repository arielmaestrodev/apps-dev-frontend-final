"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Github, Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { loginValidator, LoginSchema } from "@/components/auth/schemas/validators";
import { loginService } from "@/services/auth";
import { toast } from "sonner";
import { apiErrorHandler } from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: LoginSchema) {
    try {
      const response = await loginService(values);
      
      if (response.status === "success" && response.data) {
        // Store tokens in localStorage
        if (response.data.tokens) {
          localStorage.setItem("accessToken", response.data.tokens.accessToken);
          localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
        }
        
        // Store user data if needed
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        toast.success(response.message || "Login successful");
        router.push("/");
        form.reset();
      }
      
    } catch (error: unknown) {
      toast.error(apiErrorHandler(error as AxiosError).message ?? "Unknown error");
      return;
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Password Field */}
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Submit Button */}
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full" size="lg">
            {form.formState.isSubmitting ? (
              <>
                <Spinner />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500">
              Don't have an account? {` `}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">Sign up</Link>
            </p>
          </div>

          <Separator />
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500">Or continue with</p>
          </div>
          <Button type="button" className="w-full" size="lg" variant="outline">
            <Image src="/google.webp" alt="Google" width={18} height={18} />
            Continue with Google
          </Button>
          <Button type="button" className="w-full" size="lg" variant="outline">
            <Github className="w-4 h-4" />
            Continue with GitHub
          </Button>
        </form>
      </Form>
    </div>
  );
}