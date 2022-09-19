const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const{ MongoClient } = require('mongodb');

async function addRowDB(usernameIN, titleIN, imgIN, tagIN) {
    const uri = 
      "mongodb+srv://jackleserman:jackleserman@testcluster.8ad4jnf.mongodb.net/?retryWrites=true&w=majority"
        //TODO change login here
      const client = new MongoClient(uri);

      try{
        await client.connect();
        await createRow(client, {
            username: usernameIN,
            title: titleIN,
            img: imgIN,
            tag: tagIN
        })
    }catch(e){
        console.error(e);
      } finally {
        await client.close();
      }
}

async function getRowDB(tagIN) {
    const uri = 
      "mongodb+srv://jackleserman:jackleserman@testcluster.8ad4jnf.mongodb.net/?retryWrites=true&w=majority"
        //TODO change login here
      const client = new MongoClient(uri);

      try{
        await client.connect();
        await getRowByID(client, tagIN)
    }catch(e){
        console.error(e);
      } finally {
        await client.close();
      }
}

async function removeRowDB(tagIN) {
    const uri = 
      "mongodb+srv://jackleserman:jackleserman@testcluster.8ad4jnf.mongodb.net/?retryWrites=true&w=majority"
        //TODO change login here
      const client = new MongoClient(uri);

      try{
        await client.connect();
        await deleteRow(client, tagIN)
    }catch(e){
        console.error(e);
      } finally {
        await client.close();
      }
}

async function updateRowDB(tagToUpdate, usernameIN, titleIN, imgIN, tagIN) {
    const uri = 
      "mongodb+srv://jackleserman:jackleserman@testcluster.8ad4jnf.mongodb.net/?retryWrites=true&w=majority"
        //TODO change login here
      const client = new MongoClient(uri);

      try{
        await client.connect();
        await updateData(client, tagToUpdate, {username: usernameIN, title: titleIN, img: imgIN, tag: tagIN});
    }catch(e){
        console.error(e);
      } finally {
        await client.close();
      }
}

async function deleteRow(client, tagIN){
    const result = await client.db("catbase").collection("catdata").deleteOne(
        {tag: tagIN});

    console.log(`${result.deletedCount} rows were deleted`);
}

async function updateData(client, tagIN, updatedRow){
    const result = await client.db("catbase").collection("catdata").updateOne({tag: 
        tagIN}, {$set: updatedRow});
    
    console.log(`${result.matchedCount} rows matched the criteria`)
    console.log(`${result.modifiedCount} rows were updated`) 
}


async function getRowByID(client, tagIN){
    const result = await client.db("catbase").collection("catdata").findOne({tag: tagIN});
    if(result){
        console.log(`Found a row with tag'${tagIN}'`);
        console.log(result);
        return result;
    }else{
        console.log("No rows found under that name");
    }
}

async function createRow(client, newRow){
    const result = await client.db("catbase").collection("catdata").insertOne
    (newRow);

    console.log(`New Row Created: ${result.insertedId}`);

}

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    } )
}

//getRow(6)
//addRow("Jack", "Cat", "Img Here", 6).catch(console.error);
//removeRow(6);
//updateRow(6, "Jake", "Lil Cat", "Img here but NEW", 100);



let tag2 = -1

const appdata = []

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const update_tags = function(){
  for (let i = 0; i < appdata.length; i++) {
    appdata[i].tag = i
  }
}

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/groceryData") {
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
  }
};

const clearall = function (request, response) {
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let index = -1;
    appdata.splice(0,appdata.length);
    update_tags();
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();

  });
};

const editRow = function (request, response) {
  update_tags();
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const data = JSON.parse(dataString);
    let tag = data.tag;
    const name = document.querySelector('#name').image;
    const title = document.querySelector('#title').value;
    const img = document.querySelector('#img').value;
    for (let i = 0; i < appdata.length; i++) {
      if (String(appdata[i].tag) == String(tag)) {
        appdata[i].name = name;
        appdata[i].title = title;
        appdata[i].img = img;
        appdata[i].tag = tag;
      }
    }

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();
  });
};

const delRow = function (request, response) {
  update_tags();
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    let index = -1;
    const data = JSON.parse(dataString);
    let tag3 = data.tag;
    console.log("REMOVING "  + tag2)
    for (let i = 0; i < appdata.length; i++) {
      if (String(appdata[i].tag) == String(tag3)) {
        index = i;
        break;
      }
    }
    appdata.splice(index, 1);
    const newdata = JSON.stringify(appdata);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();
  });
};

const addRow = function (request, response) {
  update_tags();
  tag2 = tag2 + 1;
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const data = JSON.parse(dataString);
    const name = data.name;
    const title = data.title;
    const img = data.img;
    const tag = tag2;

    addRowDB(name, title, img, tag);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
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
