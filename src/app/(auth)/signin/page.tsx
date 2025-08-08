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

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required!"),
});

export default function SignIn() {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmission = form.handleSubmit(
    async ({ email, password }) => {
      setIsPending(true);
      toast.loading("Signin in...", { id: "signin" });

      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      setIsPending(false);

      if (error) {
        toast.error(error.message, { id: "signin" });
        return;
      }

      toast.success("Logged in!", { id: "signin" });
      if (!!global) {
        global.window.location.pathname = "/";
      }
    },
  );

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold text-white">Sign In</h1>
        <p className="text-balance text-zinc-400">
          Let&apos;s get you back to your brilliant ideas.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleFormSubmission} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-200">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-zinc-700"
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
                <div className="flex items-center">
                  <FormLabel className="text-zinc-200">Password</FormLabel>
                  {/* <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link> */}
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-zinc-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" variant={"normal"}>
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-zinc-300 underline hover:text-white"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
