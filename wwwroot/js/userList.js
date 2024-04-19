"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/userStatusHub")
    .build();

connection.start()
    .then(() => {
        console.log("SignalR connected.");
    })
    .catch(err => console.error(err.toString()));

connection.on("UpdateUserStatus", (userStatuses) => {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    userStatuses.forEach(userStatus => {
        const listItem = document.createElement("li");
        listItem.textContent = userStatus.UserId;
        listItem.classList.add(userStatus.Status === "Online" ? "list-group-item-success" : "list-group-item-secondary");
        userList.appendChild(listItem);
    });
});
