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

  // Metod för att visa detaljer om Pokemon
  showDetails() {
    let statsHTML = "";
    this.stats.forEach((stat) => {
      // Calculate the width of the bar based on the stat value
      const widthPercentage = (stat.value / 200) * 100; // Assuming max value is 200

      // Create a div element for each stat with a class representing the stat name
      statsHTML += `
            <div class="stat">
                <p>${stat.name}: ${stat.value}</p>
                <div class="bar" style="width: ${widthPercentage}%"></div>
            </div>
        `;
    });

    return `
        <h2>${this.name}</h2>
        <img src="${this.image}" alt="${this.name}">
        <p>Types: ${this.types.join(", ")}</p>
        <p>Weight: ${this.weight}</p>
        <p>Height: ${this.height}</p>
        <p>Stats:</p>
        <div class="stats-container">
            ${statsHTML}
        </div>
    `;
  }
}

// Deklarera variabler för att lagra de valda Pokemonerna
let firstSelectedPokemon = null;
let secondSelectedPokemon = null;

// Funktion för att hantera val av den första Pokemonen
async function handleFirstPokemonSelection() {
  const selectElement = document.getElementById("pokemonSelect1");
  const selectedPokemonName = selectElement.value;

  // Hämta detaljer för den första valda Pokemonen
  firstSelectedPokemon = await fetchPokemonDetails(selectedPokemonName);
  const pokemonDetailsContainer1 = document.getElementById("pokemonDetails1");
  const pokemonDetailsHTML1 = firstSelectedPokemon.showDetails();
  pokemonDetailsContainer1.innerHTML = pokemonDetailsHTML1;
}

// Funktion för att hantera val av den andra Pokemonen
async function handleSecondPokemonSelection() {
  const selectElement = document.getElementById("pokemonSelect2");
  const selectedPokemonName = selectElement.value;

  // Hämta detaljer för den andra valda Pokemonen
  secondSelectedPokemon = await fetchPokemonDetails(selectedPokemonName);
  const pokemonDetailsContainer2 = document.getElementById("pokemonDetails2");
  const pokemonDetailsHTML2 = secondSelectedPokemon.showDetails();
  pokemonDetailsContainer2.innerHTML = pokemonDetailsHTML2;
}

// Funktion för att jämföra de två valda Pokemonerna
async function compareSelectedPokemons() {
  // Kontrollera om båda Pokemonerna har valts
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Vänligen välj två Pokemon för att jämföra.");
    return;
  }

  // Jämför de två valda Pokemonerna
  const comparisonResultContainer = document.getElementById("comparisonResult");
  const comparisonResult = compareStats(
    firstSelectedPokemon,
    secondSelectedPokemon
  );
  comparisonResultContainer.textContent = comparisonResult;
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

// Funktion för att jämföra statistik för två Pokemon
function compareStats(pokemon1, pokemon2) {
  let pokemon1Wins = 0;
  let pokemon2Wins = 0;

  if (pokemon1.weight > pokemon2.weight) {
    pokemon1Wins++;
  } else if (pokemon1.weight < pokemon2.weight) {
    pokemon2Wins++;
  }

  if (pokemon1.height > pokemon2.height) {
    pokemon1Wins++;
  } else if (pokemon1.height < pokemon2.height) {
    pokemon2Wins++;
  }

  for (let i = 0; i < pokemon1.stats.length; i++) {
    if (pokemon1.stats[i].value > pokemon2.stats[i].value) {
      pokemon1Wins++;
    } else if (pokemon1.stats[i].value < pokemon2.stats[i].value) {
      pokemon2Wins++;
    }
  }

  let comparisonResult = "Resultat: ";
  if (pokemon1Wins > pokemon2Wins) {
    comparisonResult += `${pokemon1.name} vinner med ${pokemon1Wins} kategorier.`;
  } else if (pokemon1Wins < pokemon2Wins) {
    comparisonResult += `${pokemon2.name} vinner med ${pokemon2Wins} kategorier.`;
  } else {
    comparisonResult += "Det är oavgjort.";
  }

  return comparisonResult;
}

// Funktion för att fylla dropdown-listan med Pokemon
async function fillDropdowns() {
  const selectElement1 = document.getElementById("pokemonSelect1");
  const selectElement2 = document.getElementById("pokemonSelect2");
  const pokemonList = await fetchData();

  pokemonList.forEach((pokemon) => {
    const optionElement1 = document.createElement("option");
    const optionElement2 = document.createElement("option");
    optionElement1.textContent = pokemon.name;
    optionElement2.textContent = pokemon.name;
    selectElement1.appendChild(optionElement1);
    selectElement2.appendChild(optionElement2);
  });
}

// Lägg till händelselyssnare för att hantera val av den första Pokemonen
document
  .getElementById("firstPokemonBtn")
  .addEventListener("click", handleFirstPokemonSelection);

// Lägg till händelselyssnare för att hantera val av den andra Pokemonen
document
  .getElementById("secondPokemonBtn")
  .addEventListener("click", handleSecondPokemonSelection);

// Lägg till händelselyssnare för att hantera jämförelse av de två valda Pokemonerna
document
  .getElementById("compareButton")
  .addEventListener("click", compareSelectedPokemons);

// Lägg till händelselyssnare för att fylla dropdown-listorna när sidan laddas
document.addEventListener("DOMContentLoaded", fillDropdowns);
