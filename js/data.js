let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [
    { 
        email: 'islam@gg.com', 
        password: '12345', 
        username: 'islam', 
        firstName: 'Islam' 
    }
];
function saveRegisteredUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}
function saveCurrentUser(user) {
    currentUser = user; 
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}
function removeCurrentUser() {
    localStorage.removeItem('currentUser');
    if (typeof currentUser !== 'undefined') {
        currentUser = null;
    }
}
