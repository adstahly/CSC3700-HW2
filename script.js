document.addEventListener('DOMContentLoaded', () => {
    const TITLELENGTH = 3;
    const YEARMIN = 1880;
    const DESCMIN = 10;
    const DESCMAX = 500;
    const DIRECTORMIN = 3;
    const BUDGETMIN = 1;
    const BUDGETMAX = 1000;
    const ACTORWORDMIN = 2;
    const ACTORCHARMIN = 3;
    const ROLEMIN = 3;
    const now = new Date();
    const currentYear = now.getFullYear();
    const movieForm = document.getElementById('addMovieForm');
    movieForm.addEventListener('submit', handleMovieSubmit);
    const successMessage = document.getElementById('successMessage');

    function handleMovieSubmit(e) {
        e.preventDefault();
        createMovie();
        displayMovies();
        successMessage.style.display = 'block';
        movieForm.reset();
    }


    let moviesData = [];
    function createMovie() {
        let actors = [];
        const title = document.getElementById('movieTitle');
        const director = document.getElementById('movieDirector');
        const budget = document.getElementById('movieBudget');
        const boxOffice = document.getElementById('movieBoxOffice');
        const description = document.getElementById('movieDescription');
        const year = document.getElementById('movieYear');
        const actorName = document.getElementById('actor-name');
        const actorRole = document.getElementById('actor-role');
        //if (validateTitle(title) && validateYear(year)
        //&& )
        validateTitle(title)
       validateYear(year);
       validateDescription(description);
       validateDirector(director);
       validateBudget(budget);
       validateLeadActor(actorName);
       validateRole(actorRole);
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
    }
    function validateTitle(title) {
        if (title.value.length < TITLELENGTH) {
            title.classList.add('is-invalid');
            return false;
        }
        else {
            title.classList.remove('is-invalid')
            return true;
        }

    }

    function displayCurrentYear(){
        let currentYearElement = document.getElementById('currentYear');
        currentYearElement.innerText = currentYear.toString();
    }

    function validateYear(year) {
        displayCurrentYear();
        if (parseInt(year.value) >= YEARMIN && parseInt(year.value) <= currentYear) {
            year.classList.remove('is-invalid');
            return true;
        }
        else {
            year.classList.add('is-invalid');
            return false;
        }
    }

    function validateDescription(description) {
        if (description.value.length <= DESCMAX && description.value.length >= DESCMIN) {
            description.classList.remove('is-invalid');
            return true;
        } else {
            description.classList.add('is-invalid');
            return false;
        }
    }

    function validateDirector(director) {
        if (director.value <= DIRECTORMIN) {
            director.classList.remove('is-invalid');
            return true;
        } else {
            director.classList.add('is-invalid');
            return false;
        }
    }

    //title.addEventListener("input", validateTitle);
    //year.addEventListener("input", validateYear);

    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}/movies`;
    async function deleteMovie(id) {
        if (!confirm("Are you sure to want to delete id=" + id)) {
            return;
        }
        const Delete_URL = `${BASE_URL}/${id}`;
        try {
            const response = await fetch(`${Delete_URL}`, {
                method: "DELETE"
            });
            await fetchMovies();
            if (!response.ok) {
                throw new Error(`Failed to delete. Server responded with status: ${response.status}`);
            }
            alert("Delete Successful.")
        }
        catch (error) {
            alert("Delete Not Work");
        }
    }


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
        body.innerHTML = '';
        moviesData.forEach((movie) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${movie.title}</td> 
            <td>${movie.director}</td>
            <td>${movie.year}</td> 
            <td>${movie.boxOffice}</td>   
            <td>${movie.actors[0].name}</td>     
            <td>
            <button class="btn btn-primary btn-sm view-details-btn">
                        View Details
                    </button>
            <button class="btn btn-danger btn-sm delete-details-btn">
            Delete </button> </td>`;


            const detailsButton = tr.querySelector('.view-details-btn');
            detailsButton.addEventListener('click', () => {
                sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
                window.location.href = `movie_details.html`;
            });
            const deleteButton = tr.querySelector('.delete-details-btn');
            deleteButton.addEventListener('click', () => {
                deleteMovie(movie.id);
            });
            body.appendChild(tr);
        });
    }

    fetchMovies();
});
