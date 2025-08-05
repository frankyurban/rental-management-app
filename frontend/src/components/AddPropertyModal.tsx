'use client';

import { useState, useEffect } from 'react';

type AddPropertyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => Promise<void>; // Expect promise that resolves after refresh
};

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','PR'
];

const DEFAULT_FORM = {
  address: '',
  unit: '',
  city: '',
  state: '',
  zip: '',
  rent: '',
  imageUrl: ''
};

export default function AddPropertyModal({ isOpen, onClose, onAdded }: AddPropertyModalProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [message, setMessage] = useState('');
  const [zipError, setZipError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(DEFAULT_FORM);
      setMessage('');
      setZipError('');
      setSaving(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    setSaving(true);

    const rentNumber = parseFloat(formData.rent.replace(/[$,]/g, ''));

    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      formData.zip.length !== 5 ||
      isNaN(rentNumber) || rentNumber <= 0
    ) {
      setMessage('❌ Please fill all required fields with valid values.');
      setSaving(false);
      return;
    }

    const payload: Record<string, any> = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      rent: rentNumber
    };
    if (formData.unit) payload.unit = formData.unit;
    if (formData.imageUrl) payload.imageUrl = formData.imageUrl;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || '❌ Error adding property.');
        console.error('Error details:', data.details); // Log detailed error for debugging
        setSaving(false);
        return;
      }

      setMessage('✅ Property added! Refreshing...');
      // Wait for the parent to refresh data
      await onAdded();

      setSaving(false);
      // Delay close to show success
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 800);
    } catch {
      setMessage('❌ Error adding property.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-all animate-fade-in">
      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl border border-gray-100 scale-100 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
          aria-label="Close"
          tabIndex={0}
          disabled={saving}
        >&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Property</h2>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={saving}
          />
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="unit"
            placeholder="Unit (optional)"
            value={formData.unit}
            onChange={handleChange}
            disabled={saving}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={saving}
            />
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="">Select state</option>
              {STATES.map(s => (
                <option key={s} value={s}>{s === "PR" ? "PR (Puerto Rico)" : s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="zip"
              placeholder="ZIP"
              value={formData.zip}
              onChange={handleChange}
              maxLength={5}
              required
              disabled={saving}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="rent"
              placeholder="Monthly Rent"
              value={formData.rent}
              onChange={handleCurrencyChange}
              onBlur={handleCurrencyBlur}
              required
              inputMode="decimal"
              disabled={saving}
            />
          </div>
          {zipError && <div className="text-red-500 text-xs">{zipError}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? 'Saving...' : '+ Add Property'}
          </button>
        </form>
        {message && (
          <div className={`mt-4 text-center font-semibold transition-colors ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
