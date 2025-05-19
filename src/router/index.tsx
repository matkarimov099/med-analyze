import { AuthLayout } from "@/layout/AuthLayout";
import { DefaultLayout } from "@/layout/DefaultLayout";
import { isAuthenticated } from "@/lib/auth";
import { SignIn } from "@/pages/auth/SignIn.tsx";
import AuthContextProvider from "@/providers/AuthContextProvider";
import {
  type LoaderFunctionArgs,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { Home } from "@/pages/home/Home.tsx";
import { SignUp } from "@/pages/auth/SignUp.tsx";
import { NotFound } from "@/components/common/not-found.tsx";
import { Analyzing } from "@/pages/analyzing/Analyzing.tsx";

function authLoader({ request }: LoaderFunctionArgs) {
  if (!isAuthenticated()) {
    const redirectUrl = new URL(request.url).pathname;
    sessionStorage.setItem("redirectUrl", redirectUrl);
    return redirect("/auth/sign-in");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <AuthContextProvider>
        <AuthLayout />
      </AuthContextProvider>
    ),
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthContextProvider>
        <DefaultLayout />
      </AuthContextProvider>
    ),
    loader: authLoader,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "orders",
        element: <div>Orders Page</div>,
      },
      {
        path: "profile",
        element: <div>Profile Page</div>,
      },
      {
        path: "accounts",
        element: <div>Accounts Page</div>,
      },
      {
        path: "analyze",
        element: <Analyzing />,
      },
      {
        path: "contact",
        element: <div>Contact Page</div>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
