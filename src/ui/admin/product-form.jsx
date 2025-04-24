"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "motion/react";

import ManageHandlesModal from "./manage-handles-modal";
import ManageBrandsModal from "./manage-brands-modal";
import ImageUpload from "./image-uploader";
import ManageSizeModal from "./manage-size-modal";
import ManageFilters from "./manage-filters";

import { fetchHandles } from "@/actions/handles";
import { fetchFilters } from "@/actions/filters";
import { fetchBrands } from "@/actions/brands";

import addProduct from "@/actions/add-product";
import updateProduct from "@/actions/update-product";

export default function ProductForm({ product, edit = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    id: (product && product.id) || "",
    type: (product && product.type) || "",
    name: (product && product.name) || "",
    brand: (product && product.brand) || "",
    handle: (product && product.handle) || "",
    description: (product && product.description) || "",
    sizes: (product && product.sizes) || "",
    filters: (product && product.filters) || "",
    media: (product && product.media) || [],
    thumbnail: (product && product.thumbnail) || "",
  });

  const router = useRouter();

  // * Available properties SWR => handles.data, handles.error, handles.isLoading
  const handles = useSWR("fetchHandles", fetchHandles);
  const filters = useSWR("fetchFilters", fetchFilters);
  const brands = useSWR("fetchBrands", fetchBrands);

  // * Add a new product to database or save existing one.
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    if (edit) {
      updateProduct(formData, product)
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
          router.push("/dashboard/products");
        })
        .catch((error) => {
          setLoading(false);
          setError([error.message]);
          setMessage(null);
        });
      return;
    }

    addProduct(formData)
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
        router.push("/dashboard/products");
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
          {(edit && product.type === "knife") || !edit ? (
            <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
              <input
                name="type"
                id="typeKnife"
                type="radio"
                defaultChecked={formData.type === "knife"}
                disabled={edit && product.type === "knife"}
                onChange={(e) =>
                  e.target.checked &&
                  setFormData((prev) => ({ ...prev, type: "knife" }))
                }
              />
              <label className="flex-grow" htmlFor="typeKnife">
                Knife
              </label>
            </div>
          ) : null}

          {(edit && product.type === "other") || !edit ? (
            <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
              <input
                name="type"
                id="typeOther"
                type="radio"
                defaultChecked={formData.type === "other"}
                disabled={edit && product.type === "other"}
                onChange={(e) =>
                  e.target.checked &&
                  setFormData((prev) => ({ ...prev, type: "other" }))
                }
              />
              <label className="flex-grow" htmlFor="typeOther">
                Other
              </label>
            </div>
          ) : null}
        </div>
        <div className="mb-3">
          <input
            required
            name="name"
            placeholder="Product title"
            value={(formData && formData.name) || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-grow">
            <select
              required
              name="brand"
              value={(formData && formData.brand) || ""}
              disabled={brands.isLoading}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            >
              <option value="" disabled>
                {brands.isLoading ? "Loading..." : "Select a brand"}
              </option>
              {brands?.data &&
                brands.data.map((brand, i) => (
                  <option key={`brand-${i}`} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex-shrink-0">
            <ManageBrandsModal brands={brands.data} />
          </div>
        </div>

        <AnimatePresence>
          {formData.type === "knife" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="mb-3 flex items-center gap-3"
            >
              <div className="flex-grow">
                <select
                  required
                  name="handle"
                  value={(formData && formData.handle) || ""}
                  disabled={handles.isLoading}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-3">
          <textarea
            name="description"
            placeholder="Describe your product"
            rows="3"
            value={(formData && formData.description) || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          ></textarea>
        </div>
      </form>

      <div className="mb-5">
        <ImageUpload data={formData} setData={setFormData} />
      </div>

      <div className="mb-5">
        <ManageSizeModal data={formData} setData={setFormData} edit={edit} />
      </div>

      <ManageFilters
        data={formData}
        setData={setFormData}
        filters={filters?.data}
      />

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
            "Add New Product"
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
    </div>
  );
}
