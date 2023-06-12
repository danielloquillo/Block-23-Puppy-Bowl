
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const cohortName = '2109-UNF-HY-WEB-PT';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
    try {
      const response = await fetch(APIURL);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
      return [];
    }
  };
  
  const renderAllPlayers = async () => {
    try {
      const players = await fetchAllPlayers();
      const playerContainer = document.getElementById('all-players-container');
      playerContainer.innerHTML = '';
  
      players.forEach(player => {
        const playerCard = document.createElement('div');
         const dropdownId = `dropdown-${player.id}`;
        playerCard.innerHTML = `
          <h3>${player.name}</h3>
          <img src="${player.image}" alt="${player.name}" />
          <p>Breed: ${player.breed}</p>
          <p>Age: ${player.age}</p>
          <p>Weight: ${player.weight}</p>
        `;
        playerContainer.appendChild(playerCard);
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering players!', err);
    }
  };
  
  renderAllPlayers();

  const addNewPlayer = async (playerObj) => {
    try {
      const response = await fetch(APIURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerObj),
      });
  
      if (response.ok) {
        renderAllPlayers();
      } else {
        console.error('Oops, something went wrong with adding that player!');
      }
    } catch (err) {
      console.error('Oops, something went wrong with adding that player!', err);
    }
  };
  
  const renderNewPlayerForm = () => {
    const newPlayerFormContainer = document.getElementById('new-player-form');
    newPlayerFormContainer.innerHTML = `
      <h3>Add New Player</h3>
      <form id="new-player-form">
        <label for="name">Name:</label>
        <input type="text" id="name" required>
        
        <label for="breed">Breed:</label>
        <input type="text" id="breed" required>
        
        <label for="age">Age:</label>
        <input type="number" id="age" required>
        
        <label for="weight">Weight:</label>
        <input type="number" id="weight" required>
        
        <button type="submit">Add Player</button>
      </form>
    `;
  
    const form = newPlayerFormContainer.querySelector('#new-player-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('#name').value;
      const breed = form.querySelector('#breed').value;
      const age = form.querySelector('#age').value;
      const weight = form.querySelector('#weight').value;
  
      const playerObj = { name, breed, age, weight };
      addNewPlayer(playerObj);
    });
  };
  
  renderNewPlayerForm();