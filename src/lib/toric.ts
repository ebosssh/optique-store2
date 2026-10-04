// Cylinder (CYL): always negative by convention, -0.75 .. -4.00 in 0.25
// steps — the common commercial range for disposable toric lenses.
export const CYLINDER_OPTIONS: string[] = Array.from({ length: 14 }, (_, i) => (-(0.75 + i * 0.25)).toFixed(2));

// Axis: commercial toric lenses are sold at fixed axes, 10° apart.
export const AXIS_OPTIONS: string[] = Array.from({ length: 18 }, (_, i) => String((i + 1) * 10));
