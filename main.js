const Discord = require('discord.js');
const chrono = require('chrono-node');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
var sec;
var min;
var hour;
var day;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'countdown') {
        var eventname = "event";
        if (args.length > 2 || args.length == 0) {
            message.channel.send("Error: too many or two few arguments. Send countdown message in the following form: ```%countdown (optional)event-name-seperated-by-dashes (required)2020-01-31 .```");
        }
        else {
            if (chrono.strict.parseDate(args[0]) == null) {
                var cur = args.shift().toLowerCase().split('-');
                eventname = "";
                for (var i = 0; i < cur.length; i++) {
                    eventname += cur[i] + " ";
                }
            }
            if (chrono.strict.parseDate(args[0]) != null) {
                const given = args.shift().toLowerCase();
                const date = chrono.parseDate(given);
                function update() {
                    sec = ((date - Date.now()) / 1000) - 21600;
                    min = sec / 60;
                    hour = min / 60;
                    day = hour / 24;
                    day = Math.trunc(day);
                    hour = Math.trunc(hour - (day * 24));
                    min = Math.trunc(min - ((hour + day * 24) * 60));
                    sec = Math.trunc((sec - (((hour + day * 24) * 60) + min) * 60) * 1000);
                }
                update();
                message.channel.send(`Time left until ${eventname}: ${day} days, ${hour} hours, and ${min} minutes`).then(msg => {
                    setTimeout(function () {
                        update();
                        msg.edit(`Time left until ${eventname}: ${day} days, ${hour} hours, and ${min} minutes`);
                        var up = setInterval(function () {
                            update();
                            msg.edit(`Time left until ${eventname}: ${day} days, ${hour} hours, and ${min} minutes`);
                            if (day <= 0 && hour <= 0 && min <= 0) {
                                msg.delete();
                                clearInterval(up);
                            }
                        }, 60000);
                    }, sec);
                });
            }
            else {
                message.channel.send("Error: incompatible arguments. Send countdown message in the following format: ```%countdown (optional)event-name-seperated-by-dashes (required)2020-01-31 .```");
            }
        }
    }
})

client.login(token);