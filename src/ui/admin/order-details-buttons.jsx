"use client";

import { use, useState } from "react";
import { CheckCircle, Loader, Trash2 } from "lucide-react";
import Button from "../button";

import { removeOrder } from "@/actions/remove-order";
import { updateOrder } from "@/actions/update-order";
import ConfirmModal from "../confirm-modal";

export default function OrderDetailsButtons({ orderId, isOrderCompleted }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    updateOrder({ orderId, status: "completed" })
      .then((res) => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-start gap-3">
      {loading && <Loader size={16} className="animate-spin" />}
      {!isOrderCompleted && (
        <Button variant="primary" size="md" onClick={handleUpdate}>
          <CheckCircle size={16} />
          Complete Order
        </Button>
      )}
      <ConfirmModal action={() => removeOrder({ orderId })}>
        <Button variant="danger" size="md">
          <Trash2 size={16} />
          Delete
        </Button>
      </ConfirmModal>
    </div>
  );
}
