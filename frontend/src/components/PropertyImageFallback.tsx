"use client";
import React, { useState } from "react";

type Property = {
  address: string;
  city: string;
  state: string;
  zip: string;
  rent: number;
  imageUrl?: string;
};

export default function PropertyImageFallback({
  property,
  streetViewUrl,
}: {
  property: Property;
  streetViewUrl: string;
}) {
  const [imgSrc, setImgSrc] = useState(streetViewUrl);

  const handleImgError = () => {
    if (imgSrc !== property.imageUrl && property.imageUrl) {
      setImgSrc(property.imageUrl);
    } else {
      setImgSrc("https://placehold.co/600x400?text=No+Image+Available");
    }
  };

  return (
    <img
      src={imgSrc}
      alt={`Photo of ${property.address}`}
      className="w-full rounded-lg shadow-md mb-4"
      onError={handleImgError}
    />
  );
}