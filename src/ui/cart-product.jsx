"use client";

import Image from "next/image";
import { useState } from "react";
import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Loader, Pencil, Save, Trash2, X, XCircle } from "lucide-react";

import ProductPlaceholder from "@/assets/product-image-placeholder.webp";
import ProductBlur from "@/assets/image-blur.gif";

import { updateCart } from "@/actions/update-cart";
import { removeCart } from "@/actions/remove-cart";

export default function CartProduct({ cartProduct, preferences, hasError, setHasError }) {
  const [open, setOpen] = useState(false);

  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const [otherField, setOtherField] = useState(false);
  const [otherHandle, setOtherHandle] = useState(false);

  const [state, action, pending] = useActionState(updateCart, {
    message: "",
    errors: "",
    product: cartProduct?.product,
    cartProduct: cartProduct,
  });

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
              src={state.product?.thumbnail?.url || ProductPlaceholder}
              placeholder="blur"
              blurDataURL={ProductBlur}
              alt={state.product?.name || "Product Image"}
              className="object-cover"
              fill
            />
          </div>

          <div className="w-3/4">
            <h3 className="sm:text-xl sm:font-semibold sm:mb-4">
              {state.product?.name || "Product Name"}
            </h3>
            <h5 className="text-xs text-slate-600 sm:text-base">
              <ul>
                <li>
                  Brand:{" "}
                  <strong>{state?.cartProduct?.brand || state?.product?.brand}</strong>
                </li>
                {state?.product.type === "knife" && (
                  <li>
                    Handle:{" "}
                    <strong>{state.cartProduct?.handle || state?.product?.handle}</strong>
                  </li>
                )}
                <li>
                  Request:{" "}
                  <strong>
                    {(state?.cartProduct?.request &&
                      state?.cartProduct.request.substring(0, 20)) ||
                      "No special request."}
                  </strong>
                </li>
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
                <input type="hidden" name="productCartId" value={state?.cartProduct.id} />

                {showUpdateBtn && !pending && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    type="submit"
                    className="flex items-center justify-center gap-3 px-4 py-2 m-2 mt-0 bg-green-700 text-white text-sm sm:text-lg sm:font-semibold rounded-xl cursor-pointer"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </motion.button>
                )}

                {!showUpdateBtn && pending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    className="flex items-center justify-center gap-3 px-4 py-2 m-2 mt-0 bg-green-700 text-white text-sm sm:text-lg sm:font-semibold rounded-xl cursor-pointer"
                  >
                    <Loader size={18} className="animate-spin" />
                    <span>Saving</span>
                  </motion.div>
                )}

                {state?.message && (
                  <motion.div
                    key="responseMessageTop"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 text-sm p-3 mx-5 mb-3 rounded-xl bg-blue-200 text-blue-900"
                  >
                    <Info size={18} />
                    {state.message}
                  </motion.div>
                )}

                {state?.generalError && (
                  <motion.div
                    key="responseErrorTop"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 text-sm p-3 mx-5 mb-3 rounded-xl bg-red-200 text-red-900"
                  >
                    <Info size={18} />
                    {state.generalError}
                  </motion.div>
                )}

                <div className="py-2 px-4 mb-3">
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
                      {state?.product?.sizes &&
                        state?.product?.sizes.length > 0 &&
                        state?.product?.sizes.map((size, i) => {
                          // Extract the ordered amount for th current size.
                          const orderedSizeAmount =
                            JSON.parse(cartProduct?.details).find(
                              (d) => Number(d.id) === Number(size.id)
                            )?.quantity || 0;

                          return orderedSizeAmount > 0 ? (
                            <tr key={`size_${i}`}>
                              <td className="py-2 pl-2 text-left">
                                <span className="block text-sm mb-1 sm:text-lg sm:font-semibold">
                                  {size?.name || "No Name"}
                                </span>
                                <span className="block text-xs sm:text-base sm:text-slate-500">
                                  {size?.size || "00"} mm
                                </span>
                              </td>
                              <td className="py-2 text-center flex justify-center">
                                <div
                                  className={`relative mx-4 sm:w-20 flex items-center gap-2 border ${orderedSizeAmount > size.stock ? "border-red-400" : "border-slate-400"}  px-3 py-2 rounded-xl`}
                                >
                                  {orderedSizeAmount > size.stock && (
                                    <span className="absolute top-1 right-1">
                                      <XCircle size={14} className="stroke-red-400" />
                                    </span>
                                  )}
                                  <input
                                    className="w-full sm:w-20 appearance-none focus-visible:outline-0 placeholder:text-slate-500"
                                    type="number"
                                    name={`size_${size.id}`}
                                    autoComplete="off"
                                    defaultValue={orderedSizeAmount}
                                    max={size?.stock || 0}
                                    step={1}
                                    onChange={() => {
                                      setShowUpdateBtn(true);
                                    }}
                                  />
                                </div>
                              </td>
                              <td
                                className={`py-2 text-center ${Number(size.stock) === 0 || (orderedSizeAmount > size.stock && "text-red-400")}`}
                              >
                                {size?.stock || "0"}
                              </td>
                            </tr>
                          ) : null;
                        })}
                    </tbody>
                  </table>

                  <div className="flex flex-col gap-3">
                    <div
                      className={`relative flex gap-3 items-center px-3 py-2 pt-6 border  border-slate-300 rounded-xl ${state.product?.brand !== "OEM" ? "bg-slate-200" : "bg-white"}`}
                    >
                      <label
                        className="absolute top-2 left-3 text-xs text-slate-400"
                        htmlFor="brand"
                      >
                        Choose engraving
                      </label>
                      <Pencil size={14} className="text-slate-500" />

                      <div className="flex-grow">
                        <select
                          name="brand"
                          id="brand"
                          defaultValue={
                            (state?.cartProduct && state?.cartProduct.brand) ||
                            state?.product?.brand
                          }
                          onChange={(e) => {
                            setShowUpdateBtn(true);
                            e.target.value === "other"
                              ? setOtherField(true)
                              : setOtherField(false);
                          }}
                          disabled={state.product?.brand !== "OEM"}
                          className="w-full focus-visible:outline-0"
                        >
                          <option value="" disabled>
                            Select an engraving for this product.
                          </option>

                          {/* This is cart product config. */}
                          {state?.cartProduct &&
                            state?.cartProduct.brand !== state?.product.brand && (
                              <option value={state?.cartProduct.brand}>
                                {state?.cartProduct.brand}
                              </option>
                            )}

                          {/* This is the default products brand. */}
                          <option value={state?.product.brand}>
                            {state?.product.brand}
                          </option>

                          {state?.product.brand === "OEM" && (
                            <option value="other">Other</option>
                          )}

                          {/* This is user's own preferences. */}
                          {preferences.engraving.length > 0 &&
                            state?.product.brand === "OEM" && (
                              <optgroup label="Preferences">
                                {preferences.engraving.map((val, i) => {
                                  return (
                                    <option key={i} value={val.name}>
                                      {val.name}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            )}
                        </select>

                        {otherField && state?.product.brand === "OEM" && (
                          <input
                            type="text"
                            name="brandOther"
                            autoComplete="off"
                            placeholder="What do you want engraved?"
                            className="focus-visible:outline-0 w-full placeholder:text-slate-500 px-4 py-2 bg-slate-100 rounded-xl"
                          />
                        )}
                      </div>
                    </div>

                    {state?.product && state?.product.type === "knife" && (
                      <div>
                        <div
                          className={`relative flex gap-3 items-center px-3 py-2 pt-6 border  border-slate-300 rounded-xl ${state?.product.canChangeHandle ? "bg-white" : "bg-slate-200"}`}
                        >
                          <label
                            className="absolute top-2 left-3 text-xs text-slate-400"
                            htmlFor="handle"
                          >
                            Choose a different handle
                          </label>
                          <Pencil size={14} className="text-slate-500" />
                          <div className="flex-grow">
                            <select
                              name="handle"
                              id="handle"
                              defaultValue={
                                (state?.cartProduct && state?.cartProduct.handle) ||
                                state?.product.handle
                              }
                              onChange={(e) => {
                                setShowUpdateBtn(true);
                                e.target.value === "other"
                                  ? setOtherHandle(true)
                                  : setOtherHandle(false);
                              }}
                              className="w-full focus-visible:outline-0"
                              disabled={!state?.product.canChangeHandle}
                            >
                              <option
                                value={
                                  (state?.cartProduct && state?.cartProduct.handle) ||
                                  state?.product.handle
                                }
                              >
                                {(state?.cartProduct && state?.cartProduct.handle) ||
                                  state?.product.handle}
                              </option>
                              <option value="No Handle">No Handle</option>
                              <option value="other">Type Other</option>
                            </select>
                            {otherHandle && (
                              <input
                                type="text"
                                name="handleOther"
                                autoComplete="off"
                                placeholder="Type handle name here."
                                className="focus-visible:outline-0 w-full placeholder:text-slate-500 px-4 py-2 bg-slate-100 rounded-xl"
                              />
                            )}
                          </div>
                        </div>
                        <div className="pt-2 pl-2">
                          <p className="text-xs text-slate-500">
                            Price will be changed depending on the handles you choose.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="relative flex gap-3 items-center px-3 py-2 pt-6 bg-white border border-slate-300 rounded-xl">
                      <label
                        className="absolute top-2 left-3 text-xs text-slate-400"
                        htmlFor="request"
                      >
                        Specific request for this product
                      </label>
                      <Pencil size={14} className="text-slate-500" />
                      <input
                        type="text"
                        name="request"
                        id="request"
                        placeholder={"No special requests."}
                        autoComplete="off"
                        defaultValue={
                          (state?.cartProduct && state?.cartProduct.request) || ""
                        }
                        onChange={() => {
                          setShowUpdateBtn(true);
                        }}
                        className="focus-visible:outline-0 w-full placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {state?.message && (
                  <motion.div
                    key="responseMessageBottom"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 text-sm p-3 mx-6 mb-3 rounded-xl bg-blue-200 text-blue-900"
                  >
                    <Info size={18} />
                    {state.message}
                  </motion.div>
                )}

                {state?.generalError && (
                  <motion.div
                    key="responseErrorBottom"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 text-sm p-3 mx-6 mb-3 rounded-xl bg-red-200 text-red-900"
                  >
                    <Info size={18} />
                    {state.generalError}
                  </motion.div>
                )}

                {showUpdateBtn && !pending && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    type="submit"
                    className="flex items-center justify-center gap-3 px-4 py-2 m-2 mt-0 bg-green-700 text-white text-sm sm:text-lg sm:font-semibold rounded-xl cursor-pointer"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </motion.button>
                )}

                {!showUpdateBtn && pending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    className="flex items-center justify-center gap-3 px-4 py-2 m-2 mt-0 bg-green-700 text-white text-sm sm:text-lg sm:font-semibold rounded-xl cursor-pointer"
                  >
                    <Loader size={18} className="animate-spin" />
                    <span>Saving</span>
                  </motion.div>
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
                        ? await removeCart({
                            cartProductId: state?.cartProduct.id,
                          })
                        : setShowDeleteBtn(true)
                    }
                    className={`flex items-center gap-3 px-4 py-2 sm:py-3 mb-4 transition-colors flex-grow ${showDeleteBtn ? "bg-red-700 text-white" : "bg-red-200 text-red-700"}  text-sm sm:text-base rounded-xl`}
                  >
                    <Trash2 size={16} />
                    <span>{showDeleteBtn ? "Are you sure?" : "Remove Product"}</span>
                    {showDeleteBtn && <span className="text-white/60">Yes!</span>}
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
