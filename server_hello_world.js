var http = require( 'http' );
var fs = require( 'fs' );

function server_fun( req, res )
{
    // console.log( req );
    var final_content;
    console.log( req.url );
    var filename = req.url;
    filename = filename.replace('\/', '');
    console.log(filename);
    var fileBuffer = fs.readFileSync( filename );
    res.writeHead( 200 );
    var contents = fileBuffer.toString();
    var contents_lines = contents.split( '\n' );
    for( var i = 0; i < contents_lines.length; i++ )
    {
      res.end( contents_lines[i]);
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
