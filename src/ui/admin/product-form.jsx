"use client";

import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";

import ImageUpload from "./image-uploader";
import ManageSizeModal from "./manage-size-modal";

import addProduct from "@/actions/add-product";
import updateProduct from "@/actions/update-product";
import { removeProduct } from "@/actions/remove-product";
import { Info } from "lucide-react";

export default function ProductForm({
  product = null,
  copy = null,
  handles = [],
  filters = [],
  brands = [],
  materials = [],
  edit = false,
}) {
  console.log("copy", copy);
  const [formData, setFormData] = useState(
    product || copy
      ? {
          id: product?.id,
          type: product?.type || copy?.type || "",
          name: product?.name || "(Copy) " + copy?.name || "",
          brand: product?.brand || copy?.brand || "",
          handle: product?.handle || copy?.handle || "",
          canChangeHandle:
            product?.canChangeHandle || copy?.canChangeHandle || false,
          style: product?.style || copy?.style || "",
          material: product?.material || copy?.material || "",
          description: product?.description || copy?.description || "",
          sizes: product?.sizes || copy?.sizes || [],
          filters: product?.filters || copy?.filters || [],
          media: product?.media || copy?.media || [],
          thumbnail: product?.thumbnail || copy?.thumbnail || "",
        }
      : {}
  );

  const [state, action, isPending] = useActionState(
    edit ? () => updateProduct(formData, product) : () => addProduct(formData),
    formData
  );

  return (
    <div>
      <form action={action} className="relative">
        <h3 className="pl-2 mb-1 text-slate-600 text-sm font-semibold">
          Product Type
        </h3>
        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div
              className={`flex-grow flex items-center gap-3 px-3 py-2 bg-white border rounded-xl ${state?.errors?.type ? "border-red-600" : "border-slate-300"}`}
            >
              <input
                name="type"
                id="typeKnife"
                type="radio"
                defaultChecked={formData?.type === "knife"}
                onChange={(e) =>
                  e.target.checked &&
                  setFormData((prev) => ({ ...prev, type: "knife" }))
                }
              />
              <label className="flex-grow" htmlFor="typeKnife">
                Knife
              </label>
            </div>

            <div
              className={`flex-grow flex items-center gap-3 px-3 py-2 bg-white border rounded-xl ${state?.errors?.type ? "border-red-600" : "border-slate-300"}`}
            >
              <input
                name="type"
                id="typeOther"
                type="radio"
                defaultChecked={formData?.type === "other"}
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
          {state?.errors && state?.errors?.type && (
            <span className="px-3 text-red-600 text-xs font-semibold">
              {state.errors.type}
            </span>
          )}
        </div>

        <div className="mb-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Product Name
          </h3>
          <input
            name="name"
            value={formData?.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${state?.errors?.name ? "border-red-600" : "border-slate-300"}`}
          />
          {state?.errors && state?.errors?.name && (
            <span className="px-3 text-red-600 text-xs font-semibold">
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
            value={formData?.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-2 py-3 whitespace-pre-line placeholder:text-slate-500 focus-visible:outline-0 border border-slate-200 rounded-xl bg-white shadow-xs"
          ></textarea>
        </div>

        <div className="mb-7 flex items-center gap-3">
          <h3 className="w-2/12 mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Brand
          </h3>
          <div className="flex-grow">
            <select
              name="brand"
              value={formData?.brand || ""}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className={`w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${state?.errors?.brand ? "border-red-600" : "border-slate-300"}`}
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
              <span className="px-3 text-red-600 text-xs font-semibold">
                {state.errors.brand}
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {formData?.type !== "other" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="mb-7"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="w-2/12 mb-1 pl-2 text-slate-600 text-sm font-semibold">
                    Handle
                  </h3>
                  <div className="flex-grow">
                    <div>
                      <select
                        name="handle"
                        value={formData?.handle || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, handle: e.target.value })
                        }
                        className={`w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${state?.errors?.handle ? "border-red-600" : "border-slate-300"}`}
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
                        <span className="px-3 text-red-600 text-xs font-semibold">
                          {state.errors.handle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pb-3 mt-3 flex items-center justify-end gap-3">
                  <label
                    htmlFor="canChangeHandle"
                    className="flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      id="canChangeHandle"
                      name="canChangeHandle"
                      defaultChecked={formData?.canChangeHandle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          canChangeHandle: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm">Can Change Handle</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {formData?.type !== "other" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
            className="mb-7"
          >
            <div className="flex items-center gap-3 ">
              <h3 className="pl-2 text-slate-600 text-sm font-semibold">
                Style
              </h3>
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-grow flex items-center gap-3 px-3 py-2 bg-white border rounded-xl ${state?.errors?.style ? "border-red-600" : "border-slate-300"}`}
                  >
                    <input
                      name="style"
                      id="westernStyle"
                      type="radio"
                      defaultChecked={formData?.style === "western"}
                      onChange={(e) =>
                        e.target.checked &&
                        setFormData((prev) => ({ ...prev, style: "western" }))
                      }
                    />
                    <label className="flex-grow" htmlFor="westernStyle">
                      Western
                    </label>
                  </div>

                  <div
                    className={`flex-grow flex items-center gap-3 px-3 py-2 bg-white border rounded-xl ${state?.errors?.style ? "border-red-600" : "border-slate-300"}`}
                  >
                    <input
                      name="style"
                      id="japaneseStyle"
                      type="radio"
                      defaultChecked={formData?.style === "japanese"}
                      onChange={(e) =>
                        e.target.checked &&
                        setFormData((prev) => ({ ...prev, style: "japanese" }))
                      }
                    />
                    <label className="flex-grow" htmlFor="japaneseStyle">
                      Japanese
                    </label>
                  </div>
                </div>
                {state?.errors && state?.errors?.style && (
                  <span className="px-3 text-red-600 text-xs font-semibold">
                    {state.errors.style}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {formData?.type !== "other" && (
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
                name="material"
                value={formData?.material || ""}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
                className={`w-full px-2 py-3 placeholder:text-slate-500 focus-visible:outline-0 border rounded-xl bg-white shadow-xs ${state?.errors?.material ? "border-red-600" : "border-slate-300"}`}
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
                <span className="px-3 text-red-600 text-xs font-semibold">
                  {state.errors.material}
                </span>
              )}
            </div>
          </motion.div>
        )}

        <div className="my-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Upload Images
          </h3>
          <ImageUpload data={formData} setData={setFormData} />
          <div className="pt-3">
            {state?.errors && state?.errors?.media && (
              <span className="block pb-3 pt-2 px-3 text-red-600 text-xs font-semibold">
                {state.errors.media}
              </span>
            )}
            {state?.errors && state?.errors?.thumbnail && (
              <span className="block pb-3 px-3 text-red-600 text-xs font-semibold">
                {state.errors.thumbnail}
              </span>
            )}
          </div>
        </div>

        <div className="mb-5">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Product Sizes
          </h3>
          <ManageSizeModal data={formData} setData={setFormData} edit={edit} />
          <div className="px-4 py-2">
            {state?.errors && state?.errors?.sizes && (
              <span className="text-red-600 text-xs font-semibold text-wrap">
                {state.errors.sizes}
              </span>
            )}
          </div>
        </div>

        <div className="my-7">
          <h3 className="mb-1 pl-2 text-slate-600 text-sm font-semibold">
            Filters
          </h3>
          <div>
            {filters && filters.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filters.map((filter, i) => (
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
                                  ...formData?.filters,
                                  { id: filter.id, name: filter.name },
                                ],
                              })
                            : setFormData({
                                ...formData,
                                filters: formData?.filters.filter(
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
            ) : (
              <div className="px-5">
                <p className="text-sm text-slate-600">
                  There are no registered filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {state?.message && (
          <div className="flex items-center gap-3 mt-3 px-3 py-2 text-green-800 bg-green-100 rounded-xl">
            <Info size={18} />
            <p>{state.message}</p>
          </div>
        )}

        {state?.errors && (
          <div className="flex items-center gap-3 mt-3 px-3 py-2 text-red-800 bg-red-100 rounded-xl">
            <Info size={18} />
            Please fix the errors to continue.
          </div>
        )}

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
      </form>
    </div>
  );
}
