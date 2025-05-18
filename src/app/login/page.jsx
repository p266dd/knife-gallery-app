"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, useActionState } from "react";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

import BrandIcon from "@/ui/brand-icon";
import LinkLoading from "@/ui/link-loading";

import LoginAction from "./action";
import Button from "@/ui/button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, pending] = useActionState(LoginAction, {
    errors: [],
    data: {},
    message: "",
  });

  const formAnimation = {
    hidden: {
      opacity: 0,
      x: -80,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 80,
    },
  };

  return (
    <main className="flex h-full overflow-hidden">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-11/12 max-w-96">
          <AnimatePresence>
            <motion.div
              layout
              key="form"
              variants={formAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full p-6 bg-white rounded-lg shadow-md"
            >
              <div className="my-6">
                <BrandIcon />
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-3">
                  Sign in to your account.
                </h1>
                <h4 className="text-sm text-slate-500">
                  Not a member?
                  <Link
                    href="/register"
                    className="inline-block ml-2 text-blue-400 cursor-pointer hover:underline"
                  >
                    Create an account. <LinkLoading />
                  </Link>
                </h4>
              </div>

              <div>
                <form
                  action={action}
                  className="text-sm text-slate-700 flex flex-col gap-3"
                >
                  {state && state.message && (
                    <div className="px-3 py-2 text-xs font-semibold bg-blue-200 text-blue-900 rounded-xl">
                      {state.message}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm">
                      Email address
                    </label>
                    <input
                      type="text"
                      name="email"
                      autoComplete="email"
                      defaultValue={state?.data?.email || null}
                      className={`rounded-lg border-1 px-3 py-2 text-sm ${
                        state?.errors && state?.errors?.name
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.email && (
                      <span className="text-red-600 text-xs font-semibold">
                        {state.errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        defaultValue={state?.data?.password || null}
                        className={`w-full rounded-lg border-1 px-3 py-2 text-sm ${
                          state?.errors && state?.errors?.name
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                      />
                      <span
                        className="absolute right-4 top-2 text-slate-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </span>
                    </div>
                    {state?.errors && state?.errors?.password && (
                      <span className="text-red-600 text-xs font-semibold">
                        {state.errors.password}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end px-4 mb-3">
                    <Link
                      href="/forgot-password"
                      className="text-blue-400 cursor-pointer hover:underline"
                    >
                      Forgot password? <LinkLoading />
                    </Link>
                  </div>

                  <div className="flex flex-col">
                    <Button
                      type="submit"
                      size="lg"
                      variant={pending ? "loading" : "primary"}
                    >
                      {pending ? (
                        <span>
                          <LoaderCircle
                            className="inline-block animate-spin mr-2"
                            size={20}
                          />{" "}
                          Signing in
                        </span>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
