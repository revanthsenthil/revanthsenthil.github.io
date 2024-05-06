document.addEventListener('DOMContentLoaded', function() {
    const phrases = ["robotics researcher", "basketball and formula 1 fan"];
    const typingText = document.querySelector('.typing-text');
    let currentPhrase = [];
    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;

    const filterButtons = document.querySelectorAll('.filter-button');
    const papers = document.querySelectorAll('.paper');
    const presentations = document.querySelectorAll('.presentation');

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const keyword = this.getAttribute('data-keyword');
            this.classList.toggle('active');

            const activeKeywords = Array.from(filterButtons)
                .filter(btn => btn.classList.contains('active'))
                .map(btn => btn.getAttribute('data-keyword'));

            filterItems(papers, activeKeywords);
            filterItems(presentations, activeKeywords);
        });
    });

    function filterItems(items, keywords) {
        items.forEach(item => {
            const itemKeywords = item.getAttribute('data-keywords').split(' ');
            if (keywords.some(keyword => itemKeywords.includes(keyword)) || keywords.length === 0) {
                item.style.display = ''; // Show item
            } else {
                item.style.display = 'none'; // Hide item
            }
        });
    }

    function type() {
        if (isDeleting) {
            // Remove a letter
            currentPhrase.pop();
            letterIndex--;
            typingSpeed = 30;
        } else {
            // Add a letter
            currentPhrase.push(phrases[phraseIndex][letterIndex]);
            letterIndex++;
        }

        // Update the text on the website
        typingText.textContent = currentPhrase.join('') + '|';

        if (!isDeleting && letterIndex === phrases[phraseIndex].length) {
            // Pause at the end of a phrase
            setTimeout(() => { isDeleting = true; }, 1000);
        } else if (isDeleting && letterIndex === 0) {
            // Move to the next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before starting the new phrase
        }

        setTimeout(type, isDeleting ? 100 : typingSpeed);
    }

    // Start the typing effect
    type();

});


document.querySelectorAll('.blog-post').forEach(post => {
    post.addEventListener('click', function() {
        window.location.href = this.getAttribute('data-href');
    });
});


document.querySelectorAll('.project').forEach(post => {
    post.addEventListener('click', function(event) {
        event.stopPropagation();
        window.location.href = this.getAttribute('data-href');
    });
});