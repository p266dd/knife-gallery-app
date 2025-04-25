"use client";

import { useState, useActionState } from "react";
import { motion } from "motion/react";

import addProduct from "@/actions/add-product";

export default function UserForm({ user, edit = false }) {
  const [state, formAction, isPending] = useActionState(addProduct, {
    error: null,
    message: null,
  });

  return (
    <div>
      <form onSubmit={formAction} className="relative">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="role"
              id="user-role"
              type="radio"
              defaultChecked={user && user.role === "user"}
            />
            <label className="flex-grow" htmlFor="user-role">
              User
            </label>
          </div>

          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="role"
              id="admin-role"
              type="radio"
              defaultChecked={user && user.role === "admin"}
              disabled={edit && product.role === "admin"}
            />
            <label className="flex-grow" htmlFor="admin-role">
              Admin
            </label>
          </div>
        </div>

        <div className="mb-3">
          <input
            required
            name="name"
            type="text"
            placeholder="Full Name"
            defaultValue={(user && user.name) || ""}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="email"
            type="email"
            placeholder="Email address"
            defaultValue={(user && user.email) || ""}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          {/* Auto generate password */}
          <input
            required
            name="password"
            type="password"
            placeholder="Auto Generated"
            disabled={true}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="businessName"
            type="text"
            placeholder="Business Name"
            defaultValue={(user && user.businessName) || ""}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="businessCode"
            type="text"
            placeholder="Business Code"
            defaultValue={(user && user.businessCode) || ""}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="isActive"
              id="active"
              type="radio"
              defaultChecked={user && user.isActive === "active"}
            />
            <label className="flex-grow" htmlFor="active">
              Active
            </label>
          </div>

          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="isActive"
              id="notActive"
              type="radio"
              defaultChecked={user && user.isActive === "notActive"}
            />
            <label className="flex-grow" htmlFor="notActive">
              Not Active
            </label>
          </div>
        </div>

        <div className="pt-4">
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
