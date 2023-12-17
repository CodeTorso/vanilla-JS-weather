const degree = document.getElementById("degree");
const wind = document.getElementById("wind");
const weather = document.getElementById("weather");
const precipitation = document.getElementById("precipitation");

const apiKey = "AIzaSyDBAKGzKYMr9VxF8WpzP1t3SoT2KR_dqow";

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light intensity",
  53: "Drizzle: Moderate intensity",
  55: "Drizzle: Dense intensity",
  56: "Freezing Drizzle: Light intensity",
  57: "Freezing Drizzle: Dense intensity",
  61: "Rain: Slight intensity",
  63: "Rain: Moderate intensity",
  65: "Rain: Heavy intensity",
  66: "Freezing Rain: Light intensity",
  67: "Freezing Rain: Heavy intensity",
  71: "Snow fall: Slight intensity",
  73: "Snow fall: Moderate intensity",
  75: "Snow fall: Heavy intensity",
  77: "Snow grains",
  80: "Rain showers: Slight intensity",
  81: "Rain showers: Moderate intensity",
  82: "Rain showers: Violent",
  85: "Snow showers: Slight intensity",
  86: "Snow showers: Heavy intensity",
  95: "Thunderstorm: Slight",
  96: "Thunderstorm with hail: Slight intensity",
  99: "Thunderstorm with hail: Heavy intensity",
};

document.getElementById("searchText").addEventListener("focusin", () => {
  document.getElementById("results").classList.add("hidden");
  document.getElementById("searchText").classList.add("input-focus");
});

document.getElementById("searchText").addEventListener("focusout", () => {
  setTimeout(() => {
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("searchText").classList.remove("input-focus");
  }, 300);
});

function callSearcher() {
  let search = document.getElementById("searchText").value;
  search && callLocationApi(search);
}

function callLocationApi(name) {
  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${name}`)
    .then((res) => res.json())
    .then((result) => addSearches(result.results));
}

function addSearches(searches) {
  const results = document.getElementById("results");
  let parent = "";

  if (searches) {
    for (let i = 0; i < searches.length; i++) {
      parent += `<div class="searches" onclick="callApi(${
        searches[i].latitude
      }, ${searches[i].longitude}); callImgApi('${
        searches[i].name +
        ", " +
        (searches[i].admin1 || "") +
        ", " +
        searches[i].country
      }')"><img src="https://open-meteo.com/images/country-flags/${
        searches[i].country_code
      }.svg" class="search-country-logo"><h3>${
        searches[i].name + ", " + searches[i].country
      }</h3><p>${searches[i].admin1 || ""}</p></div>`;
    }
    results.innerHTML = parent;
  }
}

function callApi(lat, long) {
  const time24 = new Date().getHours() - 1;
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m&forecast_days=1`
  )
    .then((res) => res.json())
    .then((data) => {
      weather.innerHTML = `${weatherCodes[data.hourly.weather_code[time24]]}`;
      degree.innerHTML = `${data.hourly.temperature_2m[time24]}°C`;
      wind.innerHTML = `${data.hourly.wind_speed_10m[time24]} km/hr ${data.hourly.wind_direction_10m[time24]}°`;
      precipitation.innerHTML = `${data.hourly.precipitation_probability[time24]}%`;
    });
}

function callImgApi(location) {
  let randomPhoto = "";
  const apiKey = "AIzaSyDBAKGzKYMr9VxF8WpzP1t3SoT2KR_dqow";
  const url = "https://places.googleapis.com/v1/places:searchText";

  const data = {
    textQuery: location,
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask":
      "places.displayName,places.formattedAddress,places.priceLevel,places.photos",
  };

  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const arr = data.places[0].photos;
      randomPhoto = arr[Math.floor(Math.random() * arr.length)];
      getImg(randomPhoto.name);
    });
}

function getImg(randomPhoto) {
  const url = `https://places.googleapis.com/v1/${randomPhoto}/media?maxHeightPx=500&maxWidthPx=1300&key=AIzaSyDBAKGzKYMr9VxF8WpzP1t3SoT2KR_dqow`;
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }
      return res.blob();
    })
    .then((imageBlob) => displayImage(imageBlob));
}

function displayImage(imageBlob) {
  const imageUrl = URL.createObjectURL(imageBlob);

  const imgElement = document.getElementById("city-img");
  const bgImgElement = document.getElementById("bg-city-img");
  imgElement.src = imageUrl;
  bgImgElement.src = imageUrl;
}
