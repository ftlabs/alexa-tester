'use strict';
const helper = require('./helpers/helper');
const rp = require('request-promise');

function getSimpleNode(node) {
    let simpleNode = {
        type: node.requestType
    };
    if (node.name) {
        simpleNode.name = node.name
    }
    if (node.slots) {
        simpleNode.slots = node.slots;
    }
    if (node.shouldEndSession) {
        simpleNode.shouldEndSession = node.shouldEndSession;
    }
    return simpleNode;
}

function traverseTree(node) {
    let paths = [];
    traverse(node, [], paths);
    return paths;
}

function traverse(node, path, paths) {
    // Update to find and resolve loops
    if (node.children) {
        for (let childNode of node.children) {
            let newPath = path.slice();
            newPath.push(getSimpleNode(node));
            traverse(childNode, newPath, paths);
        }
    } else {
        path.push(getSimpleNode(node));
        paths.push(path);
    }
}

async function testSkillTree(skillTreeJson, endpoint, functionMap) {
    const json = await helper.getInteractionModelFromJSON(skillTreeJson);
    const model = JSON.parse(json);

    const paths = traverseTree(model);  
    
    const info = {
        applicationId: 'amzn1.echo-sdk-ams.app.123',
        userId: 'test-user',
        requestId: 'request-id-1234',
        locale: 'en-GB',
        newSession: true
    };

    return Promise.all(paths.map((path, i) => {
        const session = {
            sessionId: (i + '').padStart(4, "0")
        };
        return testPath(path, endpoint, info, session, functionMap);
    }));
}

async function testPath(path, endpoint, info, session, functionMap) {
    let pathResponses = [];
    let attributes = {};
    
    for (let i = 0; i < path.length; i++) {
        let node = path[i];
        if (node.type !== "LaunchRequest") {
            info.newSession = false;
        }
        if (node.slots) {
            const functionName = node.slots.Answer.value.function;
            const answerValue = await functionMap[functionName](attributes.speechOutput);
            node.slots.Answer.value = answerValue;
        }
        const newRequest = helper.buildRequest(info, session, attributes, node);

        const response = await rp({
            method: 'POST',
            uri: endpoint,
            body: newRequest,
            json: true
        });

        attributes = response.sessionAttributes || {};

        pathResponses[i] = {
            node: node,
            response: response
        };

        if (node.shouldEndSession) {
            if (response.response.shouldEndSession) {
                return {
                    responseTree: pathResponses,
                    success: true,
                    report: "Session Ended As Expected"
                };
            } else {
                return {
                    responseTree: pathResponses,                    
                    success: false,
                    report: "ERROR: Session Did Not End As Expected",
                };
            }
        }
        if (i === path.length - 1) {
            return {
                responseTree: pathResponses,     
                success: true,           
                report: "Branch Ended"
            }
        }
    }
}

module.exports = testSkillTree;
