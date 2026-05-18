const COMPARE_KEY = "lumiere-compare-products";

export function getCompareIds() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]") as number[];
  } catch {
    return [];
  }
}

export function toggleCompareId(productId: number) {
  const ids = getCompareIds();
  const next = ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [...ids, productId].slice(-4);

  localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("compare-products-updated"));
  return next;
}

export function clearCompareIds() {
  localStorage.removeItem(COMPARE_KEY);
  window.dispatchEvent(new Event("compare-products-updated"));
}
