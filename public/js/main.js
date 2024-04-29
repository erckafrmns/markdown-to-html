// Function to scroll to a section by its ID
function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to convert Markdown to HTML (placeholder function)
function convertMarkdownToHTML() {
    var markdownInput = document.getElementById('markdownInput').value;
    console.log(markdownInput); 
}

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
