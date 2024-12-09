/** Generate HTML File */

class GenerateHTML {
    static generateFile(htmlContent, filename) {
        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Output</title>
</head>
<body>

${htmlContent}

</body>
</html>`;

        const blob = new Blob([htmlTemplate.trim()], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`HTML file "${filename}" has been generated successfully.`);
    }
}

window.GenerateHTML = GenerateHTML;
