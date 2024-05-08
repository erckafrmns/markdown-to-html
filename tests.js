// CFG rules for Markdown to HTML conversion
const rules = {
    // Headings
    Heading1: (text) => `<h1>${text}</h1>`,
    Heading2: (text) => `<h2>${text}</h2>`,
    Heading3: (text) => `<h3>${text}</h3>`,
    Heading4: (text) => `<h4>${text}</h4>`,
    Heading5: (text) => `<h5>${text}</h5>`,
    Heading6: (text) => `<h6>${text}</h6>`,

    // Paragraphs
    Paragraph: (text) => `<p>${text}</p>`,

    // Line Break
    LineBreak: () => `<br>`,

    // Emphasis
    Bold: (text) => `<strong>${text}</strong>`,
    Italic: (text) => `<em>${text}</em>`,
    BoldItalic: (text) => `<strong><em>${text}</em></strong>`
};

// Tokenization function to split Markdown content into tokens
function tokenize(markdown) {
    // Split Markdown content into lines
    const lines = markdown.split('\n');
    // Tokenize each line based on Markdown syntax
    const tokens = [];
    lines.forEach(line => {
        if (line.trim() !== '') {
            tokens.push(line); // Push the entire line as a token
        }
    });
    return tokens;
}

// Parsing function for headings
function parseHeading(token) {
    const level = token.match(/^#+/)[0].length; // Extract heading level
    const text = token.replace(/^#+/, '').trim(); // Extract heading text
    return rules[`Heading${level}`](text); // Apply the corresponding rule
}

// Parsing function for paragraphs
function parseParagraph(token) {
    return rules['Paragraph'](token.trim()); // Apply the paragraph rule
}

// Parsing function for line breaks
function parseLineBreak(token) {
    return rules['LineBreak'](); // Apply the line break rule
}

// Parsing function for bold emphasis
function parseBold(token) {
    let html = '';
    let insideBold = false;

    for (let i = 0; i < token.length; i++) {
        if (token[i] === '*' && token[i + 1] === '*' && !insideBold) {
            insideBold = true;
            html += rules['Bold']('');
            i++; // Skip the next '*' character
        } else if (token[i] === '*' && token[i + 1] === '*' && insideBold) {
            insideBold = false;
            html += rules['Bold']('');
            i++; // Skip the next '*' character
        } else {
            html += token[i];
        }
    }

    return html;
}

// Parsing function for italic emphasis
function parseItalic(token) {
    let html = '';
    let insideItalic = false;

    for (let i = 0; i < token.length; i++) {
        if (token[i] === '*' && !insideItalic) {
            insideItalic = true;
            html += rules['Italic']('');
        } else if (token[i] === '*' && insideItalic) {
            insideItalic = false;
            html += rules['Italic']('');
        } else {
            html += token[i];
        }
    }

    return html;
}

// Parsing function for bolditalic emphasis
function parseBoldItalic(token) {
    let html = '';
    let insideBoldItalic = false;

    for (let i = 0; i < token.length; i++) {
        if (token[i] === '*' && token[i + 1] === '*' && token[i + 2] === '*' && !insideBoldItalic) {
            insideBoldItalic = true;
            html += rules['BoldItalic']('');
            i += 2; // Skip the next two '*' characters
        } else if (token[i] === '*' && token[i + 1] === '*' && token[i + 2] === '*' && insideBoldItalic) {
            insideBoldItalic = false;
            html += rules['BoldItalic']('');
            i += 2; // Skip the next two '*' characters
        } else {
            html += token[i];
        }
    }

    return html;
}


// Parsing function for Markdown content
function parseMarkdown(markdown) {
    const tokens = tokenize(markdown); // Tokenize Markdown content
    let html = ''; // Initialize HTML output
    tokens.forEach(token => {
        if (token.match(/^#+/)) {
            html += parseHeading(token) + '\n'; // Parse heading
        // } else if (token.endsWith('  ')) {
        //     html += rules['LineBreak'](); // Parse line break
        // } else if (token.includes('**')) {
        //     html += parseBold(token) + '\n';
        // } else if (token.includes('*')) {
        //     html += parseItalic(token) + '\n';
        // } else if (token.includes('***')) {
        //     html += parseBoldItalic(token) + '\n';
        } else {
            html += parseParagraph(token) + '\n'; // Parse paragraph
            if (token.endsWith('  ')) {
                html += rules['LineBreak'](); // Parse line break
            }
        }
    });
    return html;
}

// Example Markdown content
const markdown = `
# Heading 1

This is a paragraph.

## Heading 2

Another paragraph.
### Heading 3
##### Heading 5
This is a statement with  
linebreak
**Bold text**
*Italic*
***Bold Italic***
`;

// Parse Markdown content and print HTML output
const htmlOutput = parseMarkdown(markdown);
console.log(htmlOutput);
