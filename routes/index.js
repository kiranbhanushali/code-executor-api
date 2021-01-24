var express = require('express')
var router = express.Router()
var fs = require('fs')
const fsPromises = require('fs').promises
var cuid = require('cuid')

const { exec } = require('child_process')
const db = require('../models')
const Problems = db.problem
// Problems.find().exec((err, animal) => {
//     console.log(animal)
// })
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function fileWrite(filename, content) {
    var path = './temp/'
    fsPromises.writeFile(path + filename, content, function (err) {
        if (err) throw err
        console.log('error to save ' + filename)
    })
}

async function runPy(body, res) {
    // file name
    var filename = cuid.slug()
    await fileWrite(filename + '.py', body.code)
    var command =
        'cd temp ; ./a.out ' +
        body.problemcode +
        ' ' +
        filename +
        '.py  ; cd ..'

    console.log(command)
    await exec(command, (error, stdout, stderr) => {
        let r = {}
        r['error'] = error
        r['stderr'] = stderr
        r['stdout'] = stdout
        // console.log( "From the execute function");
        // console.log(r);

        res.json(r)
    })
}

async function runCpp(code, res) {
    //file name
    var filename = cuid.slug()
    var path = './temp/'

    //file create
    await fsPromises.writeFile(path + filename + '.cpp', code, function (err) {
        if (err) throw err
        console.log('Saved!')
    })

    //compile & execute  command
    let command =
        'g++ -Wall -g ' +
        path +
        filename +
        '.cpp -o ' +
        path +
        filename +
        '.out '
    let executeCommand = path + filename + '.out'

    var response = {}
    await exec(command, (error, stdout, stderr) => {
        let r = {}
        r['error'] = error
        r['stderr'] = stderr
        r['stdout'] = stdout
        // console.log( "From the execute function");
        // console.log(r);
        response['compile'] = r
    })

    await sleep(1400) // for compiling purpose ( need to optimize)
    await fsPromises.chmod(executeCommand, 0o777)
    await exec(executeCommand, (error, stdout, stderr) => {
        let r = {}
        r['error'] = error
        r['stderr'] = stderr
        r['stdout'] = stdout
        // console.log( "From the execute function");
        // console.log(r);
        response['exe'] = r
        res.send(response)
    })
}

router.post('/testcase', function (req, res) {
    res.send('Added Succesfully')
})
/* GET home page. */
router.post('/solution/:id', async function (req, res) {
    switch (req.body.language) {
        case 'cpp':
            await runCpp(req.body.code, res)
            break
        case 'c':
            await runCpp(req.body.code, res)
            break
        case 'python':
            await runPy(req.body, res)
            break
    }
})
router.get('/', function (req, res) {
    console.log(' Hello Welcome to Compiler Api ')
})

module.exports = router
