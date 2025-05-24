"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle } from "lucide-react";

import BrandIcon from "@/ui/brand-icon";
import Button from "@/ui/button";

import ForgotPasswordAction from "./action";

export default function ForgotPassword() {
  const [state, action, pending] = useActionState(ForgotPasswordAction, {
    errors: {},
    data: {},
    message: "",
  });

  const router = useRouter();

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

              <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-3">
                  Forgot your password?
                </h1>
                <h3 className="text-sm text-slate-500">
                  Please enter your email and we will send you a code to reset
                  your password.
                </h3>
              </div>

              <div>
                <form
                  action={action}
                  className="text-sm text-slate-700 flex flex-col gap-3"
                >
                  {state && state?.message && (
                    <div className="px-3 py-2 text-xs font-semibold bg-blue-200 text-blue-900 rounded-xl">
                      {state.message}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      defaultValue={state?.data && state.data?.email}
                      className={`rounded-lg border-1 px-3 py-2 text-sm ${
                        state?.errors && state?.errors?.email
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
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant="flat"
                      onClick={() => router.back()}
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
