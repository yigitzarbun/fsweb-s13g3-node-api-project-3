// require your server and launch it
const port = 9000;
const server = require("./api/server");
server.listen(port, () => console.log(`API running on PORt ${port}`));
