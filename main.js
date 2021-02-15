const Discord = require('discord.js');
const chrono = require('chrono-node');
//const TinyQueue = require('tinyqueue');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
//var curTimes = new TinyQueue();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    // if (command === 'countdown') {
    //     var eventname = "countdown ";
    //     if (args.length > 2 || args.length == 0) {
    //         message.channel.send("Error: too many or two few arguments. Send countdown message in the following form: ```%countdown (optional)countdown-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CST)```");
    //     }
    //     else {
    //         if (chrono.strict.parseDate(args[0]) == null) {
    //             var cur = args.shift().split('-');
    //             eventname = "";
    //             for (var i = 0; i < cur.length; i++) {
    //                 eventname += cur[i] + " ";
    //             }
    //         }
    //         if (chrono.strict.parseDate(args[0]) != null) {
    //             var given = args.shift().toLowerCase();
    //             const date = chrono.parseDate(given);
    //             if (given.includes('-')) {
    //                 var time = given.split('-')[1];
    //                 given = given.split('-')[0];
    //                 if (time.split(':')[0] > 12) {
    //                     if (time.split(':')[0] == '24') {
    //                         time = parseInt(time.split(':')[0]) - 12 + ':' + time.split(':')[1] + ' AM';
    //                     }
    //                     else {
    //                         time = parseInt(time.split(':')[0]) - 12 + ':' + time.split(':')[1] + ' PM';
    //                     }
    //                 }
    //                 else {
    //                     time = time + ' AM';
    //                 }
    //                 given = given + ' ' + time;
    //             }
    //             var sec;
    //             var min;
    //             var hour;
    //             var day;
    //             function update() {
    //                 sec = ((date - Date.now()) / 1000) - 21600;
    //                 if (!given.includes(':')) {
    //                     sec = sec - 21600;
    //                 }
    //                 min = sec / 60;
    //                 hour = min / 60;
    //                 day = hour / 24;
    //                 day = Math.trunc(day);
    //                 hour = Math.trunc(hour - (day * 24));
    //                 min = Math.trunc(min - ((hour + day * 24) * 60));
    //                 sec = Math.trunc((sec - (((hour + day * 24) * 60) + min) * 60) * 1000);
    //             }
    //             update();
    //             var countEmbed = new Discord.MessageEmbed()
    //                 .setTitle(`${eventname}`)
    //                 .setDescription(`${given}`)
    //                 .addField(`Time left until ${eventname}ends:`, `${day} days, ${hour} hours, and ${min} minutes`);
    //             message.channel.send(countEmbed).then(msg => {
    //                 var ini = setTimeout(function () {
    //                     update();
    //                     countEmbed = new Discord.MessageEmbed()
    //                         .setTitle(`${eventname}`)
    //                         .setDescription(`${given}`)
    //                         .addField(`Time left until ${eventname}ends:`, `${day} days, ${hour} hours, and ${min} minutes`);
    //                     msg.edit(countEmbed).catch(error => {
    //                         console.log("msg was already deleted & timeout removed");
    //                         clearTimeout(ini);
    //                     });
    //                     var up = setInterval(function () {
    //                         update();
    //                         countEmbed = new Discord.MessageEmbed()
    //                             .setTitle(`${eventname}`)
    //                             .setDescription(`${given}`)
    //                             .addField(`Time left until ${eventname}ends:`, `${day} days, ${hour} hours, and ${min} minutes`);
    //                         msg.edit(countEmbed).catch(error => {
    //                             console.log("msg was already deleted & interval removed");
    //                             clearInterval(up);
    //                         });
    //                         if (day <= 0 && hour <= 0 && min <= 0) {
    //                             msg.delete().catch(error => {
    //                                 console.log("msg was already deleted");
    //                             });
    //                             clearInterval(up);
    //                         }
    //                     }, 60000);
    //                 }, sec);
    //             });
    //         }
    //         else {
    //             message.channel.send("Error: incompatible arguments. Send countdown message in the following format: ```%countdown (optional)countdown-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CST)```");
    //         }
    //     }
    // }
    if (command === 'event') {
        if (args.length != 2) {
            message.channel.send("Error: too many or two few arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CST)```");
        }
        else if (chrono.strict.parseDate(args[0]) != null) {
            message.channel.send("Error: incompatible arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CST)```");
        }
        else {
            var cur = args.shift().split('-');
            var eventname = "";
            for (var i = 0; i < cur.length; i++) {
                eventname += cur[i] + " ";
            }
            if (chrono.strict.parseDate(args[0]) == null) {
                message.channel.send("Error: incompatible arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CST)```");
            }
            else {
                var given = args.shift().toLowerCase();
                const date = chrono.parseDate(given);
                if (given.includes('-')) {
                    var time = given.split('-')[1];
                    given = given.split('-')[0];
                    if (time.split(':')[0] > 12) {
                        if (time.split(':')[0] == '24') {
                            time = parseInt(time.split(':')[0]) - 12 + ':' + time.split(':')[1] + ' AM (CST)';
                        }
                        else {
                            time = parseInt(time.split(':')[0]) - 12 + ':' + time.split(':')[1] + ' PM (CST)';
                        }
                    }
                    else {
                        time = time + ' AM (CST)';
                    }
                    given = given + ' ' + time;
                }
                var sec;
                var min;
                var hour;
                var day;
                function update() {
                    sec = ((date - Date.now()) / 1000) - 21600;
                    if (!given.includes(':')) {
                        sec = sec - 21600;
                    }
                    min = sec / 60;
                    hour = min / 60;
                    day = hour / 24;
                    day = Math.trunc(day);
                    hour = Math.trunc(hour - (day * 24));
                    min = Math.trunc(min - ((hour + day * 24) * 60));
                    sec = Math.trunc((sec - (((hour + day * 24) * 60) + min) * 60) * 1000);
                }
                update();
                var eventEmbed = new Discord.MessageEmbed()
                    .setTitle(`${eventname}`)
                    .setDescription(`${given}`)
                    .addField(`Time left until ${eventname}:`, `${day} days, ${hour} hours, and ${min} minutes`);
                message.channel.send(eventEmbed).then(msg => {
                    var ini = setTimeout(function () {
                        update();
                        eventEmbed = new Discord.MessageEmbed()
                            .setTitle(`${eventname}`)
                            .setDescription(`${given}`)
                            .addField(`Time left until ${eventname}:`, `${day} days, ${hour} hours, and ${min} minutes`);
                        msg.edit(eventEmbed).catch(error => {
                            console.log("msg was already deleted & timeout removed");
                            clearTimeout(ini);
                        });
                        var up = setInterval(function () {
                            update();
                            eventEmbed = new Discord.MessageEmbed()
                                .setTitle(`${eventname}`)
                                .setDescription(`${given}`)
                                .addField(`Time left until ${eventname}:`, `${day} days, ${hour} hours, and ${min} minutes`);
                            msg.edit(eventEmbed).catch(error => {
                                console.log("msg was already deleted & interval removed");
                                clearInterval(up);
                            });
                            if (day <= 0 && hour <= 0 && min <= 0) {
                                msg.delete().catch(error => {
                                    console.log("msg was already deleted");
                                });
                                clearInterval(up);
                            }
                        }, 60000);
                    }, sec);
                });
            }
        }
    }
})

client.login(token);