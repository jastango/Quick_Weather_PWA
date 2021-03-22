<template>
  <div
    class="home"
    v-bind:style="{ height: setHeight }"
    v-bind:class="{
      'bg-cloudy': isCloudy,
      'bg-snow': isSnow,
      'bg-rain': isRain,
      'bg-sunny': isSunny,
      'bg-thunderstorm': isThunderstorm,
      'bg-haze': isHaze,
      'bg-error': isError,
      'bg-default': isDefault,
    }"
  >
    <div class="container">
      <!-- Search Form -->
      <div class="form-group">
        <form @submit.prevent="searchWeather(query)">
          <div class="input-field">
            <input v-model="query" type="text" id="query" />
            <label for="query">Enter a city or zipcode...</label>
          </div>
          <div class="btn-checkbox-group">
            <span class="make-default-flex">
              <label for="makeDefault">
                <input
                  v-model="makeDefault"
                  id="makeDefault"
                  type="checkbox"
                  class="filled-in checkbox-bg"
                />
                <span class="make-default">Make Default?</span>
              </label>
            </span>
            <button class="btn waves-effect waves-light" type="submit">
              Get Weather
            </button>
          </div>
        </form>
      </div>
      <!-- Main Weather -->
      <div class="card-grid">
        <div v-if="feedback" class="card feedback">
          <div class="card-content">
            <p class="feedback">{{ feedback }}</p>
          </div>
        </div>
        <div v-if="weather.city" class="card" id="current-weather">
          <div class="card-content center-align">
            <p class="current-date">{{ this.weather.date }}</p>
            <span class="card-title city">{{ weather.city }}</span>
            <p class="current-temp">{{ weather.temp }} <span>&#8457;</span></p>
            <p class="feels-like">
              Feels like {{ weather.feels }} <span>&#8457;</span>
            </p>
            <p class="low-temp">
              Low: {{ weather.tempLow }} <span>&#8457;</span>
            </p>
            <p class="high-temp">
              High: {{ weather.tempHigh }} <span>&#8457;</span>
            </p>
            <p class="chance-wet">
              Chance of Precipitation: {{ weather.chanceWet }}%
            </p>
            <p class="desc">{{ weather.desc }}</p>
          </div>
        </div>
      </div>
      <!-- Hourly/ Daily Weather Components -->
      <div v-if="weather.hours[0]" class="card">
        <div class="card-title header-title">
          <span>Hourly</span>
        </div>
        <table class="striped center">
          <tbody>
            <tr v-for="(hour, index) in weather.hours" :key="index">
              <td>
                <span id="hour-date-group">
                  <span id="hour-hour">{{ hour.hour }}</span>
                  <span id="hour-date">{{ hour.date }}</span>
                </span>
              </td>
              <td id="hour-temp">
                {{ Math.round(hour.temp) }}<span>&#8457;</span>
              </td>
              <td id="hour-feels-like">
                <span id="hour-feels-like-group">
                  <span id="hour-feels-like-text">Feels</span>
                  <span>
                    {{ Math.round(hour.feels_like) }}<span>&#8457;</span>
                  </span>
                </span>
              </td>
              <td id="hour-desc">
                {{ hour.weather[0].description }}
              </td>
              <td id="hour-chance-wet">{{ Math.round(hour.pop) * 100 }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 5 day forecast -->
      <div v-if="weather.forecast[0]">
        <div class="card">
          <div class="card-title header-title">
            <span>5-Day Forecast</span>
          </div>
        </div>
        <div v-for="(day, index) in weather.forecast" :key="index" class="card">
          <div class="card-content center-align">
            <p class="current-date">{{ day.date }}</p>
            <div class="center mt-10">
              <img class="forecast-img" :src="`/img/${day.img}`" alt="" />
            </div>
            <p class="low-temp">
              Low: {{ Math.round(day.temp.min) }}
              <span>&#8457;</span>
            </p>
            <p class="high-temp">
              High: {{ Math.round(day.temp.max) }}
              <span>&#8457;</span>
            </p>
            <p class="chance-wet">
              Chance of Precipitation: {{ Math.round(day.pop) * 100 }}%
            </p>
            <p class="desc">{{ day.weather[0].description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getWeather from "../js/getWeather";
import "../css-materialize/materialize.js";
import "../css-materialize/materialize.min.css";
import "../assets/css/style.css";
import dayjs from "dayjs";
export default {
  name: "Home",
  data() {
    return {
      query: "",
      feedback: "",
      setHeight: "100vh",
      makeDefault: false,
      weather: {
        city: "",
        currentTemp: "",
        type: "",
        desc: "",
        feels: "",
        tempLow: "",
        tempHigh: "",
        chanceWet: "",
        hours: [],
        forecast: [],
        date: "",
      },
      isCloudy: false,
      isSnow: false,
      isRain: false,
      isSunny: false,
      isThunderstorm: false,
      isHaze: false,
      isError: false,
      isDefault: true,
    };
  },
  methods: {
    resetFields() {
      this.feedback = "";
      this.query = "";
      this.isCloudy = false;
      this.isSnow = false;
      this.isRain = false;
      this.isSunny = false;
      this.isThunderstorm = false;
      this.isHaze = false;
      this.isError = false;
      this.isDefault = false;
    },
    clearWeather() {
      this.weather.city = "";
      this.weather.currentTemp = "";
      this.weather.feels = "";
      this.weather.type = "";
      this.weather.tempLow = "";
      this.weather.tempHigh = "";
      this.weather.chanceWet = "";
      this.weather.desc = "";
      this.weather.hours = [];
      this.weather.date = "";
      this.weather.forecast = [];
    },
    setBackground(type) {
      if (type === "clouds") {
        this.isCloudy = true;
      } else if (type === "snow") {
        this.isSnow = true;
      } else if (type === "rain" || type === "mist") {
        this.isRain = true;
      } else if (type === "clear") {
        this.isSunny = true;
      } else if (type === "thunderstorm") {
        this.isThunderstorm = true;
      } else if (type === "haze") {
        this.isHaze = true;
      }
    },
    setData(result) {
      // Reset hours/forecast arrays to prevent pushing multiple searches
      this.weather.hours = [];
      this.weather.forecast = [];
      // Set Current Weather
      this.weather.city = result.current.data.name;
      this.weather.temp = Math.round(result.current.data.main.temp);
      this.weather.type = result.current.data.weather[0].main.toLowerCase();
      this.weather.desc = result.current.data.weather[0].description;
      this.weather.feels = Math.round(result.current.data.main.feels_like);
      this.weather.tempLow = Math.round(result.daily.data.daily[0].temp.min);
      this.weather.tempHigh = Math.round(result.daily.data.daily[0].temp.max);
      this.weather.chanceWet = result.daily.data.daily[0].pop * 100;

      // Current Weather Date
      this.weather.date = dayjs
        .unix(result.current.data.dt)
        .format("dddd, MMM D, YYYY");

      // Get 12 hours
      for (let i = 0; i < 12; i++) {
        this.weather.hours.push(result.daily.data.hourly[i]);
      }
      // Get Date/Hour for Hourly
      for (let i = 0; i < 12; i++) {
        this.weather.hours[i].date = dayjs
          .unix(this.weather.hours[i].dt)
          .format("M/D");

        this.weather.hours[i].hour = dayjs
          .unix(this.weather.hours[i].dt)
          .format("h A");
      }

      // Get 5 Days
      for (let i = 0; i < 6; i++) {
        this.weather.forecast.push(result.daily.data.daily[i]);

        // Get Forecast Date
        this.weather.forecast[i].date = dayjs
          .unix(result.daily.data.daily[i].dt)
          .format("dddd, MMM D, YYYY");
      }

      // Remove Today, start on Tomorrow
      this.weather.forecast.splice(0, 1);

      // Set 5 Day Images
      for (let i = 0; i < this.weather.forecast.length; i++) {
        let type = this.weather.forecast[i].weather[0].main.toLowerCase();

        if (type === "clouds") {
          this.weather.forecast[i].img = "cloudy.jpg";
        } else if (type === "snow") {
          this.weather.forecast[i].img = "snow.jpg";
        } else if (type === "rain" || type === "mist") {
          this.weather.forecast[i].img = "rain.jpg";
        } else if (type === "clear") {
          this.weather.forecast[i].img = "sunny.jpg";
        } else if (type === "thunderstorm") {
          this.weather.forecast[i].img = "thunderstorm.jpg";
        } else if (type === "haze") {
          this.weather.forecast[i].img = "haze.jpg";
        }
      }
    },
    // Get Weather Button Method
    async searchWeather(query) {
      try {
        const result = await getWeather(query);
        this.setHeight = "100%";
        this.resetFields();
        this.setData(result);
        this.setBackground(this.weather.type);
        if (this.makeDefault) {
          localStorage.defaultCity = result.current.data.name;
          this.makeDefault = false;
        }
      } catch (error) {
        console.log(error.message);
        this.setHeight = "100vh";
        this.value = "";
        this.clearWeather();
        this.isError = true;
        this.feedback =
          "That one just kind of got away... please try your search again";
      }
    },
  },
  // Check if Default City is saved in Local Storage
  async beforeMount() {
    try {
      if (localStorage.defaultCity) {
        const result = await getWeather(localStorage.defaultCity);
        this.setHeight = "100%";
        this.resetFields();
        this.setData(result);
        this.setBackground(this.weather.type);
      }
    } catch (error) {
      this.setHeight = "100vh";
      this.value = "";
      console.log(error.message);
    }
  },
};
</script>

<style>
</style>
