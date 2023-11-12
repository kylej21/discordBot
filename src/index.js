/*
*
*       MUST DO'S TO START CODE:
*       - Add User ID from discord and discord bot api token to a .env file 
*       - type nodemon in the terminal and hit enter
*
*       TO DO:
*       - Add SQL database 
*       - create supercell API to update weekly results to SQL db
*/
require('dotenv').config();
const {Client,IntentsBitField} = require("discord.js");


//create sleep function
const sleep = ms => new Promise(r => setTimeout(r, ms));   

async function getMembers(msg){
    var token = process.env.BRAWLAPI
    const BrawlStars = require("brawlstars.js")
    const brawlClient = new BrawlStars.Client(token);
    (async() => {
        const playerClub = await brawlClient.getClub("#8YYRLYUG");
        
        var ret = "";
        for(var i=0; i <playerClub.memberCount;i++){
            ret += "#" + i+1 + ": " + playerClub.members[i].name + "  Trophies: " + playerClub.members[i].trophies +'\n';
        }
        msg.channel.send(ret);
    })()
}

async function runDate(msg){
    var date = new Date();
    while(true){
        if((date.getDay()==7&&date.getHours()==18)){
            msg.channel.send("@everyone Mega Pig ends soon. Get your attack in or risk being kicked.");
            //sleep for 5 days
            await sleep(432000000);
            date = new Date();
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
        }
        else if((date.getDay()==5&&date.getHours()==18)){
            msg.channel.send("@everyone Mega Pig is about to start. \n Number on contributer will get a promotion \n People who do not use all attacks might be kicked");
            //sleep for 2 days
            await sleep(86400000);
            date = new Date();
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
        }
        else{
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
            //sleep for one hour
            await sleep(3600000);
            date = new Date();
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
        }
    }
}
const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildScheduledEvents
    ],
});

client.on('messageCreate',(msg) =>{    
    //make sure bots don't run the command
    if(msg.author.bot){
        return;
    }
    //check if message is the command
    if(msg.content=="/beginTime"){
        //check if the author is the admin president
        //if yes begin mega pig notis
        if(msg.author.id==process.env.OWNERID){
            msg.channel.send("Beginning mega pig countdown reminders.")
            runDate(msg);
        }
        //if not reply so
        else{
            msg.channel.send("Only Kyle can run that command")
        }
    }
    if(msg.content == "/getMembers"){
        getMembers(msg);
    }
    
});


//Update your discord token to .env file to make the login work
client.login(process.env.TOKEN);