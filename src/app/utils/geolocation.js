function isValidCoordinates(latitude, longitude) {
  return Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;
}

export function getCurrentCoordinates() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.reject(new Error("Location services are not available in this browser."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!isValidCoordinates(coords?.latitude, coords?.longitude)) {
          reject(new Error("The browser returned invalid location coordinates."));
          return;
        }

        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (error) => {
        reject(new Error(error?.message || "Unable to access your current location."));
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  });
}

export async function getCurrentLocation() {
  const coordinates = await getCurrentCoordinates();

  try {
    const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    url.searchParams.set("latitude", coordinates.latitude);
    url.searchParams.set("longitude", coordinates.longitude);
    url.searchParams.set("localityLanguage", "en");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status ${response.status}.`);
    }

    const place = await response.json();
    const name = place?.city || place?.locality || place?.principalSubdivision || "My location";
    return {
      ...coordinates,
      name,
      country: typeof place?.countryName === "string" ? place.countryName : "",
      admin1: typeof place?.principalSubdivision === "string" ? place.principalSubdivision : "",
    };
  } catch (error) {
    console.warn("Unable to resolve a name for the current location.", error);
    return { ...coordinates, name: "My location" };
  }
}
