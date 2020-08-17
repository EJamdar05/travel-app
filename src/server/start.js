const app = require('./server.js')
const serverPort = 3000;
const server = app.listen(serverPort, serverUp)
function serverUp(){
    console.log('Server is starting.')
    console.log(`Server is now running on port: ${serverPort}`);
}