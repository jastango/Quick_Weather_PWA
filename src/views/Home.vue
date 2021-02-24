<template>
  <div
    class="home"
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
      <div class="form-group">
        <form @submit.prevent="searchWeather(query)">
          <div class="input-field">
            <input v-model="query" type="text" id="query" />
            <label for="query">Enter a city or zipcode...</label>
          </div>
          <div class="btn-checkbox-group">
            <button class="btn waves-effect waves-light" type="submit">
              Get Weather
            </button>
            <p>
              <label for="makeDefault">
                <input
                  v-model="makeDefault"
                  id="makeDefault"
                  type="checkbox"
                  class="filled-in checkbox-bg"
                />
                <span class="make-default">Make Default?</span>
              </label>
            </p>
          </div>
        </form>
      </div>

      <div class="card-grid">
        <div class="container">
          <div v-if="feedback" class="card feedback">
            <div class="card-content">
              <p class="feedback">{{ feedback }}</p>
            </div>
          </div>
          <div v-if="weather.city" class="card">
            <div class="card-content center-align">
              <p v-if="feedback" class="feedback">{{ feedback }}</p>
              <span class="card-title city">{{ weather.city }}</span>
              <p class="current-temp">
                {{ weather.temp }} <span class="deg-far">&#8457;</span>
              </p>
              <p class="feels-like">
                Feels like {{ weather.feels }}
                <span class="deg-far">&#8457;</span>
              </p>
              <p class="low-temp">
                Low: {{ weather.tempLow }} <span class="deg-far">&#8457;</span>
              </p>
              <p class="high-temp">
                High: {{ weather.tempHigh }}
                <span class="deg-far">&#8457;</span>
              </p>
              <p class="chance-wet">
                Chance of Precipitation: {{ weather.chanceWet }}%
              </p>
              <p class="desc">{{ weather.desc }}</p>
            </div>
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
export default {
  name: "Home",
  data() {
    return {
      query: "",
      lon: "",
      lat: "",
      feedback: "",
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
      this.weather.city = result.current.data.name;
      this.weather.temp = Math.round(result.current.data.main.temp);
      this.weather.type = result.current.data.weather[0].main.toLowerCase();
      this.weather.desc = result.current.data.weather[0].description;
      this.weather.feels = Math.round(result.current.data.main.feels_like);
      this.weather.tempLow = Math.round(result.current.data.main.temp_min);
      this.weather.tempHigh = Math.round(result.current.data.main.temp_max);
      this.weather.chanceWet = result.daily.data.daily[0].pop * 100;
    },
    async searchWeather(query) {
      try {
        const result = await getWeather(query);
        this.resetFields();
        this.setData(result);
        this.setBackground(this.weather.type);
        if (this.makeDefault) {
          localStorage.defaultCity = result.current.data.name;
          this.makeDefault = false;
        }
      } catch (error) {
        this.value = "";
        this.clearWeather();
        this.isError = true;
        this.feedback =
          "That one just kind of got away... please try your search again";
      }
    },
  },
  async beforeMount() {
    try {
      if (localStorage.defaultCity) {
        const result = await getWeather(localStorage.defaultCity);
        this.resetFields();
        this.setData(result);
        this.setBackground(this.weather.type);
      }
    } catch (error) {
      this.value = "";
      console.log(error.message);
    }
  },
};
</script>

<style>
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.card {
  opacity: 0.9;
}

.feedback {
  font-size: 1.3rem;
  font-weight: 400;
  color: #b71c1c;
}
.city {
  font-weight: 400 !important;
}
.current-temp {
  font-size: 1.8rem;
  padding: 7px;
}

.feels-like {
  font-size: 1.3rem;
  border-bottom: 1px solid #f3f3f3;
  padding-bottom: 7px;
}

.low-temp {
  font-size: 1.3rem;
  padding: 5px 0;
}

.high-temp {
  font-size: 1.3rem;
  border-bottom: 1px solid #f3f3f3;
  padding-bottom: 7px;
}

.chance-wet {
  font-size: 1.3rem;
  padding: 7px 0;
}

.desc {
  font-size: 1.2rem;
}

.make-default {
  color: #424242 !important;
  font-weight: 500;
}

.form-group {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 25px;
  padding: 0 10px;
}

.input-field label {
  color: #424242 !important;
  font-weight: 500;
}

.input-field input[type="text"]:focus + label {
  color: #424242 !important;
}

.input-field input[type="text"]:focus {
  border-bottom: 1px solid #4fc3f7 !important;
  box-shadow: 0 1px 0 0 #4fc3f7 !important;
}

.btn {
  background-color: #01579b !important;
}

.btn:hover {
  background-color: #4fc3f7 !important;
}

.btn-checkbox-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

[type="checkbox"].filled-in:checked + span:not(.lever):after {
  border: 2px solid #4fc3f7;
  background-color: #4fc3f7;
}

.bg-rain {
  background: url("../assets/rain.jpg") center center/cover no-repeat;
}

.bg-snow {
  background: url("../assets/snow.jpg") center center/cover no-repeat;
}

.bg-sunny {
  background: url("../assets/sunny.jpg") center center/cover no-repeat;
}

.bg-cloudy {
  background: url("../assets/cloudy.jpg") center center/cover no-repeat;
}

.bg-thunderstorm {
  background: url("../assets/thunderstorm.jpg") center center/cover no-repeat;
}

.bg-haze {
  background: url("../assets/haze.jpg") center center/cover no-repeat;
}

.bg-error {
  background: url("../assets/error.jpg") center center/cover no-repeat;
}

.bg-default {
  background: url("../assets/default.jpg") center center/cover no-repeat;
}
</style>
