// //frontend/src/pages/Checkout.jsx


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Check, CreditCard, Wallet, Banknote } from 'lucide-react';
// import useCartStore from '@/store/cartStore';
// import useAuthStore from '@/store/authStore';
// import useOrderStore from '@/store/orderStore';
// import { useToast } from '@/components/ui/use-toast';
// import { Label } from '@/components/ui/label';
// import AuthModal from '@/components/AuthModal';

// const loadRazorpayScript = () => {
//   if (window.Razorpay) return Promise.resolve(true);

//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const Checkout = () => {
//   const { items, totalPrice, clearCart, syncCartToBackend } = useCartStore();
//   const { isAuthenticated, user } = useAuthStore();
//   const { createOrder, createRazorpayOrder, verifyPayment } = useOrderStore();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [step, setStep] = useState(1);
//   const [showAuth, setShowAuth] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: user?.name || '',
//     phone: user?.phone || '',
//     email: user?.email || '',
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     pincode: '',
//     paymentMethod: 'cod'
//   });

//   useEffect(() => {
//     if (!user) return;

//     setFormData((current) => ({
//       ...current,
//       fullName: current.fullName || user.name || '',
//       phone: current.phone || user.phone || '',
//       email: current.email || user.email || '',
//     }));
//   }, [user]);

//   const shipping = totalPrice >= 1999 ? 0 : 99;
//   const total = totalPrice + shipping;

//   // Redirect if cart empty
//   if (items.length === 0) {
//     navigate('/cart');
//     return null;
//   }

//   // Auth gate
//   if (!isAuthenticated) {
//     return (
//       <>
//         <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
//           <h2 className="text-2xl font-bold text-gray-900">Login to continue checkout</h2>
//           <p className="text-gray-500">You need to be logged in to place an order</p>
//           <button
//             onClick={() => setShowAuth(true)}
//             className="bg-[#e63946] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#d62839] transition"
//           >
//             Login / Sign Up
//           </button>
//         </div>
//         <AuthModal
//           isOpen={showAuth}
//           onClose={() => setShowAuth(false)}
//           onSuccess={async () => {
//             await syncCartToBackend();
//             setShowAuth(false);
//           }}
//         />
//       </>
//     );
//   }

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validateStep1 = () => {
//     const { fullName, phone, email, addressLine1, city, state, pincode } = formData;
//     if (!fullName || !phone || !email || !addressLine1 || !city || !state || !pincode) {
//       toast({ title: 'Missing Information', description: 'Please fill in all address fields', variant: 'destructive' });
//       return false;
//     }
//     return true;
//   };

//   const handleRazorpayPayment = async () => {
//     const isRazorpayReady = await loadRazorpayScript();

//     if (!isRazorpayReady) {
//       toast({ title: 'Payment Error', description: 'Razorpay checkout is still loading. Please try again.', variant: 'destructive' });
//       return;
//     }

//     const { success, order: rzpOrder } = await createRazorpayOrder(total);
//     if (!success) {
//       toast({ title: 'Payment Error', description: 'Could not initiate payment', variant: 'destructive' });
//       return;
//     }

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: rzpOrder.amount,
//       currency: 'INR',
//       name: 'MotoGear Pitstop',
//       description: 'Order Payment',
//       order_id: rzpOrder.id,
//       handler: async (response) => {
//         const verified = await verifyPayment(response);
//         if (verified.success) {
//           await placeOrder(response);
//         } else {
//           toast({ title: 'Payment Failed', description: 'Verification failed', variant: 'destructive' });
//         }
//       },
//       prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
//       theme: { color: '#e63946' }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const placeOrder = async (paymentInfo = null) => {
//     setLoading(true);
//     const orderData = {
//       shippingAddress: {
//         fullName: formData.fullName,
//         phone: formData.phone,
//         addressLine1: formData.addressLine1,
//         addressLine2: formData.addressLine2,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode
//       },
//       paymentInfo: paymentInfo || {},
//       paymentMethod: formData.paymentMethod
//     };

//     const result = await createOrder(orderData);
//     setLoading(false);

//     if (result.success) {
//       toast({ title: 'Order Placed!', description: `Order #${result.order._id} confirmed.` });
//       navigate(`/orders/${result.order._id}`);
//     } else {
//       toast({ title: 'Order Failed', description: result.message, variant: 'destructive' });
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (formData.paymentMethod === 'cod') {
//       await placeOrder();
//     } else {
//       await handleRazorpayPayment();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white pt-24 px-4 pb-8">
//       <div className="max-w-[1000px] mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

//         {/* Progress Steps */}
//         <div className="flex items-center justify-center mb-8">
//           {[1, 2, 3].map((s) => (
//             <div key={s} className="flex items-center">
//               <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                 step >= s ? 'bg-[#e63946]' : 'bg-gray-200'
//               } text-white font-bold transition-colors`}>
//                 {step > s ? <Check size={20} /> : <span className={step === s ? 'text-white' : 'text-gray-500'}>{s}</span>}
//               </div>
//               {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-[#e63946]' : 'bg-gray-200'}`} />}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Form */}
//           <div className="lg:col-span-2">

//             {/* Step 1 — Shipping */}
//             {step === 1 && (
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//                 className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <Label className="text-gray-700 mb-2 block">Full Name *</Label>
//                     <input type="text" name="fullName" value={formData.fullName}
//                       onChange={handleInputChange}
//                       className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-700 mb-2 block">Phone *</Label>
//                       <input type="tel" name="phone" value={formData.phone}
//                         onChange={handleInputChange}
//                         className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 mb-2 block">Email *</Label>
//                       <input type="email" name="email" value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                     </div>
//                   </div>
//                   <div>
//                     <Label className="text-gray-700 mb-2 block">Address Line 1 *</Label>
//                     <input type="text" name="addressLine1" value={formData.addressLine1}
//                       onChange={handleInputChange}
//                       className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                   </div>
//                   <div>
//                     <Label className="text-gray-700 mb-2 block">Address Line 2</Label>
//                     <input type="text" name="addressLine2" value={formData.addressLine2}
//                       onChange={handleInputChange}
//                       className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <Label className="text-gray-700 mb-2 block">City *</Label>
//                       <input type="text" name="city" value={formData.city}
//                         onChange={handleInputChange}
//                         className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 mb-2 block">State *</Label>
//                       <input type="text" name="state" value={formData.state}
//                         onChange={handleInputChange}
//                         className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                     </div>
//                     <div>
//                       <Label className="text-gray-700 mb-2 block">Pincode *</Label>
//                       <input type="text" name="pincode" value={formData.pincode}
//                         onChange={handleInputChange}
//                         className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
//                     </div>
//                   </div>
//                 </div>
//                 <button onClick={() => validateStep1() && setStep(2)}
//                   className="mt-6 w-full bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors">
//                   Continue to Payment
//                 </button>
//               </motion.div>
//             )}

//             {/* Step 2 — Payment */}
//             {step === 2 && (
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//                 className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
//                 <div className="space-y-3">
//                   {[
//                     { value: 'cod', label: 'Cash on Delivery', icon: Banknote },
//                     { value: 'razorpay', label: 'Pay Online (UPI / Card / NetBanking)', icon: CreditCard },
//                   ].map(({ value, label, icon: Icon }) => (
//                     <label key={value}
//                       className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                         formData.paymentMethod === value ? 'border-[#e63946] bg-[#e63946]/5' : 'border-gray-200 hover:border-gray-300'
//                       }`}>
//                       <input type="radio" name="paymentMethod" value={value}
//                         checked={formData.paymentMethod === value}
//                         onChange={handleInputChange} className="text-[#e63946]" />
//                       <Icon className="text-[#e63946]" size={24} />
//                       <span className="text-gray-900 font-medium">{label}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <div className="flex gap-4 mt-6">
//                   <button onClick={() => setStep(1)}
//                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold transition-colors">
//                     Back
//                   </button>
//                   <button onClick={() => setStep(3)}
//                     className="flex-1 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors">
//                     Review Order
//                   </button>
//                 </div>
//               </motion.div>
//             )}

//             {/* Step 3 — Review */}
//             {step === 3 && (
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//                 className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Review Order</h2>
//                 <div className="space-y-4 mb-6">
//                   <div>
//                     <h3 className="text-gray-900 font-medium mb-2">Shipping Address</h3>
//                     <p className="text-gray-600 text-sm">
//                       {formData.fullName}<br />
//                       {formData.addressLine1}{formData.addressLine2 && `, ${formData.addressLine2}`}<br />
//                       {formData.city}, {formData.state} - {formData.pincode}<br />
//                       Phone: {formData.phone}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-gray-900 font-medium mb-2">Payment</h3>
//                     <p className="text-gray-600 text-sm uppercase">
//                       {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-gray-900 font-medium mb-2">Items ({items.length})</h3>
//                     {items.map((item, i) => (
//                       <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
//                         <span>{item.product?.name || item.name} × {item.quantity}</span>
//                         <span>₹{((item.price) * item.quantity).toLocaleString()}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex gap-4">
//                   <button onClick={() => setStep(2)}
//                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold transition-colors">
//                     Back
//                   </button>
//                   <button onClick={handlePlaceOrder} disabled={loading}
//                     className="flex-1 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50">
//                     {loading ? 'Placing Order...' : 'Place Order'}
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24 shadow-sm">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between text-gray-700">
//                   <span>Items ({items.length})</span>
//                   <span>₹{totalPrice.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-700">
//                   <span>Shipping</span>
//                   <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
//                 </div>
//                 <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold text-lg">
//                   <span>Total</span>
//                   <span className="text-[#e63946]">₹{total.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Also add Razorpay script to index.html */}
//     </div>
//   );
// };

// export default Checkout;










import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Banknote } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import useOrderStore from '@/store/orderStore';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import AuthModal from '@/components/AuthModal';

const getItemId = (item) => item?.product?._id || item?.product?.id || item?._id || item?.id;
const getItemName = (item) => item?.product?.name || item?.name || 'Product';
const getItemImage = (item) => item?.product?.images?.[0]?.url || item?.product?.image || item?.image || '';
const getItemPrice = (item) => Number(item?.price ?? item?.product?.discountPrice ?? item?.product?.price ?? 0);
const getItemsTotal = (items) => items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
const COD_ADVANCE_PERCENTAGE = 20;
const formatINR = (value = 0) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;
const normalizeWhatsAppNumber = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
};

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);

  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { items, clearCart, syncCartToBackend } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { createOrder, createRazorpayOrder, verifyPayment } = useOrderStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay'
  });

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name || '',
      phone: current.phone || user.phone || '',
      email: current.email || user.email || '',
    }));
  }, [user]);

  const total = getItemsTotal(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const codAdvanceAmount = Math.round(total * (COD_ADVANCE_PERCENTAGE / 100));
  const codLeftoverAmount = Math.max(total - codAdvanceAmount, 0);
  const paymentAmount = formData.paymentMethod === 'cod' ? codAdvanceAmount : total;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Login to continue checkout</h2>
          <p className="text-gray-500">You need to be logged in to place an order</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-[#e63946] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#d62839] transition"
          >
            Login / Sign Up
          </button>
        </div>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onSuccess={async () => {
            await syncCartToBackend();
            setShowAuth(false);
          }}
        />
      </>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const { fullName, phone, email, addressLine1, city, state, pincode } = formData;
    if (!fullName || !phone || !email || !addressLine1 || !city || !state || !pincode) {
      toast({ title: 'Missing Information', description: 'Please fill in all address fields', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (loading) return;

    setLoading(true);
    const isRazorpayReady = await loadRazorpayScript();
    if (!isRazorpayReady) {
      toast({ title: 'Payment Error', description: 'Razorpay failed to load. Please try again.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const { success, keyId, order: rzpOrder } = await createRazorpayOrder(paymentAmount);
    if (!success) {
      toast({ title: 'Payment Error', description: 'Could not initiate payment', variant: 'destructive' });
      setLoading(false);
      return;
    }

    const options = {
      key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency || 'INR',
      name: 'MotoGear Pitstop',
      description: formData.paymentMethod === 'cod' ? 'COD Advance Payment' : 'Order Payment',
      order_id: rzpOrder.id,
      handler: async (response) => {
        try {
          const verified = await verifyPayment(response);
          if (verified.success) {
            await placeOrder(response);
          } else {
            toast({ title: 'Payment Failed', description: 'Verification failed', variant: 'destructive' });
            setLoading(false);
          }
        } catch (err) {
          console.error('Order placement after payment failed:', err);
          toast({ title: 'Payment Failed', description: 'Verification failed', variant: 'destructive' });
          setLoading(false);
        }
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone.replace(/\D/g, '')
      },
      notes: {
        address: `${formData.addressLine1}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        paymentMethod: formData.paymentMethod,
        amountPaid: paymentAmount,
        amountDue: formData.paymentMethod === 'cod' ? codLeftoverAmount : 0
      },
      theme: { color: '#e63946' },
      modal: {
        ondismiss: () => setLoading(false)
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      console.error('Razorpay payment failed:', response.error);
      toast({
        title: 'Payment Failed',
        description: response.error?.description || response.error?.reason || 'Razorpay could not complete this payment.',
        variant: 'destructive'
      });
      setLoading(false);
    });
    rzp.open();
  };

  const placeOrder = async (paymentInfo = null) => {
    setLoading(true);
    const orderData = {
      items: items.map((item) => ({
        productId: getItemId(item),
        name: getItemName(item),
        image: getItemImage(item),
        price: getItemPrice(item),
        quantity: item.quantity
      })),
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      paymentInfo: paymentInfo || {},
      paymentMethod: formData.paymentMethod
    };

    const result = await createOrder(orderData);
    setLoading(false);

    if (result.success) {
      toast({ title: 'Order Placed!', description: 'Check your email for the order confirmation.' });
      await clearCart();
      if (formData.paymentMethod === 'cod') {
        const whatsappNumber = normalizeWhatsAppNumber(formData.phone);
        const message = `Hi ${formData.fullName}, your MotoGear Pitstop COD order has been placed successfully. Order ID: ${result.order._id}. Paid: INR ${Number(result.order.amountPaid || 0).toLocaleString('en-IN')}. Leftover on delivery: INR ${Number(result.order.amountDue || 0).toLocaleString('en-IN')}. Thank you for shopping with us.`;

        if (whatsappNumber) {
          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        }
      }
      navigate(`/orders/${result.order._id}?placed=1`, {
        replace: true,
        state: { orderPlaced: true }
      });
    } else {
      toast({ title: 'Order Failed', description: result.message, variant: 'destructive' });
    }
  };

  const handlePlaceOrder = async () => {
    if (loading) return;

    await handleRazorpayPayment();
  };

  return (
    <div className="min-h-screen bg-white pt-40 px-4 pb-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= s ? 'bg-[#e63946]' : 'bg-gray-200'
              } text-white font-bold transition-colors`}>
                {step > s ? <Check size={20} /> : (
                  <span className={step === s ? 'text-white' : 'text-gray-500'}>{s}</span>
                )}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-[#e63946]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* Step 1 — Shipping */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 mb-2 block">Full Name *</Label>
                    <input type="text" name="fullName" value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 mb-2 block">Phone *</Label>
                      <input type="tel" name="phone" value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                    </div>
                    <div>
                      <Label className="text-gray-700 mb-2 block">Email *</Label>
                      <input type="email" name="email" value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 mb-2 block">Address Line 1 *</Label>
                    <input type="text" name="addressLine1" value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                  </div>
                  <div>
                    <Label className="text-gray-700 mb-2 block">Address Line 2</Label>
                    <input type="text" name="addressLine2" value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-700 mb-2 block">City *</Label>
                      <input type="text" name="city" value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                    </div>
                    <div>
                      <Label className="text-gray-700 mb-2 block">State *</Label>
                      <input type="text" name="state" value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                    </div>
                    <div>
                      <Label className="text-gray-700 mb-2 block">Pincode *</Label>
                      <input type="text" name="pincode" value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#e63946]" />
                    </div>
                  </div>
                </div>
                <button onClick={() => validateStep1() && setStep(2)}
                  className="mt-6 w-full bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery (20% advance required)', icon: Banknote },
                    { value: 'razorpay', label: 'Pay Online (UPI / Card / NetBanking)', icon: CreditCard },
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === value
                          ? 'border-[#e63946] bg-[#e63946]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="paymentMethod" value={value}
                        checked={formData.paymentMethod === value}
                        onChange={handleInputChange} className="text-[#e63946]" />
                      <Icon className="text-[#e63946]" size={24} />
                      <span className="text-gray-900 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="mt-4 rounded-lg border border-[#e63946]/30 bg-[#e63946]/5 p-4">
                    <p className="text-sm font-bold text-gray-900">COD advance payment</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Pay {COD_ADVANCE_PERCENTAGE}% now ({formatINR(codAdvanceAmount)}) to confirm your COD order.
                      The remaining {formatINR(codLeftoverAmount)} is payable on delivery.
                    </p>
                  </div>
                )}
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep(3)}
                    className="flex-1 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors">
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Review Order</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-gray-900 font-medium mb-2">Shipping Address</h3>
                    <p className="text-gray-600 text-sm">
                      {formData.fullName}<br />
                      {formData.addressLine1}{formData.addressLine2 && `, ${formData.addressLine2}`}<br />
                      {formData.city}, {formData.state} - {formData.pincode}<br />
                      Phone: {formData.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium mb-2">Payment</h3>
                    <p className="text-gray-600 text-sm">
                      {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
                    </p>
                    {formData.paymentMethod === 'cod' && (
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div className="rounded-lg bg-green-50 p-3">
                          <p className="text-gray-500">Pay now</p>
                          <p className="font-bold text-green-700">{formatINR(codAdvanceAmount)}</p>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-3">
                          <p className="text-gray-500">Leftover on delivery</p>
                          <p className="font-bold text-orange-700">{formatINR(codLeftoverAmount)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium mb-2">Items ({itemCount})</h3>
                    {items.map((item) => (
                      <div key={getItemId(item)} className="flex gap-3 py-3 text-sm text-gray-600 border-b border-gray-100">
                        {getItemImage(item) && (
                          <img
                            src={getItemImage(item)}
                            alt={getItemName(item)}
                            className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-100 object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">{getItemName(item)}</p>
                          <p className="mt-1">{formatINR(getItemPrice(item))} x {item.quantity}</p>
                        </div>
                        <span className="flex-shrink-0 font-bold text-gray-900">
                          {formatINR(getItemPrice(item) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <p className="font-bold">Payment confirmation can take up to 2 minutes.</p>
                  <p className="mt-1">
                    After completing payment, please wait on this page. Do not close, refresh, or go back until your order confirmation appears.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-bold transition-colors">
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-1 bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50">
                    {loading
                      ? 'Confirming payment... Please wait'
                      : (formData.paymentMethod === 'cod' ? `Pay ${formatINR(codAdvanceAmount)} & Place Order` : 'Pay & Place Order')}
                  </button>
                </div>
                {loading && (
                  <p className="mt-3 text-center text-sm font-medium text-gray-600">
                    This may take less than 2 minutes. Please do not close or reload this window.
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4 mb-4">
                <div className="space-y-3 border-b border-gray-100 pb-4">
                  {items.map((item) => (
                    <div key={getItemId(item)} className="flex gap-3 text-sm">
                      {getItemImage(item) && (
                        <img
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-100 object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-medium text-gray-900">{getItemName(item)}</p>
                        <p className="mt-1 text-gray-500">{formatINR(getItemPrice(item))} x {item.quantity}</p>
                      </div>
                      <span className="flex-shrink-0 font-bold text-gray-900">
                        {formatINR(getItemPrice(item) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-4 text-gray-700">
                  <span>Items ({itemCount})</span>
                  <span>{formatINR(total)}</span>
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm">
                    <div className="flex justify-between gap-4 text-green-700">
                      <span>Advance now ({COD_ADVANCE_PERCENTAGE}%)</span>
                      <span className="font-bold">{formatINR(codAdvanceAmount)}</span>
                    </div>
                    <div className="mt-1 flex justify-between gap-4 text-orange-700">
                      <span>Leftover on delivery</span>
                      <span className="font-bold">{formatINR(codLeftoverAmount)}</span>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between gap-4 text-gray-900 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#e63946]">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
