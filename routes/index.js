var express = require('express');
var router = express.Router();
var fs = require('fs');
const fsPromises = require('fs').promises;
var cuid = require('cuid');

const { exec } = require("child_process");


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function  execute( command ) {
    await exec(command , (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
/* GET home page. */
router.post('/solution/:id' ,async function ( req , res , next ) {
    console.log( req.body.code ) ;
    var filename = cuid.slug();
	var path = './temp/';
    await fsPromises.writeFile(path + filename +'.cpp' , req.body.code, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    commmand = 'g++ -Wall -g ' + path + filename +'.cpp -o '+ path + filename+'.out ';
    executeCommand = path + filename + '.out';
    await execute(commmand);
    await sleep( 1400);
    await fsPromises.chmod(executeCommand, 0o777 )
    await execute(executeCommand);
    res.send("received your response") ;
   // execute("  echo `${req.body.code}` > t.cpp");

});
router.get('/', function(req, res, next) {
    console.log( " Hello Welcome to Compiler Api " );
});


module.exports = router;
