document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  let addToy = false; // Define addToy variable and initialize it to false

  addBtn.addEventListener("click", () => {
    // Toggle the visibility of the toy form container
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector('.add-toy-form');

  // Function to fetch toy data and create cards
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => {
          // Create a card for each toy
          const card = createToyCard(toy);
          // Append card to the toy collection
          toyCollection.appendChild(card);
        });
      });
  }

  // Call fetchToys function to load toy data
  fetchToys();

  // Add event listener to the toy form for submitting new toys
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve input values for the toy name and image URL
    const name = toyForm.querySelector('input[name="name"]').value;
    const image = toyForm.querySelector('input[name="image"]').value;

    // Create an object containing the toy data
    const newToyData = {
      name: name,
      image: image,
      likes: 0 // Initial likes value
    };

    // Send a POST request to add the new toy
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToyData)
    })
    .then(response => response.json())
    .then(data => {
      // If the POST request is successful, add the new toy to the DOM
      const card = createToyCard(data);
      toyCollection.appendChild(card);
    })
    .catch(error => {
      console.error('Error adding new toy:', error);
    });
  });

  // Function to create a toy card element
  function createToyCard(toyData) {
    const card = document.createElement('div');
    card.className = 'card';

    // Create child elements for the toy card
    const nameElement = document.createElement('h2');
    nameElement.textContent = toyData.name;

    const imageElement = document.createElement('img');
    imageElement.src = toyData.image;
    imageElement.alt = toyData.name;
    imageElement.className = 'toy-avatar';

    const likesElement = document.createElement('p');
    likesElement.textContent = `${toyData.likes} Likes`;

    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.textContent = 'Like ❤️';

    // Add event listener to the like button
    likeButton.addEventListener("click", () => {
      // Increment the likes count when the button is clicked
      toyData.likes++;
      likesElement.textContent = `${toyData.likes} Likes`;

      // Update the likes count in the database using a PATCH request
      fetch(`http://localhost:3000/toys/${toyData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: toyData.likes }),
      });
    });

    // Append child elements to the toy card
    card.appendChild(nameElement);
    card.appendChild(imageElement);
    card.appendChild(likesElement);
    card.appendChild(likeButton);

    return card;
  }
});


