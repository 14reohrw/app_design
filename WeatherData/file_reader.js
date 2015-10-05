var fs = require( 'fs' );
var sql = require( 'sqlite3' ).verbose();
var db = new sql.Database( 'weather_db' );
var num= 0;
// Did the user type a filename?
if( process.argv.length < 3 )
{
    console.log( "Usage: Need a filename, dummy" );
    process.exit( 1 );
}

var filename = process.argv[ 2 ];

console.log( "You want me to read file: ", filename );

// Use try to avoid crashing
try
{
    var fileBuffer = fs.readFileSync( filename );
}
catch( exp )
{
    console.log( "Failed to read file", filename );
    process.exit( 2 );
}
var contents = fileBuffer.toString();
var contents_lines = contents.split( '\n' );
var test = "('";
for( var i = 0; i < (contents_lines.length -1); i++ )
{
    //console.log( i, contents_lines[i] );
    var split = contents_lines[i].split(",");
    //console.log(split);
    var time= split[0];
    var time_change = time.replace(":", ".");
    var time_split= time_change.split(" ")
    var num= parseFloat(time_split[0]);
    if (time_split[1] == "PM")
    {
        var num = num + 12.00;
    }
    split[0]= num;
    console.log(num);
    console.log(time_split[0]);
    console.log(time_split[1]);
    //if (time.mat('PM'))
    //{
      //var time= time
    //}
    var test = "(";
    test += split[0] + ",";
    test += split[1] + ",";
    test += split[2] + ",";
    test += split[3] + ",";
    test += split[4] + ",";
    test += split[5] + ",";
    test += "'" + split[6] + "',";
    test += "'" + split[7] + "',";
    test += split[8] + ",";
    test += "'" + split[9] + "',";
    test += "' " + split[10] + "',";
    test += "'" + split[11] + "',";
    test += split[12] + ",";
    test += "'" + split[13] + "')";

    //console.log(test);
    //var db = new sql.Database( 'weather' );
    db.run("INSERT INTO weather (MilitaryTime, TemperatureF, DewPointF, Humidity, SeaLevelPressureIn, VisibilityMPH, WindDirection, WindSpeedMPH, GustSpeedMPH, PrecipitationIn, Events, Conditions, WindDirDegrees, DateUTC) VALUES " + test);
    setTimeout(function(){/* Look mah! No name! */},2000);
}
