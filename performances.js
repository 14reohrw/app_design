var sql = require( 'sqlite3' );
var http = require( 'http' );
var fs = require( 'fs' );



function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    // console.log( kvs );
    return kvs
}
function server_fun( req, res )
{
    console.log( req.url );
    // ...
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
    }
    catch( exp ) {
        // console.log( "huh?", req.url.indexOf( "second_form?" ) );
        if( req.url.indexOf( "get_times?" ) >= 0 )
        {
            var db = new sql.Database( 'telluride.sqlite' );
            var kvs = getFormValuesFromURL( req.url );
            var time= kvs['time'];
            //var start_time = time.replace('%3A', '.');
            db.all( 'Select Performers.Name as PerfName, * '+
            'FROM Performances '+
            'JOIN Performers ON Performers.ID = Performances.PID '+
            'JOIN Stages ON Stages.ID = Performances.SID'+
            'WHERE Performances.Time >' +time,
    function( err, rows ) {
        if( err !== null )
        {
            console.log( err );
            return;
        }
        else
        {
          res.writeHead( 200 );
          var response_text = "<html><body>"+rows.length+"<table><tbody>";
          for( var i = 0; i < rows.length; i++ )
          {
            response_text += "<tr><td>" + rows[i].Name +
            "</td><td>"+rows[i].Perfname+ "</td></tr>" + rows.Time "</td></tr>";
          }
          response_text += "</tbody></table></body></html>";
          res.end( response_text );
        }

        // console.log( rows );
        // console.log( rows.length );
    } );
