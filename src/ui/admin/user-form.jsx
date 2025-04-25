"use client";

import { useState } from "react";
import { motion } from "motion/react";

import addProduct from "@/actions/add-product";

export default function UserForm({ user, edit = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    businessName: "",
    businessCode: "",
    isActive: "",
  });

  // * Add a new product to database or save existing one.
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    if (edit) {
      updateUser(formData, user)
        .then((res) => {
          if (res.errors) {
            setError(res.errors);
            setLoading(false);
            setMessage(null);
            return;
          }
          setLoading(false);
          setMessage(null);
          setError(null);
          router.push("/dashboard/users");
        })
        .catch((error) => {
          setLoading(false);
          setError([error.message]);
          setMessage(null);
        });
      return;
    }

    addUser(formData)
      .then((res) => {
        if (res.errors) {
          setError(res.errors);
          setLoading(false);
          setMessage(null);
          return;
        }
        setLoading(false);
        setMessage(null);
        setError(null);
        router.push("/dashboard/users");
      })
      .catch((error) => {
        setLoading(false);
        setError([error.message]);
        setMessage(null);
      });
  };

  return (
    <div>
      <form className="relative">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="role"
              id="user-role"
              type="radio"
              defaultChecked={formData.role === "user"}
              disabled={edit && product.role === "user"}
              onChange={(e) =>
                e.target.checked &&
                setFormData((prev) => ({ ...prev, role: "user" }))
              }
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
              defaultChecked={formData.role === "admin"}
              disabled={edit && product.role === "admin"}
              onChange={(e) =>
                e.target.checked &&
                setFormData((prev) => ({ ...prev, role: "admin" }))
              }
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
            value={(formData && formData.name) || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="email"
            type="email"
            placeholder="Email address"
            value={(formData && formData.email) || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="password"
            type="text"
            placeholder="Password: Auto Generated"
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
            value={(formData && formData.businessName) || ""}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="businessCode"
            type="text"
            placeholder="Business Code"
            value={(formData && formData.businessCode) || ""}
            onChange={(e) =>
              setFormData({ ...formData, businessCode: e.target.value })
            }
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="isActive"
              id="active"
              type="radio"
              defaultChecked={formData.isActive === "active"}
              disabled={edit && product.isActive === "active"}
              onChange={(e) =>
                e.target.checked &&
                setFormData((prev) => ({ ...prev, isActive: "active" }))
              }
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
              defaultChecked={formData.isActive === "notActive"}
              disabled={edit && product.isActive === "notActive"}
              onChange={(e) =>
                e.target.checked &&
                setFormData((prev) => ({ ...prev, isActive: "notActive" }))
              }
            />
            <label className="flex-grow" htmlFor="notActive">
              Not Active
            </label>
          </div>
        </div>

        <div className="pt-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleSubmit}
            className={`w-full px-3 py-2 ${loading ? "bg-slate-200 text-slate-700" : "bg-slate-700 text-white"} font-semibold rounded-xl`}
          >
            {loading ? (
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

        {error && error.length > 0 && (
          <div className="mt-3">
            {error.map((err, i) => (
              <p key={`error-${i}`} className="text-red-600">
                {err}
              </p>
            ))}
          </div>
        )}

        {message && message.length > 0 && (
          <div className="mt-3">
            <p className="text-green-600">{message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
