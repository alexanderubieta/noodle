
const Discord = require('discord.js');
const chrono = require('chrono-node');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
var dict = {
    "everyone":`@everyone`,
    "genshin":`@Genshin Impact o(*￣▽￣*)ブ `,
    "genshin-impact":`@Genshin Impact o(*￣▽￣*)ブ `,
    "valorant":`@Valorant ψ(｀∇´)ψ`,
    "roblox":`@Roblox ♪(´▽｀)`,
    "among":`@Among Us ㄟ(≧◇≦)ㄏ`,
    "among-us":`@Among Us ㄟ(≧◇≦)ㄏ`,
    "smash":`@Smash (((o(*ﾟ▽ﾟ*)o)))`,
    "spaceman":`@Unfortunate Spacemen \`(*>﹏<*)′`,
    "unfortunate-spaceman":`@Unfortunate Spacemen \`(*>﹏<*)′`,
    "fortnite":`@Fortnite (๑•̀ㅂ•́)و✧`,
    "phasmophobia":`@Phasmophobia (⓿_⓿)`,
    "minecraft":`@Minecraft ( *︾▽︾)`,
    "content":`@Content ( ͡° ͜ʖ ͡°)`,
    "birthday":`@Birthday ＼(＾O＾)／`
};

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'event') {
        if (args.length < 2) {
            message.channel.send("Error: too few arguments. Send event message in the following format: ```%event event-name-seperated-by-dashes MM/DD/YYYY or MM/DD/YYYY-15:00 (which translates to MM/DD/YYYY 3PM CST)```");
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
                var date = chrono.parseDate(given);
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
                var at = dict["content"];
                cur = args.shift().toLowerCase();
                if(cur!=null && dict[cur]!=null){
                    at=dict[cur];
                }
                var expiring = false;
                function update() {
                    sec = ((date - Date.now()) / 1000) - 21600;
                    if (!given.includes(':')) {
                        sec = sec - 21600;
                    }
                    if(expiring){
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
                if(message.channel.id == '808780763909849088'){
                    id = '808780763909849088';
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
                                    .addField(`Countdown for ${eventname}is over!`,`${hour} hours and ${min} minutes until this message expires`);
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
                            else{
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
                                        client.channels.cache.get(id).send(at).then(msga => {
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