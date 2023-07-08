
// Chat
var user_name = 'Anonymous'
var user_photo = 'default_chat.jpg'

var username = document.getElementById('access_name').dataset.userName;
var userphoto = document.getElementById('access_photo').dataset.userPhoto;
if (username != undefined) {
    user_name = username.split(" ")[0];
}
if (userphoto != undefined) {
    user_photo = userphoto;
}

/////////////////////////////////////////////////////////////
const socket = io();
// const messages = document.getElementById('messages-area');
// const msgForm = document.getElementById('msgForm');

// const messages = document.getElementById('messages');
var messages = $('.messages-content');
const msgForm = document.getElementById('msgForm');

$(window).on('load', function () {
    socket.on('output-messages', data => {
        if (data.length) {
            data.forEach(message => {
                appendMessages(message.name, message.photo, message.msg)
            });
        }
    })
    messages.mCustomScrollbar();
});

socket.on('message', data => {
    appendMessages(data)
})

/////////////////////////////////////////////////////////////


// socket.on('output-messages', data => {
//     if (data.length) {
//         data.forEach(message => {
//             appendMessages(message.name, message.photo, message.msg)
//         });
//     }
// })

function updateScrollbar() {
    messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}
// var d, h, m, s;
// function setDate() {
//     d = new Date()
//     if (m != d.getMinutes()) {
//         m = d.getMinutes();
//         $('<div class="timestamp">' + d.getHours() + ':' + m + ':' + d.getSeconds() + '</div>').appendTo($('.message:last'));
//     }
// }

function insertMessage(msg) {
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container'));
    // setDate();
    $('.message-input').val(null);
    updateScrollbar();
}
$('.message-submit').click(function () {
    const message = msgForm.value.trim();
    if(message == '')return;
    const data = {
        name: user_name,
        photo: user_photo,
        message: message,
    }
    socket.emit('chatmessage', data);
    insertMessage(message);
});

$(window).on('keydown', function (e) {
    const message = msgForm.value.trim();
    if(message == '')return;
    if (e.which == 13) {
        const data = {
            name: user_name,
            photo: user_photo,
            message: message,
        }
        socket.emit('chatmessage', data)
        insertMessage(message);
        return false;
    }
})
// 💥
// socket.on('chatmessage', message => {
//     appendMessages(message.name, message.photo, message.message);
// });

function appendMessages(user_name, user_photo, message) {
    // if ($('.message-input').val() != '') {
    //     return false;
    // }

    $(`<div class="message new"><figure class="avatar"><img src="/img/users/${user_photo}"/></figure><span class="user-name">${user_name}: </span>` + message + '</div>').appendTo($('.mCSB_container'));
    // setDate();
    updateScrollbar();
}



const chat = document.querySelector('.chat');
const chatBtn = document.querySelector('.chat-btn');

chatBtn.addEventListener('click', () => {
    chat.classList.toggle('hidden');
    if (chat.classList.contains('hidden')) {
        chatBtn.innerHTML = '<i class="fa fa-comments"></i>';
    } else {
        chatBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
    }
})

// 💥 Emoji functionality -

const emojiBtn = document.querySelector('#emoji-btn');
// // const picker = new EmojiButton();

const picker = new EmojiButton({
    // referenceElement: emojiBtn,
    // triggerElement: emojiBtn,
    // autoHide: false,

    // position: 'auto',
    position: 'bottom-start',
    emojisPerRow: 6,
    rows: 5,
    showPreview: false,
    theme: 'auto',
    rootElement: chat,
    styleProperties: {
    }
});
picker.on('emoji', emoji => {
    document.querySelector('.message-input').value += emoji;
});

emojiBtn.addEventListener('click', () => picker.togglePicker(emojiBtn));
