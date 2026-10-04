-- Toric (astigmatism) contact lens support: a product-level flag plus
-- sphere/cylinder/axis on order lines, alongside the existing diopter
-- used for regular spherical lenses.
ALTER TABLE "Product" ADD COLUMN "isToric" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "OrderItem" ADD COLUMN "sphere" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "cylinder" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "axis" TEXT;
