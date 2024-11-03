// Chat script
const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const submitButton = typingForm.querySelector("button[type='submit']");
var userMessage;
var fileContent = "";

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const showTypingEffect = async (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currIndex = 0;

    const typingInterval = await setInterval(() => {
        textElement.innerText += (currIndex === 0 ? '' : ' ') + words[currIndex++];

        if (currIndex === words.length) {
            clearInterval(typingInterval);
        }
    }, 75);
}

const showLoadingAnimation = () => {
    const html = `
        <div class="message-content">
            <form class="note-form">
                <input type="hidden" name="noteContent" value=""/>
                <p class="text"></p>
            </form>
            <div class="loading-indicator">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    `;

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);
    handleIncomingChat(incomingMessageDiv);
}

const handleNoteFormSubmission = (noteContent) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/note/create", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                showSuccessAlert("Note saved successfully.");
                console.log("Note saved successfully.");
            } else {
                console.error("Error saving note:", xhr.statusText);
            }
        }
    };

    const data = JSON.stringify({ noteContent });
    xhr.send(data);
};

const handleOutgoingChat = () => {
    if (!userMessage) return;
    scrollToBottom();
    // Disable submit button to prevent further submissions
    submitButton.disabled = true;

    const html = `
        <div class="message-content">
            <p class="text">${userMessage}</p>
        </div>
    `;
    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    chatList.appendChild(outgoingMessageDiv);
    setTimeout(showLoadingAnimation, 500);
    typingForm.reset();
}


const handleIncomingChat = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");
    const dataset = Array.from(sourceList.children).map(li => li.dataset);
    const urls = [];
    dataset.forEach(item => {
        if (item.url) {
            urls.push(item.url);
        }
    });

    console.log(fileContent);

    try {
        const response = await fetch('/response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userMessage, urls: urls, content: fileContent }),
        });

        if (!response.ok) {
            throw new Error('Error');
        }

        const data = await response.json();
        scrollToBottom();
        showTypingEffect(data.content, textElement, incomingMessageDiv);

        const hiddenInput = incomingMessageDiv.querySelector('input[name="noteContent"]');
        hiddenInput.value = data.content;

        const saveButton = document.createElement("button");
        saveButton.innerText = "Save to Note";
        saveButton.classList.add("save-button");

        saveButton.addEventListener("click", (event) => {
            event.preventDefault();
            handleNoteFormSubmission(data.content);
        });

        textElement.insertAdjacentElement('afterend', saveButton);
    } catch (error) {
        console.error(error);
    } finally {
        incomingMessageDiv.classList.remove("loading");
        submitButton.disabled = false;
    }
};

typingForm.addEventListener("submit", (e) => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    e.preventDefault();
    handleOutgoingChat();
})

// Sidebar expand
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.toggle');
const content = document.querySelector('.content');
const header = document.querySelector('.header');

toggle.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    if (sidebar.classList.contains('close')) {
        content.style.marginLeft = '0px';
        // header.style.paddingLeft = '0px';
    } else {
        content.style.marginLeft = '250px';
        // header.style.paddingLeft = '400px';
    }
});

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

// Delete source item

const addForm = document.querySelector('.add-form');
const sourceList = document.querySelector('.source-list ul');

function addSource(event) {
    event.preventDefault();
    const input = document.querySelector('.add-input');
    const newSourceURL = input.value.trim();

    if (newSourceURL) {
        const li = document.createElement('li');
        li.dataset.url = newSourceURL;
        li.innerHTML = `
            <span class="source-text">${newSourceURL}</span> 
            <button class="delete-button">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        sourceList.appendChild(li);
        input.value = '';
        updateEmptyState();

        li.querySelector('.delete-button').addEventListener('click', () => {
            li.remove();
            updateEmptyState();
        });
    }
}

const fileInput = document.querySelector('#source-file');
fileInput.addEventListener('change', () => {
    const uploadedFiles = fileInput.files;

    if (uploadedFiles.length > 0) {
        for (let i = 0; i < uploadedFiles.length; i++) {
            const uploadedFile = uploadedFiles[i];
            const li = document.createElement('li');
            li.dataset.file = uploadedFile.name; 
            li.innerHTML = `
                <span class="source-text">File: ${uploadedFile.name}</span> 
                <button class="delete-button">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;
            sourceList.appendChild(li);

            // Create a FileReader to read the content of the file
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result; // Get the content of the file
                fileContent += content; // Append the content to the string
            };
            reader.readAsText(uploadedFile); // Read the file as text

            li.querySelector('.delete-button').addEventListener('click', () => {
                li.remove();
                updateEmptyState();
            });
        }
        fileInput.value = ''; // Clear input after handling files
        updateEmptyState();
    }
});


addForm.addEventListener('submit', addSource);

function updateEmptyState() {
    if (sourceList.children.length === 0) {
        sourceList.parentElement.classList.add('empty');
    } else {
        sourceList.parentElement.classList.remove('empty');
    }
}

updateEmptyState();

// Show Alert

// End Show Alert 