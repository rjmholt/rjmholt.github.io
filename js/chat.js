// Numeric encoding of a return key press
var RETURN = 13;

// The websocket reference, which must be passed around
var webSocket;

var clientState = { username: null, peers: [] };

// Connect the client to the webhost and set up the websocket methods
function connect (username)
{
    var wsHost = 'ws://' + window.location.host + '/websocket';
    webSocket  = new WebSocket(wsHost);

    webSocket.onopen    = function (e) { onOpen(e); };
    webSocket.onclose   = function (e) { onClose(e); };
    webSocket.onmessage = function (e) { onMessage(e); };
    webSocket.onerror   = function (e) { onError(e); };
}

// No actions to take immediately on opening
function onOpen (e)
{
}

// When the socket closes, print a nice message
function onClose (e)
{
    statusMessage('green', 'Disconnected');
}

// Message receiving method
function onMessage (e)
{
    // Decode the incoming message
    var msg = JSON.parse(e.data);

    switch (msg.type) {
        // Ordinary messages can just be displayed to the user
        case 'message':
            printMessage(msg.identity + ': ' + msg.message);
            break;
        // NewID messages say that someone has connected or changed name
        // (the second is not implemented yet)
        case 'newid':
            if (clientState.username === msg.identity) {
                statusMessage('green', 'Connected'); 
            }
            else if (msg.former === '') {
                statusMessage('gray', 'New Connection: ' + msg.identity);
            }
            break;
        // PeerList tells clients who is connected
        case 'peerlist':
            $('#peers').html('');
            msg.peers.forEach(function (peer, i, arr) {
                $('#peers').append(peer + '<br/>');
            });
            break;
    }
}

// Tell the user when there is an error
function onError (e)
{
    statusMessage('red', 'ERROR: ' + e.data);
}

// Message sending function that retries 10 times at intervals
// then gives up and prints a message saying it did
// Based on:
//   http://stackoverflow.com/questions/13546424/how-to-wait-for-a-websockets-readystate-to-change
function chatSend (msgObject)
{
    var chatSendTry = function(msgObject, tryNum) {
        if (tryNum > 10) {
            printMessage('Web Socket not ready to send');
            return;
        }

        setTimeout(function () {
            if (webSocket.readyState == webSocket.OPEN) {
            webSocket.send(JSON.stringify(msgObject));
            }
            else {
                chatSendTry(msgObject, tryNum+1);
            }
        }, 50);
    };

    chatSendTry(msgObject, 0);
}

// Send a (chat) 'message' type message
function sendMsg (username, text)
{
    var msg = { type: 'message', identity: username, message: text };
    chatSend(msg);
}

// Send a connection message to the server with a chosen username
function sendConnect (username)
{
    var msg = { type: 'changeid', newid: username, oldid: '' };
    chatSend(msg);
}

// Print a message to the user's interface
function printMessage (text)
{
    $('#output').append(text + '<br/>');
    setTimeout(function () {
        $('#output').scrollTop = $('#output').scrollHeight;
    }, 1);
}

// Print a status message to the user's window
function statusMessage (colour, msg)
{
    var text = '<span style="color: '+colour+';">'+msg+'</span>';
    $('#connectionMessage h2').html(text);
    $('#connectionMessage h2').show().fadeOut(5000);
}

// A strange JS way of ensuring data is UTF-8 encoded
function utf8Encode (data)
{
    return unescape(encodeURIComponent(data));
}

// A strange JS way of decoding from UTF-8
function utf8Decode (data)
{
    return decodeURIComponent(escape(data));
}

$(document).ready(function () {
    // Let the user enter their username. When they press enter, send
    // the appropriate message and show the chat window
    $('#username').keydown(function (e) {
        clientState.username = $('#username').val();
        if (e.keyCode == RETURN && clientState.username !== '') {
            connect();
            $('#chatInit').hide();
            $('#chatOut').show();
            $('#peerBox').show();
            sendConnect(clientState.username);
        }
    });

    // Let the user enter chat messages and send when they press <RETURN>
    $('#chatEntry').keydown(function (e) {
        if (e.keyCode == RETURN) {
            var content = $('#chatEntry').val();
            if (content !== '') {
                sendMsg(clientState.username, content);
                $('#chatEntry').val('');
            }
            // Stop <RETURN> from making a new line
            return false;
        }
    });
});
