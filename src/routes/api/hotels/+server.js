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