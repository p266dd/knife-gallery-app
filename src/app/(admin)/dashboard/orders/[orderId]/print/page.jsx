"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import styles from "./PrintOrderPage.module.css";
import { fetchSingleOrder } from "@/actions/fetch-orders";

// Placeholder for company details (replace with your actual data source)
const companyDetails = {
  name: "Ironclad Knives",
  address: "123 Address, Fukuyama City, 000000",
  email: "staff@yknifegallery.com",
  logoUrl: "/img/logo.png",
  website: "www.knifegallery.com",
};

export default function PrintOrderPage() {
  const params = useParams();
  const { orderId } = params;
  const router = useRouter();

  const { data, error, isLoading } = useSWR({ orderId }, fetchSingleOrder);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-slate-600 text-center">
        Loading order details for printing...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-slate-600 text-center">
        Error loading order.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-slate-600 text-center">
        Order data not found or could not be loaded.
      </div>
    );
  }

  return (
    <div className={styles.invoiceWrapperForPrint}>
      <div className={styles.a4Page}>
        <div className={styles.printButtonContainer}>
          <button className={styles.printButton} onClick={() => window.print()}>
            Print Invoice
          </button>
          <button className={styles.returnButton} onClick={() => router.back()}>
            Back
          </button>
        </div>
        <header className={styles.invoiceHeader}>
          <div className={styles.companyDetails}>
            {companyDetails.logoUrl && (
              <img
                src={companyDetails.logoUrl}
                alt={`${companyDetails.name} Logo`}
                style={{
                  maxWidth: "180px",
                  maxHeight: "80px",
                  marginBottom: "10px",
                }}
              />
            )}
            <h1>{companyDetails.name}</h1>
            <p>{companyDetails.address}</p>
            <p>
              Phone: {companyDetails.phone} | Email: {companyDetails.email}
            </p>
            {companyDetails.website && <p>Website: {companyDetails.website}</p>}
          </div>
          <div className={styles.invoiceInfo}>
            <h2>PACKING SLIP</h2>
            <p>
              <strong>Order ID:</strong> {data.code.split("-")[1]}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </header>

        <section className={styles.customerInfo}>
          <div className={styles.billingAddress}>
            <h3>Ordered By:</h3>
            <p>
              <strong>{data.client.businessName}</strong>
              <br />
              {data.client.name}
            </p>
          </div>
        </section>

        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "65%" }}>Item</th>
              <th style={{ width: "15%" }}>Brand</th>
              <th style={{ width: "15%" }}>Handle</th>
            </tr>
          </thead>
          <tbody>
            {data.orderProduct.map((item, index) => (
              <tr key={item.id || index}>
                <td>{index + 1}</td>
                <td>
                  {item.product.name} <br />
                  <hr className="my-2" />
                  <div className="mb-2">
                    <h5 className="font-semibold">Sizes</h5>
                  </div>
                  <div className="flex flex-col gap-1 mb-4">
                    {JSON.parse(item.details).map((detail, index) => {
                      return (
                        <div
                          key={index}
                          className="flex gap-9 py-1 px-2 even:bg-gray-100"
                        >
                          <div>
                            {
                              item.product.sizes.find(
                                (p) => p.id === Number(detail.id)
                              ).name
                            }
                          </div>
                          <div>
                            {
                              item.product.sizes.find(
                                (p) => p.id === Number(detail.id)
                              ).size
                            }{" "}
                            mm
                          </div>
                          <div>Ordered: {detail.quantity}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Special Request</h5>
                    <p>{item.request || "No special request."}</p>
                  </div>
                </td>
                <td>{item.brand}</td>
                <td>{item.handle}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div className={styles.totals}>
          <table className={styles.totalsTable}>
            <tbody>
              <tr>
                <td className={styles.label}>Subtotal:</td>
                <td className={styles.amount}>{formatCurrency(subtotal)}</td>
              </tr>
              {discountAmount > 0 && (
                <tr>
                  <td className={styles.label}>
                    Discount ({order.discount.code || ""}):
                  </td>
                  <td className={styles.amount}>
                    -{formatCurrency(discountAmount)}
                  </td>
                </tr>
              )}
              {shippingCost > 0 && (
                <tr>
                  <td className={styles.label}>
                    Shipping ({order.shipping.method || ""}):
                  </td>
                  <td className={styles.amount}>
                    {formatCurrency(shippingCost)}
                  </td>
                </tr>
              )}
              <tr>
                <td className={styles.label}>
                  Tax ({((order.taxRate || 0) * 100).toFixed(0)}%):
                </td>
                <td className={styles.amount}>{formatCurrency(taxAmount)}</td>
              </tr>
              <tr className={styles.grandTotal}>
                <td className={styles.label}>Grand Total:</td>
                <td className={styles.amount}>{formatCurrency(totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div> */}

        {/* {(order.notes || order.payment) && (
          <footer className={styles.notesAndPayment}>
            {order.payment && (
              <div>
                <h4>Payment Details:</h4>
                <p>
                  Method: {order.payment.method} | Status:{" "}
                  {order.payment.status}
                </p>
                {order.payment.transactionId && (
                  <p>Transaction ID: {order.payment.transactionId}</p>
                )}
              </div>
            )}
            {order.notes && (
              <div style={{ marginTop: order.payment ? "15px" : "0" }}>
                <h4>Notes:</h4>
                <p>{order.notes}</p>
              </div>
            )}
          </footer>
        )} */}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            fontSize: "8pt",
            color: "#777",
            borderTop: "1px solid #eee",
            paddingTop: "10px",
          }}
        >
          Thank you for your business! If you have any questions, please contact
          us at {companyDetails.email}.
        </div>
      </div>
    </div>
  );
}
