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
    const clearFilterbtn = document.getElementById('filterReset');
    const successMessage = document.getElementById('successMessage');
    const directorSelect = document.getElementById('directorSelect');
    const body = document.getElementById("moviesTableBody");

    function handleMovieSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('movieTitle');
        const director = document.getElementById('movieDirector');
        const budget = document.getElementById('movieBudget');
        const boxOffice = document.getElementById('movieBoxOffice');
        const description = document.getElementById('movieDescription');
        const year = document.getElementById('movieYear');
        const actorName = document.getElementById('actor-name');
        const actorRole = document.getElementById('actor-role');

        const isTitleValid = validateTitle(title)
        const isYearValid = validateYear(year)
        const isDescriptionValid = validateDescription(description)
        const isDirectorValid = validateDirector(director)
        const isBudgetValid = validateBudget(budget)
        const isActorValid = validateActor(actorName)
        const isRoleValid = validateRole(actorRole)

        if (isTitleValid && isYearValid
            && isDescriptionValid && isDirectorValid && isBudgetValid
            && isActorValid && isRoleValid) {

            const newMovie = {
                id: Date.now().toString(),
                title: title.value,
                description: description.value,
                year: parseInt(year.value),
                boxOffice: boxOffice.value,
                director: director.value,
                budget: budget.value,
                actors: [{name: actorName.value, role: actorRole.value}]
            }
            postMovie(newMovie)
        } else {
            successMessage.style.display = 'none';
        }
    }
    let moviesData = [];
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
        if (director.value.length >= DIRECTORMIN) {
            director.classList.remove('is-invalid');
            return true;
        } else {
            director.classList.add('is-invalid');
            return false;
        }
    }

    function validateBudget(budget) {
        let budgetFloat = parseFloat(budget.value)
        if (budgetFloat >= BUDGETMIN && budgetFloat <= BUDGETMAX) {
            budget.classList.remove('is-invalid');
            return true;
        } else {
            budget.classList.add('is-invalid');
            return false;
        }
    }

    function validateActor(leadActor) {
        if (leadActor.value.length > ACTORCHARMIN && leadActor.value.split(' ').length <= ACTORWORDMIN) {
            leadActor.classList.remove('is-invalid');
            return true;
        } else {
            leadActor.classList.add('is-invalid');
            return false;
        }
    }

    function validateRole(role) {
        if (role.value.length >= ROLEMIN) {
            role.classList.remove('is-invalid');
            return true;
        } else {
            role.classList.add('is-invalid');
            return false;
        }
    }

    let uniqueDirectors = [];

    function populateDirectorsDropdown(){
        directorSelect.innerHTML = '<option value="default"> Show All Directors</option>';
        moviesData.forEach((movie) => {
            populateDirectorsDropdown(movie);
        })
    }
    function populateDirectorDropdown(movie){
        for (const director of uniqueDirectors) {
            if (movie.director === director) {
                return;
            }
        }
        uniqueDirectors.push(movie.director);
        directorSelect.innerHTML += `<option value="${movie.director}"> ${movie.director} </option>`;
    }
    directorSelect.addEventListener('change', () => {
        const currentDirector = directorSelect.value;
        const filteredMovies = moviesData.filter((movie) => (movie.director === currentDirector));
        if (currentDirector === "default") {
            displayMovies()
        } else {
            body.innerHTML = ''
            filteredMovies.forEach(movie => {
                displayMovie(movie);
            })
        }
    });

    clearFilterbtn.addEventListener('reset', () =>{
        directorSelect.value = 'default';
    })


    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}/movies`;
    async function postMovie(movie){
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const postedMovie = await response.json();
            moviesData.push(postedMovie);
            displayMovie(postedMovie);
            populateDirectorDropdown(postedMovie);
            successMessage.style.display = 'block';
            movieForm.reset();
        } catch (error) {

        }
    }
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
            populateDirectorsDropdown()

        } catch (error) {

        }
    }
    function displayMovie(movie) {
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
    }

    function displayMovies() {
        body.innerHTML = '';
        moviesData.forEach((movie) => displayMovie(movie));}

    fetchMovies();
});
