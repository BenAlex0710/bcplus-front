const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on("newMessage", message => {
    console.log("newMessage");
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.message,
        createdAt: moment(message.createdAt).format("h:mm a")
    });

    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

/* socket.on("locationMessage", message => {
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    });

    $messages.insertAdjacentHTML("beforeend", html);
}); */

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });

    document.querySelector("#sidebar").innerHTML = html;
});
socket.on("rejoin", (message) => {
    console.log(message);

    socket.emit("joinEvent", { username, room }, error => {
        if (error) {
            alert(error);
            location.href = "/";
        }
    });

    socket.emit("sendChatMessage", message, error => {
        // $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        } else {
            console.log("Message delivered!");
        }
    });
});

$messageForm.addEventListener("submit", e => {
    e.preventDefault();

    // $messageFormButton.setAttribute("disabled", "disabled");

    const message = {
        message: e.target.elements.message.value,
        type: '1'
    };
    console.log(message);

    socket.emit("sendChatMessage", message, error => {
        // $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        } else {
            console.log("Message delivered!");
        }
    });
});

/* $sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  } else {
    $sendLocationBtn.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition(position => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        error => {
          $sendLocationBtn.removeAttribute("disabled");
          if (!error) {
            console.log("Location shared!");
          }
        }
      );
    });
  }
}); */


// client-side
socket.on("connect", () => {
    $messageFormButton.removeAttribute("disabled");
    const html = Mustache.render(messageTemplate, {
        username: 'Connected',
        message: 'Sever Connected successfully.',
        createdAt: '---------'
    });
    $messages.insertAdjacentHTML("beforeend", html);

    socket.emit("join", { username, room }, error => {
        if (error) {
            alert(error);
            location.href = "/";
        }
    });

    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
    $messageFormButton.setAttribute("disabled", "disabled");
    const html = Mustache.render(messageTemplate, {
        username: 'Error!!',
        message: 'Sever disconnected',
        createdAt: '---------'
    });
    $messages.insertAdjacentHTML("beforeend", html);

    console.log(socket.id); // undefined
});

socket.emit("joinEvent", { username, room }, error => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});