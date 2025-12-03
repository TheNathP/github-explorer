import './style.css';
import * as api from './js/api.js';
import * as ui from './js/ui.js';

console.log('GitHub Explorer');


// ----- Recherche -----
const handleSearch = async (e) => {
  e.preventDefault();
  const query = document.querySelector('.search-input').value.trim();
  if (!query) return;

  ui.showUsersLoading();
  ui.resetUI();
  
  // --- Reset UI droite ---
  document.querySelector('.profile-content').classList.add('hidden');
  document.querySelector('.profile-placeholder').classList.remove('hidden');
  document.querySelector('.commits-content').classList.add('hidden');
  document.querySelector('.commits-placeholder').classList.remove('hidden');

  try {
    const result = await api.searchUsers(query);
    ui.renderUserList(result.items || []);
  } catch (error) {
    console.error(error);
    alert('Erreur lors de la recherche.');
  }
};

// ----- selection user -----
const handleUserClick = async (e) => {
  const card = e.target.closest('.user-item');
  if (!card) return;

  const username = card.dataset.username;
  
  ui.setActiveUser(username);
  ui.showProfileLoading();
  
  try {
    const [user, repos] = await Promise.all([
      api.getUserDetails(username),
      api.getUserRepos(username),
    ]);
    
    ui.renderProfile(user, repos);
  } catch (error) {
    console.error(error);
    alert(`Impossible de charger le profil de ${username}.`);
    ui.resetUI();
  }
};

// ----- selection repos -----
const handleRepoClick = async (e) => {
  const card = e.target.closest('.repo-item');
  if (!card) return;

  const repoName = card.dataset.repo;
  const owner = card.dataset.owner;

  ui.setActiveRepo(repoName);
  ui.showCommitsLoading();

  try {
    const commits = await api.getRepoCommits(owner, repoName);
    ui.renderCommits(repoName, commits);
  } catch (error) {
    console.error(error);
    alert(`Impossible de charger les commits du repo ${repoName}.`)
  } finally {
    card.querySelector('.repo-name').textContent = originalText;
  }
};

// ----- Event Listeners -----
document.querySelector('.search-form').addEventListener('submit', handleSearch);
document.querySelector('.users-list-container').addEventListener('click', handleUserClick);
document.querySelector('.repos-list').addEventListener('click', handleRepoClick);