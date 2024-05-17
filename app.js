import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import Tokenizer from "./public/js/tokenizer.js"; 
import Parser from "./public/js/parser.js";
import AstToHtml from "./public/js/astToHTML.js";
//import Generate from "./public/js/generate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Static files
app.use(express.static('public'));
app.use('/css', express.static(join(__dirname, 'public', 'css')));
app.use('/js', express.static(join(__dirname, 'public', 'js')));
app.use('/files', express.static(join(__dirname, 'public', 'files')));

// Serve HTML file
app.get('', (req, res) => {
    res.sendFile(join(__dirname, 'src', 'index.html'));
});

// Endpoint to convert Markdown to HTML
app.post('/convert', (req, res) => {
    const markdown = req.body.markdown;
    if (!markdown) {
        return res.status(400).send('Markdown input is required');
    }

    try {
        const tokens = Tokenizer.tokenize(markdown);
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const htmlNodes = AstToHtml.astToHTML(ast);
        res.send(htmlNodes);
    } catch (error) {
        res.status(500).send('Error converting Markdown to HTML');
    }
});

// Endpoint to handle file uploads and convert Markdown to HTML
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('File upload is required');
    }

    const filePath = req.file.path;
    fs.readFile(filePath, 'utf8', (err, markdown) => {
        if (err) {
            return res.status(500).send('Error reading the uploaded file');
        }

        try {
            const tokens = Tokenizer.tokenize(markdown);
            const parser = new Parser(tokens);
            const ast = parser.parse();
            const htmlNodes = AstToHtml.astToHTML(ast);
            res.send(htmlNodes);
        } catch (error) {
            res.status(500).send('Error converting Markdown to HTML');
        } finally {
            // Clean up the uploaded file
            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete uploaded file:', err);
            });
        }
    });
});

// Listen on port 
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
