"use client";
import z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

const signUpSchema = z.object({
  name: z.string().min(1, "Full name is required!"),
  email: z.string().email(),
  password: z.string().min(1, "Password is required!"),
});

export default function SignUp() {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleFormSubmission = form.handleSubmit(
    async ({ name, email, password }) => {
      setIsPending(true);
      toast.loading("Creating account...", { id: "signup" });

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });
      setIsPending(false);

      if (error) {
        toast.error(error.message, { id: "signup" });
        return;
      }

      toast.success("Account created!", {
        id: "signup",
      });
      if (!!global) {
        global.window.location.pathname = "/";
      }
    }
  );

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-gray-100">Sign Up</h1>
        <p className="text-balance text-gray-400">
          Enter your information to create an account.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleFormSubmission} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600"
                    {...field} 
                  />
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
                <FormLabel className="text-gray-200">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600"
                    {...field}
                  />
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
                <FormLabel className="text-gray-200">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100"
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/signin" className="underline text-gray-300 hover:text-gray-200">
          Sign in
        </Link>
      </div>
    </div>
  );
}
