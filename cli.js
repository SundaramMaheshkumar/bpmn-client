"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { BPMNClient } from "bpmn-client";
const _1 = require("./");
const readline = require("readline");
const dotenv = require('dotenv');
const res = dotenv.config();
console.log(res);
const server = new _1.BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);
const cl = readline.createInterface(process.stdin, process.stdout);
const question = function (q) {
    return new Promise((res, rej) => {
        cl.question(q, answer => {
            res(answer);
        });
    });
};
completeUserTask();
function menu() {
    console.log('Commands:');
    console.log('	q	to quit');
    console.log('	s	start process ');
    console.log('	lo	list outstanding items');
    console.log('	li	list items');
    console.log('	l	list instances for a process');
    console.log('	di	display Instance information');
    console.log('	i	Invoke Task');
    console.log('	sgl	Signal Task');
    console.log('	msg	Message Task');
    console.log('	d	delete instnaces');
    console.log('	?	repeat this list');
}
function completeUserTask() {
    return __awaiter(this, void 0, void 0, function* () {
        menu();
        let option = '';
        var command;
        while (option !== 'q') {
            command = yield question('Enter Command, q to quit\n\r>');
            let opts = command.split(' ');
            option = opts[0];
            switch (option) {
                case '?':
                    menu();
                    break;
                case 'lo':
                    console.log("Listing Outstanding Items");
                    yield findItems({ "items.status": "wait" });
                    break;
                case 'l':
                    console.log("Listing Instances for a Process");
                    yield listInstances();
                    break;
                case 'li':
                    console.log("list items");
                    yield listItems();
                    break;
                case 'di':
                    console.log("Displaying Instance Details");
                    yield displayInstance();
                    break;
                case 'i':
                    console.log("invoking");
                    yield invoke();
                    break;
                case 's':
                    console.log("Starting Process");
                    yield start();
                    break;
                case 'sgl':
                    console.log("Signalling Process");
                    yield signal();
                    break;
                case 'msg':
                    console.log("Message Process");
                    yield message();
                    break;
                case 'd':
                    console.log("deleting");
                    yield delInstances();
                    break;
            }
        }
        console.log("bye");
        cl.close();
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide your process name: ');
        let taskData = yield question('Please provide your Task Data (json obj) if any: ');
        console.log(taskData);
        try {
            if (taskData === "") {
                taskData = {};
            }
            else {
                taskData = JSON.parse(taskData.toString());
            }
        }
        catch (exc) {
            console.log(exc);
            return;
        }
        let response = yield server.engine.start(name, taskData);
        console.log("Process " + name + " started:", 'InstanceId', response.id);
        return yield displayInstance(response.id);
    });
}
function findItems(query) {
    return __awaiter(this, void 0, void 0, function* () {
        var items = yield server.datastore.findItems(query);
        console.log(items);
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            console.log(`${item.name} - ${item.elementId}	instanceId:	${item['instanceId']}`);
        }
    });
}
function listItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield question('Please items criteria name value pair; example: items.status wait ');
        let str = '' + answer;
        const list = str.split(' ');
        let criteria = {};
        console.log(list);
        for (var i = 0; i < list.length; i += 2) {
            console.log(list[i], list[i + 1]);
            criteria[list[i]] = list[i + 1];
        }
        console.log(criteria);
        var items = yield server.datastore.findItems(criteria);
        console.log(items.length);
        for (var j = 0; j < items.length; j++) {
            let item = items[j];
            console.log(`element: ${item.elementId} status: ${item.status}  processName: ${item['processName']} InstanceId: ${item['instanceId']}	id:	${item.id}`);
        }
    });
}
function listInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide your process name: ');
        let insts = yield server.datastore.findInstances({ name: name });
        for (var i = 0; i < insts.length; i++) {
            let inst = insts[i];
            console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
        }
    });
}
function displayInstance(instanceId = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (instanceId == null)
            instanceId = yield question('Please provide your Instance ID: ');
        let insts = yield server.datastore.findInstances({ id: instanceId });
        for (var i = 0; i < insts.length; i++) {
            let inst = insts[i];
            var items = inst.items;
            console.log(`name: ${inst.name} status: ${inst.status}	instanceId:	${inst.id}
	startedAt: ${inst.startedAt} endedAt ${inst.endedAt}`, 'data:', inst.data);
            for (var j = 0; j < items.length; j++) {
                let item = items[j];
                console.log(`element: ${item.elementId} status: ${item.status}	id:	${item.id}`);
            }
        }
    });
}
function invoke() {
    return __awaiter(this, void 0, void 0, function* () {
        const instanceId = yield question('Please provide your Instance ID: ');
        const taskId = yield question('Please provide your Task ID: ');
        let taskData = yield question('Please provide your Task Data (json obj) if any: ');
        if (taskData === "") {
            taskData = {};
        }
        else {
            taskData = JSON.parse(taskData.toString());
        }
        try {
            let response = yield server.engine.invoke({ id: instanceId, "items.elementId": taskId }, taskData);
            console.log("Completed UserTask:", taskId);
            return yield displayInstance(response.id);
        }
        catch (exc) {
            console.log("Invoking task failed for:", taskId, instanceId);
            yield findItems({ id: instanceId, "items.elementId": taskId });
        }
    });
}
function signal() {
    return __awaiter(this, void 0, void 0, function* () {
        const signalId = yield question('Please provide signal ID: ');
        let signalData = yield question('Please provide your Data (json obj) if any: ');
        //if (typeof signalData === 'string' && signalData.trim() === '') {
        if (signalData === "") {
            signalData = {};
        }
        else {
            try {
                signalData = JSON.parse(signalData.toString());
            }
            catch (exc) {
                console.log(exc);
                return;
            }
        }
        let response = yield server.engine.throwSignal(signalId, signalData);
        console.log("Signal Response:", response);
    });
}
function message() {
    return __awaiter(this, void 0, void 0, function* () {
        const messageId = yield question('Please provide message ID: ');
        let messageData = yield question('Please provide your Data (json obj) if any: ');
        if (typeof messageData === 'string' && messageData.trim() === '') {
            messageData = {};
        }
        else {
            messageData = JSON.parse(messageData.toString());
        }
        let response = yield server.engine.throwMessage(messageId, messageData);
        if (response['id'])
            return yield displayInstance(response['id']);
        else {
            console.log(' no results.');
            return null;
        }
    });
}
function delInstances() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield question('Please provide process name to delete instances for process: ');
        let response = yield server.datastore.deleteInstances({ name: name });
        console.log("Instances Deleted:", response['result']['deletedCount']);
    });
}
