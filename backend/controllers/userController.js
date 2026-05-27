//controllers/userController.js


import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @GET /api/users/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
});

// @PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.body.password) user.password = req.body.password;
  if (req.file) user.avatar = req.file.path;
  const updated = await user.save();
  res.json({
    success: true,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      avatar: updated.avatar,
      role: updated.role
    }
  });
});

// @POST /api/users/address
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach(a => (a.isDefault = false));
  }

  user.addresses.push({ fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault });
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @PUT /api/users/address/:id
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);
  if (!address) { res.status(404); throw new Error('Address not found'); }

  if (req.body.isDefault) {
    user.addresses.forEach(a => (a.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @DELETE /api/users/address/:id
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @GET /api/users/addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.json({ success: true, addresses: user.addresses });
});