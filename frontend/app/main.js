
let params = {
    host: process.env.WEBSOCKET,
};

if (window.location.hash) {
    params.flowId = window.location.hash.substring(1);
} else {
    params.flowId = '/default'
}

/*
    you can either pass parameters into start function, or inline in the html tag like: <conversation-app host="ws://localhost:8080" flowId="/default"></conversation-app>
*/


document.querySelector('conversation-app#dialog').start(params.host, params.flowId);

