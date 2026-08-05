import { pb } from './pocketbase';

const form = document.querySelector('form') as HTMLFormElement;
const usernameInput = document.querySelector('#username') as HTMLInputElement;
const passwordInput = document.querySelector('#password') as HTMLInputElement;

form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        // Since PocketBase requires email auth by default, we use the pattern we mapped, 
        // or you can log in directly if using the email field. 
        // If your login form uses the dummy email pattern from earlier, use `${username}@ticketpedia.test`.
        // If you logged in with email, adjust accordingly. Here we use the username-based dummy email:
        await pb.collection('users').authWithPassword(`${username}@ticketpedia.test`, password);

        console.log('Login successful!', pb.authStore.model);
        
        // Redirect to dashboard page
        window.location.href = 'pages/dashboard.html';
    } catch (error: any) {
        console.error('Login failed:', error);
        alert('Invalid username or password.');
    }
});