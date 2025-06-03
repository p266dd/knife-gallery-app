"use client";

import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

import BrandIcon from "@/ui/brand-icon";
import Button from "@/ui/button";

import ResetPasswordAction from "./action";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, pending] = useActionState(ResetPasswordAction, {
    errors: {},
    data: {},
    message: "",
  });

  const router = useRouter();

  // Redirect user to login page after 2 seconds.
  if (state?.success) {
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

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
    <main className="flex min-h-screen overflow-hidden bg-slate-100">
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-11/12 max-w-96">
          <AnimatePresence>
            <motion.div
              key="signup"
              variants={formAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full p-6 bg-white rounded-lg shadow-md"
            >
              <div className="my-6">
                <BrandIcon />
              </div>

              <div className="mb-8 flex flex-col items-center gap-2">
                <h1 className="text-3xl text-center font-semibold mb-3">
                  Reset your password.
                </h1>
                <h3 className="text-slate-500 text-center">
                  Please enter the code sent to your email.
                </h3>
              </div>

              <div>
                <form
                  action={action}
                  className="text-slate-700 flex flex-col gap-3"
                >
                  {state && state?.message && (
                    <div className="px-3 py-2 bg-blue-200 text-blue-900 rounded-xl">
                      {state.message}
                    </div>
                  )}

                  <div className="flex flex-row items-center gap-4 p-4 rounded-lg">
                    <label htmlFor="code">Code</label>
                    <input
                      type="text"
                      name="code"
                      id="code"
                      autoComplete="off"
                      max={6}
                      defaultValue={state?.data && state.data?.code}
                      className={`w-full rounded-lg border-1 border-slate-300 bg-white px-3 py-2 ${
                        state?.errors && state?.errors?.code
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.code && (
                      <span className="text-red-600">{state.errors.code}</span>
                    )}
                  </div>

                  {/* Only show after code has been sent and confirmed. */}
                  {state?.sent && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="password">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            defaultValue={state?.data && state?.data?.password}
                            className={`w-full rounded-lg border-1 px-3 py-2 ${
                              state?.errors && state?.errors?.password
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
                          <span className="text-red-600">
                            {state.errors.password}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="password">Confirm password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            defaultValue={
                              state?.data && state?.data?.confirmPassword
                            }
                            className={`w-full rounded-lg border-1 border-slate-300 px-3 py-2 ${
                              state?.errors && state?.errors?.confirmPassword
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
                        {state?.errors && state?.errors?.confirmPassword && (
                          <span className="text-red-600">
                            {state.errors.confirmPassword}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      size="lg"
                      type="submit"
                      variant={pending ? "loading" : "primary"}
                    >
                      {pending ? (
                        <span>
                          <LoaderCircle
                            className="inline-block animate-spin mr-2"
                            size={20}
                          />{" "}
                          Loading
                        </span>
                      ) : state?.sent ? (
                        "Reset Password"
                      ) : (
                        "Confirm Code"
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={() => router.push("/login")}
                    >
                      Cancel
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
