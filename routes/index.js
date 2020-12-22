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
        let r ={}
        if (error) {
            console.log(`error: ${error.message}`);
           // return;
            r["error"] = error
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            //return;
            r["stderr"] = stderr
        }
        r['stdout'] = stdout;
        console.log(`stdout: ${stdout}`);
        //console.log( "printing r");
        //console.log(r);
        return r;
    });
}
async function runCpp(code){
    var filename = cuid.slug();
    var path = './temp/';
    await fsPromises.writeFile(path + filename +'.cpp' , code, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    commmand = 'g++ -Wall -g ' + path + filename +'.cpp -o '+ path + filename+'.out ';
    executeCommand = path + filename + '.out';

    let response = [] 
    await execute(commmand)
    await sleep( 1400);
    await fsPromises.chmod(executeCommand, 0o777 )
    await execute(executeCommand)
}
async function runPy(code){
    var filename = cuid.slug();
    var path = './temp/';
    await fsPromises.writeFile(path + filename +'.py' , code, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    commmand = 'python ' + path + filename +'.py'
    await execute(commmand)

    //  await execute(commmand).then( ( res ) => { response.push( res) ;} ) ;
}


/* GET home page. */
router.post('/solution/:id' ,async function ( req , res , next ) {
    let response = [] 
    switch ( req.body.language ) {
        case "cpp":
            response = runCpp( req.body.code ) ;
            break;
        case "c":
            response = runCpp( req.body.code ) ;
            break;
        case "python":
            response = runPy( req.body.code ) ;
            break;
    }
    console.log( response ) ;
   res.send("received your response") ;
   // execute("  echo `${req.body.code}` > t.cpp");

});
router.get('/', function(req, res, next) {
    console.log( " Hello Welcome to Compiler Api " );
});


module.exports = router;
