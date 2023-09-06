// Summoning Pokemon

const summonPokemon = document.querySelector('#pokemonImg');
const pokemonNameInput = document.querySelector('.pokemonNameInput');
const pokemonSummonButton = document.querySelector('.pokemonSummonButton');

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
  
async function getPokemonByName(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = await response.json();

        summonPokemon.innerHTML = '';

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
        // Loop through types and display them with "Type 1" and "Type 2" labels
        for (let i = 0; i < pokemonData.types.length; i++) {
            const type = pokemonData.types[i];
            createAndAppendElement('p', `Type ${i + 1}: ${type.type.name}`);
        }

        // Pokemon Base Experience
        createAndAppendElement('p', "Base Experience:" + " " + pokemonData.base_experience);

        // Pokemon Height (converted to inches with 2 decimal places)
        const heightInInches = (pokemonData.height / 10) * 39.37; // Convert decimetres to inches
        createAndAppendElement('p', `Height: ${heightInInches.toFixed(2)} inches`);

        // Pokemon Weight (converted to pounds with 2 decimal places)
        const weightInPounds = (pokemonData.weight / 10) * 2.20462; // Convert hectograms to pounds
        createAndAppendElement('p', `Weight: ${weightInPounds.toFixed(2)} lbs`);

    } catch (err) {
        console.log(err);
    }
}

// Function to capitalize the first letter of every word, including words after hyphens
function capitalizeEveryWord(string) {
    return string
        .split('-') // Split the string by hyphens
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join('-'); // Join the words back with hyphens
}

function createAndAppendElement(tagName, text) {
    const element = document.createElement(tagName);
    if (text) {
        element.innerText = text;
    }
    summonPokemon.appendChild(element);
    return element;
}


//Display a list of Pokemon names

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
        pokeName.innerText = pokemon.name;
        pokemonList.appendChild(pokeName);
        });
    } catch (err) {
        console.log(err);
    }
}


//Back-to-Top button
const btn = $('#button');

$(window).scroll(function() {
    btn.toggleClass('show', $(window).scrollTop() > 100);
});

btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 100);
});