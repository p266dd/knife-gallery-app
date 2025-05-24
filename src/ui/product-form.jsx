"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, ArrowRight, Pencil, ShoppingCart, Loader } from "lucide-react";

import { addToCart } from "@/actions/add-cart";
import { updateCart } from "@/actions/update-cart";

export default function ProductForm({ product, preferences, cart }) {
  const [otherField, setOtherField] = useState(false);
  const [otherHandle, setOtherHandle] = useState(false);

  let cartProduct;

  if (cart && cart.products.length > 0) {
    cartProduct = cart.products.find((prod) => prod.productId === product.id);
  }

  const [state, action, isPending] = useActionState(
    cartProduct ? updateCart : addToCart,
    {}
  );

  return (
    <form action={action}>
      <input type="hidden" name="productId" value={product.id} />
      {cartProduct && (
        <input type="hidden" name="productCartId" value={cartProduct.id} />
      )}

      {cartProduct && (
        <div className="flex items-center justify-start gap-3 px-3 py-2 mb-3 text-xs bg-blue-100 rounded-xl">
          <Info size={16} />
          This product is in your cart.
        </div>
      )}

      <div className="mb-9 p-2 bg-white rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {["Item", "Price", "Stock", "Order"].map((heading, i) => (
                <th className="text-left mb-2" key={`heading-${i}`}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((size, i) => {
                return (
                  Number(size.stock) > 0 && (
                    <tr
                      className="text-sm border-b border-slate-200 last:border-b-0"
                      key={`cell-${i}`}
                    >
                      <td className="w-3/12 py-2">
                        {size?.name || "No Name"}
                        <br />
                        <span className="text-xs text-slate-500">
                          {size?.size || "0"} mm
                        </span>
                      </td>
                      <td className="w-3/12 py-2">
                        ¥ {size?.price || "XX"}
                        <span className="text-[10px] text-slate-500"> ea.</span>
                      </td>
                      <td className="w-3/12 py-2">
                        <div className="flex items-center gap-1">
                          {size?.stock}
                        </div>
                      </td>
                      <td className="w-3/12 py-2">
                        <div className="flex items-center gap-2 border border-slate-300 px-3 py-2 rounded-xl">
                          <Pencil size={12} className="text-slate-500" />
                          <input
                            type="number"
                            max={size.stock}
                            min={0}
                            step={1}
                            name={`size_${size.id}`}
                            placeholder="0"
                            autoComplete="off"
                            defaultValue={
                              cartProduct &&
                              JSON.parse(cartProduct.details).find(
                                (d) => Number(d.id) === Number(size.id)
                              ).quantity
                            }
                            className="w-full appearance-none focus-visible:outline-0 placeholder:text-slate-500"
                          />
                        </div>
                      </td>
                    </tr>
                  )
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-3 text-center">
                  No registered sizes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <div
            className={`relative flex gap-3 items-center px-3 py-2 pt-6 border  border-slate-300 rounded-xl ${product.brand !== "OEM" ? "bg-slate-200" : "bg-white"}`}
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
                  (cartProduct && cartProduct.brand) || product.brand
                }
                onChange={(e) => {
                  e.target.value === "other"
                    ? setOtherField(true)
                    : setOtherField(false);
                }}
                disabled={product.brand !== "OEM"}
                className="w-full focus-visible:outline-0"
              >
                <option value="" disabled>
                  Select an engraving for this product.
                </option>

                {/* This is cart product config. */}
                {cartProduct && cartProduct.brand !== product.brand && (
                  <option value={cartProduct.brand}>{cartProduct.brand}</option>
                )}

                {/* This is the default products brand. */}
                <option value={product.brand}>{product.brand}</option>

                {product.brand === "OEM" && (
                  <option value="other">Other</option>
                )}

                {/* This is user's own preferences. */}
                {preferences.engraving.length > 0 &&
                  product.brand === "OEM" && (
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

              {otherField && product.brand === "OEM" && (
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
        </div>

        {product && product.type === "knife" && (
          <div>
            <div
              className={`relative flex gap-3 items-center px-3 py-2 pt-6 border  border-slate-300 rounded-xl ${product.canChangeHandle ? "bg-white" : "bg-slate-200"}`}
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
                    (cartProduct && cartProduct.handle) || product.handle
                  }
                  onChange={(e) => {
                    e.target.value === "other"
                      ? setOtherHandle(true)
                      : setOtherHandle(false);
                  }}
                  className="w-full focus-visible:outline-0"
                  disabled={!product.canChangeHandle}
                >
                  <option
                    value={
                      (cartProduct && cartProduct.handle) || product.handle
                    }
                  >
                    {(cartProduct && cartProduct.handle) || product.handle}
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

        <div>
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
              defaultValue={(cartProduct && cartProduct.request) || ""}
              className="focus-visible:outline-0 w-full placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <p className="text-slate-500 w-11/12 text-xs">
            ** Please note <strong>if you don't</strong> change{" "}
            <u>preferable engraving</u>, change
            <u> handle</u> or add any <u>specific request</u>, we will proceed
            with the standard configuration.
          </p>
        </div>

        <motion.div className="relative">
          <AnimatePresence>
            {state?.message && (
              <motion.div
                key="responseMessage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 text-sm mt-5 p-3 rounded-xl bg-blue-200 text-blue-900"
              >
                <Info size={18} />
                {state.message}
              </motion.div>
            )}

            {state?.generalError && (
              <motion.div
                key="responseError"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 text-sm mt-5 p-3 rounded-xl bg-red-200 text-red-900"
              >
                <Info size={18} />
                {state.generalError}
              </motion.div>
            )}

            <div className="mt-3">
              {cartProduct ? (
                <>
                  <div className="flex items-center justify-start gap-3 px-3 py-2 mb-3 text-xs bg-blue-100 rounded-xl">
                    <Info size={16} />
                    This product is in your cart.
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-3 bg-slate-700 text-slate-100 font-bold rounded-xl cursor-pointer overflow-hidden"
                  >
                    <Info size={20} />
                    Save Changes
                    {isPending && <Loader size={18} className="animate-spin" />}
                  </motion.button>
                  <Link
                    href="/cart"
                    className="text-sm flex items-center justify-center gap-3"
                  >
                    Go to Cart
                    <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 text-white font-bold rounded-xl cursor-pointer overflow-hidden"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                  {isPending && <Loader size={18} className="animate-spin" />}
                </motion.button>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      </div>
    </form>
  );
}
