var express = require('express')
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

async function runCode(body, res) {
    // file name
    var filename = cuid.slug()
    await fileWrite(filename + '.' + body.language, body.code)
    var command = 'cd temp ; ./a.out ' + body.problemcode + ' ' + filename + '.'+
    body.language + '  ; cd .. ;'

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

async function writeTestcase(code, input, output) {
    // add file contain no of testcases
    await fileWrite(code.toString(), input.length.toString())
    // add input files

    for (var i = 0; i < input.length; i++) {
        await fileWrite(
            'in/' + code.toString() + '_' + (i + 1),
            input[i].toString()
        )
    }

    // add output files

    for (var i = 0; i < output.length; i++) {
        await fileWrite(
            'out/' + code.toString() + '_' + (i + 1),
            output[i].toString()
        )
    }
}
router.post('/testcase', async function (req, res) {
    console.log(req.body)
    await writeTestcase(req.body.code, req.body.input, req.body.output)
    res.json('Added Succesfully')
})

router.get('/init-testcase', async function (req, res) {
 const problems =     await Problems.find().exec(async (err, problems) => {
        for (var i = 0; i < problems.length; i++) {
            await writeTestcase(
                problems[i].code,
                problems[i].input,
                problems[i].output
            )
        }
	 res.json({msg:'Test case init succesfull ',problems})
    })
})

router.post('/solution/:id', async function (req, res) {
    const languages = ['py', 'c', 'cpp']

    if (languages.includes(req.body.language)) {
        await runCode(req.body, res)
    } else {
        res.json({ err: 'Language is not valid', success: false })
    }
})
router.get('/', function (req, res) {
    console.log(' Hello Welcome to Compiler Api ')
})

module.exports = router
