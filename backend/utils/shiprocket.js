//utils/shiprocket.js

import axios from 'axios';

let token = null;

const getToken = async () => {
  if (token) return token;
  const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD
  });
  token = res.data.token;
  return token;
};

export const createShiprocketOrder = async (order) => {
  const t = await getToken();
  const payload = {
    order_id: order._id.toString(),
    order_date: new Date().toISOString().split('T')[0],
    pickup_location: 'Primary',
    billing_customer_name: order.shippingAddress.fullName,
    billing_address: order.shippingAddress.addressLine1,
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.pincode,
    billing_state: order.shippingAddress.state,
    billing_country: 'India',
    billing_phone: order.shippingAddress.phone,
    shipping_is_billing: true,
    order_items: order.items.map(i => ({
      name: i.name,
      sku: i.product.toString(),
      units: i.quantity,
      selling_price: i.price
    })),
    payment_method: 'Prepaid',
    sub_total: order.totalPrice,
    length: 10, breadth: 10, height: 10, weight: 0.5
  };

  const res = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', payload, {
    headers: { Authorization: `Bearer ${t}` }
  });
  return res.data;
};

export const trackShiprocket = async (awb) => {
  const t = await getToken();
  const res = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
    headers: { Authorization: `Bearer ${t}` }
  });
  return res.data;
};