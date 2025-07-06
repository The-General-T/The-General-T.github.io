import UserManager from '../javascript/Users.js';

console.log('login.js loaded ✅');

const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userManager = new UserManager();

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const user = userManager.authenticate(username, password);

  if (user) {
  localStorage.setItem("loggedInUser", user.username); // Save username
  window.location.href = "generate.html";          // Redirect to transaction page
} else {
    alert('Invalid username or password');
    usernameInput.value = '';
    passwordInput.value = '';
  }
});
