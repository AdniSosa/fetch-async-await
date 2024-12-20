/* --------------------------------------------------------------------------------------------
--------------------------------            POKEDEX            --------------------------------
--------------------------------------------------------------------------------------------- */

/* ********************************************************************************************
1. OBTENER lista de Pokemon de la API `https://pokeapi.co/api/v2/pokemon`
    2. MOSTRAR lista de Pokemons
3. OBTENER detalle de Pokemon individual 
    4. MOSTRAR Pokemon individual
5. NAVEGAR Gestiona la paginación para mostrar diferentes conjuntos de Pokémon. De 10 en 10. 
    - añadir esto a la url más otras cosas puede limitar la cantidad `?limit=`
6. BUSCAR Permite la búsqueda de Pokémon por nombre (consultar en la documentación). 
    - Si no exite, "pokemon no encontrado".
    - Muestra detalle más específico de cada uno.
7. Botón RESET

** Maneja eventos de botones y actualiza dinámicamente la interfaz. pokémon **
********************************************************************************************* */

let paginaActual = 0;

const prevPagBtn = document.getElementById('prevBtn');
const nextPagBtn = document.getElementById('nextBtn');
const botonResetear = document.getElementById('resetBtn');
const botonBuscarPokemon = document.getElementById('searchBtn');
const pokemonInput = document.getElementById('searchInput');
const listaPokemons = document.getElementById('app');
const favoritesDiv = document.getElementById('favorites');
const favoritesList = document.getElementById('favorites-list');

//localStorage.clear();
let favoritesPokemons = JSON.parse(localStorage.getItem("Pokemon")) || [];
let heartsArr = JSON.parse(localStorage.getItem("Hearts")) || [];
console.log(favoritesPokemons)

/****************************
1. OBTENER lista de Pokemons
*****************************/
const obtenerlistaPokemons = async (paginaActual) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(paginaActual) * 10}`); 
        if (!response.ok) {
            throw new Error('🔴 Ha surgido un error: ', response.status);
        }

        const data = await response.json(); 
         /* ***** */ console.log('🟩 Respuesta después json()', data); // muestra array con los 10 primeros
         await mostrarListaPokemons(data.results);

        

    } catch (error) {
        console.error('🔴 Error al obtener los datos:', error.message); 
    }
};

obtenerlistaPokemons();


/****************************
2. MOSTRAR lista de Pokemons
*****************************/
const mostrarListaPokemons = async (pokemons) => {
   
    listaPokemons.innerHTML = ''; 
    
        pokemons.forEach(async(pokemon) =>  {

            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
          
            const contenedorUl = document.createElement('ul');
            const contenedorPokemon = document.createElement('li');
            contenedorPokemon.classList.add('pokemon');
            contenedorPokemon.innerHTML = `
                <h2>${pokemon.name}</h2>
                <img class = "imagenPerdida" src= "${pokemonData.sprites.other.home.front_default}" alt= "${pokemon.name}"/>`;

                contenedorUl.appendChild(contenedorPokemon)
                listaPokemons.appendChild(contenedorUl);

            // evento para ver detalle de un Pokemon desde la lista
            contenedorPokemon.addEventListener('click', () => {
                obtenerDetallePokemon(pokemon.name);
            });
    })
};

/****************************
3. OBTENER detalle cada Pokemon
*****************************/
const obtenerDetallePokemon = async (nombrePokemon) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
        if (!response.ok) {
            console.log('🔴 Pokemon no encontrado.');
            return;
        }

        const pokemon = await response.json();
        /* ***** */ console.log('🟨 Pokemon encontrado:', pokemon);

        mostrarDetallePokemon(pokemon); // ventana emergente

    } catch (error) {
        console.error("Error al obtener detalles del Pokémon:", error);
    }
};

obtenerDetallePokemon();

/****************************
4. MOSTRAR detalle cada Pokemon
*****************************/
const mostrarDetallePokemon = (pokemon) => {
    JSON.parse(localStorage.getItem("Pokemon"));
    /* ***** */ console.log('🟢 Detalle pokemon ventana flotante', pokemon); 

    const ventanaFlotante = document.createElement('div');
    ventanaFlotante.classList.add('ventana-flotante');
    ventanaFlotante.innerHTML = `
        <div class="detalle-pokemon">
        <img class="heart white" src="./assets/img/heart.png"width="20">
        <img class="heart red" src="./assets/img/redHeart.png"width="30" style="display: none">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}" width="170" class="poke-img"> 
            <p><b>Altura:</b> ${pokemon.height / 10} m</p>
            <p><b>Peso:</b> ${pokemon.weight / 10} kg</p>
            <button class="cerrar-pokemon">Cerrar</button>
        </div>
    `;

    document.body.appendChild(ventanaFlotante);

    const noFavoriteBtn = ventanaFlotante.querySelector('.white');
    const setFavoriteBtn = ventanaFlotante.querySelector('.red');
    
    const addFavorite = () => {
        noFavoriteBtn.addEventListener('click', () => {
            noFavoriteBtn.style.display = 'none';
            setFavoriteBtn.style.display = 'block';
            
            let favoritePokemon = {
                nombre: `${pokemon.name}`,
                img: `<img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}" width="170" class="poke-img">`,
                height: `<p><b>Altura:</b> ${pokemon.height / 10} m</p>`,
                weight: `<p><b>Peso:</b> ${pokemon.weight / 10} kg</p>`,
            }

          /*   let favoritesWithHearts = {
                heart: '<img class="heart red" src="./assets/img/redHeart.png"width="30"></img>',
                name: `${pokemon.name}`,
            } */

           favoritesPokemons.push(favoritePokemon);
           //favoritesWithHearts.push(heartsArr);
           
           localStorage.setItem("Pokemon", JSON.stringify(favoritesPokemons));
           //localStorage.setItem("Hearts", JSON.stringify(favoritesWithHearts));
           
        });
    }
    addFavorite();
    
    const removeFavorite = () => {
        setFavoriteBtn.addEventListener('click', () => {
            getFavorites();
            noFavoriteBtn.style.display = 'block';
            setFavoriteBtn.style.display = 'none';
        
            localStorage.removeItem('Pokemon');
        
        });
    }
    removeFavorite();

    /* const showHearts = () => {
        heartsArr.forEach(heart => {
            
        }) 
    } */

    const closeWindow = () => {
        const botonCerrar = ventanaFlotante.querySelector('.cerrar-pokemon');
        botonCerrar.addEventListener('click', () => {
            document.body.removeChild(ventanaFlotante);
    });
}

closeWindow();

botonResetear.addEventListener('click', async () => {
    pokemonInput.value = '';
    document.body.removeChild(ventanaFlotante);
    });
};


/****************************
5. NAVEGAR por paginación
*****************************/
prevPagBtn.addEventListener('click', () => {
    if (paginaActual > 0) {
        paginaActual--;
        obtenerlistaPokemons(paginaActual);
    }
});

nextPagBtn.addEventListener('click', () => {
    paginaActual++;
    obtenerlistaPokemons(paginaActual);
});


/****************************
6. BUSCAR por nombre 
*****************************/
botonBuscarPokemon.addEventListener('click', () => {
    const buscarPokemon = pokemonInput.value.trim().toLowerCase();
    obtenerDetallePokemon(buscarPokemon);  
});

pokemonInput.addEventListener('keypress', (e) => {
    console.log(e)
    const buscarPokemon = pokemonInput.value.trim().toLowerCase();
    if(e.key === 'Enter') {
        obtenerDetallePokemon(buscarPokemon);  
    }
});

/****************************
7. Ir a la página de favoritos
*****************************/

const misFavoritos = document.createElement('a');
misFavoritos.textContent = 'Mis favoritos';
misFavoritos.href = './favoritos.html';
document.body.appendChild(misFavoritos);


/****************************
**********BONUS**************
*****************************/

/*1- Marcar los pokemons para guardar como favorito
    -Incluir un simbolo (corazón) en ventana flotante.
 2- Al clicar se ponga rojo y se guarde en el local Storage.
    Al volver a hacer click se ponga blanco el corazón y se borre de local Storage.
 3- Crear un html (favoritos.html)
    Crear botón en favoritos.html para ir a index.html
 4- Get el local Storage  de los favoritos.
    -Crear ul y li para que salgan los pokemones favoritos.
5- Crear botón en html para ir directo a favoritos.html.
    En el header poner botón "Mis favoritos"
*/ 