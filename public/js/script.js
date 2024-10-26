const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
var userMessage;
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const showLoadingAnimation = () => {
    const html = `
        <div class="message-content">
            <img src="images/ai.png" alt="" class="avatar">
            <p class="text"></p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>
    `;

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);
    handleIncomingChat(incomingMessageDiv);
}

const handleOutgoingChat = () => {
    if (!userMessage) return;
    const html = `
        <div class="message-content">
            <img src="images/avt.jpg" alt="" class="avatar">
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
        textElement.innerText = data.kwargs.content;
        console.log(data); 
        console.log(data.kwargs.content); 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
}

typingForm.addEventListener("submit", (e) => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    e.preventDefault();
    handleOutgoingChat();
})
