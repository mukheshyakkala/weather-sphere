import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.open-meteo.com/v1/" }),
  endpoints: (builder) => ({
    getWeatherData: builder.query({
      query: ({
        latitude,
        longitude,
        unit = "C",
        windSpeedUnit = "kmh",
        precipitationUnit = "mm",
      }) => {
        const tempUnitParam = unit === "F" ? "&temperature_unit=fahrenheit" : "";
        const unitParams = `&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`;

        return `forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,surface_pressure,visibility,cloud_cover,dew_point_2m&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,wind_gusts_10m_max,sunrise,sunset&forecast_days=16&timezone=auto${tempUnitParam}${unitParams}`;
      },
    }),
    getAirQuality: builder.query({
      query: ({ latitude, longitude }) => ({
        url: "https://air-quality-api.open-meteo.com/v1/air-quality",
        params: {
          latitude,
          longitude,
          current: "us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index",
          hourly: "us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen",
          forecast_days: 5,
          timezone: "auto",
        },
      }),
    }),
    searchLocations: builder.query({
      query: (name) =>
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en&format=json`,
      transformResponse: (response) => Array.isArray(response?.results)
        ? response.results.filter((result) =>
            result &&
            Number.isFinite(result.latitude) &&
            result.latitude >= -90 &&
            result.latitude <= 90 &&
            Number.isFinite(result.longitude) &&
            result.longitude >= -180 &&
            result.longitude <= 180,
          )
        : [],
    }),
  }),
});

export const { useGetWeatherDataQuery, useGetAirQualityQuery, useLazySearchLocationsQuery } = weatherApi;