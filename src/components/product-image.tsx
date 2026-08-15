import { cn } from "@/lib/utils";

type ProductType = "GLASSES" | "SUNGLASSES" | "LENSES" | "ACCESSORY" | "CARE";

function GlassesIcon({ color, sunglasses }: { color: string; sunglasses?: boolean }) {
  return (
    <svg viewBox="0 0 200 100" className="h-2/3 w-2/3" fill="none">
      <path
        d="M40 55 Q40 30 65 30 Q90 30 90 55 Q90 78 65 78 Q40 78 40 55Z"
        fill={sunglasses ? color : "none"}
        fillOpacity={sunglasses ? 0.55 : 1}
        stroke={color}
        strokeWidth="5"
      />
      <path
        d="M110 55 Q110 30 135 30 Q160 30 160 55 Q160 78 135 78 Q110 78 110 55Z"
        fill={sunglasses ? color : "none"}
        fillOpacity={sunglasses ? 0.55 : 1}
        stroke={color}
        strokeWidth="5"
      />
      <path d="M90 50 Q100 42 110 50" stroke={color} strokeWidth="5" fill="none" />
      <path d="M40 48 L15 38" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M160 48 L185 38" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function LensIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 100" className="h-2/3 w-2/3" fill="none">
      <circle cx="80" cy="50" r="34" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="4" />
      <circle cx="120" cy="50" r="34" fill={color} fillOpacity="0.32" stroke={color} strokeWidth="4" />
    </svg>
  );
}

function AccessoryIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 100" className="h-2/3 w-2/3" fill="none">
      <rect x="45" y="30" width="110" height="55" rx="20" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="5" />
      <path d="M75 30 Q100 12 125 30" stroke={color} strokeWidth="5" fill="none" />
    </svg>
  );
}

function CareIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 100" className="h-2/3 w-2/3" fill="none">
      <rect x="85" y="18" width="30" height="14" rx="3" fill={color} />
      <path d="M78 32 h44 l6 50 a8 8 0 0 1 -8 8 h-40 a8 8 0 0 1 -8 -8 z" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="4" />
    </svg>
  );
}

export function ProductImage({
  type,
  colorHex,
  className,
}: {
  type: ProductType;
  colorHex: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex aspect-square w-full items-center justify-center rounded-xl", className)}
      style={{
        background: `linear-gradient(135deg, ${colorHex}14, ${colorHex}0a)`,
      }}
    >
      {type === "GLASSES" && <GlassesIcon color={colorHex} />}
      {type === "SUNGLASSES" && <GlassesIcon color={colorHex} sunglasses />}
      {type === "LENSES" && <LensIcon color={colorHex} />}
      {type === "ACCESSORY" && <AccessoryIcon color={colorHex} />}
      {type === "CARE" && <CareIcon color={colorHex} />}
    </div>
  );
}
