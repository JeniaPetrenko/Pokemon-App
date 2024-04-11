// Class representing a Pokemon
//The class Pokemon has a constructor method that takes parameters to initialize the
//properties of a Pokemon object: name, image, types, weight, height, and stats.
//The showDetails method is defined using arrow function syntax (=>).
//This method generates HTML representing the details of the Pokemon, including its name,
//image, types, weight, height, and stats.
//Inside the showDetails method, a loop iterates over each stat of the Pokemon to
//create HTML elements for displaying each stat along with a bar representing its value.
//The method returns the generated HTML string containing the details of the Pokemon.

class Pokemon {
  // Constructor to initialize Pokemon properties
  constructor(name, image, types, weight, height, stats) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
  }

  // Method to display details about the Pokemon
  showDetails = () => {
    let statsHTML = "";
    // Loop through each stat of the Pokemon
    this.stats.forEach((stat) => {
      // Calculate the width of the bar based on the stat value
      const widthPercentage = (stat.value / 200) * 100; // Assuming max value is 200

      // Create HTML elements for each stat with a bar representing the stat value
      statsHTML += `
            <div class="stat">
                <p>${stat.name}: ${stat.value}</p>
                <div class="bar" style="width: ${widthPercentage}%"></div>
            </div>
        `;
    });

    // Return HTML representing the details of the Pokemon
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

//This code updates the generateStatsHTML function to use arrow function syntax.
// Here's a breakdown of what each part does:
//The generateStatsHTML function is defined using arrow function syntax (=>).
//Inside the function, an empty string statsHTML is initialized to store the HTML
//for the stats bars.
//The forEach method is used to iterate through each stat of the Pokemon object
// passed as a parameter. For each stat, HTML elements are created to display the stat
//name and value, along with a bar representing the stat value.
//The HTML elements for each stat are concatenated to the statsHTML string.
//Finally, the function returns the generated HTML for the stats.

// Function to generate HTML for stats bars
const generateStatsHTML = (pokemon, barColors) => {
  // Initialize an empty string to store the HTML for stats
  let statsHTML = "";

  // Iterate through each stat of the Pokemon
  pokemon.stats.forEach((stat, index) => {
    let barWidth;
    if (stat.name === "weight" || stat.name === "height") {
      //determine the percentage of scale
      barWidth = (stat.value / 1000) * 100; // Assuming max weight/height is 1000
    } else {
      barWidth = (stat.value / 200) * 100;
    }
    // Create HTML elements for each stat with a bar representing the stat value
    statsHTML += `
            <div class="stat">
                <p>${stat.name}: ${stat.value}</p>
                <div class="bar" style="width: ${barWidth}%; background-color: ${barColors[index]}"></div>
            </div>
        `;
  });

  // Return the generated HTML for stats
  return statsHTML;
};

//This code defines two functions: handleFirstPokemonSelection and
// handleSecondPokemonSelection, which are arrow functions. These functions are
//responsible for handling the selection of the first and second Pokemon, respectively.
//They asynchronously fetch details of the selected Pokemon using the fetchPokemonDetails
//function, update the corresponding Pokemon details container's HTML content,
//and display the details of the selected Pokemon.
// Variables to store the selected Pokemon
let firstSelectedPokemon = null;
let secondSelectedPokemon = null;

// Function to handle the selection of the first Pokemon
const handleFirstPokemonSelection = async () => {
  // Get the select element for the first Pokemon
  const selectElement = document.getElementById("pokemonSelect1");
  // Get the name of the selected Pokemon
  const selectedPokemonName = selectElement.value;

  // Fetch details of the first selected Pokemon asynchronously
  firstSelectedPokemon = await fetchPokemonDetails(selectedPokemonName);
  // Get the container to display the details of the first Pokemon
  const pokemonDetailsContainer1 = document.getElementById("pokemonDetails1");
  // Generate HTML for the details of the first Pokemon
  const pokemonDetailsHTML1 = firstSelectedPokemon.showDetails();
  // Set the innerHTML of the container with the generated HTML
  pokemonDetailsContainer1.innerHTML = pokemonDetailsHTML1;
};

// Function to handle the selection of the second Pokemon
const handleSecondPokemonSelection = async () => {
  // Get the select element for the second Pokemon
  const selectElement = document.getElementById("pokemonSelect2");
  // Get the name of the selected Pokemon
  const selectedPokemonName = selectElement.value;

  // Fetch details of the second selected Pokemon asynchronously
  secondSelectedPokemon = await fetchPokemonDetails(selectedPokemonName);
  // Get the container to display the details of the second Pokemon
  const pokemonDetailsContainer2 = document.getElementById("pokemonDetails2");
  // Generate HTML for the details of the second Pokemon
  const pokemonDetailsHTML2 = secondSelectedPokemon.showDetails();
  // Set the innerHTML of the container with the generated HTML
  pokemonDetailsContainer2.innerHTML = pokemonDetailsHTML2;
};

// Function to compare the selected Pokemons
//This code defines the compareSelectedPokemons function as an arrow function.
//It compares two selected Pokemons. If both Pokemons have been selected, it
//invokes the compareStats function to compare the stats of the two Pokemons.
//Then, it generates HTML to display the comparison result, including the stats of
//each Pokemon, and inserts it into the designated container for comparison results.
//If either of the Pokemons has not been selected, it alerts the user to select two
//Pokemons for comparison.

const compareSelectedPokemons = async () => {
  // Check if both Pokemons have been selected
  if (!firstSelectedPokemon || !secondSelectedPokemon) {
    // If not, alert the user to select two Pokemons for comparison
    alert("Please, choose the Pokemon!.");
    return;
  }

  // Compare the two selected Pokemons
  const { result, pokemon1BarColors, pokemon2BarColors } = compareStats(
    firstSelectedPokemon,
    secondSelectedPokemon
  );

  // Create HTML for the comparison result
  let comparisonResultHTML = `
        <h2>Who is the winner:</h2>
        <p>${result}</p>
        <h3><span style="text-transform: uppercase; font-weight: bold;">${
          firstSelectedPokemon.name
        }</span>:</h3>
        <div class="stats-container">
            ${generateStatsHTML(firstSelectedPokemon, pokemon1BarColors)}
        </div>
        <p>Weight: ${firstSelectedPokemon.weight}</p>
        <p>Height: ${firstSelectedPokemon.height}</p>
        <h3><span style="text-transform: uppercase; font-weight: bold;">${
          secondSelectedPokemon.name
        }</span>:</h3>
        <div class="stats-container">
            ${generateStatsHTML(secondSelectedPokemon, pokemon2BarColors)}
        </div>
        <p>Weight: ${secondSelectedPokemon.weight}</p>
        <p>Height: ${secondSelectedPokemon.height}</p>
    `;

  // Insert the HTML into the container for comparison results
  const comparisonResultContainer = document.getElementById("comparisonResult");
  comparisonResultContainer.innerHTML = comparisonResultHTML;
};

//This code defines two arrow functions: fetchData and fetchPokemonDetails.
//fetchData fetches data about Pokemons from the PokeAPI endpoint that returns a list
// of Pokemons with a limit of 151. It parses the response as JSON and returns the results
// containing information about the Pokemons. If an error occurs during fetching data from
//the API, it logs the error.
//fetchPokemonDetails fetches detailed data about a specific Pokemon from the PokeAPI
//using its name as a parameter in the API endpoint. It parses the response as JSON and
//extracts the necessary data such as name, image, types, weight, height, and stats.
//Then, it creates a new Pokemon object with the extracted data. If an error occurs during
// fetching Pokemon details from the API, it logs the error.

// Function to fetch data about Pokemons from the API
const fetchData = async () => {
  try {
    // Fetch data from the API endpoint that returns a list of Pokemons with a limit of 151
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    // Parse the response as JSON
    const data = await response.json();
    // Return the results containing information about the Pokemons
    return data.results;
  } catch (error) {
    // If an error occurs during fetching data from the API, log the error
    console.error("Error fetching data from API:", error);
  }
};

// Function to fetch detailed data about a Pokemon from the API
const fetchPokemonDetails = async (pokemonName) => {
  try {
    // Fetch data about the specific Pokemon using its name as a parameter in the API endpoint
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    // Parse the response as JSON
    const data = await response.json();

    // Extract the necessary data from the API response
    const name = data.name;
    const image = data.sprites.front_default;
    const types = data.types.map((type) => type.type.name);
    const weight = data.weight;
    const height = data.height;
    const stats = data.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    }));

    // Create a new Pokemon object with the extracted data
    return new Pokemon(name, image, types, weight, height, stats);
  } catch (error) {
    // If an error occurs during fetching Pokemon details from the API, log the error
    console.error("Error fetching Pokemon details:", error);
  }
};

// Function to compare the statistics of two Pokemons
//This code defines a function named compareStats that compares the statistics of two
// Pokemons and returns the result along with the colors for the bars representing
// the comparison. Here's a breakdown of what each part does:
//The function initializes variables to keep track of wins for each Pokemon
//(pokemon1Wins and pokemon2Wins) and arrays to store the colors for their bars
// (pokemon1BarColors and pokemon2BarColors).
//It compares the weight and height of the two Pokemons and increments the wins accordingly.
//Then, it iterates over each stat of the two Pokemons and compares their values.
//Depending on which Pokemon wins a category, it increments the corresponding win
// count and adds the color for the bars accordingly.
//After comparing all the stats, it determines the comparison result based on the
//number of wins for each Pokemon.
//Finally, it returns an object containing the comparison result and colors for the bars.

const compareStats = (pokemon1, pokemon2) => {
  // Initialize variables to keep track of wins for each Pokemon and colors for their bars
  let pokemon1Wins = 0;
  let pokemon2Wins = 0;
  const pokemon1BarColors = [];
  const pokemon2BarColors = [];

  // Compare the weight of the two Pokemons and increment the wins accordingly
  if (pokemon1.weight > pokemon2.weight) {
    pokemon1Wins++;
  } else if (pokemon1.weight < pokemon2.weight) {
    pokemon2Wins++;
  }

  // Compare the height of the two Pokemons and increment the wins accordingly
  if (pokemon1.height > pokemon2.height) {
    pokemon1Wins++;
  } else if (pokemon1.height < pokemon2.height) {
    pokemon2Wins++;
  }

  // Compare each stat of the two Pokemons
  for (let i = 0; i < pokemon1.stats.length; i++) {
    // If the stat value of Pokemon 1 is greater, Pokemon 1 wins the category
    if (pokemon1.stats[i].value > pokemon2.stats[i].value) {
      pokemon1Wins++;
      pokemon1BarColors.push("green"); // Green color represents Pokemon 1's win
      pokemon2BarColors.push("red"); // Red color represents Pokemon 2's loss
    } else if (pokemon1.stats[i].value < pokemon2.stats[i].value) {
      // If the stat value of Pokemon 2 is greater, Pokemon 2 wins the category
      pokemon2Wins++;
      pokemon1BarColors.push("red"); // Red color represents Pokemon 1's loss
      pokemon2BarColors.push("green"); // Green color represents Pokemon 2's win
    } else {
      // If the stat values are equal, it's a tie
      pokemon1BarColors.push("gray"); // Gray color represents a tie
      pokemon2BarColors.push("gray"); // Gray color represents a tie
    }
  }

  // Determine the comparison result based on the number of wins
  let comparisonResult = "Result: ";
  if (pokemon1Wins > pokemon2Wins) {
    comparisonResult += `<span style="text-transform: uppercase; font-weight: bold;">${pokemon1.name}</span> wins with ${pokemon1Wins} categories won.`;
  } else if (pokemon1Wins < pokemon2Wins) {
    comparisonResult += `<span style="text-transform: uppercase; font-weight: bold;">${pokemon2.name}</span> wins with ${pokemon2Wins} categories won.`;
  } else {
    comparisonResult += "It's a tie.";
  }

  // Return an object containing the comparison result and colors for the bars
  return {
    result: comparisonResult,
    pokemon1BarColors: pokemon1BarColors,
    pokemon2BarColors: pokemon2BarColors,
  };
};

// Function to fill dropdown lists with Pokemon
//This code defines a function named fillDropdowns that populates dropdown lists with
//Pokemon names fetched from an API. Here's a breakdown of what each part does:
//The function gets references to the select elements for both dropdown lists using their IDs.
//It asynchronously fetches the list of Pokemon data from the API using the fetchData function.
//It iterates over each Pokemon in the fetched list.
//For each Pokemon, it creates an option element for both dropdown lists,
//sets the text content of the option elements to the Pokemon's name, and
//appends them to their respective dropdown lists.
//Event listeners are added to the buttons for selecting the first and
//second Pokemon, as well as for comparing the two selected Pokemons.
//Additionally, an event listener is added to fill the dropdown lists with
//Pokemon when the page is loaded (DOMContentLoaded event).

const fillDropdowns = async () => {
  // Get references to the select elements for both dropdowns
  const selectElement1 = document.getElementById("pokemonSelect1");
  const selectElement2 = document.getElementById("pokemonSelect2");

  // Fetch the list of Pokemon data from the API
  const pokemonList = await fetchData();

  // Iterate over each Pokemon in the list
  pokemonList.forEach((pokemon) => {
    // Create an option element for both dropdowns
    const optionElement1 = document.createElement("option");
    const optionElement2 = document.createElement("option");

    // Set the text content of the option elements to the Pokemon's name
    optionElement1.textContent = pokemon.name;
    optionElement2.textContent = pokemon.name;

    // Append the option elements to their respective dropdowns
    selectElement1.appendChild(optionElement1);
    selectElement2.appendChild(optionElement2);
  });
};

// Add event listeners for selecting the first and second Pokemon
document
  .getElementById("firstPokemonBtn")
  .addEventListener("click", handleFirstPokemonSelection);

document
  .getElementById("secondPokemonBtn")
  .addEventListener("click", handleSecondPokemonSelection);

// Add event listener for comparing the two selected Pokemons
document
  .getElementById("compareButton")
  .addEventListener("click", compareSelectedPokemons);

// Add event listener for filling dropdown lists with Pokemon when the page is loaded
document.addEventListener("DOMContentLoaded", fillDropdowns);
