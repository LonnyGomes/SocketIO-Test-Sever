/*global io, $ */
/*************************************
//
// socketioserver app
//
**************************************/

// connect to our socket server
var socket = io.connect('http://127.0.0.1:7777/');

var app = app || {};


// shortcut for document.ready
$(function () {
    "use strict";
    //setup some common vars
    var $blastField = $('#blast'),
        $allPostsTextArea = $('#allPosts'),
        $clearAllPosts = $('#clearAllPosts'),
        $sendBlastButton = $('#send'),
        updateTextArea = function ( data) {
            var copy = $allPostsTextArea.html();
            $allPostsTextArea.html('<p>' + copy + data.msg + "</p>");
            $allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
        };


    //SOCKET STUFF
    socket.on("blast", function (data) {
        updateTextArea(data);
    });

    socket.on("upload", function (data) {
        updateTextArea(data);
    });

    $clearAllPosts.click(function (e) {
        $allPostsTextArea.text('');
    });

    $sendBlastButton.click(function (e) {

        var blast = $blastField.val();
        if (blast.length) {
            socket.emit("blast", {
                timeStamp: Date.now(),
                msg: blast
            }, function (data) {
                $blastField.val('');
            });
            console.log("why though");
        }


    });

    $blastField.keydown(function (e) {
        if (e.keyCode === 13) {
            $sendBlastButton.trigger('click');//lazy, but works
        }
    });

});
