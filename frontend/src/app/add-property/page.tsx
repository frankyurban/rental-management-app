'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddProperty() {
  const [formData, setFormData] = useState({
    address: '',
    unit: '',
    city: '',
    state: '',
    zip: '',
    rent: '',
    imageUrl: '',
  });

  const [message, setMessage] = useState('');
  const [zipError, setZipError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'zip') {
      const numeric = value.replace(/\D/g, '');
      setFormData({ ...formData, zip: numeric });
      setZipError(numeric.length === 5 ? '' : 'ZIP code must be 5 digits');
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, rent: input });
  };

  const handleCurrencyBlur = () => {
    const amount = parseFloat(formData.rent || '0');
    const formatted = amount
      ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '';
    setFormData({ ...formData, rent: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const rentNumber = parseFloat(formData.rent.replace(/[$,]/g, ''));

    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      isNaN(rentNumber)
    ) {
      setMessage('❌ Please fill in all required fields and enter a valid rent.');
      return;
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, rent: rentNumber }),
      });

      if (res.ok) {
        setMessage('✅ Property added successfully!');
        setFormData({
          address: '', unit: '', city: '', state: '', zip: '', rent: '', imageUrl: '',
        });
      } else {
        const data = await res.json();
        setMessage(data.error || '❌ Error adding property.');
      }
    } catch {
      setMessage('❌ Error adding property.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <Link href="/properties" className="text-blue-600 hover:underline text-sm">
          ← Back to Properties
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 text-center flex-1">
          Add New Property
        </h1>
        <div className="w-32" /> {/* Spacer to center the heading */}
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Address<span className="text-red-500">*</span></label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="address"
            placeholder="123 Main St"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Unit</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="unit"
            placeholder="Apt, Suite, etc. (optional)"
            value={formData.unit}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">City<span className="text-red-500">*</span></label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">State<span className="text-red-500">*</span></label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">ZIP<span className="text-red-500">*</span></label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="zip"
              placeholder="ZIP"
              value={formData.zip}
              onChange={handleChange}
              required
            />
            {zipError && <div className="text-red-500 text-xs mt-1">{zipError}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Monthly Rent<span className="text-red-500">*</span></label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="rent"
              placeholder="$2,000.00"
              value={formData.rent}
              onChange={handleCurrencyChange}
              onBlur={handleCurrencyBlur}
              required
            />
          </div>
        </div>
        {/* Optional image URL field */}
        {/* <div>
          <label className="block mb-1 font-medium text-gray-700">Image URL</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div> */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          + Add Property
        </button>
      </form>
      {message && (
        <div className={`mt-6 text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
