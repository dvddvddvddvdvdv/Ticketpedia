import { pb } from './pocketbase';

const form = document.querySelector('#registerForm') as HTMLFormElement;
const usernameInput = document.querySelector('#username') as HTMLInputElement;
const emailInput = document.querySelector('#email') as HTMLInputElement;
const passwordInput = document.querySelector('#password') as HTMLInputElement;

form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Check for spaces in username
    if (/\s/.test(username)) {
        alert('Error: Usernames cannot contain spaces.');
        return;
    }

    try {
        const data = {
            "username": username,
            "email": email,
            "emailVisibility": true,
            "password": password,
            "passwordConfirm": password
        };

        await pb.collection('users').create(data);

        await pb.collection('users').authWithPassword(email, password);

        alert('Registration Successful! Redirecting to dashboard...');
        window.location.href = 'pages/dashboard.html';

    } catch (error: any) {
        console.error('Error registering:', error);
        
        const fieldErrors = error.response?.data;
        console.log('Exact Field Errors:', fieldErrors);

        if (fieldErrors) {
            const firstErrorField = Object.keys(fieldErrors)[0];
            if (firstErrorField) {
            }
        }

        alert('Error: ');
    }
});