const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsBox = document.getElementById('results');
// the search run when the button is clicked

searchBtn.addEventListener('click', handleSearch);

//the search will also run if Enter is pressed
searchInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter') handleSearch();

});

// clear will empties the input and the results

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    resultsBox.innerHTML = '';
});

async function handleSearch() {
    // the search is made case-insensitive
    const query = searchInput.value.trim().toLowerCase();
    
    if (query === '') {
        resultsBox.innerHTML = '<p class="no-result">Please enter a destination or keyword.</p>';
        return;   
    }
    resultsBox.innerHTML = '<p class="no-result">Searching…</p>';

    try {
        //load from data.json
        const response = await fetch('data.json');
        if(!response.ok) throw new Error('Could not load data from data');
        const destinations = await response.json();

        // keep destinations whose city, country or query is in the description
        const matches = destinations.filter(dest =>
            dest.city.toLowerCase().includes(query) ||
            dest.country.toLowerCase().includes(query) ||
            dest.description.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            resultsBox.innerHTML = '<p class="no-result">No destination found. Try another search.</p>';
            return;
        }

        // build one card per destination found
        resultsBox.innerHTML = '';
        matches.forEach(element => {
            resultsBox.appendChild(createDestinationCard(element));
        });

    } catch (error) {
        resultsBox.innerHTML = '<p class="no-result">Error while loading data.</p>';
        console.error(error);
    }
}

function createDestinationCard(dest) {
    const card = document.createElement('article');
    card.className = 'result-card';
    
    // creating the card
    card.innerHTML = `
        <div class = "card-div">
        <div>
        <p class = "local-time">Current local time: <span class="time-value">Loading…</span></p>
        
        </div>
        <img src = "${dest['image-link']}" alt = "${dest.city}" id = "image-in-card">
        <h2>${dest.city}, ${dest.country}</h2>
        <p>${dest.description}</p>
        </div>
    `;

    // HTTPS request to get the current time in the city
    // using worldtimeapi.org

    fetch(`https://worldtimeapi.org/api/timezone/${dest.timezone}`)
        .then(response => response.json())
        .then(data => {
            // data.datetime splitting to get the hour and minute
            const hoursMinutes = data.datetime.slice(11, 16);
            const timeValue =card.querySelector('.time-value');
            timeValue.textContent = `${hoursMinutes} (UTC${data.utc_offset})`;
        })
        .catch(() => {
            card.querySelector('.time-value').textContent = 'unavailable';
        });
    return card;
}


console.log('Travel Bloom script v3 loaded');