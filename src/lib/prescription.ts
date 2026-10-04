export type Prescription = {
  diopter?: string | null;
  sphere?: string | null;
  cylinder?: string | null;
  axis?: string | null;
};

// Compact form for appending to a product name, e.g. "Comfort Month Toric
// (SPH -2.00 CYL -1.25 AX 90°)" or "Softlens Day 30 (-2.25)".
export function formatPrescriptionInline(item: Prescription): string | null {
  if (item.sphere || item.cylinder || item.axis) {
    const parts = [];
    if (item.sphere) parts.push(`SPH ${item.sphere}`);
    if (item.cylinder) parts.push(`CYL ${item.cylinder}`);
    if (item.axis) parts.push(`AX ${item.axis}°`);
    return parts.join(" ");
  }
  if (item.diopter) return item.diopter;
  return null;
}

// Standalone line form, for cart listings with their own row.
export function formatPrescriptionLine(item: Prescription): string | null {
  if (item.sphere || item.cylinder || item.axis) {
    const parts = [];
    if (item.sphere) parts.push(`сфера ${item.sphere}`);
    if (item.cylinder) parts.push(`циліндр ${item.cylinder}`);
    if (item.axis) parts.push(`вісь ${item.axis}°`);
    return parts.join(", ");
  }
  if (item.diopter) return `Діоптрія: ${item.diopter}`;
  return null;
}
