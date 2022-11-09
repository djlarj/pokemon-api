// Pokemon API

//Variables
const summonPokemon = document.querySelector('#pokemonImg');
const pokemonNameInput = document.querySelector('.pokemonNameInput')
const pokemonSummonButton = document.querySelector('.pokemonSummonButton')

//Summon Pokemon
pokemonSummonButton.addEventListener('click', () => {
    pokemonName = pokemonNameInput.value;
    getPokemonByName(name);
})

function getPokemonByName(name) {
    const base_url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

fetch(base_url + name)
.then( res => {
    return res.json();
}).then( (facts) => {
    summonPokemon.innerHTML = '';
    // console.log(facts);
    const displayName = document.createElement('h2');
    displayName.innerText = facts.name;
    summonPokemon.appendChild(displayName);
    const displayId = document.createElement('h3');
    displayId.innerText = facts.id;
    summonPokemon.appendChild(displayId);

    let existingObject = facts.types[1];
    // console.log(existingObject);
    if (typeof existingObject != 'undefined') {
        const displayType1 = document.createElement('p');
        displayType1.innerText = facts.types[0].type.name;
        summonPokemon.appendChild(displayType1);
        const displayType2 = document.createElement('p');
        displayType2.innerText = facts.types[1].type.name;
        summonPokemon.appendChild(displayType2);    
    } else {
        const displayType1 = document.createElement('p');
        displayType1.innerText = facts.types[0].type.name;
        summonPokemon.appendChild(displayType1);    
    }

    const displayImage = document.createElement('img');
    summonPokemon.appendChild(displayImage);
    displayImage.src = facts.sprites.front_default;
    displayImage.width = '300';
}).catch( err => console.log(err)); 
}


//Variables
const listLengthInput = document.querySelector('.listLengthInput');
const offsetInput = document.querySelector('.offsetInput');
const pokemonListButton = document.querySelector('.pokemonListButton');
const pokemonList = document.querySelector('#pokemonList');

//Get Pokemon Name List
pokemonListButton.addEventListener('click', () => {
    listLength = listLengthInput.value;
    offset = offsetInput.value;
    getPokemonList();
})

function getPokemonList() {
    const base_url = `https://pokeapi.co/api/v2/pokemon?limit=${listLength}&offset=${offset}`;
    
    fetch(base_url)
    .then(res => res.json() )
    .then(data => {
        pokemonList.innerHTML = '';
        // console.log(data);
        data.results.forEach( pokemon => {
            const pokeName = document.createElement('p');
            pokeName.innerText = pokemon.name;
            pokemonList.appendChild(pokeName);
        });
    });
}