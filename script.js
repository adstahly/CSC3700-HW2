
    document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();

    const toggleFormButton = document.getElementById('toggleFormButton');
    toggleFormButton.addEventListener('click', displayAddMovieForm);

    const movieForm = document.getElementById('addMovieForm');
    movieForm.addEventListener('submit', handleMovieSubmit);

    const addActorBtn = document.getElementById('addActorBtn');
    addActorBtn.addEventListener('click', handleAddActor);

    const successMessage = document.getElementById('successMessage');
    const successActor = document.getElementById('successActor');

    function handleMovieSubmit(e) {
    e.preventDefault();
    handleAddActor()
    createMovie();
    displayMovies();
    successActor.style.display = 'none';
    successMessage.style.display = 'block';
    movieForm.reset();
    actors = [];
}

    function displayAddMovieForm() {
    const toggleFormButton = document.getElementById('toggleFormButton');
    const addMovieDiv = document.getElementById('add-movie-div');
    if (addMovieDiv.style.display === 'none' || addMovieDiv.style.display === ``) {
    addMovieDiv.style.display = 'block';
    toggleFormButton.textContent = 'Hide Form';
} else {
    addMovieDiv.style.display = 'none';
    successMessage.style.display = 'none';
    successActor.style.display = 'none';
    toggleFormButton.textContent = 'Add Sample Movie';
}
}

    function handleAddActor() {
    const actorName = document.getElementById('actor-name');
    const actorRole = document.getElementById('actor-role');
    const name = actorName.value;
    const role = actorRole.value;

    if (name && role) {
    actors.push({name: name, role: role});
    actorName.value = '';
    actorRole.value = '';
    successActor.style.backgroundColor = '#4CAF50';
    successActor.textContent = 'Actor Successfully Added';
} else {
    successActor.style.backgroundColor = '#f44336';
    successActor.textContent = `Please Enter a Name and Role.`;
}
    successActor.style.display = 'block';
}
});

    let moviesData = [];
    let actors = []

    function createMovie() {
    const id = document.getElementById('movieId').value;
    const title = document.getElementById('movieTitle').value;
    const director = document.getElementById('movieDirector').value;
    const budget = document.getElementById('movieBudget').value;
    const boxOffice = document.getElementById('movieBoxOffice').value;
    const description = document.getElementById('movieDescription').value;
    const year = parseInt(document.getElementById('movieYear').value);
    if (!validateId(id)) {
    successMessage.style.display = 'block';
    successMessage.style.backgroundColor = '#f44336';
    successMessage.textContent = `Error: ID ${id} already in use.`;
    return;
}
    const newMovie = {
    id: id,
    title: title,
    description: description,
    year: year,
    boxOffice: boxOffice,
    director: director,
    budget: budget,
    actors: actors,
}
    moviesData.push(newMovie);
    console.log(moviesData);
}

    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}/movies`;

    function validateId(id) {
    for (const movie of moviesData) {
    if (movie.id === id) {
    return false;
}
}
    return true;
}

    async function fetchMovies() {
    try {
    const response = await fetch(BASE_URL);
    console.log('Response Status', response.status);
    console.log(`Response Ok`, response.ok);
    if (!response.ok) {
    throw new Error(`Http Error Status ${response.status}`);
}
    const data = await response.json();
    console.log("DATA ->", data);
    moviesData = data;
    displayMovies()
} catch (error) {
    console.log("Error Fetching Movies ->", error);
}
}

    function displayMovies() {
    let body = document.getElementById("moviesTableBody");
    moviesData.forEach(function (movie) {

    const div = document.createElement("div");
    div.classList.add("card", "mt-3");
    div.innerHTML = `
            <h5 class="card-header">${movie.title} (${movie.year})</h5>
                <div class="card-body">
                    <p class="card-title">${movie.description} </p>
                    <p class="card-text"><strong>Box Office:</strong> ${movie.boxOffice} </p>
                    <button class="btn btn-primary btn-sm view-details-btn">
                        View Details
                    </button>
                </div>`;

    const detailsButton = div.querySelector('.view-details-btn');
    detailsButton.addEventListener('click', () => {
    sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
    window.location.href = `movie_details.html`;
});
    body.appendChild(div);
});
}
