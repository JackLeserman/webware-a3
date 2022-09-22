const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let tag2 = -1

const { json } = require("body-parser");
const { Console } = require("console");
const{ MongoClient } = require('mongodb');
const express = require('express');

const uri = "mongodb+srv://jackleserman:jackleserman@testcluster.8ad4jnf.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

console.log("Server Started")
async function addRowDB(usernameIN, titleIN, imgIN, tagIN) {
    await client.connect();
   const newRow = {
            username: usernameIN,
            title: titleIN,
            img: imgIN,
            tag: tagIN,
    }
    const result = await client.db("catbase").collection("catdata").insertOne
    (newRow);
    console.log(`New Row Created: ${result.insertedId}`);
    
}

async function getRow(tagIN) {
      await client.connect();
      const result = await client.db("catbase").collection("catdata").findOne({tag: tagIN});
      if(result){
          //console.log(`Found a row with tag'${tagIN}'`);
          //console.log(result);
          return result;
      }else{
          console.log("No rows found under that name");
      }
      
      
}

async function removeRowDB(tagIN) {
  console.log("Removing " + tagIN);
  tagIN = parseInt(tagIN);
  await client.connect();
  const result = await client.db("catbase").collection("catdata").deleteOne(
  {tag: tagIN});

  console.log(`${result.deletedCount} rows were deleted`);
}

async function updateRow(tagToUpdate, usernameIN, titleIN, imgIN, tagIN) {
      tagToUpdate = parseInt(tagToUpdate);
      tagIN = parseInt(tagIN);
      console.log("Updating: " + tagToUpdate);
      await client.connect();
      const updatedRow =  {username: usernameIN, title: titleIN, img: imgIN, tag: tagIN};
      const result = await client.db("catbase").collection("catdata").updateOne({tag: 
        tagToUpdate}, {$set: updatedRow});
    
      console.log(`${result.matchedCount} rows matched the criteria`)
      console.log(`${result.modifiedCount} rows were updated`) 
}

async function updateRow_noClose(tagToUpdate, usernameIN, titleIN, imgIN, tagIN) {
  await client.connect();
  const updatedRow =  {username: usernameIN, title: titleIN, img: imgIN, tag: tagIN};
  const result = await client.db("catbase").collection("catdata").updateOne({tag: 
    tagToUpdate}, {$set: updatedRow});

  //console.log(`${result.matchedCount} rows matched the criteria`)
  //console.log(`${result.modifiedCount} rows were updated`) 
}


async function getAllRows() {
  await client.connect();
  const result = await client.db("catbase").collection("catdata").find().toArray();
  console.log(result);
  
  return result;
}

async function update_tagsDB() {
  array = [];
  counts = [];
  await client.connect();
  const result = await client.db("catbase").collection("catdata").find().toArray();
  counter = -1;
  result.forEach(async function(doc){
    counter = counter + 1;
    array.push(doc.tag);
    counts.push(counter);
  });
  //if you are wondering why this is here, it is because JS is bad and I couldnt
  //run my update function in the forEach. I have no idea why nor did the TAs. Pain.
  //console.log(array);
  //console.log(counts);
  for (let i = 0; i < array.length; i++) {
    try{
    const row = await getRow(array[i]);
    await updateRow_noClose(array[i], row.username, row.title, row.img, counts[i]);
    }catch(error){console.log("Tag Update DNE error")
    break;
    }
  }
  setTimeout(() => {console.log("Waiting")}, 1000);
}
const appdata = []

async function getData_forPrint() {
  appdata.splice(0,appdata.length);
  console.log("Before");
  console.log(appdata);
  await client.connect();
  const result = await client.db("catbase").collection("catdata").find().toArray();
  result.forEach(async function(doc){
    const addItem = {
      username: doc.username,
      title: doc.title,
      img: doc.img,
      tag: doc.tag, //
    };
    appdata.push(addItem);

  });
  return appdata;
}

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const update_tags = function(){

}

const handleGet = async function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/groceryData") {
    await getData_forPrint();
    console.log("After");
    console.log(appdata)
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  if (request.url === "/submit") {
    addRow(request, response);
  } else if (request.url === "/remove") {
    delRow(request, response);
  } else if (request.url === "/update") {
    editRow(request, response);
  } else if (request.url === "/clear") {
   clearall(request, response);
  } else if (request.url === "/") {
    clearall(request, response);
  }
};

async function cleardb(){
  await client.connect();
  const result = await client.db("catbase").collection("catdata").deleteMany({});
  console.log("DB cleared")
}

const clearall = function (request, response) {
    cleardb();
    let dataString = "";
    request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let index = -1;
    appdata.splice(0,appdata.length);
    update_tags();
    try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();

  });
}

const editRow = function (request, response) {
  update_tags();
  try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const data = JSON.parse(dataString);
    let tag = data.tag;
    const name = data.name;
    const title = data.title;
    const img = data.img;
    updateRow(tag, name, title, img, tag).catch(console.error);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();
  });
};

const delRow = function (request, response) {
  update_tags();
  try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", async function () {
    let index = -1;
    const data = JSON.parse(dataString);
    let tag3 = data.tag;
    await removeRowDB(tag3);
    //console.log("REMOVING "  + tag3)
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();
  });
};

const addRow = function (request, response) {
  update_tags();
  try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
  tag2 = tag2 + 1;
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", async function () {
    const data = JSON.parse(dataString);
    
    /*
        const data = JSON.parse(dataString);
    const name = data.name;
    const title = data.title;
    const img = data.img;
    const tag = data.tag;

    addRowDB(name, title, img, tag);
    */

    await addRowDB(data.name, data.title, data.img, data.tag).catch(console.error);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end();
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
