const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-E';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
  * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
      const allPlayers = await fetch(APIURL);
      const {data: players} = await allPlayers.json();
      return players.players;
    } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
      return [];
    }
  };

  const fetchSinglePlayer = async (playerId, domEl) => {
    try {
        let singlePlayer = await fetch(`${APIURL}/${playerId}`);
        const {data: player} = await singlePlayer.json();
        singlePlayer = player.player;
        const playerInfoElement = document.createElement('div');
        playerInfoElement.setAttribute("class", "playerInformationDropDown");
        playerInfoElement.innerHTML = `
            <h2>Player Stats:</h2>
            <p>Breed: ${singlePlayer.breed}</p>
            <p>Status: ${singlePlayer.status}</p>

            <button class="close-button">Close Details</button>
        `
        const checkForDuplicate = domEl.querySelector('.playerInformationDropDown');
        if (checkForDuplicate) checkForDuplicate.remove()
        domEl.appendChild(playerInfoElement);

        const closeDetailsButton = playerInfoElement.querySelector('.close-button');
        closeDetailsButton.addEventListener('click', () => {
            playerInfoElement.remove();
        });

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(
            APIURL,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(playerObj),
            }
          );
          const result = await response.json();
          console.log(result);
          
          const players = await fetchAllPlayers();
          renderAllPlayers(players);
        
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};
  
  const removePlayer = async (playerId) => {
    try {
        if (confirm("Are You Sure You Want to Delete This Player?")) {
            const response = await fetch(`${APIURL}/${playerId}`, {
                method: 'DELETE',
            });

            const players = await fetchAllPlayers();
            renderAllPlayers(players);
        }
        

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err 
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
  
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add(`playerCard`);
            playerElement.setAttribute("id", `${player.id}`);
            playerElement.innerHTML = `
            
            <h2 class="topCardPlayerName">${player.name}</h2>

            <div class="cardImgContainer">
                <p><img class="player-image" src="${player.imageUrl}    "></p>
            </div>
            
            <button class="details-button" data-id=${player.id}>Details</button>
            <button class="remove-button" data-id=${player.id}>Remove</button>
            `

        playerContainer.appendChild(playerElement);
        const playerDetailsButton = playerElement.querySelector('.details-button');
        playerDetailsButton.addEventListener('click', () => {
                fetchSinglePlayer(player.id, document.getElementById(`${player.id}`));
        });
        
        const removeButton = playerElement.querySelector('.remove-button');
        removeButton.addEventListener('click', () => {
            removePlayer(player.id);
            });
        });
    
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */



class Player {
    constructor(name, breed, imageUrl, status) {
        this.name = name;
        this.breed = breed; 
        this.status = status;
        this.imageUrl = imageUrl;
    }
};

const renderNewPlayerForm = () => {
    try {
        const newPlayerForm = document.createElement('form');
        newPlayerForm.classList.add('new-player-form-info');
        newPlayerForm.setAttribute("autocomplete", "off");
        newPlayerForm.innerHTML = `
            <h2>Add New Dog Here</h2>
            
                <input id="new-player-name" type="text" name="name" placeholder="Player Name" required>
                <div id="autofill-wrapper">
                    <input id="new-player-breed" type="text" name="breed" placeholder="Player Breed" required>
                </div>
                
                <select name="select-status" id="new-players-status" required>
                    <option value="bench">Bench</option>
                    <option value="field">Field</option>
                </select>
                <input type="submit">
            
        `
        newPlayerFormContainer.appendChild(newPlayerForm);
        
            newPlayerForm.onsubmit = (e) => {
                e.preventDefault();
                const name = newPlayerFormContainer.querySelector("#new-player-name").value;
                const breed = newPlayerFormContainer.querySelector("#new-player-breed").value;
                const status = newPlayerFormContainer.querySelector("#new-players-status").value;
    
                const newPlayer = new Player(name,breed, randomImageUrl, status);
                addNewPlayer(newPlayer);
                newPlayerForm.reset();
            }
        } catch (err) {
            console.error('Uh oh, trouble rendering the new player form!', err);
        }
    }
    
    const init = async () => {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    
        renderNewPlayerForm();
    }
    
    init();








    