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

- requestType: "LaunchRequest" or "IntentRequest"
- (optional) name: a string. This is required for intent requests
- (optional) children: an array of request nodes
- (optional) slots: a slot object (see below)
- (optional) shouldEndSession: true or false
