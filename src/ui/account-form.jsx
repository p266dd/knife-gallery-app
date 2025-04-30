"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, PlusCircle, SaveAll, Trash2 } from "lucide-react";

import updateOwnUser from "@/actions/update-own-user";

export default function AccountForm({ user }) {
  const [showFormSave, setShowFormSave] = useState(false);
  const [showEngravingSave, setShowEngravingSave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [engravingPreferences, setEngravingPreferences] = useState(
    user?.engraving ? JSON.parse(user.engraving) : []
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
    setEngravingPreferences((prev) =>
      prev.filter((pref) => pref.name !== name)
    );
  };

  const [state, action] = useActionState(updateOwnUser, {});

  return (
    <form action={action} onChange={() => setShowFormSave(true)}>
      <div className="mb-6">
        <h3 className="text-xl font-bold">Account Information</h3>
      </div>

      {state && state.message && (
        <div className="px-3 py-2 text-xs font-semibold bg-blue-200 text-blue-900 rounded-xl">
          {state.message}
        </div>
      )}

      <div className="mb-9 flex flex-col gap-3">
        <div className="relative flex flex-col">
          <label
            htmlFor="name"
            className="block text-sm px-2 py-1 text-slate-600"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={user && user.name}
            placeholder="Enter your name"
            className={`block px-3 py-2 text-sm border bg-white rounded-xl focus-visible:outline-0 focus-visible:border-slate-700 ${
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

        <div className="relative flex flex-col">
          <label
            htmlFor="email"
            className="block text-sm px-2 py-1 text-slate-600"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={user && user.email}
            placeholder="account@email.com"
            className={`block px-3 py-2 text-sm border bg-white rounded-xl focus-visible:outline-0 focus-visible:border-slate-700 ${
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

        <div className="relative flex flex-col">
          <label
            htmlFor="password"
            className="block text-sm px-2 py-1 text-slate-600"
          >
            Change your password
          </label>
          <div className="relative w-full">
            <span
              className="absolute right-4 top-3 text-slate-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="*******"
              className="w-full block px-3 py-2 text-sm border border-slate-400 bg-white rounded-xl focus-visible:outline-0 focus-visible:border-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold">Company Details</h3>
      </div>

      <div className="mb-9">
        <div className="w-full flex items-center gap-3">
          <div className="relative flex-grow flex flex-col">
            <label
              htmlFor="businessName"
              className="block text-sm px-2 py-1 text-slate-600"
            >
              Company Name
            </label>
            <input
              type="text"
              name="businessName"
              id="businessName"
              defaultValue={user && user.businessName}
              placeholder="Type your company name"
              className={`block px-3 py-2 text-sm border bg-white rounded-xl focus-visible:outline-0 focus-visible:border-slate-700 ${
                state?.errors && state?.errors?.email
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />
            {state?.errors && state?.errors?.businessname && (
              <span className="text-red-600 text-xs font-semibold">
                {state.errors.businessname}
              </span>
            )}
          </div>

          <div className="relative w-[90px] flex flex-col">
            <label
              htmlFor="businessCode"
              className="block text-sm px-2 py-1 text-slate-600"
            >
              Code
            </label>
            <input
              type="text"
              name="businessCode"
              id="businessCode"
              defaultValue={user && user.businessCode}
              placeholder="IC3245"
              max={7}
              className={`block px-3 py-2 text-sm border bg-white rounded-xl focus-visible:outline-0 focus-visible:border-slate-700 ${
                state?.errors && state?.errors?.email
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
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold">Preferences</h3>
      </div>

      <div className="relative flex-grow flex flex-col gap-2">
        <label
          htmlFor="engravingPref"
          className="block text-sm px-2 py-1 text-slate-600"
        >
          Engraving
        </label>

        <div className="relative overflow-hidden">
          <AnimatePresence>
            {showEngravingSave && (
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ type: "spring", duration: 0.35 }}
                type="button"
                className="absolute top-2 right-2 flex gap-2 items-center px-3 py-1 bg-green-700 text-white text-xs font-bold rounded-xl cursor-pointer"
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
            onChange={(e) =>
              e.target.value.length >= 3
                ? setShowEngravingSave(true)
                : setShowEngravingSave(false)
            }
            className="block w-full px-3 py-2 text-sm border border-slate-400 bg-white rounded-xl focus-visible:outline-0 focus-visible:border-slate-700"
          />
          <input
            name="engraving"
            type="hidden"
            value={engravingPreferences && JSON.stringify(engravingPreferences)}
          />
        </div>

        {engravingPreferences && engravingPreferences.length >= 1 && (
          <div className="border border-slate-400 bg-white text-sm rounded-xl">
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
          <div className="px-3 py-2 mt-5 text-xs font-semibold bg-blue-200 text-blue-900 rounded-xl">
            {state.message}
          </div>
        )}

        <div className="mb-6">
          <AnimatePresence>
            {showFormSave && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full flex items-center justify-center gap-3 py-3 bg-green-600 text-white text-sm font-bold rounded-xl`}
                type="submit"
                onClick={() => setShowFormSave(false)}
              >
                <SaveAll size={18} />
                <span>Save</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
