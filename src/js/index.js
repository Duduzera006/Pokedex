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
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const data = await response.json();
        const regionValue = regionSelected.value;
        const pokedex = document.getElementById("pokedex");
        const wrapper = document.getElementById("wrapper-container")
        const pokeball = document.getElementById("pokeball-spinner")
        let pokemonList = data.results;
        
        pokedex.innerHTML = '';
        regionSelected.disabled = true;
        wrapper.classList.add("wrapper");
        pokeball.classList.add("pokeball");

        const regionList = handleSelectedRegion(pokemonList, regionValue);

        for (const pokemon of regionList) {
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

            const gifDiv = document.createElement("div");
            gifDiv.classList.add("gifDiv");

            const image = document.createElement("img");
            if (pokemonID < 650) {
                image.src = `./src/images/${pokemonID}.gif`
            } else {
                image.src = `./src/images/${pokemonID}.png`
            }
            image.alt = pokemon.name;

            const height = image.height;
            const width = image.width;

            if (height > 90 || width > 90) {
                image.classList.add("gif");
            }

            gifDiv.appendChild(image);

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
            listItem.appendChild(gifDiv);
            listItem.appendChild(typesList);
            listItem.appendChild(description);
            pokedex.appendChild(listItem);

        }

        regionSelected.disabled = false;
        wrapper.classList.remove("wrapper")
        pokeball.classList.remove("pokeball")

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

function handleSelectedRegion(list, region){
    if (region == "Kanto") {
        list = list.slice(0, 151)
    } else if (region == "Johto") {
        list = list.slice(151, 251)
    } else if (region == "Hoenn") {
        list = list.slice(251, 386)
    } else if (region == "Sinnoh") {
        list = list.slice(386, 494)
    } else if (region == "Unova") {
        list = list.slice(494, 649)
    } else if (region == "Kalos") {
        list = list.slice(649, 721)
    } else if (region == "Alola") {
        list = list.slice(721, 809)
    } else if (region == "Galar") {
        list = list.slice(809, 905)
    } else if (region == "Paldea") {
        list = list.slice(905, 1010)
    }
    return list;
}

async function getPokemonTypesFromURL(url) {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonTypes = data.types;
    return pokemonTypes;
}

async function getPokemonDescription(ID) {
    debugger;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${ID}/`);
    const data = await response.json();
    const dataArray = data.flavor_text_entries;
    for (const item of dataArray) {
        if (ID < 387) {
            if (item.language.name == "en" && item.version.name == "firered") {
                const description = item.flavor_text;
                return description;
            }
        } else {
            if (item.language.name == "en") {
                const description = item.flavor_text;
                return description;
            }
        }
    }
    return "No description available";
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
        dragon: 'dragão',
        dark: 'sombrio'
    };

    const translatedTypes = types.map(type => typeTranslations[type.type.name] || type.type.name);

    return translatedTypes;
}

fetchPokemonData();
