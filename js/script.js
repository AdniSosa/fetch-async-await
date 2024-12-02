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

    const ventanaFlotante = document.createElement('div');
    ventanaFlotante.classList.add('ventana-flotante');
    ventanaFlotante.innerHTML = `
        <div class="detalle-pokemon">
            <img class="heart" src="./assets/img/heart.png"width="20">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}" width="170" class="poke-img"> 
            <p><b>Altura:</b> ${pokemon.height / 10} m</p>
            <p><b>Peso:</b> ${pokemon.weight / 10} kg</p>
            <button class="cerrar-pokemon">Cerrar</button>
        </div>
    `;

    document.body.appendChild(ventanaFlotante);

    const botonFavorito = ventanaFlotante.querySelector('.heart');
    const addFavorite = () => {
        botonFavorito.addEventListener('click', () => {
            botonFavorito.style.display = 'none';
            ventanaFlotante.innerHTML = `
            <div class="detalle-pokemon">
                <img class="redheart" src="./assets/img/redHeart.png"width="30">
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}" width="170" class="poke-img"> 
                <p><b>Altura:</b> ${pokemon.height / 10} m</p>
                <p><b>Peso:</b> ${pokemon.weight / 10} kg</p>
                <button class="cerrar-pokemon">Cerrar</button>
            </div>
        `;
            closeWindow();
            localStorage.setItem('Pokemon', ventanaFlotante);
            removeFavorite();
        });
    }
    addFavorite();

    const quitarFavorito = ventanaFlotante.querySelector('.redheart');
    const removeFavorite = () => {
        quitarFavorito.addEventListener('click', () => {
            quitarFavorito.style.display = 'none';
            ventanaFlotante.innerHTML = `
            <div class="detalle-pokemon">
                <img class="heart" src="./assets/img/heart.png"width="30">
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}" width="170" class="poke-img"> 
                <p><b>Altura:</b> ${pokemon.height / 10} m</p>
                <p><b>Peso:</b> ${pokemon.weight / 10} kg</p>
                <button class="cerrar-pokemon">Cerrar</button>
            </div>
        `;
            closeWindow();
            localStorage.removeItem('Pokemon');
            addFavorite();
        });
    }
    removeFavorite();

    const closeWindow = () => {
        const botonCerrar = ventanaFlotante.querySelector('.cerrar-pokemon');
        botonCerrar.addEventListener('click', () => {
            document.body.removeChild(ventanaFlotante);
        });
    }
   

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