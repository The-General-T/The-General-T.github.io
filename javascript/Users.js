export default class UserManager {
  constructor() {
    this.users = [
      { username: '1818', password: '9213', role: "Executive", isManager: true },
      { username: '7', password: '0258', role: "Manager", isManager: true },
      { username: '13', password: '0117', role: "Associate",isManager: false },
    ];
  }

  authenticate(username, password) {
    return this.users.find(u => u.username === username && u.password === password) || null;
  }
  getUser() {
    const loggedInUsername = localStorage.getItem("loggedInUser");
    if (!loggedInUsername) {
      return null; // No user logged in
    }
    return this.users.find(u => u.username === loggedInUsername) || null;
  }
  getManager() {
    return this.users.find(u => u.isManager) || null;
  }
  getRole(username) {
    const user = this.users.find(u => u.username === username);
    return user ? user.role : null;
  }
}
