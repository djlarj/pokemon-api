// Summoning Pokemon

// Selectors and variables
const summonPokemon = document.querySelector('#pokemonDetails');
const pokemonNameInput = document.querySelector('.pokemonNameInput');
const pokemonSummonButton = document.querySelector('.pokemonSummonButton');
const prevPokemon = document.querySelector('#prevPokemon');
const nextPokemon = document.querySelector('#nextPokemon');
const pokemonSuggestions = document.querySelector('#pokemonSuggestions');
let currentPokemonId;
let isModalOpen = false; // Flag to track modal state

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

        // Insert the Details button
        const detailsButton = document.createElement('button');
        detailsButton.id = 'detailsButton';
        detailsButton.className = 'btn btn-light btn-sm mt-2';
        detailsButton.innerText = 'Details';
        summonPokemon.appendChild(detailsButton);

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

        // Insert the Details button
        const detailsButton = document.createElement('button');
        detailsButton.id = 'detailsButton';
        detailsButton.className = 'btn btn-light btn-sm mt-2';
        detailsButton.innerText = 'Details';
        summonPokemon.appendChild(detailsButton);

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

// Variables to store touch positions
let touchstartX = 0;
let touchendX = 0;
const swipeThreshold = 100; // Minimum swipe distance in pixels

// Function to handle swipe gestures
function handleGesture() {
    if (!isModalOpen) { // Only handle swipe if modal is not open
        const swipeDistance = touchendX - touchstartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0) {
                // Swiped left
                getPokemonById(currentPokemonId + 1);
            } else if (swipeDistance > 0) {
                // Swiped right
                getPokemonById(currentPokemonId - 1);
            }
        }
    }
}

// Event listeners for touch events within the pokemonDetails div
summonPokemon.addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
});

summonPokemon.addEventListener('touchend', (event) => {
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
});

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

// Function to initialize the Details modal feature
function initializeDetailsModal() {
    // Add event listener for Details button
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'detailsButton') {
            showDetailsModal();
        }
    });

    // Function to show the details modal
    async function showDetailsModal() {
        const modal = new bootstrap.Modal(document.getElementById('pokemonDetailsModal'), {
            keyboard: false
        });

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonId}`);
            const pokemonData = await response.json();

            // Populate abilities
            const abilitiesList = document.querySelector('#abilitiesList');
            abilitiesList.innerHTML = '';
            pokemonData.abilities.forEach(abilityInfo => {
                const abilityName = capitalizeEveryWord(abilityInfo.ability.name);
                const listItem = document.createElement('li');
                listItem.innerText = abilityName;
                abilitiesList.appendChild(listItem);
            });

            // Populate moves
            const movesList = document.querySelector('#movesList');
            movesList.innerHTML = '';
            pokemonData.moves.forEach(moveInfo => {
                const moveName = capitalizeEveryWord(moveInfo.move.name);
                const listItem = document.createElement('li');
                listItem.innerText = moveName;
                movesList.appendChild(listItem);
            });

            modal.show();
            isModalOpen = true; // Set flag to true when modal is shown
        } catch (err) {
            console.log(err);
        }
    }

    // Swipe functionality within modal
    let modalTouchstartX = 0;
    let modalTouchendX = 0;
    const modalSwipeThreshold = 100; // Minimum swipe distance in pixels

    // Event listeners for touch events in modal
    document.querySelector('.modal-content').addEventListener('touchstart', (event) => {
        modalTouchstartX = event.changedTouches[0].screenX;
        event.stopPropagation(); // Stop propagation to prevent background swipe
    });

    document.querySelector('.modal-content').addEventListener('touchend', (event) => {
        modalTouchendX = event.changedTouches[0].screenX;
        handleModalSwipe();
        event.stopPropagation(); // Stop propagation to prevent background swipe
    });

    function handleModalSwipe() {
        const swipeDistance = modalTouchendX - modalTouchstartX;

        if (Math.abs(swipeDistance) > modalSwipeThreshold) {
            if (swipeDistance < 0) {
                // Swiped left
                showSection('movesSection');
            } else if (swipeDistance > 0) {
                // Swiped right
                showSection('abilitiesSection');
            }
        }
    }

    function showSection(sectionId) {
        document.querySelectorAll('.details-section').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector(`#${sectionId}`).style.display = 'block';

        document.querySelectorAll('.modal-footer .dot').forEach(dot => {
            dot.classList.remove('active');
        });
        document.querySelector(`.modal-footer .dot[data-target="${sectionId}"]`).classList.add('active');
    }

    // Handle click on navigation dots
    document.querySelectorAll('.modal-footer .dot').forEach(dot => {
        dot.addEventListener('click', (event) => {
            const target = event.target.getAttribute('data-target');
            showSection(target);
        });
    });

    // Event listener to update modal open state when modal is hidden
    document.getElementById('pokemonDetailsModal').addEventListener('hidden.bs.modal', () => {
        isModalOpen = false; // Set flag to false when modal is hidden
    });

    // Function to capitalize every word in a string
    function capitalizeEveryWord(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
}

// Call the function to initialize the Details modal feature
initializeDetailsModal();

// Helper function to create and append elements to the summonPokemon container
function createAndAppendElement(tagName, textContent) {
    const element = document.createElement(tagName);
    if (textContent) {
        element.innerText = textContent;
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

// getPokemonList function
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