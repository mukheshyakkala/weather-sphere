# WeatherSphere

WeatherSphere is a responsive weather dashboard built with Next.js, React, Redux Toolkit, and Recharts. It uses Open-Meteo for weather, air-quality, and location-search data, and OpenStreetMap for interactive maps.

## Features

- Current conditions, hourly forecast, weekly outlook, temperature analytics, sunrise and sunset, and air-quality summary.
- Extended forecast with a 48-hour carousel, 16-day outlook, and temperature, rainfall, and wind charts.
- Air-quality readings, pollutant charts, environmental information, and health recommendations.
- Interactive OpenStreetMap with city search, location selection, zoom, and current-weather details.
- Side-by-side city comparison, saved favorite locations, recent searches, and app settings.
- Shared theme and measurement preferences, responsive page layouts, and loading/error states.

## Pages

| Route | Description |
| --- | --- |
| `/` | Weather dashboard |
| `/forecast` | Hourly and 16-day forecast |
| `/air-quality` | AQI, pollutants, trends, and guidance |
| `/maps` | OpenStreetMap with local weather details |
| `/compare` | Compare weather and air quality between cities |
| `/favorites` | Manage saved locations and recent searches |
| `/settings` | Configure theme, units, location, and app preferences |

## Requirements

- Node.js compatible with the installed Next.js version.
- npm.

No API key or environment variables are required for the current providers.

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate and build

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Deployment

The project can be deployed to any platform that supports Next.js, including [Vercel](https://vercel.com/). To deploy with Vercel:

1. Push the project to a GitHub repository.
2. Import the repository in Vercel and keep the detected Next.js build settings.
3. Deploy. No environment variables are needed for the current Open-Meteo and OpenStreetMap integrations.

For other platforms, install dependencies, run `npm run build`, and start the application with `npm run start` in the deployment environment.

## Data providers and limitations

- Weather, forecast, and air-quality data are provided by [Open-Meteo](https://open-meteo.com/); location search uses its geocoding service.
- Browser-detected coordinates are reverse-geocoded with [BigDataCloud](https://www.bigdatacloud.com/), so the app can display the detected locality and country.
- On first visit, the app requests browser location access to load local weather and uses reverse geocoding to show the detected city and country. Browser-detected locations are refreshed on later visits; a manually selected city is kept as the default. If location access is unavailable or denied, search for a city or retry from Settings.
- The interactive map uses [OpenStreetMap](https://www.openstreetmap.org/) tiles and displays map attribution.
- The current map provider does not supply weather, rainfall, cloud, wind, AQI, or radar overlays; these layers are not available in the app.
- Pollen measurements may be unavailable for some locations or seasons.
- Favorite locations and preferences are saved in the browser, so they do not automatically sync between devices.
- Notification preferences and browser permission can be managed in Settings. The app does not currently deliver server-side or push weather alerts.
