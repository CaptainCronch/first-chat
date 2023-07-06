const net = require("net");
const port = 5000;

let clients = []
let uniqueClients = 0
let newUser = "Guest"

process.stdin.setEncoding("utf-8");

const server = net.createServer(client => {
    client.setEncoding("utf-8");
    let templateName = newUser + (uniqueClients).toString()
    uniqueClients += 1
    clients.push({user: client, name: templateName});
    console.log("new client connected!")
    client.write("welcome to the chatroom!");

    client.on("data", data => {
        broadcast(data, client);
    })

    client.on("end", () => {
        
    })

}).listen(port, () => {
    console.log("servered to port " + port);
});

process.stdin.on('readable', function() {
    let userInput
    while ((userInput = process.stdin.read()) !== null) {
        if (userInput.trim() === "help" || userInput.trim() === "man") {
            console.log(
`    available commands:
    help/man - self-explanatory
    ls/lsc - list connected clients
    exit - server shutoff`);
        }
        else if (userInput.trim() === "lsc" || userInput.trim() === "ls") {
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

function broadcast(message, sender) {
    var currentName = findName(sender)
    console.log(currentName + ": " + message);
    clients.forEach((individual) => {
        individual.user.write(currentName + ": " + message);
    })
}

function findName(currentUser) {
    var i = 0
    clients.forEach((individual) => {
        if (individual.user == currentUser){
            console.log(clients[i].name)
            return clients[i].name
        }
        i++
    })
}
