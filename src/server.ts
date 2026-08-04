import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Automatically load your login_page.html when visiting the root URL
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../login_page.html'));
});

// --- IN-MEMORY MOCK DATABASE ---
const usersDB = [
    { username: 'panca_admin', email: 'test@example.com', password: 'password123' }
];

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

app.post('/api/register', (req: Request, res: Response): void => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'All fields are required.' });
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        return;
    }

    // Check if user already exists
    const userExists = usersDB.find(u => u.email === email || u.username === username);
    if (userExists) {
        res.status(400).json({ success: false, message: 'Username or Email already taken.' });
        return;
    }

    // Save the new user to our database array
    usersDB.push({ username, email, password });

    res.status(200).json({ success: true, message: 'Registration successful!' });
});

// 2. LOGIN ENDPOINT
app.post('/api/login', (req: Request, res: Response): void => {
    const loginIdentifier = req.body.email || req.body.username;
    const password = req.body.password;

    if (!loginIdentifier || !password) {
        res.status(400).json({ success: false, message: 'Username/Email and password are required.' });
        return;
    }

    // Search our array for a matching user
    const foundUser = usersDB.find(u => 
        (u.email === loginIdentifier || u.username === loginIdentifier) && 
        u.password === password
    );

    if (foundUser) {
        res.status(200).json({ success: true, message: 'Login successful!', token: 'mock-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
    }
});

// 3. GOOGLE LOGIN MOCK
app.post('/api/auth/google', (req: Request, res: Response): void => {
    res.status(200).json({ success: true, message: 'Google login successful!', token: 'mock-google-token' });
});

app.listen(PORT, () => {
    console.log(`🚀 TicketPedia Server is running on http://localhost:${PORT}`);
});