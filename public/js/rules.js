// CFG rules for Markdown to HTML conversion
export const rules = {
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
    BoldItalic: (text) => `<strong><em>${text}</em></strong>`,

    // Blockquote
    Blockquote: (text) => `<blockquote>${text}</blockquote>`,
    MultipleBlockquote: (text) => `<blockquote>${text}</blockquote>`,
    NestedBlockquote: (text) => `<blockquote>${text}</blockquote>`,

    // Lists
    OrderedList: (items) => `<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`,
    UnorderedList: (items) => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`,

    // Code Blocks
    // CodeBlock: (code) => `<pre><code>${code}</code></pre>`,
    CodeBlock: (language, code) => `<pre><code class="${language}">${code}</code></pre>`,

    // Horizontal Rule
    HorizontalRule: () => `<hr>`,

    // Links
    Link: (text, url) => `<a href="${url}">${text}</a>`,

    // Images
    Image: (altText, imageUrl) => `<img src="${imageUrl}" alt="${altText}">`,

    // Linked Image
    LinkedImage: (altText, imageUrl, linkUrl) => `<a href="${linkUrl}"><img src="${imageUrl}" alt="${altText}"></a>`,

    // Escape Character
    EscapeCharacter: (char) => `${char}`,

    // Tables 
    Table: (headers, rows) => {
        const headerRow = `<tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`;
        const bodyRows = rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
        return `<table>${headerRow}${bodyRows}</table>`;
    },

    // Escaping Pipe Characters
    EscapedPipe: () => `&#124;`,

    // Fenced Code Blocks
    FencedCodeBlock: (code) => `<pre><code>${code}</code></pre>`,

    // Footnotes (to be implemented)
    FootnoteReference: (id) => `<sup><a href="#fn${id}" id="fnref${id}">${id}</a></sup>`,
    FootnoteDefinition: (id, text) => `<li id="fn${id}">${text}<a href="#fnref${id}">↩</a></li>`,

    // Heading IDs (to be implemented)
    HeadingWithID: (text, id) => `<h1 id="${id}">${text}</h1>`,

    // Linking to Heading IDs (to be implemented)
    AnchorLink: (text, id) => `<a href="#${id}">${text}</a>`,

    // Definition Lists (to be implemented)
    DefinitionList: (terms, definitions) => {
        let html = '<dl>';
        for (let i = 0; i < terms.length; i++) {
            html += `<dt>${terms[i]}</dt>`;
            html += `<dd>${definitions[i]}</dd>`;
        }
        html += '</dl>';
        return html;
    },

    // Strikethrough (to be implemented)
    Strikethrough: (text) => `<del>${text}</del>`,

    // Task Lists (to be implemented)
    TaskList: (items) => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`,

    // Emoji (to be implemented)
    Emoji: (code) => `<span class="emoji">${code}</span>`,

    // Highlight (to be implemented)
    Highlight: (text) => `<mark>${text}</mark>`,

    // Subscript (to be implemented)
    Subscript: (text) => `<sub>${text}</sub>`,

    // Superscript (to be implemented)
    Superscript: (text) => `<sup>${text}</sup>`

    // TO BE IMPLEMENTED AFTER --> Table with alignment
    // TO BE IMPLEMENTED AFTER --> Linking to Heading IDs
    // TO BE IMPLEMENTED AFTER --> Strikethrough
    // TO BE IMPLEMENTED AFTER --> Task Lists
    // TO BE IMPLEMENTED AFTER --> Emoji source from emojipedia
};