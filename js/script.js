// taking DOM elements
var elSearchForm = $_('.js-search-form');
var elSearchTitleInput = $_('.js-search-form__title-input', elSearchForm);
var elRatingInput = $_('.js-search-form__rating-input', elSearchForm);
var elGenreSelect = $_('.js-search-form__genre-select', elSearchForm);
var elSortSelect = $_('.js-search-form__sort-select', elSearchForm);
var elSearchResult = $_('.js-search-results');

var elMovieTemplate = $_('#movie-template').content;


var normalizedMovies = movies.map(function (movie) {
    return {
        title: movie.Title.toString(),
        year: movie.movie_year,
        categories: movie.Categories.split('|'),
        summary: movie.summary,
        rating: movie.imdb_rating,
        runtime: movie.runtime,
        language: movie.language,
        // link: getYouTubeVideoLink(movie.ytid),
        // youtubeBigImgPoster: getYouTubeBigImgPoster(movie.ytid),
        // youtubeSmallImgPoster: getYouTubeSmallImgPoster(movie.ytid)
    }
});


var renderResults = function (elResults, searchRegex) {
    var elResultsFragment = document.createDocumentFragment();

    elSearchResult.innerHTML = '';

    elResults.forEach((movie) => {
        var elMovie = elMovieTemplate.cloneNode(true);
        $_('.movie__poster', elMovie).src = movie.youtubeSmallImgPoster;

        if (searchRegex.source === '(?:)') {
            $_('.movie__title', elMovie).textContent = movie.title;
        } else {
            $_('.movie__title', elMovie).innerHTML = movie.title.replace(searchRegex, `<mark class="bg-warning px-0">${movie.title.match(searchRegex)}</mark>`);
        }

        $_('.movie__year', elMovie).textContent = movie.year;
        $_('.movie__rating', elMovie).textContent = movie.rating;
        $_('.movie__runtime', elMovie).textContent = `${movie.runtime} min`;
        $_('.movie__language', elMovie).textContent = movie.language;
        $_('.movie__trailer-link', elMovie).href = movie.link;

        elResultsFragment.appendChild(elMovie)
    });

    elSearchResult.appendChild(elResultsFragment);
};

//SORT 
var sortObjectsAZ = function (array) {
    return array.sort(function (a, b) {
        if (a.title > b.title) {
            return 1;
        } else if (a.title < b.title) {
            return -1;
        }
        return 0;
    });
};

var sortObjectsRating = function (array) {
    return array.sort(function (a, b) {
        if (a.imdbRating > b.imdbRating) {
            return -1;
        } else if (a.imdbRating < b.imdbRating) {
            return 1;
        }
        return 0;
    });
}

var sortObjectsYear = function (array) {
    return array.sort(function (a, b) {
        if (a.year > b.year) {
            return -1;
        } else if (a.year < b.year) {
            return 1;
        }
        return 0;
    });
}

var sortSearchResults = function (results, sortType) {
    // TODO - create sorting function that accepts array of objects and sorting property
    if (sortType === 'az') {
        return sortObjectsAZ(results);
    } else if (sortType === 'za') {
        return sortObjectsAZ(results).reverse();
    } else if (sortType === 'rating_desc') {
        return sortObjectsRating(results)
    } else if (sortType === 'rating_asc') {
        return sortObjectsRating(results).reverse();
    } else if (sortType === 'year_desc') {
        return sortObjectsYear(results)
    } else if (sortType === 'year_asc') {
        return sortObjectsYear(results).reverse();
    }
};

// FIND A NAME

var findMovie = function (title, minRating, genre) {

    return normalizedMovies.filter((movie) => {

        var doesMatchCategory = genre === 'All' || movie.categories.includes(genre);

        return movie.title.match(title) && movie.rating >= minRating && doesMatchCategory;
    })
};

// finding the movie by title 
elSearchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    var movieTitle = elSearchTitleInput.value.trim()
    var movieRegexTitle = new RegExp(movieTitle, 'gi')
    var minimumRating = Number(elRatingInput.value);
    var movieGenres = elGenreSelect.value;
    var sorting = elSortSelect.value;

    var elResults = findMovie(movieRegexTitle, minimumRating, movieGenres);
    var result = sortSearchResults(elResults, sorting);

    renderResults(elResults, movieRegexTitle);
})

// creating the genre selection func
var createGenreSelectOption = function () {

    var movieCategories = [];

    normalizedMovies.forEach(function (movie) {
        movie.categories.forEach(function (category) {
            if (!movieCategories.includes(category)) {
                movieCategories.push(category)
            }
        });
    });

    movieCategories.sort();

    var elOptionsFragment = document.createDocumentFragment();

    movieCategories.forEach(function (category) {
        var optionsElement = createElementFunc('option', '', category)
        optionsElement.value = category;

        elOptionsFragment.appendChild(optionsElement);
    });

    elGenreSelect.appendChild(elOptionsFragment);
};
createGenreSelectOption();

