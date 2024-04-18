// Class representing a Pokemon
class Pokemon {
  constructor(name, image, types, weight, height, stats, moves) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.moves = moves;
    // Set initial HP as maxValue for HP tracking
    this.stats.forEach((stat) => {
      if (stat.name === "hp") {
        stat.maxValue = stat.value;
      }
    });
    console.log(`Pokemon created: ${this.name}`);
  }

  showDetails() {
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

    console.log(`Details shown for ${this.name}`);
    return `
      <h2>${this.name}</h2>
      <img src="${this.image}" alt="Image of ${this.name}">
      <p>Types: ${this.types.join(", ")}</p>
      <p>Weight: ${this.weight}</p>
      <p>Height: ${this.height}</p>
      <p>Stats:</p>
      <div class="stats-container">${statsHTML}</div>
    `;
  }
}

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
  let weightMessage = `Weight Comparison: ${pokemon1.name} (${pokemon1.weight}) vs ${pokemon2.name} (${pokemon2.weight})`;

  if (pokemon1.height > pokemon2.height) {
    pokemon1Wins++;
  } else if (pokemon1.height < pokemon2.height) {
    pokemon2Wins++;
  }
  let heightMessage = `Height Comparison: ${pokemon1.name} (${pokemon1.height}) vs ${pokemon2.name} (${pokemon2.height})`;

  console.log(weightMessage);
  console.log(heightMessage);

  pokemon1.stats.forEach((stat, index) => {
    const opponentStat = pokemon2.stats[index]; // Використовуємо індекс для отримання відповідної статистики покемона 2
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
    console.log(
      `Stat comparison for ${stat.name}: ${pokemon1.name} (${stat.value}) vs ${pokemon2.name} (${opponentStat.value})`
    );
  });

  let comparisonResult = `
  <p style="font-weight: bold; font-size: 20px; color: #423f3a;">Result: </p> 
  <p>
    <span style="color: blue; font-weight: bold; text-transform: uppercase;"> ${pokemon1.name} </span> has advantages in <span style="color: blue; font-weight: bold">${pokemon1Wins}</span> categories, 
    <span style="color: red; font-weight: bold; text-transform: uppercase;">${pokemon2.name}</span> 
    has advantages in <span style="color: red; font-weight: bold">${pokemon2Wins}</span> categories
  </p>
`;
  console.log(comparisonResult);
  return {
    result: comparisonResult,
    pokemon1BarColors: pokemon1BarColors,
    pokemon2BarColors: pokemon2BarColors,
  };
};

let firstSelectedPokemon = null;
let secondSelectedPokemon = null;

async function fetchPokemonDetails(pokemonName) {
  console.log(`Fetching details for ${pokemonName}`);
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    const pokemon = new Pokemon(
      data.name,
      data.sprites.front_default,
      data.types.map((type) => type.type.name),
      data.weight,
      data.height,
      data.stats.map((stat) => {
        return { name: stat.stat.name, value: stat.base_stat };
      }),
      data.moves.slice(0, 4).map((move) => move.move.name)
    );
    console.log(`Pokemon details fetched: ${pokemon.name}`);
    return pokemon;
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return null;
  }
}

async function handlePokemonSelection(selectionId, detailsContainerId) {
  console.log(`Selecting Pokemon with ID: ${selectionId}`);
  const selectElement = document.getElementById(selectionId);
  const selectedPokemonName = selectElement.value;
  const pokemon = await fetchPokemonDetails(selectedPokemonName);
  if (!pokemon) {
    console.error("Failed to fetch details for", selectedPokemonName);
    return;
  }

  if (selectionId === "pokemonSelectOne") {
    firstSelectedPokemon = pokemon;
  } else {
    secondSelectedPokemon = pokemon;
  }

  const detailsContainer = document.getElementById(detailsContainerId);
  detailsContainer.innerHTML = pokemon.showDetails();
}

// Додаємо функцію для порівняння вибраних покемонів
const compareSelectedPokemons = async () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please, choose the Pokemon!");
    return;
  }

  // Логуємо процес порівняння для дебагінгу
  console.log(
    `Comparing ${firstSelectedPokemon.name} and ${secondSelectedPokemon.name}`
  );

  // Використовуємо функцію compareStats для отримання результатів порівняння
  const { result, pokemon1BarColors, pokemon2BarColors } = compareStats(
    firstSelectedPokemon,
    secondSelectedPokemon
  );

  // Логуємо результат порівняння
  console.log("Comparison result:", result);

  // Генеруємо HTML для відображення результатів
  let comparisonResultHTML = `
    <p>${result}</p>
    <div class="comparison-container">
      <div class="pokemon-comparison">
        <h3><span style="text-transform: uppercase; font-weight: bold; color: blue;">${
          firstSelectedPokemon.name
        }</span>:</h3>
        ${generateStatsHTML(firstSelectedPokemon, pokemon1BarColors)}
        <img src="${firstSelectedPokemon.image}" alt="${
    firstSelectedPokemon.name
  }" style="width:150px; height:auto;">
      </div>
      <div class="pokemon-comparison">
        <h3><span style="text-transform: uppercase; font-weight: bold; color: red;">${
          secondSelectedPokemon.name
        }</span>:</h3>
        ${generateStatsHTML(secondSelectedPokemon, pokemon2BarColors)}
        <img src="${secondSelectedPokemon.image}" alt="${
    secondSelectedPokemon.name
  }" style="width:150px; height:auto;">
      </div>
    </div>
  `;

  // Заповнюємо контейнер результатами порівняння
  const comparisonResultContainer = document.getElementById("comparisonResult");
  comparisonResultContainer.innerHTML = comparisonResultHTML;
};

function generateStatsHTML(pokemon, barColors) {
  console.log(`Generating stats HTML for ${pokemon.name}`);
  return pokemon.stats
    .map((stat, index) => {
      let barWidth = (stat.value / 200) * 100;
      console.log(
        `Stat: ${stat.name}, Value: ${stat.value}, Bar Width: ${barWidth}%`
      );
      return `
      <div class="stat">
        <p>${stat.name}: ${stat.value}</p>
        <div class="bar" style="width: ${barWidth}%; background-color: ${barColors[index]}"></div>
      </div>
    `;
    })
    .join("");
}

document
  .getElementById("firstPokemonBtn")
  .addEventListener("click", () =>
    handlePokemonSelection("pokemonSelectOne", "pokemonDetailsOne")
  );
document
  .getElementById("secondPokemonBtn")
  .addEventListener("click", () =>
    handlePokemonSelection("pokemonSelectTwo", "pokemonDetailsTwo")
  );

// Підключаємо обробник події на кнопку для порівняння
document
  .getElementById("compareButton")
  .addEventListener("click", compareSelectedPokemons);

document.getElementById("compareButton").addEventListener("click", () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please select both Pokémon to compare.");
    return;
  }
  const { result, pokemonBarColors, pokemon2BarColors } = compareStats(
    firstSelectedPokemon,
    secondSelectedPokemon
  );
  console.log("Comparison result:", result);
});

let modal = document.getElementById("myModal");
let btn = document.getElementById("startBattleBtn");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
  console.log("Modal opened.");
};

span.onclick = function () {
  modal.style.display = "none";
  console.log("Modal closed.");
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    console.log("Modal closed by clicking outside.");
  }
};

async function performAttack(attacker, defender) {
  console.log(`Attacker: ${attacker.name}, Defender: ${defender.name}`);
  const attackMove =
    attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
  const damage = calculateDamage(attackMove);
  console.log(`${attacker.name} uses ${attackMove} causing ${damage} damage.`);
  const defenderHpStat = defender.stats.find((stat) => stat.name === "hp");
  defenderHpStat.value = Math.max(0, defenderHpStat.value - damage);
  console.log(`${defender.name} HP after attack: ${defenderHpStat.value}`);

  // Uppdatera HP-skalan i DOM
  updateHealthBar(defender);

  // Skapa en element för att visa attacken
  const battleLog = document.querySelector(".battle-log-messages");
  const attackMessage = document.createElement("p");
  attackMessage.textContent = `${attacker.name} uses ${attackMove} causing ${damage} damage. ${defender.name} HP after attack: ${defenderHpStat.value}`;
  battleLog.appendChild(attackMessage);

  // Vänta en kort stund mellan varje attack
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

function initializeBattleLog(pokemon1, pokemon2) {
  console.log(
    `Initializing battle log for ${pokemon1.name} vs ${pokemon2.name}`
  );
  const log = document.getElementById("battleLog");
  log.innerHTML = `
    <h2>Starting battle between <span style="color: blue;">${
      pokemon1.name
    }</span> and <span style="color: red;">${pokemon2.name}</span></h2>
    <div class="battle-stats">
      <div class="pokemon-stats" id="${pokemon1.name}-stats">
        <h3 style="color: blue; text-transform: uppercase;">${
          pokemon1.name
        }</h3>
        <div id="${pokemon1.name}-hp-bar" class="hp-bar">
          <div class="hp-bar-fill" style="width: 100%"></div>
          <span class="hp-text">${
            pokemon1.stats.find((stat) => stat.name === "hp").value
          } HP</span>
        </div>
      </div>
      <div class="pokemon-stats" id="${pokemon2.name}-stats">
        <h3 style="color: red; text-transform: uppercase;">${pokemon2.name}</h3>
        <div id="${pokemon2.name}-hp-bar" class="hp-bar">
          <div class="hp-bar-fill" style="width: 100%"></div>
          <span class="hp-text">${
            pokemon2.stats.find((stat) => stat.name === "hp").value
          } HP</span>
        </div>
      </div>
    </div>
    <div class="battle-log-messages"></div>
    <div class="winner-announcement"></div>
  `;
}

async function battle() {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please select both Pokémon before starting the battle!");
    return;
  }
  initializeBattleLog(firstSelectedPokemon, secondSelectedPokemon);
  let attacker = firstSelectedPokemon;
  let defender = secondSelectedPokemon;
  while (
    attacker.stats.find((stat) => stat.name === "hp").value > 0 &&
    defender.stats.find((stat) => stat.name === "hp").value > 0
  ) {
    await performAttack(attacker, defender);
    console.log(
      `Current HP after attack: ${firstSelectedPokemon.name}: ${
        firstSelectedPokemon.stats.find((stat) => stat.name === "hp").value
      }, ${secondSelectedPokemon.name}: ${
        secondSelectedPokemon.stats.find((stat) => stat.name === "hp").value
      }`
    );
    [attacker, defender] = [defender, attacker];
  }
  const winner =
    attacker.stats.find((stat) => stat.name === "hp").value > 0
      ? attacker
      : defender;

  console.log(`${winner.name} wins the battle!`);
  const winnerAnnouncement = document.querySelector(".winner-announcement");
  winnerAnnouncement.innerHTML = `<h3><span style="text-transform: uppercase;">${winner.name}</span> wins the battle!</h3>
  <img src="${winner.image}" alt="Winner: ${winner.name}" style="width:100px; height:auto;">`;
}

document
  .getElementById("startBattleBtn")
  .addEventListener("click", async () => {
    if (!firstSelectedPokemon || !secondSelectedPokemon) {
      alert("Please select both Pokémon before starting the battle!");
      return;
    }
    console.log("Battle started.");
    const battleLog = document.getElementById("battleLog");
    const battleMessages = document.querySelector(".battle-log-messages");
    const winnerAnnouncement = document.querySelector(".winner-announcement");
    battleLog.innerHTML = "";
    battleMessages.innerHTML = "";
    winnerAnnouncement.innerHTML = "";

    try {
      // Завантажуємо дані покемонів
      await Promise.all([
        fetchPokemonDetails(firstSelectedPokemon.name),
        fetchPokemonDetails(secondSelectedPokemon.name),
      ]);

      initializeBattleLog(firstSelectedPokemon, secondSelectedPokemon);

      battle();
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  });

function resetPokemonStats(pokemon) {
  console.log(`Resetting stats for ${pokemon.name}`);
  pokemon.stats.forEach((stat) => {
    if (stat.name === "hp") {
      stat.value = stat.maxValue;
    }
  });
  updateHealthBar(pokemon);
}

function updateHealthBar(pokemon) {
  const hpBarContainer = document.getElementById(`${pokemon.name}-hp-bar`);
  if (hpBarContainer) {
    const hpBar = hpBarContainer.querySelector(".hp-bar-fill");
    const hpText = hpBarContainer.querySelector(".hp-text");
    const hpStat = pokemon.stats.find((stat) => stat.name === "hp");
    const hpPercentage = (hpStat.value / hpStat.maxValue) * 100;
    hpBar.style.width = `${hpPercentage}%`;
    hpText.innerText = `${hpStat.value} HP`;
    console.log(
      `Updated ${pokemon.name} HP bar: ${hpStat.value} / ${hpStat.maxValue}`
    );
  } else {
    console.error(`HP bar container for ${pokemon.name} not found.`);
  }
}

function calculateDamage() {
  const damage = Math.floor(Math.random() * 20) + 10;
  console.log(`Calculated damage: ${damage}`);
  return damage;
}

async function populateOptions() {
  console.log("Populating options for Pokémon selection.");
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  const select1 = document.getElementById("pokemonSelectOne");
  const select2 = document.getElementById("pokemonSelectTwo");
  data.results.forEach((pokemon) => {
    let option1 = new Option(pokemon.name, pokemon.name);
    let option2 = new Option(pokemon.name, pokemon.name);
    select1.add(option1);
    select2.add(option2);
  });
  console.log("Options populated.");
}

document.addEventListener("DOMContentLoaded", populateOptions);
