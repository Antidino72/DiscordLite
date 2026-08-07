const socket = io();
let username = "DD"
socket.on('connect', () => {
    socket.emit('login', {
        username: username,
        user_id: socket.id,
    });
});

const button = document.getElementById('send');
const messagebox = document.getElementById('messagebox');
const message_input = document.getElementById('message_input');
const message_div = document.getElementById('infobox');
let typingTimeout;
button.addEventListener('click', function(e){
    e.preventDefault();

    const message = {
        username : username,
        message : message_input.value
    }
    if (message.message !== ""){
        socket.emit('message_input', message);
        message_input.value = '';
        clearTimeout(typingTimeout);
        message_div.textContent = "";
    }else {
        alert("Please enter a message!")
    }
})
message_input.addEventListener('input', function(e){
    socket.emit("typing",{
        username: username,
    })
})

socket.on('typing',function (json){


    if (json.socket_id === socket.id) return
    message_div.textContent = json.username +" is typing..."

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        message_div.textContent = "";
    }, 2000);

})
socket.on("message_received",function (text){
    console.log(text.user_id);

        const li = document.createElement('li');

        if (text.user_id === socket.id){
            li.className = "message_send"
            console.log("it's your message");
        }else {
            li.className = "message_received"
        }
        li.textContent = text.username+" : "+text.message;
        messagebox.appendChild(li)

});
