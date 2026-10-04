-- Add optional diopter to order items, for contact lens orders
ALTER TABLE "OrderItem" ADD COLUMN "diopter" TEXT;
