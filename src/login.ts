import { pb } from './pocketbase';

const form = document.querySelector('#loginForm') as HTMLFormElement;
const identityInput = document.querySelector('#identity') as HTMLInputElement;
const passwordInput = document.querySelector('#password') as HTMLInputElement;

form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identity = identityInput.value.trim();
    const password = passwordInput.value;

    try {
        // PocketBase allows logging in with either email or username in the first parameter
        await pb.collection('users').authWithPassword(identity, password);

        alert('Login Successful! Redirecting...');
        window.location.href = 'pages/dashboard.html';

    } catch (error: any) {
        console.error('Error logging in:', error);
        const errorMessage = error.data?.message || 'Invalid email/username or password.';
        alert('Error: ' + errorMessage);
    }
});