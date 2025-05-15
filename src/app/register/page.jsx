"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import BrandIcon from "@/ui/brand-icon";
import Button from "@/ui/button";

import RegisterAction from "./action";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(RegisterAction, {
    errors: {},
    data: {},
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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

  if (state?.success) {
    return (
      <main className="flex h-full overflow-hidden py-3">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-11/12 max-w-96">
            <AnimatePresence>
              <motion.div
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

                <div className="mb-6 flex flex-col items-center">
                  <h1 className="text-2xl font-semibold mb-2">Success!</h1>
                  <h4 className="text-lg text-slate-500 mb-4">
                    Your application has been received.
                  </h4>
                  <p className="text-sm text-center text-slate-600 mb-3">
                    Please wait while our team review your aplication.
                  </p>
                  <Link href="/login">Go Back</Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full overflow-hidden py-3">
      <div className="w-full h-full  flex flex-col justify-center items-center">
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

              <div className="mb-6">
                <h1 className="text-2xl font-semibold">
                  Create a new account.
                </h1>
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
                    <label htmlFor="name" className="text-sm">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      defaultValue={state?.data?.name || null}
                      className={`rounded-lg border-1 px-3 py-2 text-sm ${
                        state?.errors && state?.errors?.name
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.name && (
                      <span className="text-red-600 text-xs font-semibold">
                        {state.errors.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm">
                      Email Address
                    </label>
                    <input
                      type="text"
                      name="email"
                      autoComplete="email"
                      defaultValue={state?.data?.email || null}
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
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        defaultValue={state?.data?.password || null}
                        className={`w-full rounded-lg border-1 px-3 py-2 text-sm ${
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
                      <span className="text-red-600 text-xs font-semibold">
                        {state.errors.password}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="businessName" className="text-sm">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      autoComplete="off"
                      defaultValue={state?.data?.businessName || null}
                      className={`rounded-lg border-1 px-3 py-2 text-sm ${
                        state?.errors && state?.errors?.businessName
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.businessName && (
                      <span className="text-red-600 text-xs font-semibold">
                        {state.errors.businessName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="businessCode" className="text-sm">
                      Business Code
                    </label>
                    <input
                      type="text"
                      name="businessCode"
                      autoComplete="off"
                      defaultValue={state?.data?.businessCode || null}
                      className={`rounded-lg px-3 py-2 text-sm border-1 ${
                        state?.errors && state?.errors?.businessCode
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.businessCode && (
                      <span className="text-red-600 text-xs font-semibold">
                        {state.errors.businessCode}
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
                          />
                          Creating Account
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant="flat"
                      onClick={() => router.back()}
                    >
                      Back
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
