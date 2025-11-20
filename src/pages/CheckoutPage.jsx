import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createOrder } from '../api/orderApi';
import { createPayment } from '../api/paymentApi';

function CheckoutPage() {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (items.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const orderPayload = {
        items: items.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      };
      const order = await createOrder(orderPayload);
      await createPayment(order.orderId, order.totalAmount);
      setMessage('Order created and payment initiated. Implement payment UI next.');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while creating your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="text-gray-600">Review your order and proceed to payment.</p>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        disabled={loading || items.length === 0}
        onClick={handleCheckout}
      >
        {loading ? 'Processing…' : 'Place Order & Pay'}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default CheckoutPage;
