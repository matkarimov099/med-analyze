import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NavLink } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth.ts";
import { useAuthContext } from "@/hooks/useAuthContext.ts";
import { toast } from "sonner";
import type { ServerError } from "@/types/auth.ts";
import { PasswordInput } from "@/components/custom/password-input.tsx";
import { PhoneInput } from "@/components/custom/phone-input.tsx";

const formSchema = z.object({
  phone: z.string().regex(/^\+?\d{9,}$/, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignIn = () => {
  const { setAuthToken } = useAuthContext();
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      phone: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data, {
      onSuccess: (response) => {
        setAuthToken(response.accessToken);
        toast.success("Login successful!", {
          description: "You have been signed in.",
        });
      },
      onError: (error: ServerError) => {
        toast.error("Login failed", {
          description: error?.message || "Invalid credentials",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm">
        <p className="font-bold text-lg">Your logo</p>
        <p className="mt-4 text-xl font-bold tracking-tight">
          Log in to MED ANALYZE
        </p>
        <Form {...form}>
          <form
            className="w-full space-y-4 mt-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="UZ"
                      placeholder="90 123 45 67"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Parolingizni kiriting"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full" disabled={isPending}>
              {isPending ? "Logging In..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-5 space-y-5">
          <NavLink
            to="/forgot-password"
            className="text-sm block underline text-muted-foreground text-center"
          >
            Forgot your password?
          </NavLink>
          <p className="text-sm text-center">
            Don't have an account?
            <NavLink
              to="/auth/sign-up"
              className="ml-1 underline text-muted-foreground"
            >
              Create account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};
