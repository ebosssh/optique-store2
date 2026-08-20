import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMany, create } = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: { findMany },
    order: { create },
  },
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const baseCustomer = {
  name: "Іван Петренко",
  phone: "+380671234567",
  city: "Київ",
  address: "Відділення №12",
};

describe("POST /api/orders", () => {
  beforeEach(() => {
    findMany.mockReset();
    create.mockReset();
  });

  it("rejects a request with missing required fields", async () => {
    const res = await POST(makeRequest({ ...baseCustomer, name: "", items: [{ productId: "p1", quantity: 1 }] }));
    expect(res.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("rejects an empty cart", async () => {
    const res = await POST(makeRequest({ ...baseCustomer, items: [] }));
    expect(res.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it.each([0, -1, 51, "not-a-number"])("rejects an invalid quantity (%s)", async (quantity) => {
    const res = await POST(makeRequest({ ...baseCustomer, items: [{ productId: "p1", quantity }] }));
    expect(res.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("rejects the order when a product no longer exists in the database", async () => {
    findMany.mockResolvedValue([]);
    const res = await POST(makeRequest({ ...baseCustomer, items: [{ productId: "missing", quantity: 1 }] }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/доступні/);
  });

  it("rejects the order when a product is out of stock", async () => {
    findMany.mockResolvedValue([{ id: "p1", name: "Test", price: 1000, inStock: false }]);
    const res = await POST(makeRequest({ ...baseCustomer, items: [{ productId: "p1", quantity: 1 }] }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/складі/);
  });

  it("prices the order from the database and ignores any price the client sends", async () => {
    findMany.mockResolvedValue([{ id: "p1", name: "Оправа A", price: 2500, inStock: true }]);
    create.mockResolvedValue({ id: "order-1" });

    const res = await POST(
      makeRequest({
        ...baseCustomer,
        items: [{ productId: "p1", quantity: 2, price: 1 }],
      })
    );

    expect(res.status).toBe(200);
    expect((await res.json()).id).toBe("order-1");

    const createArgs = create.mock.calls[0][0];
    expect(createArgs.data.total).toBe(5000);
    expect(createArgs.data.items.create[0]).toMatchObject({ productId: "p1", price: 2500, quantity: 2 });
  });

  it("merges duplicate productId entries into one line with a combined quantity", async () => {
    findMany.mockResolvedValue([{ id: "p1", name: "Оправа A", price: 1000, inStock: true }]);
    create.mockResolvedValue({ id: "order-2" });

    await POST(
      makeRequest({
        ...baseCustomer,
        items: [
          { productId: "p1", quantity: 2 },
          { productId: "p1", quantity: 3 },
        ],
      })
    );

    const createArgs = create.mock.calls[0][0];
    expect(createArgs.data.items.create).toHaveLength(1);
    expect(createArgs.data.items.create[0].quantity).toBe(5);
    expect(createArgs.data.total).toBe(5000);
  });
});
