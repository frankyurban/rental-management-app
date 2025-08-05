import { create } from 'zustand'

export type Property = {
  id: number
  address: string
  city: string
  state: string
  zip: string
  rent: number
  imageUrl?: string

  // New Home Facts fields:
  sqft?: number
  bedrooms?: number
  fullBaths?: number
  threeQuarterBaths?: number
  halfBaths?: number
  quarterBaths?: number

  yearBuilt?: number
  propertyType?: string         // Example: 'Townhouse', 'Single Family', etc.
  features?: string[]           // ['Pool', 'Basement', ...]
  renovations?: string[]        // ['2021 - HVAC', ...] (Optional, for future)
  
  // New Home Value fields:
  homeValue?: number
  useZestimate?: boolean
}


type State = {
  properties: Property[]
  setProperties: (properties: Property[]) => void
  updateProperty: (property: Property) => void
  removeProperty: (id: number) => void
  addProperty: (property: Property) => void
}

export const usePropertyStore = create<State>((set) => ({
  properties: [],
  setProperties: (properties) => set({ properties }),
  updateProperty: (property) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === property.id ? { ...p, ...property } : p
      ),
    })),
  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    })),
  addProperty: (property) =>
    set((state) => ({
      properties: [property, ...state.properties],
    })),
}))
