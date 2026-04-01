console.log("JS loaded");

const container = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const sortOption = document.getElementById("sortOption");
const statusText = document.getElementById("status");

let allCountries = [];

async function fetchCountries() {
  statusText.textContent = "Loading countries...";

  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    allCountries = data;

    displayCountries(allCountries);
    statusText.textContent = "";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error loading countries";
  }
}

function displayCountries(countries) {
  container.innerHTML = "";

  countries.forEach((country) => {
    const div = document.createElement("div");
    div.className = "card";

    const capital = country.capital ? country.capital[0] : "N/A";
    const flag = country.flags ? country.flags.png : "";

    div.innerHTML = `
      <img src="${flag}" alt="${country.name.common} flag">
      <h3>${country.name.common}</h3>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Capital:</strong> ${capital}</p>
    `;

    container.appendChild(div);
  });
}

function applyFiltersAndSort() {
  let result = [...allCountries];

  const searchValue = searchInput.value.toLowerCase();
  const selectedRegion = regionFilter.value;
  const selectedSort = sortOption.value;

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

  if (selectedSort === "name") {
    result.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } else if (selectedSort === "population") {
    result.sort((a, b) => a.population - b.population);
  }

  displayCountries(result);
}

searchInput.addEventListener("input", applyFiltersAndSort);
regionFilter.addEventListener("change", applyFiltersAndSort);
sortOption.addEventListener("change", applyFiltersAndSort);

fetchCountries();