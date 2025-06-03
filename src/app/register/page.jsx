"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";

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
                  <p className="text-center text-slate-800 mb-5 py-3 px-2 border border-slate-200 bg-slate-100 rounded-xl">
                    Please wait while our team review your aplication.
                  </p>
                  <Link href="/login">
                    <ArrowLeft size={16} className="inline-block mr-3" /> Go
                    Back
                  </Link>
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
                <h1 className="text-3xl text-center font-semibold">
                  Create a new account.
                </h1>
              </div>

              <div>
                <form
                  action={action}
                  className="text-slate-700 flex flex-col gap-3"
                >
                  {state && state?.message && (
                    <div className="px-3 py-2 font-semibold bg-blue-200 text-blue-900 rounded-xl">
                      {state.message}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      defaultValue={state?.data && state?.data?.name}
                      className={`rounded-lg border-1 px-3 py-2 ${
                        state?.errors && state?.errors?.name
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.name && (
                      <span className="text-red-600 font-semibold">
                        {state.errors.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      autoComplete="email"
                      defaultValue={state?.data && state?.data?.email}
                      className={`rounded-lg border-1 px-3 py-2 ${
                        state?.errors && state?.errors?.email
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.email && (
                      <span className="text-red-600 font-semibold">
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
                        id="password"
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
                      <span className="text-red-600 font-semibold">
                        {state.errors.password}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="businessName">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      id="businessName"
                      autoComplete="off"
                      defaultValue={state?.data && state?.data?.businessName}
                      className={`rounded-lg border-1 px-3 py-2 ${
                        state?.errors && state?.errors?.businessName
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.businessName && (
                      <span className="text-red-600 font-semibold">
                        {state.errors.businessName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="businessCode">Business Code</label>
                    <input
                      type="text"
                      name="businessCode"
                      id="businessCode"
                      autoComplete="off"
                      defaultValue={state?.data && state?.data?.businessCode}
                      className={`rounded-lg px-3 py-2 border-1 ${
                        state?.errors && state?.errors?.businessCode
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {state?.errors && state?.errors?.businessCode && (
                      <span className="text-red-600 font-semibold">
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
                      variant="ghost"
                      size="lg"
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
