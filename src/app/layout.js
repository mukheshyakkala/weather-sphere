import { Providers } from "./Providers";
import AppShell from "./AppShell";
import "./globals.css";

export const metadata = {
  title: "WeatherSphere | Live Weather",
  description: "Current weather, forecasts, air quality, and weather maps for your location.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}