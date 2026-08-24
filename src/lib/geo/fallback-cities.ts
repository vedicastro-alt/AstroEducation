import type { GeocodeResult } from "./resolve";

/**
 * A small offline city list used only if the live geocoding lookup is
 * unreachable (e.g. no network, or the provider is down), so the form
 * never leaves parents completely stuck.
 */
export const FALLBACK_CITIES: GeocodeResult[] = [
  { label: "New Delhi, Delhi, India", latitude: 28.6139, longitude: 77.209 },
  { label: "Mumbai, Maharashtra, India", latitude: 19.076, longitude: 72.8777 },
  { label: "Bengaluru, Karnataka, India", latitude: 12.9716, longitude: 77.5946 },
  { label: "Hyderabad, Telangana, India", latitude: 17.385, longitude: 78.4867 },
  { label: "Chennai, Tamil Nadu, India", latitude: 13.0827, longitude: 80.2707 },
  { label: "Kolkata, West Bengal, India", latitude: 22.5726, longitude: 88.3639 },
  { label: "Pune, Maharashtra, India", latitude: 18.5204, longitude: 73.8567 },
  { label: "Ahmedabad, Gujarat, India", latitude: 23.0225, longitude: 72.5714 },
  { label: "Jaipur, Rajasthan, India", latitude: 26.9124, longitude: 75.7873 },
  { label: "Lucknow, Uttar Pradesh, India", latitude: 26.8467, longitude: 80.9462 },
  { label: "Chandigarh, Chandigarh, India", latitude: 30.7333, longitude: 76.7794 },
  { label: "Kochi, Kerala, India", latitude: 9.9312, longitude: 76.2673 },
  { label: "Surat, Gujarat, India", latitude: 21.1702, longitude: 72.8311 },
  { label: "Nagpur, Maharashtra, India", latitude: 21.1458, longitude: 79.0882 },
  { label: "Indore, Madhya Pradesh, India", latitude: 22.7196, longitude: 75.8577 },
  { label: "Bhopal, Madhya Pradesh, India", latitude: 23.2599, longitude: 77.4126 },
  { label: "Patna, Bihar, India", latitude: 25.5941, longitude: 85.1376 },
  { label: "Coimbatore, Tamil Nadu, India", latitude: 11.0168, longitude: 76.9558 },
  { label: "Visakhapatnam, Andhra Pradesh, India", latitude: 17.6868, longitude: 83.2185 },
  { label: "Gurugram, Haryana, India", latitude: 28.4595, longitude: 77.0266 },
  { label: "Noida, Uttar Pradesh, India", latitude: 28.5355, longitude: 77.391 },
  { label: "New York, New York, United States", latitude: 40.7128, longitude: -74.006 },
  { label: "Los Angeles, California, United States", latitude: 34.0522, longitude: -118.2437 },
  { label: "Chicago, Illinois, United States", latitude: 41.8781, longitude: -87.6298 },
  { label: "San Francisco, California, United States", latitude: 37.7749, longitude: -122.4194 },
  { label: "Houston, Texas, United States", latitude: 29.7604, longitude: -95.3698 },
  { label: "Edison, New Jersey, United States", latitude: 40.5187, longitude: -74.4121 },
  { label: "Toronto, Ontario, Canada", latitude: 43.6532, longitude: -79.3832 },
  { label: "Vancouver, British Columbia, Canada", latitude: 49.2827, longitude: -123.1207 },
  { label: "London, England, United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  { label: "Birmingham, England, United Kingdom", latitude: 52.4862, longitude: -1.8904 },
  { label: "Dubai, Dubai, United Arab Emirates", latitude: 25.2048, longitude: 55.2708 },
  { label: "Abu Dhabi, Abu Dhabi, United Arab Emirates", latitude: 24.4539, longitude: 54.3773 },
  { label: "Singapore, Singapore, Singapore", latitude: 1.3521, longitude: 103.8198 },
  { label: "Kuala Lumpur, Kuala Lumpur, Malaysia", latitude: 3.139, longitude: 101.6869 },
  { label: "Sydney, New South Wales, Australia", latitude: -33.8688, longitude: 151.2093 },
  { label: "Melbourne, Victoria, Australia", latitude: -37.8136, longitude: 144.9631 },
  { label: "Auckland, Auckland, New Zealand", latitude: -36.8485, longitude: 174.7633 },
  { label: "Karachi, Sindh, Pakistan", latitude: 24.8607, longitude: 67.0011 },
  { label: "Dhaka, Dhaka, Bangladesh", latitude: 23.8103, longitude: 90.4125 },
  { label: "Colombo, Western Province, Sri Lanka", latitude: 6.9271, longitude: 79.8612 },
  { label: "Kathmandu, Bagmati, Nepal", latitude: 27.7172, longitude: 85.324 },
];

export function searchFallbackCities(query: string): GeocodeResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return FALLBACK_CITIES.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 5);
}
