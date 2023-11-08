// Global state variables
let addToy = false;  // Controls the display state of the toy form
let toyList = [];    // Holds the list of toys to manage state on the client side

// Headers object for fetch calls, to be sent with requests to the server
const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
};

// API endpoint for toys
const toyApi = 'http://localhost:3000/toys';

// DOM element selectors
const addBtn = document.querySelector("#new-toy-btn");  // Button to add a new toy
const toyFormContainer = document.querySelector(".container"); // Container for the toy form
const toyCollection = document.querySelector('#toy-collection'); // Container for displaying toy cards
const toyForm = document.querySelector(".add-toy-form"); // The form for adding new toys

// Event listeners
addBtn.addEventListener('click', toggleToyFormDisplay); // Toggle the toy form display on button click
toyForm.addEventListener('submit', handleAddNewToy);    // Submit event for adding a new toy

// Initial fetch to get toys and render them
fetch(toyApi)
    .then(response => response.json())
    .then(toys => {
        toyList = toys; // Store the fetched toys in the global state variable
        renderToys(toys); // Render the toys in the UI
    });

// Functions
function toggleToyFormDisplay() {
    // Function to toggle the display of the add new toy form
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? 'block' : 'none';
}

function renderToys(toys) {
    // Function to render all toy cards. Clears the current list and re-renders from 'toys' array.
    toyCollection.innerHTML = ''; // Clear the toy collection container
    toys.forEach(renderToy); // Render each toy using renderToy function
}

function renderToy(toy) {
    // Function to render a single toy card and append it to the toy collection
    const toyCard = document.createElement('div');
    toyCard.classList.add('card');
    toyCard.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" id="like-btn-${toy.id}">Like ❤️</button>
        `;
    toyCollection.append(toyCard); // Append the new card to the toy collection container

    // Attach an event listener to the like button, calling handleAddLike when clicked
    const likeButton = document.getElementById(`like-btn-${toy.id}`);
    likeButton.addEventListener('click', () => handleAddLike(toy));
}

function handleAddLike(toy) {
    // Function to handle the like button click, increases like count for a toy
    const likes = toy.likes + 1;
    fetch(`${toyApi}/${toy.id}`, {
        headers,
        method: 'PATCH',
        body: JSON.stringify({ likes })
    })
        .then(response => response.json())
        .then(updatedToy => {
            // Update the toy in the toyList with the new like count
            const toyIndex = toyList.findIndex(t => t.id === toy.id);
            toyList[toyIndex] = updatedToy;
            renderToys(toyList); // Re-render the toy list to reflect the new like count
        });
}

function handleAddNewToy(e) {
    // Function to handle the new toy form submission
    e.preventDefault();
    const newToyData = {
        name: e.target.name.value,
        image: e.target.image.value,
        likes: 0  // New toys start with 0 likes
    };
    fetch(toyApi, {
        headers,
        method: 'POST',
        body: JSON.stringify(newToyData)
    })
        .then(response => response.json())
        .then(newToy => {
            toyList.push(newToy); // Add the new toy to the toyList
            renderToys(toyList);  // Re-render the toy list to include the new toy
        });
}
