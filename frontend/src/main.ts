import './style.css';
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="chat-container">
        <div class="chat-header">
            <h2>ChatApp</h2>
        </div>
        <div class="chat-messages" id="messages"></div>
        <div class="chat-form">
            <input type="text" id="message" placeholder="Type your message...">
            <button id="send">Send</button>
        </div>
    </div>
`;

(() => {
  const iotimer = window.setInterval(() => {console.log("checking for io");
    if (io) {
      console.log(io)
      window.clearInterval(iotimer);
      /////////////////////////////////////////////////////
      const socket = io("http://localhost:3000");

      // DOM elements
      const messageForm = document.querySelector('.chat-form');
      const messageInput = document.querySelector('#message');
      const messagesContainer = document.querySelector('#messages');
      const sendButton = document.querySelector('#send');
      // Add a message to the chat
      function appendMessage(message: string) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerText = message;
        //@ts-ignore
        messagesContainer.appendChild(messageElement);
        //@ts-ignore
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      // Handle form submission
      //@ts-ignore
      sendButton.addEventListener('click', (e) => {console.log("form submit",e);
        e.preventDefault();
        //@ts-ignore
        const message = messageInput!.value;console.log("message",message);
        if (message.trim()) {
          appendMessage(`You: ${message}`);
          socket.emit('chatMessage', message);
          //@ts-ignore
          messageInput.value = '';
        }
      });

      // Listen for messages from the server
      socket.on('message', (message: string) => {
        appendMessage(message);
      });
      ////////////////////////////////////////////////////
    }
  }, 1500);
})()