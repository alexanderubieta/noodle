const Discord = require('discord.js');
const chrono = require('chrono-node');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
var launch;
var purge = false;
var purgeName = [];
var dict = {
    "everyone": `<@&813551519529959426>`,
    "genshin": `<@&765998462684495892>`,
    "genshin-impact": `<@&765998462684495892>`,
    "valorant": `<@&739733389250396250>`,
    "roblox": `<@&739737246890065980>`,
    "among": `<@&753473946157842512>`,
    "among-us": `<@&753473946157842512>`,
    "smash": `<@&774842717627744327>`,
    "spaceman": `<@&799033561935249458>`,
    "unfortunate-spaceman": `<@&799033561935249458>`,
    "fortnite": `<@&800111816785133639>`,
    "phasmophobia": `<@&814590094567800892>`,
    "minecraft": `<@&739733579914805368>`,
    "content": `<@&813551519529959426>`,
    "birthday": `<@&827107944134737963>`
    //add more alternates later
};

client.once('ready', () => {
    launch = Date.now();
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'uptime') {
        var elapsed = chrono.parseDate("Today") - launch;
        elapsed = (elapsed / 1000) / 60;
        elapsed = elapsed.toFixed(2);
        message.channel.send(`I've been online for ${elapsed} minutes`);
    }
    else if (command === 'purge') {
        if (args.length < 1) {
            message.channel.send("Enter reminder name to purge");
        }
        else {
            purge = true;
            var input = args.shift().split('-');
            if (input == "reset") {
                purgeName = [];
                purge = false;
            }
            else {
                var base = "";
                for (var i = 0; i < input.length; i++) {
                    base += input[i] + " ";
                }
                purgeName.push(base);
            }
        }
    }
    else if (command === 'reminder') {
        if (args.length < 3) {
            message.channel.send("Error: too few arguments. Send event message in the following format: ```%reminder reminder-name-seperated-by-dashes time rolename link/description(optional)```");
        }
        else {
            var cur = args.shift().split('-');
            var reminderName = "";
            for (var i = 0; i < cur.length; i++) {
                reminderName += cur[i] + " ";
            }
            cur = args.shift();
            var firstTime = chrono.parseDate(`Today at ${cur}`) - Date.now();
            if (firstTime == null) {
                cur = "11:00";
                firstTime = chrono.parseDate(`Today at ${cur}`) - Date.now();
            }
            if (firstTime < 0) {
                firstTime = chrono.parseDate(`Tomorrow at ${cur}`) - Date.now();
            }
            message.channel.send(`A reminder has been created in this channel for: \`\`\`${reminderName}\`\`\`every day at ${cur} (CDT)`);
            var atMention = dict["content"];
            cur = args.shift().toLowerCase();
            if (dict[cur] != null) {
                atMention = dict[cur];
            }
            cur = "";
            while (args.length != 0) {
                cur += args.shift() + " ";
            }
            var reminderEmbed = new Discord.MessageEmbed()
                .setTitle(`${reminderName}`)
                .setDescription(`${cur}`);
            var ini = setTimeout(function () {
                if (purge && purgeName.indexOf(reminderName)!=-1) {
                    purgeName.splice(purgeName.indexOf(reminderName),1);
                    if(purgeName.length==0){
                        purge = false;
                    }
                    clearTimeout(ini);
                }
                else {
                    message.channel.send(atMention);
                    message.channel.send(reminderEmbed);
                    var daily = setInterval(function () {
                        if (purge && purgeName.indexOf(reminderName)!=-1) {
                            purgeName.splice(purgeName.indexOf(reminderName),1);
                            if(purgeName.length==0){
                                purge = false;
                            }
                            clearInterval(daily);
                        }
                        else {
                            message.channel.send(atMention);
                            message.channel.send(reminderEmbed);
                        }
                    }, 86400000);
                }
            }, firstTime);
        }
    }
    else if (command === 'event') {
        if (args.length < 2) {
            message.channel.send("Error: too few arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CDT)```");
        }
        else if (chrono.parseDate(args[0]) != null) {
            message.channel.send("Error: incompatible arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CDT)```");
        }
        else {
            var cur = args.shift().split('-');
            var eventname = "";
            for (var i = 0; i < cur.length; i++) {
                eventname += cur[i] + " ";
            }
            if (chrono.parseDate(args[0]) == null) {
                message.channel.send("Error: incompatible arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CDT)```");
            }
            else {
                var given = args.shift().toLowerCase();
                var date = chrono.parseDate(given);
                if (given.includes('-')) {
                    var time = given.split('-')[1];
                    given = given.split('-')[0];
                    if (time.split(':')[0] > 12) {
                        if (time.split(':')[0] == '24') {
                            time = parseInt(time.split(':')[0]) - 12 + ':' + time.split(':')[1] + ' AM (CDT)';
                        }
                        else {
                            time = parseInt(time.split(':')[0]) - 12 + ':' + time.split(':')[1] + ' PM (CDT)';
                        }
                    }
                    else {
                        time = time + ' AM (CDT)';
                    }
                    given = given + ' ' + time;
                }
                var atMention = dict["content"];
                if (args.length >= 1) {
                    cur = args.shift().toLowerCase();
                    if (dict[cur] != null) {
                        atMention = dict[cur];
                    }
                }
                var sec;
                var min;
                var hour;
                var day;
                var expiring = false;
                function update() {
                    sec = ((date - Date.now()) / 1000) - 21600;
                    if (!given.includes(':')) {
                        sec = sec - 21600;
                        // adjust for timezone
                    }
                    else {
                        sec = sec - 3600;
                        // needed for CDT time
                    }
                    if (expiring) {
                        sec = sec + 86400;
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
                var id = '810597400946409492';
                // default channel send
                if (message.channel.id == '808780763909849088') {
                    id = '808780763909849088';
                    //sends to noodle test channel
                }
                client.channels.cache.get(id).send(eventEmbed).then(msg => {
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
                            if (expiring) {
                                update();
                                eventEmbed = new Discord.MessageEmbed()
                                    .setTitle(`${eventname}`)
                                    .setDescription(`${given}`)
                                    .addField(`Countdown for ${eventname}is over!`, `${hour} hours and ${min} minutes until this message expires`);
                                msg.edit(eventEmbed).catch(error => {
                                    console.log("msg was already deleted & interval removed during expiring");
                                    clearInterval(up);
                                });
                                if (day <= 0 && hour <= 0 && min <= 0) {
                                    msg.delete().catch(error => {
                                        console.log("msg was already deleted in final minute");
                                    });
                                    clearInterval(up);
                                }
                            }
                            else {
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
                                    expiring = true;
                                    setTimeout(function () {
                                        client.channels.cache.get(id).send(atMention).then(msga => {
                                            setTimeout(function () {
                                                msga.delete().catch(error => {
                                                    console.log("@ msg was already deleted");
                                                });
                                            }, 86400000);
                                        });
                                    }, 60000);
                                }
                            }
                        }, 60000);
                    }, sec);
                });
            }
        }
    }
})
client.login(token);