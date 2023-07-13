const net = require("net");
const port = 5001   ;
process.stdin.setEncoding('utf-8')
let userName

const server = net.createConnection(port, console.log("cliented to port " + port));
server.setEncoding("utf-8");

server.on("data", data => {
    console.log(data);
});

process.stdin.on('readable', () => {
    let userInput
    while ((userInput = process.stdin.read()) !== null) {
        server.write(userInput.trim())
    }
})
