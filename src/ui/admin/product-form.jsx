"use client";

import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";

import ImageUpload from "./image-uploader";
import ManageSizeModal from "./manage-size-modal";
import ManageFilters from "./manage-filters";

import addProduct from "@/actions/add-product";
import updateProduct from "@/actions/update-product";
import { removeProduct } from "@/actions/remove-product";
import { Info } from "lucide-react";

export default function ProductForm({
  product,
  handles,
  filters,
  brands,
  materials,
  edit = false,
}) {
  const [formData, setFormData] = useState({
    id: (product && product.id) || "",
    type: (product && product.type) || "",
    name: (product && product.name) || "",
    brand: (product && product.brand) || "",
    handle: (product && product.handle) || "",
    material: (product && product.material) || "",
    description: (product && product.description) || "",
    sizes: (product && product.sizes) || "",
    filters: (product && product.filters) || "",
    media: (product && product.media) || [],
    thumbnail: (product && product.thumbnail) || "",
  });

  const [state, action, isPending] = useActionState(
    edit ? () => updateProduct(formData, product) : () => addProduct(formData),
    {}
  );

  return (
    <div>
      <form action={action} className="relative">
        <h3 className="pl-2 mb-1 text-slate-600 text-sm font-semibold">
          Product Type
        </h3>
        <div className="flex items-center gap-3 mb-7">
          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="type"
              id="typeKnife"
              type="radio"
              defaultChecked={formData.type === "knife"}
              onChange={(e) =>
                e.target.checked &&
                setFormData((prev) => ({ ...prev, type: "knife" }))
              }
            />
            <label className="flex-grow" htmlFor="typeKnife">
              Knife
            </label>
          </div>

          <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-white border border-slate-300 rounded-xl">
            <input
              name="type"
              id="typeOther"
              type="radio"
              defaultChecked={formData.type === "other"}
              onChange={(e) =>
                e.target.checked &&
                setFormData((prev) => ({ ...prev, type: "other" }))
              }
            />
            <label className="flex-grow" htmlFor="typeOther">
              Other
            </label>
          </div>
        </div>
        <div className="mb-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Product Name
          </h3>
          <input
            required
            name="name"
            value={(formData && formData.name) || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          />
          {state?.errors && state?.errors?.name && (
            <span className="text-red-600 text-xs font-semibold">
              {state.errors.name}
            </span>
          )}
        </div>

        <div className="relative mb-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Product Description
          </h3>
          <textarea
            name="description"
            rows={5}
            value={(formData && formData.description) || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-2 py-3 whitespace-pre-line placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          ></textarea>
          {state?.errors && state?.errors?.description && (
            <span className="text-red-600 text-xs font-semibold">
              {state.errors.description}
            </span>
          )}
        </div>

        <div className="mb-7 flex items-center gap-3">
          <h3 className="w-2/12 mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Brand
          </h3>
          <div className="flex-grow">
            <select
              required
              name="brand"
              value={(formData && formData.brand) || ""}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            >
              <option value="" disabled>
                Select
              </option>
              {brands &&
                brands.map((brand, i) => (
                  <option key={`brand-${i}`} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
            </select>
            {state?.errors && state?.errors?.brand && (
              <span className="text-red-600 text-xs font-semibold">
                {state.errors.brand}
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {formData.type !== "other" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="mb-7 flex items-center gap-3"
            >
              <h3 className="w-2/12 mb-1 pl-2 text-slate-600 text-sm font-semibold">
                Handle
              </h3>
              <div className="flex-grow">
                <select
                  required
                  name="handle"
                  value={(formData && formData.handle) || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {handles &&
                    handles.map((handle, i) => (
                      <option key={`handle-${i}`} value={handle.name}>
                        {handle.name}
                      </option>
                    ))}
                </select>
                {state?.errors && state?.errors?.handle && (
                  <span className="text-red-600 text-xs font-semibold">
                    {state.errors.handle}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
          className="mb-7 flex items-center gap-3"
        >
          <h3 className="w-2/12 mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Material
          </h3>
          <div className="flex-grow">
            <select
              required
              name="material"
              value={(formData && formData.material) || ""}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
              className="w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
            >
              <option value="" disabled>
                Select
              </option>
              {materials &&
                materials.map((material, i) => (
                  <option key={`material-${i}`} value={material.name}>
                    {material.name}
                  </option>
                ))}
            </select>
            {state?.errors && state?.errors?.material && (
              <span className="text-red-600 text-xs font-semibold">
                {state.errors.material}
              </span>
            )}
          </div>
        </motion.div>

        <div className="my-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Upload Images
          </h3>
          <ImageUpload data={formData} setData={setFormData} />
          {state?.errors && state?.errors?.media && (
            <span className="text-red-600 text-xs font-semibold">
              {state.errors.media}
            </span>
          )}
        </div>

        <div className="mb-5">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Product Sizes
          </h3>
          <ManageSizeModal data={formData} setData={setFormData} edit={edit} />
          {state?.errors && state?.errors?.sizes && (
            <span className="text-red-600 text-xs font-semibold">
              {state.errors.sizes}
            </span>
          )}
        </div>

        <div className="my-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Filters
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {filters &&
              filters.map((filter, i) => (
                <div
                  key={`filter-${i}`}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-xl"
                >
                  <label htmlFor="filter" className="flex items-center gap-3">
                    <input
                      id="filter"
                      name="filter"
                      type="checkbox"
                      defaultChecked={product.filters.some(
                        (f) => f.name === "Limited"
                      )}
                      onChange={(e) =>
                        e.target.checked
                          ? setFormData({
                              ...formData,
                              filters: [
                                ...formData.filters,
                                { id: filter.id, name: filter.name },
                              ],
                            })
                          : setFormData({
                              ...formData,
                              filters: formData.filters.filter(
                                (f) => f.name !== filter.name
                              ),
                            })
                      }
                    />
                    <span>{filter.name}</span>
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
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
              "Add New Product"
            )}
          </motion.button>

          {edit && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={async () => await removeProduct(product.id)}
              className="w-full px-3 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              Delete
            </motion.button>
          )}
        </div>

        {state?.message && (
          <div className="flex items-center gap-3 mt-3 px-3 py-2 text-green-800 bg-green-100 rounded-xl">
            <Info size={18} />
            <p>{state.message}</p>
          </div>
        )}
        {state?.errors ||
          (state?.generalError && (
            <div className="flex items-center gap-3 mt-3 px-3 py-2 text-red-800 bg-red-100 rounded-xl">
              <Info size={18} />
              {state?.generalError ? (
                <p>{state.generalError}</p>
              ) : (
                <p>Some errors occured, please check.</p>
              )}
            </div>
          ))}
      </form>
    </div>
  );
}
