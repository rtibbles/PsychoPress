$(function(){
window.localStorage.clear();

PsychoCoffee.DEBUG = true;

experiment = new PsychoCoffee.Experiment.Model({title: "Test Experiment"});

block1 = experiment.createBlock({
    title: "Instructions",
    parameterSet:{
        trialParameters: [
            {
                parameterName: "stuff",
                parameters: [1,2,3,4,5,6,7,8,9,10],
                parameterizedAttributes: {
                    parameters: "blockDelays"
                }
            },
            {
                parameterName: "others",
                parameters: ["Sometimes","I", "like", "to", "play", "games", "with", "my", "work", "Just sometimes."]
            }
        ],

        blockParameters: [
            {
                parameterName: "blockDelays",
                parameters: [[1,2,3,4,5,6,7,8,9,10], [100,200,300,400,500,600,700,800,900,1000]]
            },
            {
                parameterName: "blockTexts",
                parameters: [["what", "this?"], ["no", "this"]],
                dataType: "array",
                shuffled: true
            }
        ]

    },
    // triggers: [
    //     {
    //         eventName: "keypress",
    //         objectName: "keyboard",
    //         callback: "endTrial"
    //     }
    // ],
    timeout: 10000000
});

// block1.createTrialObject({
//     type: "text",
//     text: "You will now hear some sentences.\nSome will be completely audible, others will be difficult to make out.\nFor each sentence, identify whether which emotion they most sound like.",
//     duration: 10000000,
//     delay: 0,
//     fontSize: 24,
//     fontFamily: "arial",
//     fontStyle: "normal",
//     x: 400,
//     y: 400,
//     width: 100,
//     height: 100,
//     opacity: 0.5,
//     parameterizedAttributes: {
//         delay: "stuff",
//         text: "others"
//     },
//     triggers: [
//         {
//             eventName: "keypress",
//             objectName: "keyboard",
//             callback: "deactivate"
//         },
//         {
//             eventName: "click",
//             objectName: "tux",
//             callback: "deactivate"
//         }
//     ]
// });

window.test = block1.createTrialObject({
    type: "text",
    text: "",
    duration: 10000000,
    delay: 0,
    fontSize: 12,
    fontFamily: "arial",
    fontStyle: "normal",
    x: 100,
    y: 100,
    width: 600,
    height: 100,
    opacity: 0.5,
    triggers: [
        {
            eventName: "keypress",
            objectName: "keyboard",
            callback: "addText"
        }
    ]
});

block1.createTrialObject({
    type: "text-input",
    placeholder: "Type here!",
    prompt: "What is your favourite colour?",
    duration: 10000000,
    delay: 0,
    fontSize: 12,
    fontFamily: "arial",
    fontStyle: "normal",
    x: 100,
    y: 100
});

// block1.createTrialObject({
//     subModelTypeAttribute: "AudioTrialObject",
//     duration: 8000,
//     delay: 0,
//     file: "/sounds/test.mp3"
// });

block1.createTrialObject({
    subModelTypeAttribute: "KeyboardTrialObject",
    duration: 10000000,
    delay: 0,
    name: "keyboard"
});

block1.createTrialObject({
    subModelTypeAttribute: "CircleVisualTrialObject",
    duration: 10000000,
    delay: 0,
    name: "circle",
    radius: 25,
    y: 300,
    x: 300,
    fill: "#FF0000"
});

block1.createTrialObject({
    subModelTypeAttribute: "RectangleVisualTrialObject",
    duration: 10000000,
    delay: 0,
    name: "rectangle",
    radius: 25,
    y: 400,
    x: 400,
    height: 100,
    width: 200,
    fill: "#FF0000"
});

block1.createTrialObject({
    subModelTypeAttribute: "ImageVisualTrialObject",
    duration: 100000,
    y: 300,
    x: 300,
    delay: 0,
    file: "/images/test.png",
    name: "tux"
});

// group = block1.createTrialObject({
//     subModelTypeAttribute: "GroupTrialObject",
//     duration: 10000000,
//     delay: 0,
//     name: "group1"
// });

// group.createTrialObject({
//     name: "texthere",
//     type: "text",
//     duration: 10000000,
//     delay: 0,
//     text: "This is here",
//     fontSize: 16,
//     fontFamily: "arial",
//     fontStyle: "normal",
//     x: 100,
//     y: 200,
//     width: 600,
//     height: 100,
//     opacity: 0.5,
//     backgroundColor: "#0000FF",
//     parameterizedAttributes: {
//         text: "blockTexts"
//     }
// });

// group.createTrialObject({
//     name: "textthere",
//     type: "text",
//     duration: 10000000,
//     delay: 0,
//     text: "This is there",
//     fontSize: 16,
//     fontFamily: "arial",
//     fontStyle: "normal",
//     x: 100,
//     y: 300,
//     width: 600,
//     height: 100,
//     opacity: 0.5,
//     fill: "#000000",
//     backgroundColor: "#FF0000",
//     parameterizedAttributes: {
//         text: "blockTexts"
//     }
// });

experimentView = new PsychoCoffee.ExperimentView({model: experiment});

});