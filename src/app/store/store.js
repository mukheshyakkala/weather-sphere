import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./preferencesSlice";
import { weatherApi } from "./weatherApiSlice";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    weatherApi: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});