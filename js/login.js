
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginBtn');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'index.html';
        return;
    }
    if (loginButton) {
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value;
            const foundUser = registeredUsers.find(user => 
                user.email === emailInput && user.password === passwordInput
            );
            if (foundUser) {
                const userSession = { 
                    username: foundUser.username,
                    email: foundUser.email, 
                    isLoggedIn: true 
                };
                saveCurrentUser(userSession);
                window.location.href = 'index.html';
            } else {
        alert('فشل الدخول. البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});
}});