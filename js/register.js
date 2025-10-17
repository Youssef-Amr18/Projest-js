document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('btn'); 
    if (registerButton) {
        registerButton.addEventListener('click', (event) => {
            event.preventDefault();
            const newFirstName = document.getElementById('first').value.trim();
            const newLastName = document.getElementById('last').value.trim();
            const newEmail = document.getElementById('userEmail').value.trim();
            const newPassword = document.getElementById('password').value; 
            if (!newFirstName || !newEmail || !newPassword) {
                alert('الرجاء ملء جميع الحقول المطلوبة (الاسم الأول، الإيميل، كلمة المرور).');
                return;
            }
            if (registeredUsers.some(user => user.email === newEmail)) {
                alert('فشل التسجيل. هذا البريد الإلكتروني مسجل بالفعل.');
                return;
            }
            const newUser = {
                username: newFirstName,
                email: newEmail,
                password: newPassword,
                firstName: newFirstName,
                lastName: newLastName
            };
            registeredUsers.push(newUser);
            saveRegisteredUsers();
            alert('Account Created Successfuly!');
            window.location.href = 'login.html';
        });
    }
});
