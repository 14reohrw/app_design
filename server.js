var fs= require('fs');
var http= require('http');

function getFormValuesFromUrl(url)
{
  var kvs= {};
  var parts = url.split("?");
  var key_value_pairs = parts[1].split("&");

  var wstream = fs.createWriteStream('output.txt', {flags: 'a+'});

  for(var i= 0; i< key_value_pairs; i++)
  {
    var key_value = key_value_pairs[i].split('=');
    kvs[ key_value[0]]= key_value[1];

    content_to_file = key_value[1];
    wstream.write(content_to_file + '\r\n');
  }
  wstream.end();
  return kvs
}

function server_fun(req, res)
{
  var filename='./'+ req.url;
  try {
    var contents= fs.readFileSync(filename).toString();
    res.writeHead(200);
    res.end(contents);
  }
  catch (exp)
  {
    if (req.url.indexOf('first_form?') >= 0)
    {
      var kvs = getFormValuesFromUrl(req.url);
      res.writeHead(200);
      res.end('You submitted the first form');
    }
    else if (req.url.indexOf('second_form?') >= 0)
    {
      var kvs= getFormValuesFromUrl(req.url);
      res.writeHead(200);
      res.end('you have submitted the second form');
    }
    else
    {
      res.writeHead(404);
      res.end('cannot find file' + filename);
    }
  }
}
var server = http.createServer(server_fun);
server.listen(8080);
