async function getCSRFToken() {
  try {
    console.log('Fetching CSRF token...');
    
    // Attempt to fetch the CSRF token
    const response = await fetch('http://localhost:8000/get-csrf-token/', {
      method: 'GET',
      credentials: 'include', // Add this line
    });

    if (!response.ok) {
      // Handle the case where the response is not OK (e.g., network error)
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    
    if (data.csrfToken) {
      // If the CSRF token is present in the response, return it
      return data.csrfToken;
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching CSRF token:', error);
  }

  // Fallback to parsing document.cookie
  const cookies = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;
  }, {});

  console.log('CSRF token from cookies:', cookies.csrftoken);

  return cookies.csrftoken;
}

export default getCSRFToken;

