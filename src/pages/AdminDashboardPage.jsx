import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../api/orderApi';

function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {loading && <p>Loading orders…</p>}
      {!loading && (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Order ID</th>
              <th className="border px-2 py-1 text-left">Status</th>
              <th className="border px-2 py-1 text-left">Payment</th>
              <th className="border px-2 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td className="border px-2 py-1">{o.orderId}</td>
                <td className="border px-2 py-1">{o.status}</td>
                <td className="border px-2 py-1">{o.paymentStatus}</td>
                <td className="border px-2 py-1 text-right">₹{o.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboardPage;
