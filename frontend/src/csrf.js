async function getCSRFToken() {
  console.log('Fetching CSRF token...');
  const response = await fetch('http://localhost:8000/get-csrf-token/');
  const data = await response.json();
  return data.csrfToken;
}

export default getCSRFToken;
