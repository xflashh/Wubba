const botconfig = require("process.env.token");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
var isReady = true;

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});


bot.on("ready", async () => {

    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Fortnite", {type: "WATCHING"});
});


bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArrey = message.content.split(" ");
    let cmd = messageArrey[0];
    let args = messageArrey.slice(1);

    let commandsfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandsfile) commandsfile.run(bot,message,args);

    if(cmd === `${prefix}start`){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Can't Do That !");
        var VC = message.member.voiceChannel;
        if (!VC)
            return message.reply("Not In Channel")
    VC.join()
        .then(connection => {
            const dispatcher = connection.playFile('./start.mp3');
            dispatcher.on("end", end => {VC.leave()});
        })
        .catch(console.error);
    }
});

bot.login(process.env.BOT_TOKEN);
      
