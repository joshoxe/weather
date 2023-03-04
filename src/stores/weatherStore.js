import { defineStore } from 'pinia';
import axios from 'axios';

const useWeatherStore = defineStore('weatherStore', () => {
  async function getGeolocation(location) {
    return axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.VUE_APP_WEATHER_API_KEY}`);
  }

  async function getWeather(lat, lon) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.VUE_APP_WEATHER_API_KEY}`);
  }

  return {
    getGeolocation,
    getWeather,
  };
});

export default useWeatherStore;
