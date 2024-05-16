/**AST TO HTML */

class AstToHtml {
    
    static astToHTML(node) {
        let html = '';

        if (node.type === 'root') {
            node.children.forEach(child => {
                html += this.astToHTML(child);
            });

        } else if (node.type === 'header') {
            html += `<h${node.level} id="${node.id}">${node.value}</h${node.level}>`;

        } else if (node.type === 'blockquote') {
            html += '<blockquote>';
            node.children.forEach(child => {
                html += this.astToHTML(child);
            });
            html += '</blockquote>';

        } else if (node.type === 'ordered-list') {
            html += '<ol>';
            node.children.forEach(child => {
                html += this.astToHTML(child);
            });
            html += '</ol>';

        } else if (node.type === 'unordered-list') {
            html += '<ul>';
            node.children.forEach(child => {
                html += this.astToHTML(child);
            });
            html += '</ul>';

        } else if (node.type === 'list-item') {
            html += '<li>';
            if (node.children) {
                node.children.forEach(child => {
                    html += this.astToHTML(child);
                });
            }
            html += '</li>';

        } else if (node.type === 'paragraph') {
            html += '<p>';
            if (node.children) {
                node.children.forEach(child => {
                    html += this.astToHTML(child);
                });
            }
            html += '</p>';
            
        } else if (node.type === 'table') {
            html += '<table>';
            if (node.head.length > 0) {
                html += '<thead>';
                html += '<tr>';
                node.head.forEach(cell => {
                    html += `<th>${this.astToHTML(cell.content[0])}</th>`;
                });
                html += '</tr>';
                html += '</thead>';
            }
            if (node.rows.length > 0) {
                html += '<tbody>';
                node.rows.forEach(row => {
                    html += '<tr>';
                    row.cells.forEach(cell => {
                        html += `<td>${this.astToHTML(cell.content[0])}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</tbody>';
            }
            html += '</table>';
        
        } else if (node.type === 'codeblock') {
            html += `<pre><code>${node.value}</code></pre>`;
        
        } else if (node.type === 'tasklist') {
            html += '<ul>';
            node.children.forEach(child => {
                html += '<li>';
                html += `<input type="checkbox" ${child.state} disabled>`;
                html += child.content;
                html += '</li>';
            });
            html += '</ul>';

        } else if (node.type === 'horizontal-rule') {
            html += '<hr>';
        
        } else if (node.type === 'linebreak') {
            html += '<br>';

        } else if (node.type === 'boldItalic') {
            html += `<strong><em>${node.value}</em></strong>`;

        } else if (node.type === 'bold') {
            html += `<strong>${node.value}</strong>`;

        } else if (node.type === 'italic') {
            html += `<em>${node.value}</em>`;

        } else if (node.type === 'code') {
            html += `<code>${node.value}</code>`;

        } else if (node.type === 'url') {
            html += `<a href="${node.value}">${node.value}</a>`;

        } else if (node.type === 'link') {
            html += `<a href="${node.url}"${node.title ? ` title="${node.title}"` : ''}>${node.text}</a>`;

        } else if (node.type === 'image') {
            html += `<img src="${node.url}" alt="${node.alt}" title="${node.title}">`;

        } else if (node.type === 'linkedImage') {
            html += `<a href="${node.url}"><img src="${node.imgUrl}" alt="${node.altText}"${node.imgTitle ? ` title="${node.imgTitle}"` : ''}></a>`;

        } else if (node.type === 'strikethrough') {
            html += `<del>${node.value}</del>`;

        } else if (node.type === 'highlight') {
            html += `<mark>${node.value}</mark>`;

        } else if (node.type === 'subscript') {
            html += `<sub>${node.value}</sub>`;

        } else if (node.type === 'superscript') {
            html += `<sup>${node.value}</sup>`;

        } else {
            html += node.value;
        }

        return html;
    }
}

export default AstToHtml;
