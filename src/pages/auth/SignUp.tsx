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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NavLink } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth.ts";
import { useAuthContext } from "@/hooks/useAuthContext.ts";
import { toast } from "sonner";
import type { ServerError } from "@/types/auth.ts";
import { PhoneInput } from "@/components/custom/phone-input.tsx";
import { PasswordInput } from "@/components/custom/password-input.tsx";

const formSchema = z
  .object({
    phone: z.string().regex(/^\+?\d{9,}$/, "Invalid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    birthday: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const SignUp = () => {
  const { setAuthToken } = useAuthContext();
  const { mutate, isPending, isError, error } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      birthday: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { ...registerData } = data;
    mutate(registerData, {
      onSuccess: (response) => {
        setAuthToken(response.accessToken);
        toast.success("Registration successful!", {
          description: "You have been signed up.",
        });
      },
      onError: (error: ServerError) => {
        toast.error("Registration failed", {
          description: error?.message || "An error occurred",
        });
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="font-bold text-lg">Your logo</p>
          <p className="mt-4 text-xl font-bold tracking-tight">
            Sign up for MED ANALYZE
          </p>
          {isError && (
            <p className="mt-2 text-sm text-red-600">
              Registration failed: {error?.message || "Unknown error"}
            </p>
          )}
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Parolingizni qaytadan kiriting"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthday (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Birthday"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                {isPending ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="mt-5 text-sm text-center">
            Already have an account?
            <NavLink
              to="/auth/sign-in"
              className="ml-1 underline text-muted-foreground"
            >
              Log in
            </NavLink>
          </p>
        </div>
        <div className="bg-muted hidden lg:block" />
      </div>
    </div>
  );
};
