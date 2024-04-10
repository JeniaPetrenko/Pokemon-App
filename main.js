// Klass för att representera en Pokemon
class Pokemon {
  constructor(name, image, types, weight, height, stats) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
  }

  // Metod för att jämföra två Pokemon
  compare(otherPokemon) {
    // Här kan du implementera din egen logik för att jämföra Pokemon
    // Till exempel, baserat på deras statistik eller egenskaper
    // Returnera ett positivt värde om den här Pokemon är starkare,
    // negativt om den andra Pokemon är starkare, och noll om de är lika
  }

  // Metod för att visa detaljer om Pokemon
  showDetails() {
    return `
      <h2>${this.name}</h2>
      <img src="${this.image}" alt="${this.name}">
      <p>Types: ${this.types.join(", ")}</p>
      <p>Weight: ${this.weight}</p>
      <p>Height: ${this.height}</p>
      <p>Stats:</p>
      <ul>
        ${this.stats
          .map((stat) => `<li>${stat.name}: ${stat.value}</li>`)
          .join("")}
      </ul>
    `;
  }
}

// Funktion för att hämta data från API
async function fetchData() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}

// Funktion för att hämta detaljerad data om en Pokemon från API
async function fetchPokemonDetails(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();

    // Extrahera önskad data från API-svaret
    const name = data.name;
    const image = data.sprites.front_default;
    const types = data.types.map((type) => type.type.name);
    const weight = data.weight;
    const height = data.height;
    const stats = data.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    }));

    return new Pokemon(name, image, types, weight, height, stats);
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
  }
}

// Funktion för att fylla dropdown-listan med Pokemon
async function fillDropdown() {
  const selectElement = document.getElementById("pokemonSelect");
  const pokemonList = await fetchData();

  pokemonList.forEach((pokemon) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = pokemon.name;
    selectElement.appendChild(optionElement);
  });
}

// Funktion för att visa detaljer om vald Pokemon
async function showSelectedPokemon() {
  const selectElement = document.getElementById("pokemonSelect");
  const selectedPokemonName = selectElement.value;
  const pokemonDetailsContainer = document.getElementById("pokemonDetails");

  const selectedPokemon = await fetchPokemonDetails(selectedPokemonName);
  const pokemonDetailsHTML = selectedPokemon.showDetails();

  pokemonDetailsContainer.innerHTML = pokemonDetailsHTML;
}

// Lägg till händelselyssnare för att visa detaljer när en Pokemon väljs
document
  .getElementById("pokemonSelect")
  .addEventListener("change", showSelectedPokemon);

// Fyll dropdown-listan med Pokemon när sidan laddas
fillDropdown();
