"use strict";

// Get the current user's username from the hidden input
var currentUser = document.getElementById("currentUser").value;
console.log("Current user:", currentUser);

/// Function to display user status updates in the user list
function displayUserStatus(userStatuses, allUsers) {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    allUsers.forEach(user => {
        const listItem = document.createElement("li");
        listItem.textContent = user;
        
        // Check if the user is in the userStatuses array
        const userStatus = userStatuses.find(status => status.userId === user);
        if (userStatus) {
            // User is online
            listItem.innerHTML += ` <span class="bullet ${userStatus.status === 0 ? 'green' : 'red'}"></span>`;
        } else {
            // User is offline
            listItem.innerHTML += ` <span class="bullet red"></span>`;
        }
        
        userList.appendChild(listItem);
    });
}

// Create a connection to the SignalR hub for user status updates
var userStatusConnection = new signalR.HubConnectionBuilder()
    .withUrl("/userStatusHub")
    .build();

// Start the connection for user status updates
userStatusConnection.start()
    .then(() => {
        console.log("User Status SignalR Connected.");
    })
    .catch(err => console.error("User Status SignalR Connection Error:", err.toString()));

// Listen for user status updates from the server
userStatusConnection.on("UpdateUserStatus", (userStatuses, allUsers) => {
    console.log("Received user status update:", userStatuses);
    console.log("All users:", allUsers);
    
    displayUserStatus(userStatuses, allUsers);
});



// Create a connection to the SignalR hub for sending and receiving messages
var chatConnection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

// Start the connection for sending and receiving messages
chatConnection.start()
    .then(() => {
        console.log("Chat SignalR Connected.");
    })
    .catch(err => console.error("Chat SignalR Connection Error:", err.toString()));

// Receive message from the server
chatConnection.on("ReceiveMessage", function (username, message) {
    console.log("Received message from server:", username, message);

    // Get the current time
    var now = new Date();
    var time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create a container for the message
    var messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    // Determine if the message is sent by the current user or not
    var isCurrentUser = username === currentUser; // Use the currentUser variable

    // Add appropriate classes to the container based on the sender
    if (isCurrentUser) {
        messageContainer.classList.add("sent");
    } else {
        messageContainer.classList.add("received");
    }

    // Create the message content
    var messageContent = `
        <div class="message-content"><strong>${username}</strong> <span class="message-time">${time}</span></div>
        <div class="message-content">${message}</div>
    `;

    // Set the message content
    messageContainer.innerHTML = messageContent;

    // Append the message container to the chat box
    document.getElementById("chatBox").appendChild(messageContainer);

    // Optionally, scroll to the bottom of the chat box
    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
});

// Function to send a message to the server
function sendMessage() {
    // Get user input from the input field
    var message = document.getElementById("messageInput").value;

    // Invoke the SendMessage method on the server
    chatConnection.invoke("SendMessage", currentUser, message)
        .catch(function (err) {
            return console.error(err.toString());
        });

    // Clear the input field after sending the message
    document.getElementById("messageInput").value = "";
}

// Event listener for the "Send" button click
document.getElementById("sendButton").addEventListener("click", function () {
    sendMessage(); // Call the sendMessage function when the button is clicked
});
