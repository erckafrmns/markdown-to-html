function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function convertMarkdownToHTML() {
    var markdownInput = document.getElementById('markdownInput').value;
    console.log(markdownInput);
}