console.log("JS loaded");

const container = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const sortOption = document.getElementById("sortOption");
const favoriteFilter = document.getElementById("favoriteFilter");
const statusText = document.getElementById("status");
const themeToggle = document.getElementById("themeToggle");
const favoriteCount = document.getElementById("favoriteCount");

let allCountries = [];
let favoriteCountries = JSON.parse(localStorage.getItem("favoriteCountries")) || [];

async function fetchCountries() {
  statusText.textContent = "Loading countries...";

  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    allCountries = data;

    applyFiltersAndSort();
    statusText.textContent = "";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error loading countries";
  }
}

function displayCountries(countries) {
  container.innerHTML = "";

  if (countries.length === 0) {
    container.innerHTML = `<p class="no-results">No countries found.</p>`;
    return;
  }

  countries.forEach((country) => {
    const div = document.createElement("div");
    div.className = "card";

    const capital = country.capital ? country.capital[0] : "N/A";
    const flag = country.flags ? country.flags.png : "";
    const name = country.name.common;
    const isFavorite = favoriteCountries.includes(name);

    div.innerHTML = `
      <img src="${flag}" alt="${name} flag">
      <div class="card-content">
        <h3>${name}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${capital}</p>
        <button class="fav-btn" data-name="${name}">
          ${isFavorite ? "💖 Remove Favorite" : "🤍 Add Favorite"}
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  addFavoriteButtonEvents();
  updateFavoriteCount();
}

function addFavoriteButtonEvents() {
  const favButtons = document.querySelectorAll(".fav-btn");

  favButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const countryName = button.dataset.name;

      if (favoriteCountries.includes(countryName)) {
        favoriteCountries = favoriteCountries.filter((name) => name !== countryName);
      } else {
        favoriteCountries.push(countryName);
      }

      localStorage.setItem("favoriteCountries", JSON.stringify(favoriteCountries));
      applyFiltersAndSort();
    });
  });
}

function updateFavoriteCount() {
  favoriteCount.textContent = `⭐ Favorite Countries: ${favoriteCountries.length}`;
}

function applyFiltersAndSort() {
  let result = [...allCountries];

  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedRegion = regionFilter.value;
  const selectedSort = sortOption.value;
  const selectedFavoriteFilter = favoriteFilter.value;

  if (searchValue) {
    result = result.filter((country) =>
      country.name.common.toLowerCase().includes(searchValue)
    );
  }

  if (selectedRegion !== "all") {
    result = result.filter(
      (country) => country.region.toLowerCase() === selectedRegion
    );
  }

  if (selectedFavoriteFilter === "favorites") {
    result = result.filter((country) =>
      favoriteCountries.includes(country.name.common)
    );
  }

  if (selectedSort === "name-asc") {
    result.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } else if (selectedSort === "name-desc") {
    result.sort((a, b) => b.name.common.localeCompare(a.name.common));
  } else if (selectedSort === "population-asc") {
    result.sort((a, b) => a.population - b.population);
  } else if (selectedSort === "population-desc") {
    result.sort((a, b) => b.population - a.population);
  }

  displayCountries(result);
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  }
}

searchInput.addEventListener("input", applyFiltersAndSort);
regionFilter.addEventListener("change", applyFiltersAndSort);
sortOption.addEventListener("change", applyFiltersAndSort);
favoriteFilter.addEventListener("change", applyFiltersAndSort);

loadTheme();
fetchCountries();