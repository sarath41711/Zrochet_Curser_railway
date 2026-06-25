import { prisma } from "@/lib/prisma";
import { formatCartPrice } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brown-dark">Orders</h1>
      <p className="mt-2 text-text-muted">{orders.length} orders total</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-sand bg-white">
        {orders.length === 0 ? (
          <p className="p-8 text-sm text-text-muted">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand bg-beige/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brown-dark">{order.name}</p>
                    <p className="text-text-muted">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatCartPrice(order.subtotal, order.currency)}
                  </td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
