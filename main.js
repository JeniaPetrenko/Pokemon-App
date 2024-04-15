// Class representing a Pokemon
class Pokemon {
  constructor(name, image, types, weight, height, stats, moves) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.moves = moves; // Moves for battle
  }

  showDetails = () => {
    let statsHTML = this.stats
      .map(
        (stat) => `
    <div class="stat">
        <p>${stat.name}: ${stat.value}</p>
        <div class="bar" style="width: ${(stat.value / 200) * 100}%"></div>
    </div>
  `
      )
      .join("");

    // Ensure each Pokemon has an HP bar element with a unique ID
    let hp = this.stats.find((stat) => stat.name === "hp").value;
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
  };
}

// Function to compare two selected Pokémon and decide who wins based on their stats
const compareStats = (pokemon1, pokemon2) => {
  let pokemon1Wins = 0;
  let pokemon2Wins = 0;
  const pokemon1BarColors = [];
  const pokemon2BarColors = [];

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

  pokemon1.stats.forEach((stat, index) => {
    const opponentStat = pokemon2.stats.find((s) => s.name === stat.name);
    if (stat.value > opponentStat.value) {
      pokemon1Wins++;
      pokemon1BarColors.push("green");
      pokemon2BarColors.push("red");
    } else if (stat.value < opponentStat.value) {
      pokemon2Wins++;
      pokemon1BarColors.push("red");
      pokemon2BarColors.push("green");
    } else {
      pokemon1BarColors.push("gray");
      pokemon2BarColors.push("gray");
    }
  });

  let comparisonResult = "Result: ";
  if (pokemon1Wins > pokemon2Wins) {
    comparisonResult += `<span style="text-transform: uppercase; font-weight: bold;">${pokemon1.name}</span> has an advantage in ${pokemon1Wins} categories.`;
  } else if (pokemon1Wins < pokemon2Wins) {
    comparisonResult += `<span style="text-transform: uppercase; font-weight: bold;">${pokemon2.name}</span> has an advantage in ${pokemon2Wins} categories.`;
  } else {
    comparisonResult += "It's a tie.";
  }

  return {
    result: comparisonResult,
    pokemon1BarColors: pokemon1BarColors,
    pokemon2BarColors: pokemon2BarColors,
  };
};

let firstSelectedPokemon = null;
let secondSelectedPokemon = null;

async function fetchPokemonDetails(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();

    const name = data.name;
    const image = data.sprites.front_default;
    const types = data.types.map((type) => type.type.name);
    const weight = data.weight;
    const height = data.height;
    const stats = data.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    }));
    // Extract only necessary move details from the first few moves
    const moves = data.moves.slice(0, 4).map((move) => ({
      name: move.move.name,
      // You may want to add more details about moves here, such as damage range
      // This would require additional API calls unless such details are included in the fetched data
    }));

    return new Pokemon(name, image, types, weight, height, stats, moves);
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return null; // Return null or handle the error appropriately
  }
}

async function handlePokemonSelection(selectionId, detailsContainerId) {
  const selectElement = document.getElementById(selectionId);
  const selectedPokemonName = selectElement.value;
  const pokemon = await fetchPokemonDetails(selectedPokemonName);

  if (selectionId === "pokemonSelect1") {
    firstSelectedPokemon = pokemon;
  } else {
    secondSelectedPokemon = pokemon;
  }

  const detailsContainer = document.getElementById(detailsContainerId);
  detailsContainer.innerHTML = pokemon.showDetails();
}

document
  .getElementById("firstPokemonBtn")
  .addEventListener("click", () =>
    handlePokemonSelection("pokemonSelect1", "pokemonDetails1")
  );
document
  .getElementById("secondPokemonBtn")
  .addEventListener("click", () =>
    handlePokemonSelection("pokemonSelect2", "pokemonDetails2")
  );

document.getElementById("compareButton").addEventListener("click", () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please select both Pokémon to compare.");
    return;
  }
  compareSelectedPokemons();
});

const compareSelectedPokemons = async () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please, choose the Pokemon!");
    return;
  }

  const { result, pokemon1BarColors, pokemon2BarColors } = compareStats(
    firstSelectedPokemon,
    secondSelectedPokemon
  );

  let comparisonResultHTML = `
    <p>${result}</p>
    <div class="comparison-container">
      <div class="pokemon-comparison">
        <h3><span style="text-transform: uppercase; font-weight: bold;">${
          firstSelectedPokemon.name
        }</span>:</h3>
        ${generateStatsHTML(firstSelectedPokemon, pokemon1BarColors)}
        <img src="${firstSelectedPokemon.image}" alt="${
    firstSelectedPokemon.name
  }" style="width:150px; height:auto;">
      </div>
      <div class="pokemon-comparison">
        <h3><span style="text-transform: uppercase; font-weight: bold;">${
          secondSelectedPokemon.name
        }</span>:</h3>
        ${generateStatsHTML(secondSelectedPokemon, pokemon2BarColors)}
        <img src="${secondSelectedPokemon.image}" alt="${
    secondSelectedPokemon.name
  }" style="width:150px; height:auto;">
      </div>
    </div>
  `;

  const comparisonResultContainer = document.getElementById("comparisonResult");
  comparisonResultContainer.innerHTML = comparisonResultHTML;
};

function generateStatsHTML(pokemon, barColors) {
  return pokemon.stats
    .map((stat, index) => {
      let barWidth = (stat.value / 200) * 100;
      return `
      <div class="stat">
        <p>${stat.name}: ${stat.value}</p>
        <div class="bar" style="width: ${barWidth}%; background-color: ${barColors[index]}"></div>
      </div>
    `;
    })
    .join("");
}

async function battle() {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please select both Pokémon before starting the battle!");
    return;
  }
  initializeBattleLog(firstSelectedPokemon, secondSelectedPokemon);

  let attacker = firstSelectedPokemon;
  let defender = secondSelectedPokemon;
  let winner = null;

  while (
    attacker.stats.find((stat) => stat.name === "hp").value > 0 &&
    defender.stats.find((stat) => stat.name === "hp").value > 0
  ) {
    await performAttack(attacker, defender); // Використовуєте async/await для чекання завершення атаки
    [attacker, defender] = [defender, attacker]; // Міняємо ролі атакувальника та захисника
  }

  winner =
    attacker.stats.find((stat) => stat.name === "hp").value > 0
      ? attacker
      : defender;
  document.getElementById(
    "battleLog"
  ).innerHTML += `<h3>${winner.name} wins the battle!</h3>`;
}

async function performAttack(attacker, defender) {
  const attackMove =
    attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
  const damage = calculateDamage(attackMove);
  const defenderHpStat = defender.stats.find((stat) => stat.name === "hp");
  defenderHpStat.value = Math.max(0, defenderHpStat.value - damage);
  updateHealthBar(defender);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Симуляція тривалості ходу
}

function initializeBattleLog(pokemon1, pokemon2) {
  const log = document.getElementById("battleLog");
  log.innerHTML = `<h2>Starting battle between ${pokemon1.name} and ${
    pokemon2.name
  }</h2>
    <div class="battle-stats">
      <div id="${pokemon1.name}-hp-bar" class="hp-bar">
        <div class="hp-bar-fill" style="width: 100%"></div>
        <span class="hp-text">${
          pokemon1.stats.find((s) => s.name === "hp").value
        } HP</span>
      </div>
      <div id="${pokemon2.name}-hp-bar" class="hp-bar">
        <div class="hp-bar-fill" style="width: 100%"></div>
        <span class="hp-text">${
          pokemon2.stats.find((s) => s.name === "hp").value
        } HP</span>
      </div>
    </div>
    <div class="battle-log-messages"></div>`;
}

function updateHealthBar(pokemon) {
  const hpBarContainer = document.getElementById(`${pokemon.name}-hp-bar`);
  if (!hpBarContainer) {
    console.error(`HP bar container for ${pokemon.name} not found.`);
    return;
  }
  const hpBar = hpBarContainer.querySelector(".hp-bar-fill");
  const hpText = hpBarContainer.querySelector(".hp-text");
  const hpStat = pokemon.stats.find((stat) => stat.name === "hp");
  const hpPercentage = (hpStat.value / 100) * 100; // Assuming max HP is 100 for simplicity

  hpBar.style.width = `${hpPercentage}%`;
  hpText.innerText = `${hpStat.value} HP`;
}

document.getElementById("startBattleBtn").addEventListener("click", () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please select both Pokémon before starting the battle!");
    return;
  }
  initializeBattleLog(firstSelectedPokemon, secondSelectedPokemon);
  battle(firstSelectedPokemon, secondSelectedPokemon);
});

function calculateDamage(move) {
  // Simple random damage calculation for the sake of example
  return Math.floor(Math.random() * 20) + 10;
}

document.getElementById("startBattleBtn").addEventListener("click", battle);

async function populateOptions() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  const select1 = document.getElementById("pokemonSelect1");
  const select2 = document.getElementById("pokemonSelect2");

  data.results.forEach((pokemon) => {
    let option1 = new Option(pokemon.name, pokemon.name);
    let option2 = new Option(pokemon.name, pokemon.name);
    select1.add(option1);
    select2.add(option2);
  });
}

document.addEventListener("DOMContentLoaded", populateOptions);
