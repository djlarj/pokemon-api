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
    console.log(facts);
    const h1 = document.createElement('h2');
    h1.innerText = facts.name;
    summonPokemon.appendChild(h1);
    const img = document.createElement('img');
    summonPokemon.appendChild(img);
    img.src = facts.sprites.front_default;
    img.width = '300';
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
        console.log(data);
        data.results.forEach( pokemon => {
            const li = document.createElement('li');
            li.innerText = pokemon.name;
            pokemonList.appendChild(li);
            li.addEventListener('click', () => {
                getPokemonByName(pokemon.name);
            })
        });
    });
}