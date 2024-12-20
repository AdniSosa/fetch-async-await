
const favoritesDiv = document.getElementById('favorites');
const favoritesList = document.getElementById('favorites-list');
let favoritesPokemons = JSON.parse(localStorage.getItem("Pokemon"))
console.log(localStorage)

const getFavorites = () => {
    favoritesPokemons.forEach(pokemon => {
        console.log(pokemon)
        favoritesList.innerHTML +=
            `
            <li>
                    <h2>${pokemon.nombre}</h2>
                    ${pokemon.img}
                    <p>${pokemon.height}</p>
                    <p>${pokemon.weight}</p>
                    <button class="delete">Borrar</button>
            </li>
            `  
         
        
            const deleteBtn = favoritesList.querySelector('.delete'); 

            deleteBtn.addEventListener('click', () => {
               deletePokemon(pokemon.nombre);
                
            })
    })
}

const deletePokemon = (nombrePokemon) => {
    favoritesPokemons = JSON.parse(localStorage.getItem('Pokemon'));
    let indexFavorito = favoritesPokemons.findIndex(pokemon => pokemon.name === nombrePokemon);
    console.log(indexFavorito)
    favoritesPokemons.splice(indexFavorito, 1);
    localStorage.setItem("Pokemon", JSON.stringify(favoritesPokemons));
}

getFavorites();

