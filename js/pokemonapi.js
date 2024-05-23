// Summoning Pokemon

// Selectors and variables
const summonPokemon = document.querySelector('#pokemonDetails');
const pokemonNameInput = document.querySelector('.pokemonNameInput');
const pokemonSummonButton = document.querySelector('.pokemonSummonButton');
const prevPokemon = document.querySelector('#prevPokemon');
const nextPokemon = document.querySelector('#nextPokemon');
const pokemonSuggestions = document.querySelector('#pokemonSuggestions');
let currentPokemonId;

// Fetching all Pokémon names for autocomplete
async function fetchAllPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
        const data = await response.json();
        return data.results.map(pokemon => pokemon.name);
    } catch (err) {
        console.log(err);
        return [];
    }
}

// Autocomplete functionality
async function setupAutocomplete() {
    const pokemonNames = await fetchAllPokemonNames();

    pokemonNameInput.addEventListener('input', () => {
        const inputValue = pokemonNameInput.value.toLowerCase();
        pokemonSuggestions.innerHTML = '';

        if (inputValue) {
            const filteredNames = pokemonNames.filter(name => name.startsWith(inputValue));

            filteredNames.forEach(name => {
                const option = document.createElement('option');
                option.value = capitalizeEveryWord(name);
                pokemonSuggestions.appendChild(option);
            });
        }
    });
}

setupAutocomplete();

// Event listeners
pokemonSummonButton.addEventListener('click', () => {
    const pokemonName = pokemonNameInput.value;
    getPokemonByName(pokemonName);
});

pokemonNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const pokemonName = pokemonNameInput.value;
        getPokemonByName(pokemonName);
    }
});

// getPokemonByName function
async function getPokemonByName(name) {
    try {
        // Show loading indicator
        summonPokemon.innerHTML = '<p>Loading...</p>';
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const pokemonData = await response.json();

        summonPokemon.innerHTML = ''; // Clear loading indicator
        currentPokemonId = pokemonData.id;

        // Capitalize the first letter of every word in Pokemon name, including words after hyphens
        const capitalizedPokemonName = capitalizeEveryWord(pokemonData.name);

        // Pokemon Name
        createAndAppendElement('h2', capitalizedPokemonName);

        // Pokemon ID
        createAndAppendElement('p', "Pokemon ID:" + " " + pokemonData.id);

        // Pokemon Image
        const displayImage = createAndAppendElement('img');
        displayImage.src = pokemonData.sprites.other['official-artwork'].front_default;
        displayImage.width = '300';
        displayImage.alt = '';

        // Pokemon Type(s)
        for (let i = 0; i < pokemonData.types.length; i++) {
            const type = pokemonData.types[i];
            createAndAppendElement('p', `Type ${i + 1}: ${type.type.name}`);
        }

        // Pokemon Base Experience
        createAndAppendElement('p', "Base Experience:" + " " + pokemonData.base_experience);

        // Pokemon Height (converted to inches with 2 decimal places)
        const heightInInches = (pokemonData.height / 10) * 39.37;
        createAndAppendElement('p', `Height: ${heightInInches.toFixed(2)} inches`);

        // Pokemon Weight (converted to pounds with 2 decimal places)
        const weightInPounds = (pokemonData.weight / 10) * 2.20462;
        createAndAppendElement('p', `Weight: ${weightInPounds.toFixed(2)} lbs`);

        // Show navigation chevrons
        prevPokemon.style.display = 'inline';
        nextPokemon.style.display = 'inline';

        // Update event listeners for chevrons
        prevPokemon.onclick = () => getPokemonById(currentPokemonId - 1);
        nextPokemon.onclick = () => getPokemonById(currentPokemonId + 1);

    } catch (err) {
        console.log(err);
        summonPokemon.innerHTML = '<p>Pokémon not found. Please try again.</p>';
    }
}

// getPokemonById function
async function getPokemonById(id) {
    try {
        // Show loading indicator
        summonPokemon.innerHTML = '<p>Loading...</p>';
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const pokemonData = await response.json();

        summonPokemon.innerHTML = ''; // Clear loading indicator
        currentPokemonId = pokemonData.id;

        // Capitalize the first letter of every word in Pokemon name, including words after hyphens
        const capitalizedPokemonName = capitalizeEveryWord(pokemonData.name);

        // Pokemon Name
        createAndAppendElement('h2', capitalizedPokemonName);

        // Pokemon ID
        createAndAppendElement('p', "Pokemon ID:" + " " + pokemonData.id);

        // Pokemon Image
        const displayImage = createAndAppendElement('img');
        displayImage.src = pokemonData.sprites.other['official-artwork'].front_default;
        displayImage.width = '300';
        displayImage.alt = '';

        // Pokemon Type(s)
        for (let i = 0; i < pokemonData.types.length; i++) {
            const type = pokemonData.types[i];
            createAndAppendElement('p', `Type ${i + 1}: ${type.type.name}`);
        }

        // Pokemon Base Experience
        createAndAppendElement('p', "Base Experience:" + " " + pokemonData.base_experience);

        // Pokemon Height (converted to inches with 2 decimal places)
        const heightInInches = (pokemonData.height / 10) * 39.37;
        createAndAppendElement('p', `Height: ${heightInInches.toFixed(2)} inches`);

        // Pokemon Weight (converted to pounds with 2 decimal places)
        const weightInPounds = (pokemonData.weight / 10) * 2.20462;
        createAndAppendElement('p', `Weight: ${weightInPounds.toFixed(2)} lbs`);

        // Show navigation chevrons
        prevPokemon.style.display = 'inline';
        nextPokemon.style.display = 'inline';

        // Update event listeners for chevrons
        prevPokemon.onclick = () => getPokemonById(currentPokemonId - 1);
        nextPokemon.onclick = () => getPokemonById(currentPokemonId + 1);

    } catch (err) {
        console.log(err);
        summonPokemon.innerHTML = '<p>Pokémon not found. Please try again.</p>';
    }
}

function capitalizeEveryWord(string) {
    return string
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
}

function createAndAppendElement(tagName, text) {
    const element = document.createElement(tagName);
    if (text) {
        element.innerText = text;
    }
    summonPokemon.appendChild(element);
    return element;
}


// Display a list of Pokemon names

const listLengthInput = document.querySelector('.listLengthInput');
const offsetInput = document.querySelector('.offsetInput');
const pokemonListButton = document.querySelector('.pokemonListButton');
const pokemonList = document.querySelector('#pokemonList');

pokemonListButton.addEventListener('click', getPokemonList);
listLengthInput.addEventListener('keypress', handleKeyPress);
offsetInput.addEventListener('keypress', handleKeyPress);

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        getPokemonList();
    }
}

// Updated getPokemonList function
async function getPokemonList() {
    const listLength = listLengthInput.value;
    const offset = offsetInput.value;
    const base_url = `https://pokeapi.co/api/v2/pokemon?limit=${listLength}&offset=${offset}`;

    try {
        const response = await fetch(base_url);
        const data = await response.json();

        pokemonList.innerHTML = '';

        data.results.forEach(pokemon => {
            const pokeName = document.createElement('p');
            
            // Extract the Pokemon ID from the URL
            const urlParts = pokemon.url.split('/');
            const pokemonId = urlParts[urlParts.length - 2];
            
            // Capitalize the first letter of every word in the Pokemon name
            const capitalizedPokemonName = capitalizeEveryWord(pokemon.name);
            
            // Create the display string with ID and name
            const displayString = `${pokemonId} - ${capitalizedPokemonName}`;
            
            // Make the name clickable
            pokeName.innerText = displayString;
            pokeName.style.cursor = 'pointer';
            pokeName.addEventListener('click', () => getPokemonByName(pokemon.name));
            
            pokemonList.appendChild(pokeName);
        });
    } catch (err) {
        console.log(err);
    }
}

// Back-to-Top button
const btn = $('#button');

$(window).scroll(function() {
    btn.toggleClass('show', $(window).scrollTop() > 100);
});

btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 100);
});