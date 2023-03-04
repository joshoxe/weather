<template>
  <div id="weather-box">
      <div id="header">
        <img src="@/assets/img/earth.png" alt="weather-icon">
        <h1>Search for weather in any area</h1>
      </div>

    <div id="box">
      <div id="search-box">
        <span id="location-icon">
          <font-awesome-icon icon="fa-solid fa-location-dot" />
        </span>
        <input
          type="text"
          class="form-control"
          placeholder="Location"
          @keyup.enter="handleWeatherSearch"
        >
        <button type="button" class="search-btn" @click="handleWeatherSearch">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
        </button>
      </div>
      <Collapse :when="!loading && searched" class="v-collapse">
        <div id="results">
            <img :src="weatherIcon" />
            <span class="temp">{{ weatherDisplay.temp }}°C</span>
            <span class="description">{{ weatherDisplay.description }}</span>
            <div class="bottom-bar">
              <span class="humidity">
                <font-awesome-icon icon="fa-solid fa-tint" />
                {{ weatherDisplay.humidity }}%
              </span>
              <span class="wind">
                <font-awesome-icon icon="fa-solid fa-wind" />
                {{ weatherDisplay.wind }}m/s
              </span>
            </div>
        </div>
      </Collapse>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Collapse } from 'vue-collapsed';
import useWeatherStore from '../stores/weatherStore';

const weatherStore = useWeatherStore();

const weatherDisplay = ref({});
const weatherCode = ref(0);
const loading = ref(false);
const searched = ref(false);
const weatherIcon = computed(() => {
  const iconCodeMap = {
    0: 'sun.png',
    2: 'storm.png',
    3: 'drizzle.png',
    5: 'rain.png',
    6: 'snow.png',
    7: 'mist.png',
    8: 'clouds.png',
  };

  // 8xx is for clouds, 800 is for clear sky, so don't use the clouds icon for 800
  if (weatherCode.value === 800) {
    // eslint-disable-next-line global-require
    return require('../assets/img/icons/sun.png');
  }
  const firstDigit = Math.floor(weatherCode.value / 100);
  const iconName = iconCodeMap[firstDigit];
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(`../assets/img/icons/${iconName}`);
});

async function handleWeatherSearch() {
  loading.value = true;
  const location = document.querySelector('input').value;
  const response = await weatherStore.getGeolocation(location);
  const { lat, lon } = await response.data[0];
  const weatherResponse = await weatherStore.getWeather(lat, lon);
  const {
    weather,
    main,
    name,
    wind,
  } = await weatherResponse.data;

  weatherDisplay.value = {
    weather: weather[0].main,
    description: weather[0].description,
    temp: Math.round(main.temp),
    code: weather[0].id,
    wind: wind.speed,
    humidity: main.humidity,
    name,
  };

  document.querySelector('input').value = weatherDisplay.value.name;

  loading.value = false;
  searched.value = true;
  weatherCode.value = weatherDisplay.value.code;
}

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.v-collapse {
  transition: height 300ms cubic-bezier(0.33, 1, 0.68, 1);
}

#weather-box {
  display: flex;
  flex-direction: column;
  width: 50%;
  font-family: 'Roboto Mono', monospace;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 576px) {
    width: 80%;
  }

  @media (max-width: 375px) {
    width: 90%;
  }

  #box {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: none;
  }

  #results {
    min-height: 30vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    animation: fadeInScale 0.3s ease-in-out;

    img {
      display: flex;
      justify-content: center;
      margin: 0 auto;
      height: 20vh;
    }

    .temp {
      display: flex;
      font-size: 3rem;
      justify-content: center;
    }

    .description {
      display: flex;
      font-size: 1.5rem;
      justify-content: center;
      text-transform: capitalize;
    }

    .city-name {
      display: flex;
      font-size: 1.5rem;
      justify-content: left;
    }

    .bottom-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 50px;
      padding: 0 20px;

      .wind, .humidity {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 1.3rem;

        svg {
          margin-right: 5px;
          font-size: 1.5rem;
        }
      }
    }
  }

  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  #header {
    display: flex;
    position: fixed;
    width: 50%;
    top: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 5px;

    h1 {
      display: flex;
      font-size: 1.2rem;
      color: #fff;
      text-align: center;
      align-items: end;
    }

    img {
      margin: 10px 0;
      height: 8vh;
    }
  }

  #search-box {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    input[type="text"] {
      border: none;
      padding: 0 30px;
      border-radius: 5px 0 0 5px;
      font-size: 1.2rem;
      outline: none;
      color: #333;
      transition: all 0.5s ease;

    }

    #location-icon {
      font-size: 2.3rem;
      color: #000;
      transition: all 0.5s ease;

    }

    button {
      display: flex;
      border: none;
      border-radius: 50%;
      padding: 15px;
      background-color: #4A4E69;
      color: #fff;
      font-size: 1.7rem;
      transition: background-color 0.3s ease-in-out;
      transition: all 0.5s ease;
    }

    button:hover {
      background-color: #2B2D42;
      color: white;
    }
  }
}

</style>
