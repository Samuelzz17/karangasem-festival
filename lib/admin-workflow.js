export const orderStatusFlow = [
  "processing",
  "completed",
  "cancelled",
];

export const orderStatusLabels = {
  processing: "Proses",
  completed: "Completed",
  cancelled: "Cancel",
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
    case "processing":
      return ["completed", "cancelled"];
    case "completed":
      return ["processing", "cancelled"];
    case "cancelled":
      return ["processing"];
    default:
      return ["processing"];
  }
}

