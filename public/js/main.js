document.getElementById('convertButton').addEventListener('click', convertMarkdownToHTML);
document.getElementById('fileInput').addEventListener('change', uploadMarkdownFile);

async function convertMarkdownToHTML() {
    const markdownInput = document.getElementById('markdownInput').value;

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown: markdownInput }),
        });

        if (response.ok) {
            const htmlOutput = await response.text();
            document.getElementById('HTMLOutput').value = htmlOutput;
        } else {
            console.error('Failed to convert Markdown to HTML:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function uploadMarkdownFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const markdownContent = await file.text(); // Extract content of the file
            document.getElementById('HTMLOutput').value = await response.text(); // Display HTML output
            document.getElementById('markdownInput').value = markdownContent; // Set Markdown input value
        } else {
            console.error('Failed to upload and convert Markdown file:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to scroll to a section by its ID
function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to convert Markdown to HTML (placeholder function)
// function convertMarkdownToHTML() {
//     var markdownInput = document.getElementById('markdownInput').value;
//     console.log(markdownInput);
// }

// Get the clear button element
const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", function() {
    const markdownInput = document.getElementById("markdownInput");

    markdownInput.value = "";

    markdownInput.dispatchEvent(new Event('input'));
});

const clearButton2 = document.getElementById("clearButton2");

clearButton2.addEventListener("click", function() {
    const HTMLOutput = document.getElementById("HTMLOutput");

    HTMLOutput.value = "";

    HTMLOutput.dispatchEvent(new Event('input'));
});


// Update line numbers on scroll
const markdownInput = document.getElementById("markdownInput");
const lineNumbers = document.getElementById("lineNumbers");

markdownInput.addEventListener("scroll", () => {
    lineNumbers.scrollTop = markdownInput.scrollTop;
});

const HTMLOutput = document.getElementById("HTMLOutput");
const lineNumbers2 = document.getElementById("lineNumbers2");

HTMLOutput.addEventListener("scroll", () => {
    lineNumbers2.scrollTop = HTMLOutput.scrollTop;
});

// Function to update line numbers for the first container
function updateLineNumbers() {
    const textarea = document.getElementById('markdownInput');
    const lineNumbers = document.getElementById('lineNumbers');

    const lines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// Function to update line numbers for the second container
function updateLineNumbers2() {
    const textarea = document.getElementById('HTMLOutput');
    const lineNumbers = document.getElementById('lineNumbers2');

    const lines = textarea.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// Event listener for input change
document.getElementById('markdownInput').addEventListener('input', updateLineNumbers);
document.getElementById('HTMLOutput').addEventListener('input', updateLineNumbers2);

updateLineNumbers();
updateLineNumbers2();

// Copy to clipboard function
const textarea = document.getElementById('HTMLOutput');
const button = document.querySelector('.copy-html');

function toggleButtonVisibility() {
    if (textarea.scrollTop === 0) {
        button.classList.remove('hidden');
    } else {
        button.classList.add('hidden');
    }
}
toggleButtonVisibility();
textarea.addEventListener('scroll', toggleButtonVisibility);

function copyToClipboard() {
    var text = textarea.value;
    navigator.clipboard.writeText(text)
        .then(function() {
            console.log('Text copied to clipboard successfully.');
        })
        .catch(function(err) {
            console.error('Could not copy text: ', err);
        });
}


const markdownTextarea = document.getElementById('markdownInput');
const markdownButton = document.querySelector('.copy-markdown');

markdownTextarea.addEventListener('scroll', toggleMarkdownButtonVisibility);

function toggleMarkdownButtonVisibility() {
    if (markdownTextarea.scrollTop === 0) {
        markdownButton.classList.remove('hidden');
    } else {
        markdownButton.classList.add('hidden');
    }
}

markdownButton.addEventListener('click', copyMarkdownToClipboard);

function copyMarkdownToClipboard() {
    var text = markdownTextarea.value;
    navigator.clipboard.writeText(text)
        .then(function() {
            console.log('Markdown text copied to clipboard successfully.');
        })
        .catch(function(err) {
            console.error('Could not copy Markdown text: ', err);
        });
}

// Back to top button
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    var scrollToTopButton = document.getElementById("scrollToTopButton");
    if (document.body.scrollTop > 2100 || document.documentElement.scrollTop > 2100) {
        scrollToTopButton.classList.add("show");
    } else {
        scrollToTopButton.classList.remove("show");
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Zoom on scroll
document.addEventListener("DOMContentLoaded", function() {
    const tables = document.querySelectorAll('.zoomable-table');

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScroll() {
        tables.forEach(table => {
            if (isInViewport(table)) {
                table.classList.add('zoomed');
            } else {
                table.classList.remove('zoomed');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
});
