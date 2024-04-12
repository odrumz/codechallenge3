
let url = "http://localhost:3000/films/";
let ulFilms = document.getElementById("films");
let idBuyticket = document.getElementById("buy-ticket");

let movieImg = document.getElementById("poster");
let idTitle = document.getElementById("title");
let idRuntime = document.getElementById("runtime");
let idFilmInfo = document.getElementById("film-info");
let idShowtime = document.getElementById("showtime");
let idTicketnum = document.getElementById("ticket-num");

function grabMovie() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            ulFilms.innerHTML = "";
            data.forEach(movie => {
                addMovie(movie);
            });
        })
        .catch(error => console.error("Error fetching movies:", error));
}

grabMovie();

function addMovie(movie) {
    let remaining = movie.capacity - movie.tickets_sold;

    let liFilm = document.createElement("li");
    liFilm.textContent = movie.title;
    if (remaining <= 0) {
        liFilm.className = "sold-out";
    }

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', () => {
        deleteMovie(movie);
    });
    liFilm.appendChild(deleteButton);

    ulFilms.appendChild(liFilm);

    liFilm.addEventListener('click', () => {
        updateDom(movie);
    });

    if (movie.id === "1") {
        updateDom(movie);
    }
}

function updateDom(movie) {
    let remaining = movie.capacity - movie.tickets_sold;
    let availability = remaining > 0 ? "Buy Ticket" : "Sold out";

    movieImg.src = movie.poster;
    movieImg.alt = movie.title;
    idTitle.innerText = movie.title;
    idRuntime.innerText = movie.runtime + " minutes";
    idFilmInfo.innerText = movie.description;
    idShowtime.innerText = movie.showtime;
    idTicketnum.innerText = remaining;

    idBuyticket.onclick = () => {
        if (remaining > 0) {
            buyTicket(movie);
        } else {
            console.log("You cannot buy tickets");
        }
    };

    idBuyticket.dataset.movieId = movie.id;
    let button = document.querySelector(`[data-movie-id="${movie.id}"]`);
    if (button) {
        button.innerText = availability;
    }
}

function buyTicket(movie) {
    movie.tickets_sold++;
    let ticketsSold = movie.tickets_sold;
    let requestHeaders = {
        "Content-Type": "application/json"
    };
    let requestBody = {
        "tickets_sold": ticketsSold
    };
    fetch(url + movie.id, {
        method: "PATCH",
        headers: requestHeaders,
        body: JSON.stringify(requestBody)
    })
        .then(res => res.json())
        .then(data => {
            updateDom(data);
            let numberOfTickets = data.capacity - data.tickets_sold;

            if (numberOfTickets <= 0) {
                grabMovie();
            }

            let requestBodyTickets = {
                "film_id": data.id,
                "number_of_tickets": numberOfTickets
            };

            fetch("http://localhost:3000/tickets", {
                method: "POST",
                headers: requestHeaders,
                body: JSON.stringify(requestBodyTickets)
            })
                .then(res => res.json())
                .then(data => console.log("Ticket purchased:", data))
                .catch(error => console.error("Error purchasing ticket:", error));

        })
        .catch(error => console.error("Error buying ticket:", error));
}

function deleteMovie(movie) {
    let requestHeaders = {
        "Content-Type": "application/json"
    };
    let requestBody = {
        "id": movie.id
    };
    fetch(url + movie.id, {
        method: "DELETE",
        headers: requestHeaders,
        body: JSON.stringify(requestBody)
    })
        .then(res => res.json())
        .then(data => grabMovie())
        .catch(error => console.error("Error deleting movie:", error));
}
