document.addEventListener('DOMContentLoaded', () => {


    const toggleFormButton = document.getElementById('toggleFormButton');
    toggleFormButton.addEventListener('click', displayAddMovieForm);

    const movieForm = document.getElementById('addMovieForm');
    movieForm.addEventListener('submit', handleMovieSubmit);

    const successMessage = document.getElementById('successMessage');

    function handleMovieSubmit(e) {
        e.preventDefault();
        createMovie();
        displayMovies();
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
            toggleFormButton.textContent = 'Add Sample Movie';
        }
    }


    let moviesData = [];

    function createMovie() {
        let actors = [];
        const title = document.getElementById('movieTitle').value;
        const director = document.getElementById('movieDirector').value;
        const budget = document.getElementById('movieBudget').value;
        const boxOffice = document.getElementById('movieBoxOffice').value;
        const description = document.getElementById('movieDescription').value;
        const year = parseInt(document.getElementById('movieYear').value);
        const actorName = document.getElementById('actor-name').value;
        const actorRole = document.getElementById('actor-role').value;
        if (actorName && actorRole) {
            actors.push({name: actorName, role: actorRole});
            actorName.value = '';
            actorRole.value = '';
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


    async function fetchMovies() {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error(`Http Error Status ${response.status}`);
            }
            moviesData = await response.json();
            displayMovies()
        } catch (error) {

        }
    }

    function displayMovies() {
        let body = document.getElementById("moviesTableBody");

        moviesData.forEach((movie) => {
            const tr = document.createElement("tr");
            tr.classList.add("card", "mt-3");
            tr.innerHTML = `
            <td>${movie.title}</td> 
            <td>${movie.director}</td> 
            <td>${movie.year}</td> 
            <td>${movie.boxOffice}</td>   
            <td>${movie.actors.name[0]}</td>     
            <td>
            <button class="btn btn-primary btn-sm view-details-btn">
                        View Details
                    </button>
                    
</td>
            
            
            (${movie.year})</h5>
                <div class="card-body">
                    <p class="card-title">${movie.description} </p>
                    <p class="card-text"><strong>Box Office:</strong> ${movie.boxOffice} </p>
                    <button class="btn btn-primary btn-sm view-details-btn">
                        View Details
                    </button>
                </div>`;

            const detailsButton = tr.querySelector('.view-details-btn');
            detailsButton.addEventListener('click', () => {
                sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
                window.location.href = `movie_details.html`;
            });
            body.appendChild(tr);
        });
    }

    fetchMovies();
});
