const net = require("net");
const port = 5000;

let clients = {}
let uniqueClients = 0
let newUser = "Guest"

process.stdin.setEncoding("utf-8");

const server = net.createServer(client => {
    client.setEncoding("utf-8");
    let templateName = newUser + uniqueClients.toString()
    uniqueClients += 1
    clients += {templateName: client};
    console.log("new client connected!")
    client.write("welcome to the chatroom!");

    client.on("data", data => {
        console.log(data);
        broadcast(data, client);
    })
}).listen(port, () => {
    console.log("servered to port " + port);
});

process.stdin.on('readable', function() {
    let userInput
    while ((userInput = process.stdin.read()) !== null) {
        if (userInput.trim() === "help" || userInput.trim() === "man") {
            console.log(`available commands:
help - self-explanatory
lsc - list connected clients
exit - server shutoff`);
        }
        else if (userInput.trim() === "lsc") {
            for (key in clients) {
                console.log(key);
            }
        }
    }
})

function broadcast(message, sender) {
    for (key in clients){
        if (clients[key] !== sender){
            clients[key].write(key + ": " + message);
        }
    }
}
