// Summoning Pokemon

// Selectors and variables
const summonPokemon = document.querySelector('#pokemonDetails');
const pokemonNameInput = document.querySelector('#pokemonNameInput');
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
        if (!response.ok) throw new Error('Failed to load Pokémon list');
        const data = await response.json();
        return data.results.map(pokemon => pokemon.name);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Autocomplete functionality
async function setupAutocomplete() {
    const pokemonNames = await fetchAllPokemonNames();

    pokemonNameInput.addEventListener('input', () => {
        const inputValue = pokemonNameInput.value.toLowerCase().trim();
        pokemonSuggestions.innerHTML = '';

        if (!inputValue) return;

        pokemonNames
            .filter(name => name.startsWith(inputValue))
            .slice(0, 10)
            .forEach(name => {
                const option = document.createElement('option');
                option.value = capitalizeEveryWord(name);
                pokemonSuggestions.appendChild(option);
            });
    });
}

function normalizeInput(value) {
    return value.toString().trim().toLowerCase();
}

function showLoading() {
    summonPokemon.innerHTML = '<p>Loading...</p>';
}

function showError(message) {
    summonPokemon.innerHTML = `<p>${message}</p>`;
}

function renderPokemonCard(pokemonData) {
    summonPokemon.innerHTML = '';
    currentPokemonId = pokemonData.id;

    createAndAppendElement('h2', capitalizeEveryWord(pokemonData.name));
    createAndAppendElement('p', `Pokemon ID: ${pokemonData.id}`);

    const displayImage = createAndAppendElement('img');
    displayImage.src = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
    displayImage.width = 300;
    displayImage.alt = `${capitalizeEveryWord(pokemonData.name)} artwork`;

    pokemonData.types.forEach((typeInfo, index) => {
        createAndAppendElement('p', `Type ${index + 1}: ${capitalizeEveryWord(typeInfo.type.name)}`);
    });

    createAndAppendElement('p', `Base Experience: ${pokemonData.base_experience}`);

    const heightInInches = (pokemonData.height / 10) * 39.37;
    createAndAppendElement('p', `Height: ${heightInInches.toFixed(2)} inches`);

    const weightInPounds = (pokemonData.weight / 10) * 2.20462;
    createAndAppendElement('p', `Weight: ${weightInPounds.toFixed(2)} lbs`);

    const detailsButton = document.createElement('button');
    detailsButton.id = 'detailsButton';
    detailsButton.className = 'btn btn-light btn-sm mt-2';
    detailsButton.innerText = 'Details';
    summonPokemon.appendChild(detailsButton);

    prevPokemon.style.display = 'inline';
    nextPokemon.style.display = 'inline';
    prevPokemon.onclick = () => getPokemonById(currentPokemonId - 1);
    nextPokemon.onclick = () => getPokemonById(currentPokemonId + 1);
}

async function fetchPokemon(key) {
    try {
        showLoading();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizeInput(key)}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const pokemonData = await response.json();
        renderPokemonCard(pokemonData);
    } catch (err) {
        console.error(err);
        showError('Pokémon not found. Please try again.');
    }
}

function getPokemonByName(name) {
    if (!name.trim()) {
        showError('Please enter a Pokémon name or ID.');
        return;
    }
    fetchPokemon(name);
}

function getPokemonById(id) {
    if (id < 1) {
        showError('No previous Pokémon available.');
        return;
    }
    fetchPokemon(id);
}

setupAutocomplete();

pokemonSummonButton.addEventListener('click', () => getPokemonByName(pokemonNameInput.value));

pokemonNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getPokemonByName(pokemonNameInput.value);
    }
});

// Swipe navigation for the main card
let touchstartX = 0;
let touchendX = 0;
const swipeThreshold = 100;

function handleGesture() {
    if (isModalOpen || !currentPokemonId) return;
    const swipeDistance = touchendX - touchstartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        swipeDistance < 0 ? getPokemonById(currentPokemonId + 1) : getPokemonById(currentPokemonId - 1);
    }
}

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
    if (text) element.innerText = text;
    summonPokemon.appendChild(element);
    return element;
}

function initializeDetailsModal() {
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'detailsButton') {
            showDetailsModal();
        }
    });

    async function showDetailsModal() {
        const modal = new bootstrap.Modal(document.getElementById('pokemonDetailsModal'), {
            keyboard: false
        });

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonId}`);
            if (!response.ok) throw new Error('Details not found');
            const pokemonData = await response.json();

            populateList('#abilitiesList', pokemonData.abilities.map(item => capitalizeEveryWord(item.ability.name)));
            populateList('#movesList', pokemonData.moves.map(item => capitalizeEveryWord(item.move.name)));

            const speciesResponse = await fetch(pokemonData.species.url);
            if (!speciesResponse.ok) throw new Error('Evolution data not found');
            const speciesData = await speciesResponse.json();
            const evolutionResponse = await fetch(speciesData.evolution_chain.url);
            if (!evolutionResponse.ok) throw new Error('Evolution data not found');
            const evolutionData = await evolutionResponse.json();

            const evolutionPaths = getEvolutionPaths(evolutionData.chain);
            populateList('#evolutionsList', evolutionPaths.map(path => path.join(' → ')));

            showSection('abilitiesSection');
            modal.show();
            isModalOpen = true;
        } catch (err) {
            console.error(err);
        }
    }

    function populateList(selector, items) {
        const list = document.querySelector(selector);
        list.innerHTML = '';
        items.forEach(text => {
            const listItem = document.createElement('li');
            listItem.innerText = text;
            list.appendChild(listItem);
        });
    }

    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        let modalTouchstartX = 0;
        let modalTouchendX = 0;
        const modalSwipeThreshold = 100;

        modalContent.addEventListener('touchstart', (event) => {
            modalTouchstartX = event.changedTouches[0].screenX;
            event.stopPropagation();
        });

        modalContent.addEventListener('touchend', (event) => {
            modalTouchendX = event.changedTouches[0].screenX;
            handleModalSwipe();
            event.stopPropagation();
        });

        function handleModalSwipe() {
            const swipeDistance = modalTouchendX - modalTouchstartX;
            if (Math.abs(swipeDistance) > modalSwipeThreshold) {
                swipeDistance < 0 ? showNextSection() : showPreviousSection();
            }
        }
    }

    function showNextSection() {
        const sections = Array.from(document.querySelectorAll('.details-section'));
        const currentIndex = sections.findIndex(section => section.style.display !== 'none');
        showSection(sections[(currentIndex + 1) % sections.length].id);
    }

    function showPreviousSection() {
        const sections = Array.from(document.querySelectorAll('.details-section'));
        const currentIndex = sections.findIndex(section => section.style.display !== 'none');
        showSection(sections[(currentIndex - 1 + sections.length) % sections.length].id);
    }

    function showSection(sectionId) {
        document.querySelectorAll('.details-section').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector(`#${sectionId}`).style.display = 'block';

        document.querySelectorAll('.modal-footer .dot').forEach(dot => dot.classList.remove('active'));
        document.querySelector(`.modal-footer .dot[data-target="${sectionId}"]`).classList.add('active');
    }

    document.querySelectorAll('.modal-footer .dot').forEach(dot => {
        dot.addEventListener('click', (event) => {
            showSection(event.target.getAttribute('data-target'));
        });
    });

    document.getElementById('pokemonDetailsModal').addEventListener('hidden.bs.modal', () => {
        isModalOpen = false;
    });
}

function getEvolutionPaths(chainNode, path = []) {
    const currentPath = [...path, capitalizeEveryWord(chainNode.species.name)];
    if (chainNode.evolves_to.length === 0) return [currentPath];
    return chainNode.evolves_to.flatMap(nextEvolution => getEvolutionPaths(nextEvolution, currentPath));
}

initializeDetailsModal();

// Back-to-Top button
const btn = $('#button');
$(window).scroll(() => btn.toggleClass('show', $(window).scrollTop() > 100));
btn.on('click', (e) => {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 100);
});
