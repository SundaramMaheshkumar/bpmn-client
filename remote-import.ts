
//FromPostMan();
//request('test4', 'Trans.bpmn');
import { BPMNClient } from './';


console.log('remote-import.ts');

fromClientLib();

console.log('-------------------');
//FromPostMan();

async function fromClientLib() {

    console.log('from client lib');
    const server = new BPMNClient('localhost', 3000, '12345');

    var name = 'test-import';
    var file = 'E:\\x4\\dev\\webApp\\processes\\Trans.bpmn';

    var res=await server.definitions.import(name, file);
    //console.log(res.length);
    return res;
}
async function FromPostMan() {

    console.log("Testing Remote import");
    var file = 'E:\\x4\\dev\\webApp\\processes\\Trans.bpmn';


    var http = require('follow-redirects').http;
    //const http = require('http');

    var fs = require('fs');

    var options = {
        'method': 'POST',
        'hostname': 'localhost',
        'port': 3000,
        'path': '/api/definitions/import/testing4',
        'headers': {
            'x-api-key': '12345',
            'Cookie': 'connect.sid=s%3AXMa01DuOlQ4WsrvBj0FVaIrTak49vLPB.hDIV9j7ONA437rZf%2F%2Biu%2Bc6B7T5%2FVuEIjj1BAaoCJW4'
        },
        'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\"Trans.bpmn\"\r\nContent-Type: \"text/plain\"\r\n\r\n" + fs.readFileSync(file) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    req.write(postData);

    req.end();

    return req;

}


async function request(name,path) {

    console.log("Testing Request");


    var http = require('http');
    var fs = require('fs');

    var options = {
        'method': 'POST',
        'hostname': 'localhost',
        'port': 3000,
        'path': '/api/definitions/import/'+name,
        'headers': {
            'x-api-key': '12345',
            'Cookie': 'connect.sid=s%3AXMa01DuOlQ4WsrvBj0FVaIrTak49vLPB.hDIV9j7ONA437rZf%2F%2Biu%2Bc6B7T5%2FVuEIjj1BAaoCJW4'
        },
        'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
        + path + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" +
        fs.readFileSync(path) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    req.write(postData);

    req.end();
    console.log('end');
}