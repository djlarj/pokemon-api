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
        createAndAppendElement('h2', pokemonData.name);
        createAndAppendElement('h3', pokemonData.id);

        for (let type of pokemonData.types) {
            createAndAppendElement('p', type.type.name);
        }

        const displayImage = createAndAppendElement('img');
        displayImage.src = pokemonData.sprites.front_default;
        displayImage.width = '300';
        displayImage.alt = '';
    } catch (err) {
        console.log(err);
    }
}

function createAndAppendElement(tagName, text) {
    const element = document.createElement(tagName);
    if (text) {
        element.innerText = text;
    }
    summonPokemon.appendChild(element);
    return element;
}


//Displaying a list of Pokemon names

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