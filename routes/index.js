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

router.post('/testcase', async function (req, res) {
    console.log(req.body)
    // add file contain no of testcases
    await fileWrite(req.body.code.toString(), req.body.input.length.toString())
    // add input files
    const input = req.body.input

    for (var i = 0; i < input.length; i++) {
        await fileWrite(
            'in/' + req.body.code.toString() + '_' + (i + 1),
            req.body.input[i].toString()
        )
    }

    // add output files

    const output = req.body.output
    for (var i = 0; i < output.length; i++) {
        await fileWrite(
            'out/' + req.body.code.toString() + '_' + (i + 1),
            req.body.output[i].toString()
        )
    }

    res.send('Added Succesfully')
})
/* GET home page. */
router.post('/solution/:id', async function (req, res) {
    switch (req.body.language) {
        case 'python':
            await runPy(req.body, res)
            break
    }
})
router.get('/', function (req, res) {
    console.log(' Hello Welcome to Compiler Api ')
})

module.exports = router
