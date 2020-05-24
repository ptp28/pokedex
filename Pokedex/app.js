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
const previousButton = document.querySelector(".previous-button");
const nextButton = document.querySelector(".next-button");

const buttonA = document.querySelector(".button-a");
const buttonB = document.querySelector(".button-b");
const secondaryScreen = document.querySelector(".secondary-screen");
const pokeFrontImageBig = document.querySelector(".poke-front-image-big");
const pokeBackImageBig = document.querySelector(".poke-back-image-big");
const pokeIdInput = document.querySelector(".poke-id-input");

const dPadTop = document.querySelector(".top");
const dPadBottom = document.querySelector(".bottom");
const dPadLeft = document.querySelector(".left");
const dPadRight = document.querySelector(".right");

//Constants and variables
let previousURL = null;
let nextURL = null;

const LEFT_BUTTON_PRESS = new Audio();
LEFT_BUTTON_PRESS.src = "sounds/LeftButtonClick.mp3";
const RIGHT_BUTTON_PRESS = new Audio();
RIGHT_BUTTON_PRESS.src = "sounds/RightButtonClick.mp3";

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

            mainScreen.classList = "main-screen hide"; 
            secondaryScreen.classList = "secondary-screen hide";
            pokeFrontImageBig.classList = "poke-front-image-big hide";
            pokeBackImageBig.classList = "poke-back-image-big hide";// Remove any previous classes and add default classes

            mainScreen.classList.add(pokeTypeOne.textContent);
            secondaryScreen.classList.add(pokeTypeOne.textContent); // Background color depending on first type

            mainScreen.classList.remove("hide");
            pokeName.textContent = data["name"];
            pokeID.textContent = "#" + data["id"].toString().padStart(3, "0");
            pokeWeight.textContent = data["weight"];
            pokeHeight.textContent = data["height"];

            pokeFrontImage.src = data["sprites"]["front_default"] || "";
            pokeBackImage.src = data["sprites"]["back_default"] || ""; // ORing it with '' in case image is not present

            pokeFrontImageBig.src = data["sprites"]["front_default"] || "";
            pokeBackImageBig.src = data["sprites"]["back_default"] || ""; // ORing it with '' in case image is not present

            pokeIdInput.value = data["id"].toString().padStart(3, "0");
        });
};

function handlePreviousButtonClick() {
    RIGHT_BUTTON_PRESS.play();
    if (previousURL) {
        fetchPokeList(previousURL);
    }
}

function handleNextButtonClick() {
    // console.log(nextURL);

    // const offset = nextURL.substring(nextURL.indexOf("offset=")+7,nextURL.indexOf('&'));    // Getting offset from url

    // if(offset == 800)
    // {
    //     nextURL = nextURL.substring(0,nextURL.lastIndexOf('=')+1) + "7";
    //     offset = 0;
    // }
    RIGHT_BUTTON_PRESS.play();

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

function handleButtonAClick()
{
    LEFT_BUTTON_PRESS.play();
    mainScreen.classList.add('hide');
    secondaryScreen.classList.remove('hide');

    if(pokeFrontImageBig.classList.contains('hide'))
    {
        pokeFrontImageBig.classList.remove('hide');
        pokeBackImageBig.classList.add('hide');
    }
    else
    {
        pokeFrontImageBig.classList.add('hide');
        pokeBackImageBig.classList.remove('hide');
    }
}

function handleButtonBClick()
{
    LEFT_BUTTON_PRESS.play();
    secondaryScreen.classList.add('hide');
    mainScreen.classList.remove('hide');
}

function handlePokeIdInput()
{
    const id = parseInt(pokeIdInput.value);
    fetchPokeData(id);
}

function incrementPokeInputID()
{
    LEFT_BUTTON_PRESS.play();
    pokeIdInput.value = (parseInt(pokeIdInput.value) + 1).toString().padStart(3, "0");
    handlePokeIdInput();

}

function decrementPokeInputID()
{
    LEFT_BUTTON_PRESS.play();
    pokeIdInput.value = (parseInt(pokeIdInput.value) - 1).toString().padStart(3, "0");
    handlePokeIdInput();
}


// Event listeners
previousButton.addEventListener("click", handlePreviousButtonClick);
nextButton.addEventListener("click", handleNextButtonClick);

for (const pokeListItem of pokeListItems) { // Add event listeners for all items in list
    pokeListItem.addEventListener("click", handleListItemClick);
}

buttonA.addEventListener("click",handleButtonAClick);
buttonB.addEventListener("click",handleButtonBClick);

pokeIdInput.addEventListener("change",handlePokeIdInput);
dPadTop.addEventListener("click",incrementPokeInputID);
dPadRight.addEventListener("click",incrementPokeInputID);
dPadLeft.addEventListener("click",decrementPokeInputID);
dPadBottom.addEventListener("click",decrementPokeInputID);

//init
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
