const botaoAlterarTema = document.getElementById("botao-alterar-tema");
const body = document.querySelector("body");
const imagemBotaoTrocaDeTema = document.querySelector(".imagem-botao")
const regionSelector = document.querySelector(".pokemon-region-filter")


botaoAlterarTema.addEventListener("click", () => {
    const modoEscuroAtivo = body.classList.contains("modo-escuro");
    body.classList.toggle("modo-escuro");

    if (modoEscuroAtivo) {
        imagemBotaoTrocaDeTema.setAttribute("src", "./src/images/sun.png")
        regionSelector.classList.add("pokemon-region-filter")
        regionSelector.classList.remove("pokemon-region-filter-dark")
    } else {
        imagemBotaoTrocaDeTema.setAttribute("src", "./src/images/moon.png")
        regionSelector.classList.remove("pokemon-region-filter")
        regionSelector.classList.add("pokemon-region-filter-dark")
    }
})








async function fetchPokemonData() {
    try {
        debugger;
        const regionSelected = document.getElementById("region-selector");
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=809');
        const data = await response.json();
        let pokemonList = data.results;
        const pokedex = document.getElementById("pokedex");
        pokedex.innerHTML = '';
        
        if (regionSelected.value == "Kanto"){
            pokemonList = pokemonList.slice(0,151)
        }else if (regionSelected.value == "Johto") {
            pokemonList = pokemonList.slice(151,251)
        } else if (regionSelected.value == "Hoenn"){
            pokemonList = pokemonList.slice(251,386)
        } else if (regionSelected.value == "Sinnoh"){
            pokemonList = pokemonList.slice(387,493)
        } else if (regionSelected.value == "Unova"){
            pokemonList = pokemonList.slice(494,649)
        } else if (regionSelected.value == "Kalos"){
            pokemonList = pokemonList.slice(650,721)
        } else if (regionSelected.value == "Alola"){
            pokemonList = pokemonList.slice(722,809)
        } 
        
        for (const pokemon of pokemonList) {
            const pokemonID = getPokemonIDFromURL(pokemon.url);
            const pokemonTypes = await getPokemonTypesFromURL(pokemon.url);
            const ptBR = await translatePokemonTypes(pokemonTypes);
            const pokemonDescription = await getPokemonDescription(pokemonID);

            const listItem = document.createElement("li");
            listItem.classList.add("cartao-pokemon");
            if (ptBR.length > 1) {
                const formatedType = ptBR[0].charAt(0).toUpperCase() + ptBR[0].slice(1);
                const formatedType2 = ptBR[1].charAt(0).toUpperCase() + ptBR[1].slice(1);
                listItem.classList.add("background-" + formatedType + "-" + formatedType2);
            } else {
                const formatedType = ptBR[0].charAt(0).toUpperCase() + ptBR[0].slice(1);
                listItem.classList.add("background-" + formatedType);
            }

            const infoDiv = document.createElement("div");
            infoDiv.classList.add("informacoes");

            const nameSpan = document.createElement("span");
            nameSpan.textContent = pokemon.name;

            const numberSpan = document.createElement("span");
            numberSpan.textContent = `#${pokemonID.toString().padStart(3, '0')}`;

            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(numberSpan);

            const image = document.createElement("img");
            image.src = `./src/images/${pokemonID}.gif`
            image.alt = pokemon.name;
            image.classList.add("gif");

            const typesList = document.createElement("ul");
            typesList.classList.add("tipos");

            ptBR.forEach(type => {
                const typeItem = document.createElement("li");
                typeItem.classList.add("tipo")
                typeItem.classList.add(type);
                const str = type;
                const str2 = str.charAt(0).toUpperCase() + str.slice(1);
                typeItem.textContent = str2;
                typesList.appendChild(typeItem);
            });

            const description = document.createElement("p");
            description.classList.add("descricao");
            description.textContent = pokemonDescription;

            listItem.appendChild(infoDiv);
            listItem.appendChild(image);
            listItem.appendChild(typesList);
            listItem.appendChild(description);

            pokedex.appendChild(listItem);
        }
    } catch (error) {
        console.log("Error fetching Pokémon data:", error);
    }
}

function getPokemonIDFromURL(url) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }
    return null;
}

async function getPokemonTypesFromURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonTypes = data.types;
    return pokemonTypes;
}

async function getPokemonDescription(ID) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${ID}/`);
    const data = await response.json();
    const textVersion = data.flavor_text_entries[9];
    const description = textVersion.flavor_text;
    return description;
}

async function translatePokemonTypes(types) {
    const typeTranslations = {
        grass: 'grama',
        fire: 'fogo',
        water: 'água',
        poison: 'veneno',
        flying: 'voador',
        bug: 'inseto',
        normal: 'normal',
        electric: 'elétrico',
        ground: 'terra',
        fairy: 'fada',
        ghost: 'fantasma',
        fighting: 'lutador',
        psychic: 'psíquico',
        rock: 'pedra',
        steel: 'aço',
        ice: 'gelo',
        dragon: 'dragão'
    };

    const translatedTypes = types.map(type => typeTranslations[type.type.name] || type.type.name);

    return translatedTypes;
}

fetchPokemonData();
