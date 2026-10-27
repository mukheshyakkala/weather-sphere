export function getAqiCategory(aqi) {
  if (aqi == null || !Number.isFinite(aqi)) return { label: "Unavailable", color: "#94a3b8", advice: "Air quality readings are not available right now." };
  if (aqi <= 50) return { label: "Good", color: "#22c55e", advice: "Air quality is satisfactory. Enjoy your usual outdoor activities." };
  if (aqi <= 100) return { label: "Moderate", color: "#eab308", advice: "Sensitive people may want to reduce prolonged outdoor exertion." };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "#f97316", advice: "Sensitive groups should limit prolonged outdoor activity." };
  if (aqi <= 200) return { label: "Unhealthy", color: "#ef4444", advice: "Consider limiting outdoor exertion and keep windows closed." };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#a855f7", advice: "Avoid strenuous outdoor activity and consider using an air purifier." };
  return { label: "Hazardous", color: "#7f1d1d", advice: "Stay indoors where possible and follow local health guidance." };
}

export const pollutantDefinitions = [
  ["pm2_5", "PM2.5", "Fine particles"],
  ["pm10", "PM10", "Coarse particles"],
  ["carbon_monoxide", "Carbon monoxide", "CO"],
  ["nitrogen_dioxide", "Nitrogen dioxide", "NO₂"],
  ["sulphur_dioxide", "Sulfur dioxide", "SO₂"],
  ["ozone", "Ozone", "O₃"],
  ["dust", "Dust", "Mineral dust"],
];

export function formatUpdatedTime(time, timezone) {
  if (typeof time !== "string" || !Number.isFinite(Date.parse(time))) return "Awaiting reading";
  const options = { hour: "numeric", minute: "2-digit" };
  try {
    return new Intl.DateTimeFormat("en", {
      ...options,
      timeZone: typeof timezone === "string" && timezone ? timezone : undefined,
    }).format(new Date(time));
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return new Intl.DateTimeFormat("en", options).format(new Date(time));
  }
}
