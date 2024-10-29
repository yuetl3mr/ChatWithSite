// Chat script
const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
var userMessage;
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const showTypingEffect = (text, textElement) => {
    const words = text.split(' ');
    let currIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currIndex === 0 ? '' : ' ') + words[currIndex++];

        if (currIndex === words.length) {
            clearInterval(typingInterval);
        }
    }, 75);
}

const showLoadingAnimation = () => {
    const html = `
        <div class="message-content">
            <p class="text"></p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>
    `;

    const incomingMessageDiv = createMessageElement(html, "incoming");
    chatList.appendChild(incomingMessageDiv);
    handleIncomingChat(incomingMessageDiv);
}

const handleOutgoingChat = () => {
    if (!userMessage) return;
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
    try {
        const response = await fetch('/response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userMessage }),
        });

        if (!response.ok) {
            throw new Error('Error');
        }

        const data = await response.json();
        
        showTypingEffect(data.kwargs.content, textElement);
        console.log(data);
        console.log(data.kwargs.content);
    } catch (error) {
        console.error(error);
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
}

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