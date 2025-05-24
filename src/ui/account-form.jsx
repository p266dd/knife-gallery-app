"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader, PlusCircle, SaveAll, Trash2 } from "lucide-react";

import updateOwnUser from "@/actions/update-own-user";

export default function AccountForm({ user }) {
  const [showFormSave, setShowFormSave] = useState(false);
  const [showEngravingSave, setShowEngravingSave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [engravingPreferences, setEngravingPreferences] = useState(
    user && user?.engraving ? JSON.parse(user.engraving) : []
  );

  const engravingInputRef = useRef(null);

  const handleAddEngraving = () => {
    const currentEngravingInput = engravingInputRef.current.value;
    setEngravingPreferences((prev) => [
      ...prev,
      { name: currentEngravingInput },
    ]);

    setShowEngravingSave(false);
    engravingInputRef.current.value = "";
  };

  const handleRemoveEngraving = (name) => {
    setShowFormSave(true);
    setEngravingPreferences((prev) =>
      prev.filter((pref) => pref.name !== name)
    );
  };

  const [state, action, pending] = useActionState(updateOwnUser, {
    message: "",
    errors: {},
    user: user,
  });

  return (
    <form action={action} onChange={() => setShowFormSave(true)}>
      {state && state?.message && (
        <div className="px-3 py-2 sm:py-3 mb-4 text-xs sm:text-base font-semibold bg-blue-200 text-blue-900 rounded-xl">
          {state.message}
        </div>
      )}

      <AnimatePresence>
        {showFormSave && (
          <div className="mb-4 flex justify-end sm:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`w-full sm:w-40 flex items-center justify-center gap-3 py-3 bg-green-600 text-white text-sm sm:text-base font-bold rounded-xl cursor-pointer`}
              type="submit"
              onClick={() => setShowFormSave(false)}
            >
              <SaveAll size={18} />
              <span>Save</span>
            </motion.button>
          </div>
        )}
        {pending && (
          <div className="mb-4 flex justify-end sm:hidden">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`w-full sm:w-40 flex items-center justify-center gap-3 py-3 bg-green-600 text-white text-sm sm:text-base font-bold rounded-xl cursor-pointer`}
            >
              <Loader size={18} className="animate-spin" />
              <span>Saving</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:gap-10 sm:flex-row">
        <div className="flex-1 mb-9 flex flex-col gap-3">
          <div className="mb-3">
            <h3 className="text-xl font-bold">Account Information</h3>
          </div>

          <div className="mb-4">
            <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
              Full Name
            </h3>
            <input
              required
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              defaultValue={state?.user && state?.user.name}
              className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            />
            {state?.errors && state?.errors?.name && (
              <span className="text-red-600 text-xs font-semibold">
                {state.errors.name}
              </span>
            )}
          </div>

          <div className="mb-4">
            <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
              Email
            </h3>
            <input
              required
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              defaultValue={state?.user && state?.user.email}
              className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            />
            {state?.errors && state?.errors?.email && (
              <span className="text-red-600 text-xs font-semibold">
                {state.errors.email}
              </span>
            )}
          </div>

          <div className="mb-7">
            <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
              Change your password.
            </h3>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="******"
                className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
              />
              <span
                className="absolute right-4 top-4 text-slate-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>
            {state?.errors && state?.errors?.password && (
              <span className="text-red-600 text-xs font-semibold">
                {state.errors.password}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Company Details</h3>
          </div>

          <div className="mb-9">
            <div className="w-full flex items-center gap-3">
              <div className="mb-4">
                <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
                  Business Name
                </h3>
                <input
                  required
                  type="text"
                  name="businessName"
                  id="businessName"
                  defaultValue={state?.user && state?.user?.businessName}
                  autoComplete="off"
                  className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
                />
                {state?.errors && state?.errors?.businessName && (
                  <span className="text-red-600 text-xs font-semibold">
                    {state.errors.businessName}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
                  Business Code
                </h3>
                <input
                  required
                  type="text"
                  name="businessCode"
                  id="businessCode"
                  defaultValue={state?.user && state?.user?.businessCode}
                  autoComplete="off"
                  className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
                />
                {state?.errors && state?.errors?.businessCode && (
                  <span className="text-red-600 text-xs font-semibold">
                    {state.errors.businessCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold">Preferences</h3>
          </div>

          <div className="relative flex-grow flex flex-col gap-2">
            <div className="mb-4 relative">
              <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
                Engraving
              </h3>

              <AnimatePresence>
                {showEngravingSave && (
                  <motion.button
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.35 }}
                    type="button"
                    className="absolute bottom-2 right-3 flex gap-2 items-center px-3 py-2 bg-green-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    onClick={handleAddEngraving}
                  >
                    <PlusCircle size={14} className="inline-block" />
                    Add
                  </motion.button>
                )}
              </AnimatePresence>

              <input
                ref={engravingInputRef}
                type="text"
                name="engravingPref"
                id="engravingPref"
                placeholder="Add a new engraving preference"
                autoComplete="off"
                onChange={(e) =>
                  e.target.value.length >= 3
                    ? setShowEngravingSave(true)
                    : setShowEngravingSave(false)
                }
                className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
              />
              <input
                name="engraving"
                type="hidden"
                value={
                  engravingPreferences && JSON.stringify(engravingPreferences)
                }
              />
            </div>

            {engravingPreferences && engravingPreferences.length >= 1 && (
              <div className="border border-slate-200 shadow-xs bg-white text-sm rounded-xl">
                <h5 className="px-2 py-2 text-xs bg-slate-700 text-white font-bold rounded-t-xl">
                  Saved
                </h5>
                <div className="flex flex-col gap-2 p-3">
                  <AnimatePresence>
                    {engravingPreferences.map((item, i) => (
                      <motion.div
                        layout
                        initial={{ y: -30, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: { type: "easeOut", duration: 0.3 },
                        }}
                        exit={{ x: 30, opacity: 0 }}
                        className="relative bg-slate-100 px-4 py-2 rounded-xl text-slate-700"
                        key={i}
                      >
                        {item.name}

                        <button
                          type="button"
                          className="absolute top-2 right-3 text-red-600 cursor-pointer"
                          onClick={() => handleRemoveEngraving(item.name)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {state && state.message && (
              <div className="sm:hidden px-3 py-2 text-xs font-semibold bg-blue-200 text-blue-900 rounded-xl">
                {state.message}
              </div>
            )}

            <div className="mb-6 flex justify-end">
              <AnimatePresence>
                {showFormSave && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`w-full sm:w-40 flex items-center justify-center gap-3 py-3 bg-green-600 text-white text-sm sm:text-base font-bold rounded-xl cursor-pointer`}
                    type="submit"
                    onClick={() => setShowFormSave(false)}
                  >
                    <SaveAll size={18} />
                    <span>Save</span>
                  </motion.button>
                )}
                {pending && (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`w-full sm:w-40 flex items-center justify-center gap-3 py-3 bg-green-600 text-white text-sm sm:text-base font-bold rounded-xl cursor-pointer`}
                  >
                    <Loader size={18} className="animate-spin" />
                    <span>Saving</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
