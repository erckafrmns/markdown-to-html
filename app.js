import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

// Static files
app.use(express.static('public'));
app.use('/css', express.static(join(__dirname, 'public', 'css')));
app.use('/js', express.static(join(__dirname, 'public', 'js')));
app.use('/files', express.static(join(__dirname, 'public', 'files')));

// Serve HTML file
app.get('', (req, res) => {
    res.sendFile(join(__dirname, 'src', 'index.html'));
});

// Listen on port 
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
