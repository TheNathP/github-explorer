import { formatDate, timeAgo } from './utils.js';

const elements = {
  globalStatus: document.querySelector('.global-status'),
  usersListContainer: document.querySelector('.users-list-container'),
  
  profileContent: document.querySelector('.profile-content'),
  profilePlaceholder: document.querySelector('.profile-placeholder'),
  profileHeader: document.querySelector('.profile-header'),
  reposList: document.querySelector('.repos-list'),

  commitsContent: document.querySelector('.commits-content'),
  commitsPlaceholder: document.querySelector('.commits-placeholder'),
  commitsList: document.querySelector('.commits-list'),
  commitsRepoTitle: document.querySelector('.commits-repo-title'),
};

export const resetUI = () => {
  elements.profileContent.classList.add('hidden');
  elements.profilePlaceholder.classList.remove('hidden');

  elements.profilePlaceholder.textContent = 'Sélectionnez un utilisateur pour voir les détails.';

  elements.commitsContent.classList.add('hidden');
  elements.commitsPlaceholder.classList.remove('hidden');
};


// ----- Loading -----
const loadingHtml = '<img src="./src/assets/images/loading.gif" alt="loading" class="loading-gif" />';

export const showUsersLoading = () => {
  elements.usersListContainer.innerHTML = `<div class="loading-text">${loadingHtml} Loading users...</div>`;
};

export const showProfileLoading = () => {
  elements.profileContent.classList.add('hidden');
  
  elements.profilePlaceholder.innerHTML = `<div class="loading-text">${loadingHtml} Loading user details...</div>`;
  elements.profilePlaceholder.classList.remove('hidden');

  elements.commitsContent.classList.add('hidden');
  elements.commitsPlaceholder.classList.remove('hidden');
};

export const showCommitsLoading = () => {
  elements.commitsList.innerHTML = `<li class="commit-item"><div class="loading-text">${loadingHtml} Loading commits...</div></li>`;
  elements.commitsContent.classList.remove('hidden');
  elements.commitsPlaceholder.classList.add('hidden');
};

// ----- Liste Users -----
export const renderUserList = (users) => {
  elements.usersListContainer.innerHTML = '';

  if (!users || users.length === 0) {
    elements.usersListContainer.innerHTML = '<div class="placeholder-text">Aucun utilisateur trouvé.</div>';
    return;
  }

  const ul = document.createElement('div');
  
  users.forEach((user) => {
    const div = document.createElement('div');
    div.className = 'user-item';
    div.dataset.username = user.login; // Pour le click
    div.innerHTML = `
      <img src="${user.avatar_url}" alt="avatar" />
      <div class="user-info">
        <span class="user-login">${user.login}</span>
        <span class="user-id">ID: ${user.id}</span>
      </div>
    `;
    ul.appendChild(div);
  });

  elements.usersListContainer.appendChild(ul);
};

export const setActiveUser = (username) => {
  document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));

  const activeEl = document.querySelector(`.user-item[data-username="${username}"]`);
  if (activeEl) activeEl.classList.add('active');
};

// ----- Details User -----
export const renderProfile = (user, repos) => {
  elements.profilePlaceholder.classList.add('hidden');
  elements.profileContent.classList.remove('hidden');
  
  elements.commitsContent.classList.add('hidden');
  elements.commitsPlaceholder.classList.remove('hidden');

  elements.profileHeader.innerHTML = `
    <div class="profile-header-content">
      <img src="${user.avatar_url}" class="profile-pic-lg" />
      <div class="profile-names">
        <h2>${user.name || user.login}</h2>
        <p>@${user.login}</p>
        <p>📍 ${user.location || 'Unknown location'}</p>
        <div class="profile-bio">${user.bio || ''}</div>
      </div>
    </div>
  `;

  elements.reposList.innerHTML = '';
  if (repos.length === 0) {
    elements.reposList.innerHTML = '<li>No public repositories found.</li>';
    return;
  }

  repos.forEach(repo => {
    const li = document.createElement('li');
    li.className = 'repo-item';
    li.dataset.repo = repo.name;
    li.dataset.owner = user.login;
    li.innerHTML = `
      <span class="repo-name">${repo.name}</span>
      <span class="repo-date">Updated ${formatDate(repo.updated_at)}</span>
    `;
    elements.reposList.appendChild(li);
  });
};

export const setActiveRepo = (repoName) => {
  document.querySelectorAll('.repo-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.querySelector(`.repo-item[data-repo="${repoName}"]`);
  if (activeEl) activeEl.classList.add('active');
};

// ----- Commits -----
export const renderCommits = (repoName, commits) => {
  elements.commitsContent.classList.remove('hidden');
  elements.commitsPlaceholder.classList.add('hidden');
  elements.commitsRepoTitle.textContent = `Commits: ${repoName}`;
  elements.commitsList.innerHTML = '';

  if (!commits || commits.length === 0) {
    elements.commitsList.innerHTML = '<li>No commits found.</li>';
    return;
  }

  commits.forEach((item) => {
    const dateObj = item.commit.author.date;
    const relativeTime = timeAgo(dateObj);
    const absoluteDate = formatDate(dateObj);
    
    const fullDateString = `${relativeTime} (${absoluteDate})`;

    const li = document.createElement('li');
    li.className = 'commit-item';
    li.innerHTML = `
      <span class="commit-msg">${item.commit.message}</span>
      <span class="commit-meta">
        ${item.commit.author.name} • ${fullDateString}
      </span>
    `;
    elements.commitsList.appendChild(li);
  });
};