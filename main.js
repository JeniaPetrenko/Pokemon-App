// Class representing a Pokemon
// Constructor function for creating new Pokemon instances with specified properties
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
      // Iterate over each stat in the stats array
      if (stat.name === "hp") {
        stat.maxValue = stat.value; // Set the maxValue property of the "hp" stat to its current value
      }
    });
    console.log(`Pokemon created: ${this.name}`);
  }

  //method
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
      .join(""); //convert the array of hyml strings into a single string

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

// Define a function named compareStats that takes two Pokemon objects as parameters
const compareStats = (pokemon1, pokemon2) => {
  let pokemon1Wins = 0; //varibale to track the number of wins
  let pokemon2Wins = 0;
  const pokemon1BarColors = []; //empty array to store bar colors for pokemon
  const pokemon2BarColors = [];

  // Compare weight of the two Pokemons
  if (pokemon1.weight > pokemon2.weight) {
    pokemon1Wins++;
  } else if (pokemon1.weight < pokemon2.weight) {
    pokemon2Wins++;
  }

  // Compare height of the two Pokemons
  if (pokemon1.height > pokemon2.height) {
    pokemon1Wins++;
  } else if (pokemon1.height < pokemon2.height) {
    pokemon2Wins++;
  }

  // Compare the stats of the Pokemons
  // Iterate over each stat of Pokemon 1
  pokemon1.stats.forEach((stat, index) => {
    const opponentStat = pokemon2.stats[index]; // Get the corresponding stat of Pokemon 2
    if (stat.value > opponentStat.value) {
      pokemon1Wins++; // Increment the number of wins for Pokemon 1
      pokemon1BarColors.push("green"); // Push "green" to the bar colors array for Pokemon 1
      pokemon2BarColors.push("red"); // Push "red" to the bar colors array for Pokemon 2
    } else if (stat.value < opponentStat.value) {
      pokemon2Wins++; //
      pokemon1BarColors.push("red");
      pokemon2BarColors.push("green");
    } else {
      // If the stat values are equal
      pokemon1BarColors.push("gray"); // Push "gray" to the bar colors array for Pokemon 1
      pokemon2BarColors.push("gray"); // Push "gray" to the bar colors array for Pokemon 2
    }
  });

  let comparisonResult = `
    <div clsass="result">
      <h2>Result: </h2> 
      <p class="result">
        <span style="color: blue; font-weight: bold; text-transform: uppercase;"> ${pokemon1.name} </span> 
        has <span style="font-weight: bold;">Height:</span> <span style="color: blue;">${pokemon1.height}</span>,
         <span style="font-weight: bold;">Weight:</span> <span style="color: blue;">${pokemon1.weight}</span>.
          It has advantages in <span style="color: blue; font-weight: bold">${pokemon1Wins}</span> categories, 
        <br><span style="color: #FA1171; font-weight: bold; text-transform: uppercase;">${pokemon2.name}</span> 
        has <span style="font-weight: bold;">Height:</span> <span style="color: #FA1171;">${pokemon2.height}</span>, 
        <span style="font-weight: bold;">Weight:</span> <span style="color: #FA1171;">${pokemon2.weight}</span>.
        It has advantages in <span style="color: #FA1171; font-weight: bold">${pokemon2Wins}</span> categories
      </p>
      
    </div>
  `;
  return {
    // Return an object  of  the comparison result and bar colors for both Pokemons
    result: comparisonResult, // Include the comparison result in the object
    pokemon1BarColors: pokemon1BarColors,
    pokemon2BarColors: pokemon2BarColors,
  };
};

// Initialize variables to store the details of the selected Pokémon
let firstSelectedPokemon = null;
let secondSelectedPokemon = null;

// Asynchronously fetch Pokémon details from the PokeAPI
async function fetchPokemonDetails(pokemonName) {
  console.log(`Fetching details for ${pokemonName}`);
  // Send a GET request to the PokeAPI endpoint for the specified Pokémon name
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    // Create a new Pokémon object with the fetched details
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

//selection of a pokemon
async function handlePokemonSelection(selectionId, detailsContainerId) {
  console.log(`Selecting Pokemon with ID: ${selectionId}`);
  // Get the select element corresponding to the selection ID
  const selectElement = document.getElementById(selectionId);
  // Get the name of the pokemon selected in the dropdown menu
  const selectedPokemonName = selectElement.value;
  // Fetch details for the selected pokemon using its name
  const pokemon = await fetchPokemonDetails(selectedPokemonName);

  // Check if fetching details was unsuccessful
  if (!pokemon) {
    console.error("Failed to fetch details for", selectedPokemonName);
    return;
  }

  if (selectionId === "pokemonSelectOne") {
    firstSelectedPokemon = pokemon;
  } else {
    secondSelectedPokemon = pokemon;
  }

  // Get the details container element using its ID
  const detailsContainer = document.getElementById(detailsContainerId);
  // Display the details of the selected Pokémon in the details container
  detailsContainer.innerHTML = pokemon.showDetails();
}

//function for comparing the selected pokemon
const compareSelectedPokemons = async () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please, choose the Pokemon!");
    return;
  }

  console.log(
    `Comparing ${firstSelectedPokemon.name} and ${secondSelectedPokemon.name}`
  );

  // Call compareStats to get the comparison results
  const { result, pokemon1BarColors, pokemon2BarColors } = compareStats(
    firstSelectedPokemon,
    secondSelectedPokemon
  );

  console.log("Comparison result:", result);

  // Generate HTML to display the comparison results
  let comparisonResultHTML = `
    <p>${result}</p>
    <div class="comparison-container">
    <div class="comparisonFirst">
        <h2 style="color: blue;">${firstSelectedPokemon.name}:</h2>
        ${generateStatsHTML(firstSelectedPokemon, pokemon1BarColors)}
        <img src="${firstSelectedPokemon.image}" alt="${
    firstSelectedPokemon.name
  }" style="width:150px; height:auto;">
      </div>
      <div class="comparisonSecond">
        <h2 style="color: #FA1171">${secondSelectedPokemon.name}:</h2>
        ${generateStatsHTML(secondSelectedPokemon, pokemon2BarColors)}
        <img src="${secondSelectedPokemon.image}" alt="${
    secondSelectedPokemon.name
  }" style="width:150px; height:auto;">
      </div>
    </div>
  `;

  // Fill the container with the comparison results
  const comparisonResultContainer = document.getElementById("comparisonResult");
  comparisonResultContainer.innerHTML = comparisonResultHTML;
};
// Function to generate HTML for displaying pokemon stats
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

// Add event listener for selecting the first pokemon
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

//event listener for comparing selected Pokemons
document
  .getElementById("compareButton")
  .addEventListener("click", compareSelectedPokemons);

document.getElementById("compareButton").addEventListener("click", () => {
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    alert("Please select both Pokémon to compare.");
    return;
  }
  const { result } = compareStats(firstSelectedPokemon, secondSelectedPokemon);
  console.log("Comparison result:", result);
});

let modal = document.getElementById("myModal");
let btn = document.getElementById("startBattleBtn");
let span = document.getElementsByClassName("close")[0];

//open the modal window
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

//to perform attack between two pokemons
async function performAttack(attacker, defender) {
  console.log(`Attacker: ${attacker.name}, Defender: ${defender.name}`);
  // Choose a random attack move for the attacker
  const attackMove =
    attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
  const damage = calculateDamage(attackMove);
  console.log(`${attacker.name} uses ${attackMove} causing ${damage} damage.`);
  // Find the HP stat of the defender
  const defenderHpStat = defender.stats.find((stat) => stat.name === "hp");
  // Reduce the defender's HP by the calculated damage, ensuring it doesn't go below 0
  defenderHpStat.value = Math.max(0, defenderHpStat.value - damage);
  console.log(`${defender.name} HP after attack: ${defenderHpStat.value}`);

  // Update the health bar in the DOM to reflect the defender's new HP
  updateHealthBar(defender);

  // Create an element to display the attack message in the battle log
  const battleLog = document.querySelector(".battle-log-messages");
  const attackMessage = document.createElement("p");
  attackMessage.textContent = `${attacker.name} uses ${attackMove} causing ${damage} damage. ${defender.name} HP after attack: ${defenderHpStat.value}`;
  battleLog.appendChild(attackMessage);

  // Wait for a short delay between each attack
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

// the initialization of the battle log with the names of the participating Pokémon
function initializeBattleLog(pokemon1, pokemon2) {
  console.log(
    `Initializing battle log for ${pokemon1.name} vs ${pokemon2.name}`
  );
  const log = document.getElementById("battleLog"); // Get the battle log element by its ID
  log.innerHTML = `
    <h2>Starting battle between <span style="color: blue;">${
      pokemon1.name
    }</span> and <span style="color: #fa1171;">${pokemon2.name}</span></h2>
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
        <h3 style="color: #fa1171; text-transform: uppercase;">${
          pokemon2.name
        }</h3>
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

  // Set the initial attacker and defender
  let attacker = firstSelectedPokemon;
  let defender = secondSelectedPokemon;

  // Loop until one of the Pokémon's HP reaches zero
  while (
    attacker.stats.find((stat) => stat.name === "hp").value > 0 &&
    defender.stats.find((stat) => stat.name === "hp").value > 0
  ) {
    await performAttack(attacker, defender); // Perform an attack and wait for it to complete
    console.log(
      `Current HP after attack: ${firstSelectedPokemon.name}: ${
        firstSelectedPokemon.stats.find((stat) => stat.name === "hp").value
      }, ${secondSelectedPokemon.name}: ${
        secondSelectedPokemon.stats.find((stat) => stat.name === "hp").value
      }`
    );
    // Swap the roles of attacker and defender for the next round
    [attacker, defender] = [defender, attacker];
  }
  const winner =
    attacker.stats.find((stat) => stat.name === "hp").value > 0
      ? attacker
      : defender;

  console.log(`${winner.name} wins the battle!`);

  // Display the winner announcement in the DOM
  const winnerAnnouncement = document.querySelector(".winner-announcement");
  winnerAnnouncement.innerHTML = `<h3><span style="text-transform: uppercase;">${winner.name}</span> wins the battle!</h3>
  <img src="${winner.image}" alt="Winner: ${winner.name}" style="width:100px; height:auto;">`;
}

//to start the battle
document
  .getElementById("startBattleBtn")
  .addEventListener("click", async () => {
    if (!firstSelectedPokemon || !secondSelectedPokemon) {
      alert("Please select both Pokémon before starting the battle!");
      return;
    }
    console.log("Battle started.");

    // Clear the battle log, messages, and winner announcement
    const battleLog = document.getElementById("battleLog");
    const battleMessages = document.querySelector(".battle-log-messages");
    const winnerAnnouncement = document.querySelector(".winner-announcement");
    battleLog.innerHTML = "";
    battleMessages.innerHTML = "";
    winnerAnnouncement.innerHTML = "";

    try {
      // Load details of both selected Pokémon
      await Promise.all([
        fetchPokemonDetails(firstSelectedPokemon.name),
        fetchPokemonDetails(secondSelectedPokemon.name),
      ]);

      // Initialize the battle log with the selected Pokémon
      initializeBattleLog(firstSelectedPokemon, secondSelectedPokemon);

      battle(); //start the battle
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  });

//to reset the stats
function resetPokemonStats(pokemon) {
  console.log(`Resetting stats for ${pokemon.name}`);

  // Iterate through each stat of the Pokémon
  pokemon.stats.forEach((stat) => {
    if (stat.name === "hp") {
      stat.value = stat.maxValue;
    }
  });
  updateHealthBar(pokemon);
}

//Find the health bar container element based on the Pokémon's name
function updateHealthBar(pokemon) {
  const hpBarContainer = document.getElementById(`${pokemon.name}-hp-bar`);
  if (hpBarContainer) {
    //find the health bar fill element
    const hpBar = hpBarContainer.querySelector(".hp-bar-fill");
    const hpText = hpBarContainer.querySelector(".hp-text");
    //find the hp stat
    const hpStat = pokemon.stats.find((stat) => stat.name === "hp");
    //calculate th hp percentage
    const hpPercentage = (hpStat.value / hpStat.maxValue) * 100;
    // Update the width of the health bar and the text content of the health text element
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
  const damage = Math.floor(Math.random() * 20) + 10; //random damage value between 10-29
  console.log(`Calculated damage: ${damage}`);
  return damage;
}

async function populateOptions() {
  console.log("Populating options for Pokémon selection.");
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  //waits until the request is completed
  const data = await response.json();

  // Get references to the select elements
  const select1 = document.getElementById("pokemonSelectOne");
  const select2 = document.getElementById("pokemonSelectTwo");

  // iterate over the pokemon data and create options for each pokemon
  data.results.forEach((pokemon) => {
    let option1 = new Option(pokemon.name, pokemon.name);
    let option2 = new Option(pokemon.name, pokemon.name);
    select1.add(option1);
    select2.add(option2);
  });
  console.log("Options populated.");
}

document.addEventListener("DOMContentLoaded", populateOptions);
