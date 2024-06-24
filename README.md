# SvelteKit Hotel Search

Een SvelteKit-tool waarmee je hotels kunt zoeken via de Google Hotels API. Dit is mijn eerste project met SvelteKit. Met deze tool kun je hotels zoeken in elke stad, plaats of land. Je kunt de resultaten sorteren op verschillende manieren en filteren op allerlei opties.

## Inhoud

- [Inleiding](#inleiding)
- [Doel van het Project](#doel-van-het-project)
- [Installatie](#installatie)
- [Gebruik](#gebruik)


## Inleiding

Deze tool maakt gebruik van SvelteKit en de Google Hotels API om dynamische zoekopdrachten naar hotels uit te voeren. Gebruikers kunnen zoeken naar hotels in elke stad, plaats of land, en de resultaten sorteren en filteren op verschillende criteria. Het project toont foto's, beoordelingen, het aantal reviews, en biedt een link naar de website van het hotel voor verdere informatie.

## Doel van het Project

Het doel van dit project was om mijn front-end vaardigheden te demonstreren door middel van dynamische data-ophalen uit een API en deze te tonen. Daarnaast wilde ik SvelteKit leren gebruiken. 

## Installatie

Volg deze stappen om het project lokaal te installeren:

```bash
# Clone de repository
git clone https://github.com/jouwgebruikersnaam/sveltekit-hotel-finder.git

# Navigeer naar de projectmap
cd sveltekit-hotel-finder

# Installeer de vereisten
npm install

# Start de ontwikkelserver
npm run dev
```
## Gebruik

Het project bestaat uit 1 page pagina en een server.js waarmee de API requests maakt. Hieronder volgt een korte uitleg van hoe de data wordt opgehaald en weergegeven.

### Ophalen van Data:

- De API-aanroepen worden afgehandeld in `routes/api/hotels/+server.js`.
```javascript
import axios from 'axios';

export async function GET({ url }) {
    const location = url.searchParams.get('location');
    const checkInDate = url.searchParams.get('checkInDate') || '2024-08-26';
    const checkOutDate = url.searchParams.get('checkOutDate') || '2024-08-28';
    const guests = url.searchParams.get('guests') || '2';
    const sortBy = url.searchParams.get('sort_by') || '';
    const currency = url.searchParams.get('currency') || 'EUR';
    const amenities = url.searchParams.get('amenities') || '';
    const pageToken = url.searchParams.get('pageToken');
    const apiKey = import.meta.env.VITE_SERPAPI_KEY;
  
    if (!location) {
      return new Response(JSON.stringify({ error: 'Location parameter is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  
    const params = {
      engine: 'google_hotels',
      q: `hotels in ${location}`,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      adults: guests,
      sort_by: sortBy,
      currency: currency,
      amenities: amenities,
      api_key: apiKey,
      num: 20 
    };
  
    if (pageToken) {
      params.next_page_token = pageToken;
    }
  
    try {
      const response = await axios.get('https://serpapi.com/search', { params });
      console.log('Response from SerpApi:', response.data);
  
      const { properties, serpapi_pagination } = response.data;
      const nextPageToken = serpapi_pagination?.next_page_token || null;
      const currentFrom = serpapi_pagination?.current_from || null;
      const currentTo = serpapi_pagination?.current_to || null;
  
      return new Response(JSON.stringify({ properties, nextPageToken, currentFrom, currentTo }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error fetching data from SerpApi:', error.response?.data || error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
```
- De data wordt vervolgens doorgestuurd naar de frontend en weergegeven in `+page.svelte`.
```svelte
async function loadProperties(pageToken = null) {
		try {
			const params = new URLSearchParams({
				location,
				checkInDate,
				checkOutDate,
				guests,
				sort_by: sortBy,
				currency,
				amenities: selectedAmenities.join(',')
			});
			if (pageToken) {
				params.append('pageToken', pageToken);
			}
			const response = await fetch(`/api/hotels?${params.toString()}`);
			if (response.ok) {
				const data = await response.json();
				console.log('API response data:', data); // Debugging line
				jsonResponse = data; // Store the entire response data
				properties = data.properties || []; // Extract the properties array from the response
				nextPageToken = data.nextPageToken || null;
				currentFrom = data.currentFrom || null;
				currentTo = data.currentTo || null;
			} else {
				const errorResponse = await response.json();
				error = errorResponse.error || 'Failed to load properties';
				console.error('Failed to load properties:', error);
			}
		} catch (err) {
			console.error('Error in loadProperties:', err);
			error = 'An error occurred while loading properties';
		} finally {
			showAmenitiesDropdown = false;
		}
	}
```

### Zoeken naar Hotels:

- Voer een stad, plaats of land in de zoekbalk in en klik op zoeken.
- Gebruik de filters en sorteermogelijkheden om de resultaten verder aan te passen.

### Resultaten Weergeven:

- De resultaten worden weergegeven met een slideshow van foto's, beoordelingen, het aantal reviews, en een link naar de website van het hotel.

## Hoe Ik Dit Heb Gedaan

Als eerste ben ik begonnen bij de [Svelte course van Laracasts](https://laracasts.com/series/svelte-crash-course). Hier heb ik snel wat van de basis geleerd en ben toen snel doorgegaan naar het stuk over de API's. Ik heb geleerd hoe je met SvelteKit een externe API kan fetchen.

Aanvankelijk probeerde ik de API van Booking.com te gebruiken, maar dat vereiste een partnerschap dat niet meer toegankelijk was. Vervolgens heb ik de API van [Amadeus](https://developers.amadeus.com/) geprobeerd, maar hun versie met foto's werkte niet meer. Uiteindelijk heb ik de [SerpApi](https://serpapi.com/) gevonden om de Google Hotels API te gebruiken, wat perfect werkte en een veel hotels en filters aan bood.
