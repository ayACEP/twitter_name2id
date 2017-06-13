
const NodeStorage = require("node-localstorage").LocalStorage;
const storage = new NodeStorage("./storage");

module.exports = storage;
