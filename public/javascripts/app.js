var Nickname = null
  , Chatbox = null
  , Inputbox = null
  , SendButton = null
  , socket = null;

var send = function() {
  var textvalue = Inputbox.val().trim();

    Inputbox.val('');

    if (textvalue.length == 0) {
      return true;
    }

    var msg = { who: Nickname, text: textvalue };

    socket.emit('chat send', msg);

    var msgdetail = $("<li class='me'><b>me</b>&nbsp;" + msg.text + "</li>");
    Chatbox.append(msgdetail);
};

$(function() {
  Chatbox = $("#chat");
  Inputbox = $("#text");
  SendButton = $("#send");

  Nickname = prompt("Nickname");

  Chatbox.append("<li class='me'><b>system</b>&nbsp;Chatting as " + Nickname + ".</li>");

  socket = io.connect('http://localhost');

  socket.on('connect', function() {
    socket.emit('register', Nickname);
  });

  socket.on('chat error', function(msg) {
    alert(msg);
  });

  socket.on('chat message', function(msg) {
    if (msg.who != Nickname) {
      Chatbox.append("<li><b>" + msg.who + "</b>&nbsp;" + msg.text + "</li>");
    }
  });

  SendButton.on('click', send);

  Inputbox.on('keydown', function(event) {
    if (event.keyCode == 13) {
      return send();
    }

    return true;
  });

  $(window).on('unload', function() {
    socket.emit('unregister', Nickname);
  });
});
