const GITHUB_API_BASE = 'https://api.github.com';

const request = async (endpoint) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// ----- requete recherche -----
export const searchUsers = async (query) => {
  const data = await request(`/search/users?q=${encodeURIComponent(query)}`);
  return data;
};

// ----- requete details utilisateur -----
export const getUserDetails = async (username) => {
  return request(`/users/${username}`);
};

// ----- requete repos -----
export const getUserRepos = async (username) => {
  return request(`/users/${username}/repos?sort=updated&per_page=100`);
};

// ----- requete commits -----
export const getRepoCommits = async (username, repo) => {
  return request(`/repos/${username}/${repo}/commits`);
};