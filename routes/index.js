var express = require('express');
var router = express.Router();
var fs = require('fs');
const fsPromises = require('fs').promises;
var cuid = require('cuid');

const { exec } = require("child_process");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPy( code ,res ) {

    // file name 
    var filename = cuid.slug();
    var path = './temp/';

    // creating file 

    await fsPromises.writeFile(path + filename +'.py' , code, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    // execute the command 
  var command = 'python ' + path + filename +'.py'
  await exec(command , (error, stdout, stderr) => {
        let r ={}
        r["error"] = error
        r["stderr"] = stderr
        r['stdout'] = stdout;
       // console.log( "From the execute function");
       // console.log(r);
        return res.send( r );
    });
}

async function runCpp(code , res ){
    //file name 
    var filename = cuid.slug();
    var path = './temp/';


    //file create 
    await fsPromises.writeFile(path + filename +'.cpp' , code, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    

    //compile & execute  command 
    let command = 'g++ -Wall -g ' + path + filename +'.cpp -o '+ path + filename+'.out ';
    let executeCommand = path + filename + '.out';

    var response ={};
     await exec(command , (error, stdout, stderr) => {
        let r ={}
        r["error"] = error
        r["stderr"] = stderr
        r['stdout'] = stdout;
       // console.log( "From the execute function");
       // console.log(r);
         response["compile"] = r ;
    });

    await sleep( 1400); // for compiling purpose ( need to optimize) 
    await fsPromises.chmod(executeCommand, 0o777 )
    await exec(executeCommand , (error, stdout, stderr) => {
        let r ={}
        r["error"] = error
        r["stderr"] = stderr
        r['stdout'] = stdout;
        // console.log( "From the execute function");
        // console.log(r);
        response["exe"] = r ;
        res.send( response ) ;
    });

}


/* GET home page. */
router.post('/solution/:id' ,async function ( req , res , next ) {
    switch ( req.body.language ) {
        case "cpp":
            await runCpp( req.body.code , res ) ;
            break;
        case "c":
            await runCpp( req.body.code , res ) ;
            break;
        case "python":
            await  runPy( req.body.code , res ) ;
            break;
    }
})
router.get('/', function(req, res, next) {
    console.log( " Hello Welcome to Compiler Api " );
});


module.exports = router;
