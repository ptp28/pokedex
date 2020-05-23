//DOM Objects
const mainScreen = document.querySelector(".main-screen");
const pokeName = document.querySelector(".poke-name");
const pokeID = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHeight = document.querySelector(".poke-height");
const pokeListItems = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

//Constants and variables
let previousURL = null;
let nextURL = null;

// Functions
const fetchPokeList = (url) => {
    // Fetching data for right side
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);

            previousURL = data["previous"];
            nextURL = data["next"];

            const results = data["results"];

            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const name = resultData["name"];
                    const url = resultData["url"];
                    const urlSplit = url.split("/"); // To extract ID from url
                    const id = urlSplit[urlSplit.length - 2]; // ID is second last element of split
                    pokeListItem.textContent = id + ". " + name;
                } else {
                    pokeListItem.textContent = "";
                }
            }
        });
};

const fetchPokeData = (id) => {
    // Fetching data for left side
    fetch("https://pokeapi.co/api/v2/pokemon/"+id)
        .then((res) => res.json()) // Gets data from API, stores in variable res and then returns the same data in json format
        .then((data) => {
            console.log(data);

            const pokeTypes = data["types"];
            pokeTypeOne.textContent = pokeTypes[0]["type"]["name"];

            if (pokeTypes[1]) {
                // For pokemon who have only 1 type
                pokeTypeTwo.classList.remove("hide");
                pokeTypeTwo.textContent = pokeTypes[1]["type"]["name"];
            } else {
                pokeTypeTwo.classList.add("hide");
                pokeTypeTwo.textContent = "";
            }

            mainScreen.classList = "main-screen hide"; // Remove any previous classes and add default classes

            mainScreen.classList.add(pokeTypeOne.textContent); // Background color depending on first type

            mainScreen.classList.remove("hide");
            pokeName.textContent = data["name"];
            pokeID.textContent = "#" + data["id"].toString().padStart(3, "0");
            pokeWeight.textContent = data["weight"];
            pokeHeight.textContent = data["height"];

            pokeFrontImage.src = data["sprites"]["front_default"] || "";
            pokeBackImage.src = data["sprites"]["back_default"] || ""; // ORing it with '' in case image is not present
        });
};

function handleLeftButtonClick() {
    if (previousURL) {
        fetchPokeList(previousURL);
    }
}

function handleRightButtonClick() {
    if (nextURL) {
        fetchPokeList(nextURL);
    }
}

function handleListItemClick(e) {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split(".")[0];
    fetchPokeData(id);
}

// Event listeners
leftButton.addEventListener("click", handleLeftButtonClick);
rightButton.addEventListener("click", handleRightButtonClick);

for (const pokeListItem of pokeListItems) { // Add event listeners for all items in list
    pokeListItem.addEventListener("click", handleListItemClick);
}

//init
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
