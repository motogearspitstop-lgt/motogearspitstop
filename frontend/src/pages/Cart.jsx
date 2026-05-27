// frontend/src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import useCartStore from '@/store/cartStore';

const getItemId = (item) => item?.product?._id || item?.product?.id || item?._id || item?.id;
const getItemName = (item) => item?.product?.name || item?.name || 'Product';
const getItemImage = (item) => item?.product?.image || item?.image;
const getItemPrice = (item) => Number(item?.price ?? item?.product?.price ?? 0);

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCartStore();
  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 px-4 pb-12">
        <div className="max-w-[900px] mx-auto text-center py-16">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-[#e63946]">
            <ShoppingBag size={38} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add riding gear and accessories to see them here.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-[#e63946] px-8 py-3 font-bold text-white transition-colors hover:bg-[#d62839]"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 px-4 pb-12">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemId = getItemId(item);
              const price = getItemPrice(item);

              return (
                <div
                  key={itemId}
                  className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {getItemImage(item) ? (
                      <img
                        src={getItemImage(item)}
                        alt={getItemName(item)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingBag size={28} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="line-clamp-2 font-bold text-gray-900">{getItemName(item)}</h2>
                        <p className="mt-1 font-bold text-[#e63946]">Rs. {price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#e63946]"
                        aria-label={`Remove ${getItemName(item)} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
                          aria-label={`Decrease quantity for ${getItemName(item)}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
                          aria-label={`Increase quantity for ${getItemName(item)}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-gray-900">
                        Rs. {(price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-[#e63946]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full rounded-lg bg-[#e63946] px-6 py-3 font-bold text-white transition-colors hover:bg-[#d62839]"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-bold text-gray-900 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
