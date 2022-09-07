const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let tag = 0;

const appdata = [
  { 'item': 'apples', 'quan':'5','store':'shaws', 'tag':1}
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if(request.url === '/groceryData'){
    response.end(JSON.stringify(appdata));
  }else{
    sendFile(response, filename)
  }
}

const handlePost = function( request, response ) {
  if(request.url === "/submit"){
    addRow(request, response);
  } else if(request.url === "/remove"){
    delRow(request, response);
  } else if(request.url === "/editRow"){
    editRow(request, response);
  }
}

const delRow = function( request, response ) {
  
}

const editRow = function( request, response ) {
  
}

const addRow = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on('end', function() {
    const data = JSON.parse(dataString)
    
    
    const addItem = {
      'item': data.item,
      'quan': data.quan,
      'store': data.store,
      'tag': tag,
    }
    
    tag = tag + 1
    appdata.push(addItem)

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    //response.end( JSON.stringify( appdata ) )
    response.end()
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
