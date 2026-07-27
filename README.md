# Pokemon API Demo

A static Pokemon search application that uses the PokéAPI to display details for any Pokémon by name or ID.

## Features

- Search by Pokémon name or ID
- Autocomplete suggestions as you type
- Previous / next navigation between Pokémon
- Details modal showing abilities, moves, and evolution chain
- Swipe gestures for mobile navigation and modal section switching
- Back-to-top button for convenient navigation

## How to use

1. Open `index.html` in a browser.
2. Type a Pokémon name or ID into the search field.
3. Click **Summon** or press **Enter**.
4. Use the left/right chevrons to move between Pokémon.
5. Click **Details** to view abilities, moves, and evolution paths.

## Project structure

- `index.html` — application markup and Bootstrap integration
- `css/styles.css` — layout, modal, and button styling
- `js/pokemonapi.js` — application logic for fetching, rendering, and UI behavior

## Notes

- The app loads Pokémon names for autocomplete from the PokéAPI.
- The details modal fetches species and evolution chain data dynamically.
- For local development, use a static web server or a Live Server extension.

## Credits

Built with Bootstrap, Font Awesome, and PokéAPI.
