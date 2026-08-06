import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        account: resolve(__dirname, 'pages/Account.html'),
        settings: resolve(__dirname, 'pages/Settings.html'),
        tickets: resolve(__dirname, 'pages/tickets.html')
      }
    }
  }
});