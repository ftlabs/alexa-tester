# Alexa Tester

## How To Use

Run against an Alexa Skill by specifying the file path of the skill model, skill endpint, and the file path of function mapping:

```$ node index.js endpoint_url skill_model_path function_mapping_path```

## Skill Model

The skill model that needs to be passed to the tester is not the same as the Interaction Model defined in the Alexa Developer Console. Models are defined in a tree structure. Below is an example of a simple model where a 'No' intent after launch should end the skill session. Alexa Tester will validate that this is correct.

```
{
    "requestType": "LaunchRequest",
    "children": [
        {
            "requestType": "IntentRequest",
            "name": "AMAZON.NoIntent",
            "shouldEndSession": true            
        }
    ]
}
```

Nodes in the tree have the following attributes:

- `requestType`: "LaunchRequest" or "IntentRequest"
- (optional) `name`: a string. This is required for intent requests
- (optional) `children`: an array of request nodes
- (optional) `slots`: a slot object (see below)
- (optional) `shouldEndSession`: true or false

Slots follow a similiar format to those sent in requests to the Alexa Skill endpoint. Each slot is defined as an attribute of the slots object. Each slot needs a name and a value.
Slot values can be literal, for example you can test what happens when you pass a string or number. However, Alexa Tester is powerful in that it supports functions for values. These functions must be defined by the developer and they take, as input, the response from the previous request. By using this information, developers can direct conversations down specific logical paths, for example given a quiz question you can test both the correct and incorrect answer path.

```
"slots": {
    "Answer": {
        "name": "Answer",
        "value": {
            "function": "correctAnswer"
        }
    }
}
```

To make use of functions with Alexa Tester you must define a function mapping in a separate file

```
const functionMapping = {
    "correctAnswer": correctAnswer,
    "incorrectAnswer": incorrectAnswer
};

function correctAnswer(outputSpeech) {
    ...
}

function incorrectAnswer(outputSpeech) {
    ...
}

module.exports = functionMapping;
```

