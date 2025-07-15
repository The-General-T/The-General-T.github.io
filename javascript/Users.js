export default class UserManager {
  constructor() {
    this.users = [
      { username: '1818', password: '9213', role: "Executive", isManager: true },
      { username: '7', password: '0258', role: "Manager", isManager: true },
      { username: '13', password: '0117', role: "Associate", isManager: false },
    ];
  }



  /**
   * @function authenticate
   * @param {*} username 
   * @param {*} password 
   * @returns {Object|null} Returns the user object if authentication is successful, or null if not.
   */
  authenticate(username, password) {
    return this.users.find(u => u.username === username && u.password === password) || null;
  }

/** 
 * @function getUser
 * @description Retrieves the currently logged-in user based on the username stored in localStorage.
 * @returns {Object|null} The user object if found, or null if no user is logged in.
 * 
 * 
 * **/
  getUser() {
    const loggedInUsername = localStorage.getItem("loggedInUser");
    if (!loggedInUsername) {
      return null; // No user logged in
    }
    return this.users.find(u => u.username === loggedInUsername) || null;
  }


  /**
   * @function getManager
   * @description Retrieves the manager user from the list of users.
   * @returns {Object|null} The manager user object if found, or null if no manager exists.
   */
  getManager() {
    return this.users.find(u => u.isManager) || null;
  }


  /**
   * @function getRole
   * @param {*} username 
   * @returns {string|null} Returns the role of the user if found, or null if not.
   */
  getRole(username) {
    const user = this.users.find(u => u.username === username);
    return user ? user.role : null;
  }


}
