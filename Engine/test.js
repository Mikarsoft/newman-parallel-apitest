/**
 * @fileOverview A sample script to demonstrate parallel collection runs using async.
 */
const fs = require('fs');
const cc = require('./combine-collections');
const testFolder = '../PostmanJsonCollections/';
var delayStart = 0;
var resultData = [];
var differentNames = [];
var resultsCount = 0;
var filesNumber = 0;
var times = parseInt(process.argv[2]);

fs.readdirSync(testFolder).forEach(async file => {
    console.log(file);
    filesNumber += 1;
    flip(times,file);
});

function flip(times,file){
    runs = newmanFunctions(times,file);
    let startAfter = 0;
    runs.forEach(run=>{
        setTimeout(()=> TheTests(run),10000*startAfter);
        startAfter +=4;
    });
    delete runs;
}

async function TheTests(runs){
    global.gc();
    let async = require('async');
    async.parallel(runs);
    delete runs;
    delete async;
}


function addDelay(){
    delayStart +=1;
    if(delayStart>30){
        delayStart = 1;
    }
}

function addResult(result){
    resultData.push(result);
    if(differentNames.indexOf(result.name)==-1){
        differentNames.push(result.name);
    }
}

function countFinish(){
    resultsCount +=1;
    if(resultsCount >= times * filesNumber ){
        //console.log(resultData);
        //console.log(differentNames);
        let resultHtml = generateReport();
        openResultPage(resultHtml);
    }
}

function generateReport(){
    let result = `
    <style>
        .bodybg{
            background: black;
        }

        .header{
            color: blue;
            font-family: verdana;
            font-size:30px;
        }

        .request{
            color:green;
            font-family:verdana;
            font-size:22px;
        }
        .timeout{
            color: red;
            font-family:verdana;
            font-size: 22px;
        }

        .time{
            color: yellow;
            font-family:verdana;
            font-size: 22px;
        }
    </style>
    `;
    differentNames.forEach(name=>{
        let reqData = resultData.filter(x=>x.name===name);

        let errors = 0;
        let averageTime = 0;
        let loops = 0;
        reqData.forEach(line=>{
            if(line.status!=200){
                errors+=1;
            }
            averageTime += line.time;
            loops+=1;
        });
        result += `
        <body class='bodybg'>
        <div class='header'>request Name:${name}</div><br>
        <div class='request'>total requests:${times.toString()}</div><br>
        <div class='timeout'>timed out requests:${(times-loops).toString()}</div><br>
        <div class='timeout'>errors:${errors.toString()}</div><br>
        <div class='time'>average request time:${(averageTime/loops).toFixed(2).toString()}ms</div><br><br>
        </body>`;
    })
    return result;
}

function openResultPage(responseHtml){
    const http = require('http');
    const portfinder = require('portfinder');

    const hostname = 'localhost';
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(responseHtml);
    });

    portfinder.getPort({port:36100,stopPort:36900},(err,port) =>{
        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
          });
    
        let open = require('open');
        
        open(`http://localhost:${port}`);
    });

}

function newmanFunctions(times,file){
    let runs = [];
    let quotient = Math.floor(times/50);
    let newman = require('newman');

    let testFolderL = '../PostmanJsonCollections/';

    let options = {
        collection: testFolderL + file,
        timeout:5000,
        reporters: 'cli'
    };

    parallelCollectionRun = function () {
        addDelay();
        setTimeout(()=>{
            newman.run(options, (err,result) =>{
                if(err){
                    result.collection.items.members.forEach(member =>{
                        addResult({
                            name:member.name,
                            status:400,
                            time:3000
                        });
                    });

                    countFinish();
                }
                else{
                    result.run.executions.forEach(ex =>{
                        addResult({
                            name:ex.item.name,
                            status:ex.response.code,
                            time:ex.response.responseTime
                        })
                    });
                    countFinish();
                }   
                delete result;
                delete err;
            }).on('done', (err,args)=>{
                delete newman;
                delete this;
            });
        },delayStart *1000);
    };

    if(times > 5){
        let allruns = Array(50).fill(parallelCollectionRun);
    
        for (let i = 0; i < quotient; i++) {
            runs.push(allruns);
        }
    }
    else{
        let oneRun = Array(5).fill(parallelCollectionRun);;
        runs.push(oneRun);
    }

    delete newman;
    return runs;
}

