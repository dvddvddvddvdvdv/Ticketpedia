import { pb } from './pocketbase';

// Check if a user is currently authenticated
if (pb.authStore.isValid && pb.authStore.model) {
    // Get the current user's model data
    const user = pb.authStore.model;

    // Find the elements in your top nav
    const usernameEl = document.querySelector('#navUsername');
    const emailEl = document.querySelector('#navEmail');

    // Update them with the real database values
    if (usernameEl) {
        usernameEl.textContent = user.username || 'User';
    }
    if (emailEl) {
        emailEl.textContent = user.email || '';
    }
} else {
    // If no one is logged in, redirect them back to the login page
    window.location.href = '../login.html';
}