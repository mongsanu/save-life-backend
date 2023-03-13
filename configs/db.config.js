/**
 Module dependencies.
 */
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
 // Production and Dev Stage Detect
 /**
  * For Running Produnction State. Start with --production Flag
  * For Running Development State. Run as normal CMD
  */
 
let dbURI;
let uri;
let isLive = false;
let dbNameLocal = 'SAVE_LIFE';
let dbNameLive = 'SAVE_LIFE';
let dbUserNameLive = 'SAVE_LIFE';
let dbPasswordLive = 'SAVE_LIFE';

if (process.env.NODE_ENV === "development") {
  
  console.log("Running at Development State");

  //  console.log("\n ########### \n");
  console.log(
  "\x1b[42m%s\x1b[0m",
  "Application was Running at localDB. Any Change Can Be Done"
  );
  console.log("\n ########### \n");

  // Local Config
  dbURI = `mongodb://localhost:27017/${dbNameLocal}`;
  uri = "localhost://27017";

} else {

  isLive = true;

  // dbURI = `mongodb://user_mobipath:Mobipath#123@153.92.4.251:27010/${dbNameLive}`;
  dbURI = `mongodb+srv://${dbUserNameLive}:${dbPasswordLive}@cluster0.7vieyi4.mongodb.net/${dbNameLive}?retryWrites=true&w=majority`;
  // dbURI = `mongodb+srv://${dbUserNameLive}:mmhk$30313@cluster0.h3rvg.mongodb.net/${dbNameLive}?retryWrites=true&w=majority`;
  uri = "Prod-Connection-Mongodb-Cluod --- > mmhk.everexpert@gmail.com --- > https://bd-online-voting.herokuapp.com/api";

}

module.exports = mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
                  .then(() => {
                    console.log("Mongodb Connected at", uri);

                    !isLive && console.log("Mongodb Connected URI", dbURI);

                  //  log("Mongodb Connected at" + uri);
                  })
                  .catch(error => console.log("Mongodb Error: " + error));
