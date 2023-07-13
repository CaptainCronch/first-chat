// @ts-check
const net = require("net");
const path = require("path")
const fs = require("fs");
const port = 5001;

let clients = []
let uniqueClients = 0
let newUser = "Guest"

process.stdin.setEncoding("utf-8");
const log = fs.createWriteStream('./chat.log')

const server = net.createServer(client => {
    client.setEncoding("utf-8");
    let templateName = newUser + (uniqueClients).toString()
    uniqueClients += 1
    clients.push({user: client, name: templateName});

    let joinMessage = templateName + " has joined."
    client.write("welcome to the chatroom!");
    broadcast(joinMessage, client, false)

    client.on("data", data => {
        broadcast(data, client);
    })

    client.on("end", () => {
        let leaveMessage = clients.splice(clients.findIndex(element => element.user == client), 1)[0].name + " has left."
        clients.forEach((individual) => {
            individual.user.write(leaveMessage);
        })
        console.log(leaveMessage)
        log.write(leaveMessage + "\n")
    })

}).listen(port, () => {
    console.log("servered to port " + port);
});

process.stdin.on('readable', function() {
    let userInput
    while ((userInput = process.stdin.read().trim()) !== null) {
        if (userInput === "help" || userInput === "man") {
            console.log(
`   available commands:
    help/man - self-explanatory
    ls/lsc - list connected clients
    exit - server shutoff`);
        }
        else if (userInput === "lsc" || userInput === "ls") {
            var any = false
            clients.forEach(individual => {
                any = true
                console.log(individual.name)
            })
            if (!any) {
                console.log("No clients currently connected.")
            }
        }
    }
})

/**
 * @param {string | Buffer} message
 * @param {net.Socket} sender
 */
function broadcast(message, sender, repeat = true) {
    let currentName = findName(sender)
    let namedMessage
    if (repeat){
        namedMessage = currentName + ": " + message
    } else {
        namedMessage = message;
        console.log(namedMessage);
    }

    log.write(namedMessage + "\n");
    clients.forEach((individual) => {
        if (individual.name != currentName){
            individual.user.write(namedMessage);
        }
    })
}

/**
 * @param {any} currentUser
 */
function findName(currentUser) {
    return clients.find(element => element.user == currentUser).name
}
