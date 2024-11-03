let startX = 0, startY = 0;

document.querySelectorAll('.card').forEach(card => {
    const resizer = card.querySelector('.resizer');
    const closeButton = card.querySelector('.close-btn');

    card.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

        function mouseMove(e) {
            const newX = startX - e.clientX;
            const newY = startY - e.clientY;

            startX = e.clientX;
            startY = e.clientY;

            card.style.top = (card.offsetTop - newY) + 'px';
            card.style.left = (card.offsetLeft - newX) + 'px';
        }

        function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
        }
    });

    // Resize functionality
    resizer.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener('mousemove', resizeMouseMove);
        document.addEventListener('mouseup', resizeMouseUp);

        function resizeMouseMove(e) {
            const width = card.offsetWidth - (startX - e.clientX);
            const height = card.offsetHeight - (startY - e.clientY);
            
            if (width > 50) card.style.width = width + 'px';
            if (height > 50) card.style.height = height + 'px';
            
            startX = e.clientX;
            startY = e.clientY;
        }

        function resizeMouseUp() {
            document.removeEventListener('mousemove', resizeMouseMove);
        }
    });

    // Close button functionality
    closeButton.addEventListener('click', function() {
        card.remove(); // Remove the card from DOM
    });

});


const addNote = document.querySelector('.add-note-btn');
const noteContainer = document.querySelector('#card-container');

addNote.addEventListener("click", (e) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    
    cardDiv.innerHTML = `
        <div class="resizer"></div>
        <textarea class="note-content" oninput="updateNoteContent(this, note.id)">
        </textarea>
        <button class="close-btn">X</button>
    `;
    
    noteContainer.appendChild(cardDiv);
});


