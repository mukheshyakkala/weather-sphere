import { useMemo } from "react";

export function useForecastData(weather, view, selectedDate) {
  const hourlyData = useMemo(() => {
    const hourly = weather?.hourly;
    if (!Array.isArray(hourly?.time) || !hourly.time.length) return [];

    const currentTime = weather.current?.time ?? hourly.time[0];
    const foundIndex = hourly.time.findIndex((time) => typeof time === "string" && time >= currentTime);
    const startIndex = Math.max(0, foundIndex);

    return hourly.time.slice(startIndex, startIndex + 48).flatMap((time, offset) => {
      if (typeof time !== "string" || !Number.isFinite(Date.parse(time))) return [];
      const index = startIndex + offset;
      return [{
        time,
        date: time.slice(0, 10),
        temperature: hourly.temperature_2m?.[index],
        feelsLike: hourly.apparent_temperature?.[index],
        rainProbability: Number.isFinite(hourly.precipitation_probability?.[index])
          ? hourly.precipitation_probability[index]
          : null,
        rainfall: Number.isFinite(hourly.precipitation?.[index])
          ? hourly.precipitation[index]
          : null,
        humidity: hourly.relative_humidity_2m?.[index],
        windSpeed: hourly.wind_speed_10m?.[index],
        windDirection: hourly.wind_direction_10m?.[index],
        windGusts: hourly.wind_gusts_10m?.[index],
        uvIndex: hourly.uv_index?.[index],
        weatherCode: Number.isFinite(hourly.weather_code?.[index]) ? hourly.weather_code[index] : null,
      }];
    });
  }, [weather]);

  const dailyData = useMemo(() => {
    const daily = weather?.daily;
    if (!Array.isArray(daily?.time) || !daily.time.length) return [];

    return daily.time.flatMap((date, index) => {
      if (typeof date !== "string" || !Number.isFinite(Date.parse(`${date}T12:00:00Z`))) return [];
      return [{
      date,
      weatherCode: Number.isFinite(daily.weather_code?.[index]) ? daily.weather_code[index] : null,
      minTemperature: daily.temperature_2m_min?.[index],
      maxTemperature: daily.temperature_2m_max?.[index],
      rainProbability: Number.isFinite(daily.precipitation_probability_max?.[index])
        ? daily.precipitation_probability_max[index]
        : null,
      rainfall: Number.isFinite(daily.precipitation_sum?.[index])
        ? daily.precipitation_sum[index]
        : null,
      windSpeed: daily.wind_speed_10m_max?.[index],
      windDirection: daily.wind_direction_10m_dominant?.[index],
      windGusts: daily.wind_gusts_10m_max?.[index],
      }];
    });
  }, [weather]);

  const chartData = useMemo(() => {
    const source = view === "hourly" ? hourlyData : dailyData;
    return selectedDate === "all"
      ? source
      : source.filter((item) => item.date === selectedDate);
  }, [dailyData, hourlyData, selectedDate, view]);

  return { hourlyData, dailyData, chartData };
}
