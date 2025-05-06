"use client";

import { useActionState, useState, useMemo } from "react";
import { motion } from "motion/react";
import { User, Mail, Key, Briefcase, FileDigit } from "lucide-react";

import addUser from "@/actions/add-user";
import updateUser from "@/actions/update-user";
import { removeUser } from "@/actions/remove-user";

import { generateRandomString } from "@/utils/generate-random-string";

export default function UserForm({ user, edit = false }) {
  const generatedPassword = useMemo(() => generateRandomString("password"), []);
  const generatedBusinessCode = useMemo(
    () => generateRandomString("businessCode"),
    []
  );
  const [state, formAction, isPending] = useActionState(
    edit ? updateUser : addUser,
    {
      errors: null,
      message: null,
    }
  );

  return (
    <div>
      <form action={formAction} className="relative">
        {edit && user && <input type="hidden" name="userId" value={user.id} />}
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex-grow flex items-center gap-3 px-3 py-2 bg-white border rounded-xl ${
              state?.errors && state?.errors?.role
                ? "border-red-500"
                : "border-slate-300"
            }`}
          >
            <input
              name="role"
              id="user-role"
              type="radio"
              value="user"
              defaultChecked={
                (user && user.role === "user") ||
                state?.role === "user" ||
                false
              }
            />
            <label className="flex-grow" htmlFor="user-role">
              User
            </label>
          </div>

          <div
            className={`flex-grow flex items-center gap-3 px-3 py-2 bg-white border rounded-xl ${
              state?.errors && state?.errors?.role
                ? "border-red-500"
                : "border-slate-300"
            }`}
          >
            <input
              name="role"
              id="admin-role"
              type="radio"
              value="admin"
              defaultChecked={
                (user && user.role === "admin") ||
                state?.role === "admin" ||
                false
              }
            />
            <label className="flex-grow" htmlFor="admin-role">
              Admin
            </label>
          </div>
        </div>
        <div>
          {state?.errors && state?.errors?.role && (
            <span className="text-red-600 text-xs font-semibold">
              {state.errors.role}
            </span>
          )}
        </div>

        <div className="mb-3 relative">
          <input
            required
            name="name"
            type="text"
            placeholder="Full Name"
            defaultValue={(user && user.name) || state?.name || ""}
            className={`w-full px-2 py-3 pl-7 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${
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
          <User size="14" className="absolute left-2 top-4 text-slate-500" />
        </div>

        <div className="mb-3 relative">
          <input
            required
            name="email"
            type="email"
            placeholder="Email address"
            defaultValue={(user && user.email) || state?.email || ""}
            className={`w-full px-2 py-3 pl-7 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${
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
          <Mail size="14" className="absolute left-2 top-4 text-slate-500" />
        </div>

        <div className="mb-3 relative">
          {/* Auto generate password */}
          <input
            placeholder={edit ? "Private" : "Auto-Generated"}
            disabled={true}
            readOnly={true}
            className="w-full px-2 py-3 pl-7 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
          <Key size="14" className="absolute left-2 top-4 text-slate-500" />
          {!user && (
            <input
              name="password"
              type="hidden"
              readOnly={true}
              value={generatedPassword}
            />
          )}
        </div>

        <div className="mb-3 relative">
          <input
            required
            name="businessName"
            type="text"
            placeholder="Business Name"
            defaultValue={
              (user && user.businessName) || state?.businessName || ""
            }
            className={`w-full px-2 py-3 pl-7 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${
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
          <Briefcase
            size="14"
            className="absolute left-2 top-4 text-slate-500"
          />
        </div>

        <div className="mb-3 relative">
          <input
            required
            name="businessCode"
            type="text"
            placeholder="Business Code"
            defaultValue={
              (user && user.businessCode) ||
              state?.businessCode ||
              (!user && generatedBusinessCode) ||
              ""
            }
            className={`w-full px-2 py-3 pl-7 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${
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
          <FileDigit
            size="14"
            className="absolute left-2 top-4 text-slate-500"
          />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="isActive"
              id="active"
              type="radio"
              value={1}
              defaultChecked={user && user.isActive}
            />
            <label className="flex-grow text-sm" htmlFor="active">
              Active
            </label>
          </div>

          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="isActive"
              id="notActive"
              type="radio"
              value={0}
              defaultChecked={user && !user.isActive}
            />
            <label className="flex-grow text-sm" htmlFor="notActive">
              Not Active
            </label>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            className={`w-full px-3 py-2 ${isPending ? "bg-slate-200 text-slate-700" : "bg-slate-700 text-white"} font-semibold rounded-xl`}
          >
            {isPending ? (
              edit ? (
                <span>Saving...</span>
              ) : (
                <span>Adding...</span>
              )
            ) : edit ? (
              "Save Changes"
            ) : (
              "Add User"
            )}
          </motion.button>
          {edit && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={async () => await removeUser(user.id)}
              className="w-full px-3 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              Delete
            </motion.button>
          )}
        </div>

        {state.message && state.message.length > 0 && (
          <div className="mt-3">
            <p className="text-green-600">{state.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
