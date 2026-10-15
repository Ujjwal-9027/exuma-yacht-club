export type DeliverySpeed = "standard" | "priority";

export type DeliveryAddress = {
  city: string;
  region?: string | null;
  postalCode?: string | null;
};

const MIAMI_ZIP_CODES = new Set([
  "33014", "33015", "33101", "33102", "33106", "33107", "33110", "33111",
  "33112", "33114", "33116", "33121", "33122", "33124", "33125", "33126",
  "33127", "33128", "33129", "33130", "33131", "33132", "33133", "33135",
  "33136", "33137", "33138", "33139", "33142", "33143", "33144", "33145", "33147",
  "33150", "33151", "33152", "33153", "33155", "33156", "33157", "33158",
  "33159", "33161", "33163", "33164", "33165", "33166", "33167", "33168",
  "33170", "33172", "33173", "33174", "33175", "33176", "33177", "33178",
  "33181", "33182", "33183", "33184", "33185", "33186", "33187", "33188",
  "33189", "33190", "33193", "33194", "33195", "33196", "33197", "33199",
  "33206", "33222", "33231", "33233", "33234", "33238", "33242", "33243",
  "33245", "33247", "33255", "33256", "33257", "33261", "33265", "33266",
  "33269", "33280", "33283", "33296", "33299",
]);

export function isMiamiAddress(address: DeliveryAddress | null): boolean {
  if (!address) return false;
  const state = address.region?.trim().toLowerCase().replace(/[.,]/g, "") ?? "";
  const postalCode = address.postalCode?.trim().slice(0, 5) ?? "";
  return (
    /\bmiami\b/i.test(address.city.trim()) &&
    /\b(?:fl|florida)\b/i.test(state) &&
    MIAMI_ZIP_CODES.has(postalCode)
  );
}

export function getShippingFeeCents(
  fulfillment: "pickup" | "ship",
  address: DeliveryAddress | null,
  deliverySpeed: DeliverySpeed,
): number {
  if (fulfillment === "pickup" || isMiamiAddress(address)) return 0;
  return deliverySpeed === "priority" ? 1200 : 800;
}