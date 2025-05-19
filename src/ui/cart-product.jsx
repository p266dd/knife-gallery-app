"use client";

import Image from "next/image";
import { useState } from "react";
import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Loader, Pencil, Save, Trash2, X } from "lucide-react";

import { updateCart } from "@/actions/update-cart";
import { removeCart } from "@/actions/remove-cart";
import { set } from "lodash";

export default function CartProduct({ cartProduct, preferences }) {
  const product = cartProduct.product;

  const [open, setOpen] = useState(false);

  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [otherField, setOtherField] = useState(false);

  const [state, action, pending] = useActionState(updateCart, {});

  return (
    <div className="relative">
      <div className="mb-2">
        <motion.div
          whileTap={{ scale: 0.9, backgroundColor: "#f3f3f3" }}
          className="flex items-center p-2 gap-4 rounded-xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="relative w-1/4 h-28 sm:h-48 rounded-xl overflow-hidden">
            <Image
              src={
                product.thumbnail.url || "/img/product-image-placeholder.webp"
              }
              alt={product.name || "Product Image"}
              className="object-cover"
              fill
            />
          </div>

          <div className="w-3/4">
            <h3 className="sm:text-xl sm:font-semibold sm:mb-4">
              {product.name || "Product Name"}
            </h3>
            <h5 className="text-xs text-slate-600 sm:text-base">
              <ul>
                <li>Brand: {cartProduct.brand || "Standard"}</li>
                {product.type === "knife" && (
                  <li>Handle: {cartProduct.handle || "Standard"}</li>
                )}
                <li>
                  Request:{" "}
                  {(cartProduct?.request &&
                    cartProduct.request.substring(0, 20)) ||
                    "No special request."}
                </li>
                {/* Change the above to css. */}
              </ul>
            </h5>
          </div>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`rounded-xl bg-white border border-slate-300`}
            >
              <form
                className="className={`overflow-hidden flex flex-col pt-3"
                action={action}
                onSubmit={() => setShowUpdateBtn(false)}
              >
                <input
                  type="hidden"
                  name="productCartId"
                  value={cartProduct.id}
                />

                {showUpdateBtn && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    type="submit"
                    className="flex items-center justify-center gap-3 px-4 py-2 m-2 mt-0 bg-green-700 text-white text-sm sm:text-lg sm:font-semibold rounded-xl cursor-pointer"
                  >
                    {pending ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span>Saving</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                )}

                <div className="py-2 px-4">
                  <table className="w-full mb-5">
                    <thead>
                      <tr className="w-full text-xs sm:text-lg sm:font-semibold text-white">
                        <th className="w-5/12 py-1 px-2 text-left bg-slate-600 rounded-l-xl">
                          Size
                        </th>
                        <th className="w-3/12 py-1 px-2 text-center bg-slate-600">
                          Order
                        </th>
                        <th className="w-2/12 py-1 px-2 text-center bg-slate-600 rounded-r-xl">
                          Available
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {product.sizes.map((size, i) => (
                        <tr key={`size_${i}`}>
                          <td className="py-2 pl-2 text-left">
                            <span className="block text-sm mb-1 sm:text-lg sm:font-semibold">
                              {size.name}
                            </span>
                            <span className="block text-xs sm:text-base sm:text-slate-500">
                              {size.size} mm
                            </span>
                          </td>
                          <td className="py-2 text-center flex justify-center">
                            <div className="mx-2 sm:w-20 flex items-center gap-2 border border-slate-400 px-3 py-2 rounded-xl">
                              <input
                                className="w-full sm:w-20 appearance-none focus-visible:outline-0 placeholder:text-slate-500"
                                type="number"
                                name={`size_${size.id}`}
                                autoComplete="off"
                                defaultValue={
                                  JSON.parse(cartProduct.details).find(
                                    (d) => Number(d.id) === Number(size.id)
                                  ).quantity
                                }
                                max={size.stock}
                                step={1}
                                onChange={() => {
                                  setShowUpdateBtn(true);
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-2 text-center">{size.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex flex-col gap-3 px-2 py-3 m-2 border border-slate-300 rounded-xl">
                    <div className="relative flex gap-2 items-center px-2 py-1 pt-6 sm:pt-10 mb-4">
                      <label
                        className="absolute top-0 left-3 text-[10px] sm:text-base text-slate-700"
                        htmlFor="brand"
                      >
                        Choose engraving
                      </label>
                      <Pencil size={14} />

                      <div className="flex-grow">
                        <select
                          name="brand"
                          id="brand"
                          defaultValue={
                            (cartProduct && cartProduct.brand) ||
                            product.brand.toLowerCase()
                          }
                          disabled={product.brand !== "OEM"}
                          onChange={(e) => {
                            e.target.value === "other"
                              ? setOtherField(true)
                              : setOtherField(false);
                            setShowUpdateBtn(true);
                          }}
                          className="w-full focus-visible:outline-0 border-b border-slate-300 pb-2 pr-1 pt-1 sm:py-2 disabled:bg-slate-100"
                        >
                          <option value="" disabled>
                            Select an engraving for this product.
                          </option>

                          {cartProduct && (
                            <option value={cartProduct.brand}>
                              *{cartProduct.brand}
                            </option>
                          )}

                          {preferences.engraving &&
                            preferences.engraving.map((val, i) => {
                              return (
                                <option
                                  key={`preference-${i}`}
                                  value={val.name.toLowerCase()}
                                >
                                  {val.name}
                                </option>
                              );
                            })}

                          <option
                            className="capitalize"
                            value={product.brand.toLowerCase()}
                          >
                            {product.brand}
                          </option>
                          <option value="other">Other</option>
                        </select>

                        {otherField && (
                          <input
                            type="text"
                            name="brandOther"
                            placeholder="What do you want engraved?"
                            className="focus-visible:outline-0 w-full placeholder:text-slate-500 px-4 py-2 bg-slate-100 rounded-xl"
                          />
                        )}
                      </div>
                    </div>

                    {product.type === "knife" && (
                      <div className="relative flex gap-2 items-center px-2 py-1 pt-6 sm:pt-10 mb-6">
                        <label
                          className="absolute top-0 left-3 text-[10px] sm:text-base text-slate-700"
                          htmlFor="handle"
                        >
                          Choose Handle
                        </label>
                        <Pencil size={14} />
                        <input
                          type="text"
                          name="handle"
                          id="handle"
                          placeholder={product.handle}
                          defaultValue={cartProduct.handle || null}
                          onChange={() => {
                            setShowUpdateBtn(true);
                          }}
                          disabled={!product.canChangeHandle}
                          className="focus-visible:outline-0 w-full placeholder:text-slate-500 text-sm  border-b border-slate-300 pb-2 py-1 pl-1 sm:py-2 disabled:bg-slate-100"
                        />
                      </div>
                    )}

                    <div className="relative flex gap-2 items-center px-2 py-1 pt-6 sm:pt-10 mb-6">
                      <label
                        className="absolute top-0 left-3 text-[10px] sm:text-base text-slate-700"
                        htmlFor="request"
                      >
                        Special Request
                      </label>
                      <Pencil size={14} />
                      <textarea
                        name="request"
                        id="request"
                        placeholder="No special request."
                        defaultValue={cartProduct.request || null}
                        onChange={() => {
                          setShowUpdateBtn(true);
                        }}
                        className="focus-visible:outline-0 w-full placeholder:text-slate-500 text-sm sm:text-base  border-b border-slate-300 pb-2"
                      />
                    </div>
                  </div>
                </div>

                {showUpdateBtn && (
                  <div className="px-3 pr-6 mb-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ x: -60, opacity: 0 }}
                      type="submit"
                      className="flex items-center w-full justify-center gap-3 px-4 py-2 m-2 mt-0 bg-green-700 text-white text-sm sm:text-lg sm:font-semibold rounded-xl cursor-pointer"
                    >
                      {pending ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          <span>Saving</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                <div className="flex items-center gap-2 px-6 mb-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    type="button"
                    onClick={async () =>
                      showDeleteBtn
                        ? await removeCart({ cartProductId: cartProduct.id })
                        : setShowDeleteBtn(true)
                    }
                    className={`flex items-center gap-3 px-4 py-2 sm:py-3 mb-4 transition-colors flex-grow ${showDeleteBtn ? "bg-red-700 text-white" : "bg-red-200 text-red-700"}  text-sm sm:text-base rounded-xl`}
                  >
                    <Trash2 size={16} />
                    <span>{showDeleteBtn ? "Remove" : "Remove Product"}</span>
                    {showDeleteBtn && (
                      <span className="text-white/60">Are you sure?</span>
                    )}
                  </motion.button>
                  {showDeleteBtn && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ x: -60, opacity: 0 }}
                      className="px-3 py-2 sm:py-3 mb-4 text-sm sm:text-base rounded-xl bg-slate-200"
                      onClick={() => setShowDeleteBtn(false)}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
