const searchBtn = document.getElementById('searchBtn')
const searchInpt = document.getElementById('searchInput')

let cachedMovies = JSON.parse(localStorage.getItem('movies'))
let movieArr = []

searchBtn.addEventListener('click', handleSearch)

document.addEventListener('DOMContentLoaded', function(){
    if(movieArr.length < 1 && cachedMovies) {
        movieArr = cachedMovies
        renderMovies()
    }
})

async function handleSearch() {
    const apiKey = '4378420d'
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInpt.value}`)
    const data = await res.json()

    if (data.Response === 'True') {
        const movies = data.Search
        movieArr.length = 0
        for (const movie of movies) {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`);
            const data = await res.json();
            movieArr.push(data)
        }
        console.log(movieArr)
    } else {
        console.log("No movies found.")
    }
    if(movieArr.length > 0) {
        localStorage.setItem('movies', JSON.stringify(movieArr))
    }
    renderMovies()
}

function renderMovies() {

    const movieCards = movieArr.map((movie) => {
        return `
        <article class="card">
                <img src="${movie.Poster}" alt="Official movie poster of ${movie.Title}" class="card-img">
                <div class="card-content">
                    <h2 class="card-title">
                        ${movie.Title}
                        <span class="rating">
                            <img src="/img/star.svg" alt="Star Icon"> <span aria-label="Rated ${movie.imdbRating} out of 10">${movie.imdbRating}</span>
                        </span>
                    </h2>
                    <p class="card-details">
                        <span aria-label="Runtime: ${movie.Runtime} minutes">${movie.Runtime} min</span> &bull;
                        <span aria-label="Genres: ${movie.Genre}">${movie.Genre}</span>
                    </p>
                    <p class="card-description truncated-text">
                        ${movie.Plot}
                    </p>
                    <button class="watchlist-btn" data-id="${movie.imdbID}" aria-label="Add ${movie.Title} to your watchlist">
                        <img src="/img/plus.svg" alt="Watchlist Icon">
                        Watchlist
                    </button>
                </div>
            </article>
            `
    }).join('')
    document.getElementById('movieGrid').innerHTML = movieCards
}

function addToWatchlist(e) {
    if (e.target.matches(".watchlist-btn")) {
        const imdbID = e.target.dataset.id;
        const movie = movieArr.find(m => m.imdbID === imdbID);

        if (movie) {
            const stored = localStorage.getItem("watchlist");
            const watchlist = stored ? JSON.parse(stored) : [];

            const index = watchlist.findIndex(m => m.imdbID === movie.imdbID);

            if (index === -1) {
                watchlist.push(movie);
                e.target.textContent = "Remove from Watchlist";
                console.log(`Added "${movie.Title}" to watchlist`);
            } else {
                watchlist.splice(index, 1);
                e.target.textContent = "Add to Watchlist";
                console.log(`Removed "${movie.Title}" from watchlist`);
            }

            localStorage.setItem("watchlist", JSON.stringify(watchlist));
        }
    }
}


document.getElementById("movieGrid").addEventListener("click", addToWatchlist)