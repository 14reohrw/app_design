var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();
var counter =0;


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
        if( req.url.indexOf( "add_student?" ) >= 0 )
        {
            var kvs = getFormValuesFromURL( req.url );
            var TimeMDT = kvs['TimeMDT'];
            var Time= TimeMDT.replace('%3A', '.');
            var num = parseFloat(Time);
            if (kvs['time'] == "PM")
            {
              var num= num + 12.00;
            }
            var date= kvs['DateUTC'].replace('+', ' ');
            var date2 = date.replace('%3A', ':');
            var final_date= date2.replace('%3A', ':');
            console.log(final_date);
            var values = "(";
            values += num + ",";
            values += kvs['TemperatureF'] + ",";
            values += kvs['DewPointF'] + ",";
            values += kvs['Humidity'] + ",";
            values += kvs['SeaLevelPressureIn'] + ",";
            values += kvs['VisibilityMPH'] + ",";
            values += "'" + kvs['WindDirection'] + "',";
            values += "'" + kvs['WindSpeedMPH'] + "',";
            values += kvs['GustSpeedMPH'] + ",";
            values += "' " + kvs['PrecipitationIn'] + "',";
            values += "'" + kvs['Events'] + "',";
            values += "'" + kvs['Conditions'] + "',";
            values += kvs['WindDirDegrees'] + ",";
            values += "'" + final_date + "')";
            var db = new sql.Database( 'weather_db' );
            console.log( values );
            db.run( "INSERT INTO weather (MilitaryTime, TemperatureF, DewPointF, Humidity, SeaLevelPressureIn, VisibilityMPH, WindDirection, WindSpeedMPH, GustSpeedMPH, PrecipitationIn, Events, Conditions, WindDirDegrees, DateUTC) VALUES "+values,
                    function( err ) {
                        res.writeHead( 200 );
                        res.end( "Data Set added!!!" );
                    } );
        }
        else if( req.url.indexOf( "show_table?" ) >= 0 )
        {
          var kvs = getFormValuesFromURL( req.url );
          var db = new sql.Database( 'weather_db' );
          var start_dec =kvs['Start_Time'];
          var end_dec = kvs['End_Time'];
          var start_military = start_dec.replace('%3A', '.');
          var end_military = end_dec.replace('%3A', '.');
          var start= parseFloat(start_military);
          var end = parseFloat(end_military);
          if (kvs['Stime'] == "PM")
          {
            start= start + 12.00;
          }
          if (kvs['Etime'] == "PM")
          {
            end= end + 12.00;
          }
          console.log(end);
          console.log(start);
          db.all( "SELECT * FROM weather WHERE MilitaryTime >" +start,
          //"AND WHERE MilitaryTime <" + end,
          function( err, rows ) {
            res.writeHead( 200 );
            var resp_text = [];
            console.log(resp_text[2])
            for (var i = 0; i < rows.length; i++)
            {
              if (rows[i].MilitaryTime < end)
              {
                console.log(rows[i].MilitaryTime);
                resp_text.push(rows[i].MilitaryTime);
                resp_text.push(rows[i].TemperatureF);
                resp_text.push(rows[i].DewPointF);
                resp_text.push(rows[i].Humidity);
                resp_text.push(rows[i].SeaLevelPressureIn);
                resp_text.push(rows[i].VisibilityMPH);
                resp_text.push(rows[i].WindDirection);
                resp_text.push(rows[i].WindSpeedMPH);
                resp_text.push(rows[i].GustSpeedMPH);
                resp_text.push(rows[i].PrecipitationIn);
                resp_text.push(rows[i].Events);
                resp_text.push(rows[i].Conditions);
                resp_text.push(rows[i].WindDirDegrees);
                resp_text.push(rows[i].DateUTC);
                resp_text.push("\n");
                counter++;
              }
            }
                  //console.log( rows );

            res.end("" + PlotTable(resp_text));

          }    //console.log( rows )
          );
        }

        else
        {
            // console.log( exp );
            res.writeHead( 404 );
            res.end( "Cannot find file: "+filename );
        }
    }
}

var server = http.createServer( server_fun );
function PlotTable( myArray)
{
  var table="   ";
  for( var r = 0; r < counter*15; r++ )
  {
    table+= myArray[0]+ "   ";
      myArray.splice(0, 1);
    }
    return table;
}

server.listen( 8080 );
