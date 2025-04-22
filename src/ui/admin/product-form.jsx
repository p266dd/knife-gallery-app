"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "motion/react";

import ManageHandlesModal from "./manage-handles-modal";
import ImageUpload from "./image-uploader";
import ManageSizeModal from "./manage-size-modal";

import { fetchHandles } from "@/actions/handles";

export default function ProductForm({ product }) {
  const [formData, setFormData] = useState({
    name: (product && product.name) || "",
    brand: (product && product.brand.name) || "",
    handle: (product && product.handle) || "",
    description: (product && product.description) || "",
  });

  // console.log(product);

  const handles = useSWR("fetchHandles", fetchHandles);
  // * Available properties => handles.data, handles.error, handles.isLoading

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <div className="mb-3">
          <input
            required
            name="name"
            placeholder="Product title"
            value={(formData && formData.name) || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3">
          <input
            required
            name="brand"
            placeholder="Brand name"
            value={(formData && formData.brand) || ""}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow">
            <select
              required
              name="handle"
              value={(formData && formData.handle) || ""}
              disabled={handles.isLoading}
              onChange={(e) =>
                setFormData({ ...formData, handle: e.target.value })
              }
              className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            >
              <option value="" disabled>
                {handles.isLoading ? "Loading..." : "Select a handle"}
              </option>
              {handles?.data &&
                handles.data.map((handle, i) => (
                  <option key={`handle-${i}`} value={handle.name}>
                    {handle.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex-shrink-0">
            <ManageHandlesModal handles={handles.data} />
          </div>
        </div>

        <div className="mb-3">
          <textarea
            name="description"
            placeholder="Describe your product"
            rows="3"
            value={(formData && formData.description) || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full text-sm px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          ></textarea>
        </div>
      </form>

      <div className="mb-5">
        <ImageUpload data={formData} setData={setFormData} />
      </div>

      <div className="mb-5">
        <ManageSizeModal
          data={formData}
          setData={setFormData}
          productId={(product && product.id) || null}
        />
      </div>

      {/* <ManageFiltersTable data={data} setData={setData} /> */}

      {/* <div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            className={`w-full px-3 py-2 ${loading ? "bg-slate-200 text-slate-700" : "bg-slate-700 text-white"} text-sm font-semibold rounded-xl`}
          >
            {loading ? <span> Adding...</span> : "Add New Item"}
          </motion.button>
        </div> */}

      {/* {error && error.length > 0 && (
          <div className="mt-3">
            {error.map((err, i) => (
              <p key={`error-${i}`} className="text-sm text-red-600">
                {err}
              </p>
            ))}
          </div>
        )}

        {message && message.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )} */}
    </div>
  );
}
