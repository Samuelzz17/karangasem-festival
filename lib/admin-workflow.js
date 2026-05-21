export const orderStatusFlow = [
  "payment_review",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export const orderStatusLabels = {
  payment_review: "Payment Review",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function getNextOrderStatus(status) {
  const index = orderStatusFlow.indexOf(status);
  if (index === -1 || index === orderStatusFlow.length - 1) return status;
  return orderStatusFlow[index + 1];
}

export function getPreviousOrderStatus(status) {
  const index = orderStatusFlow.indexOf(status);
  if (index <= 0) return status;
  return orderStatusFlow[index - 1];
}

export function getStatusActions(status) {
  switch (status) {
    case "payment_review":
      return ["paid", "cancelled"];
    case "paid":
      return ["processing", "cancelled"];
    case "processing":
      return ["shipped", "cancelled"];
    case "shipped":
      return ["completed", "cancelled"];
    case "completed":
      return ["processing"];
    case "cancelled":
      return ["payment_review"];
    default:
      return ["paid"];
  }
}
