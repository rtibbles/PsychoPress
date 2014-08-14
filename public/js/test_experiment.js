$(function(){
window.localStorage.clear();

window.experiment = new PsychoCoffee.Experiment.Model({title: "Test Experiment"});

window.trial = experiment.get("blocks").create({
    title: "Instructions",
    parameterSet: {
        parameters: {
            stuff: [1,2,3,4,5,6,7,8,9,10],
            others: ["Sometimes","I", "like", "to", "play", "games", "with", "my", "work", "Just sometimes."]
        }
    },
    timeout: 5000
});

experiment.get("blocks").at(0).get("trialObjects").create({
    type: "text",
    text: "You will now hear some sentences.\nSome will be completely audible, others will be difficult to make out.\nFor each sentence, identify whether which emotion they most sound like.",
    duration: 10000,
    delay: 0,
    fontSize: 24,
    fontFamily: "arial",
    fontStyle: "normal",
    x: 400,
    y: 400,
    width: 100,
    height: 100,
    opacity: 0.5,
    parameterizedAttributes: {
        delay: "stuff",
        text: "others"
    },
    triggers: [
        {
            eventName: "keypress",
            objectName: "keyboard",
            callback: "deactivate"
        }
    ]
});

window.block = experiment.get("blocks").at(0).get("trialObjects").create({
    subModelTypeAttribute: "ImageVisualTrialObject",
    duration: 3000,
    delay: 3000,
    file: "/images/test.png",
    triggers: [
        {
            eventName: "keypress",
            objectName: "keyboard",
            callback: "deactivate"
        }
    ]
});

// experiment.get("blocks").at(0).get("trialObjects").create({
//     subModelTypeAttribute: "AudioTrialObject",
//     duration: 8000,
//     delay: 0,
//     file: "/sounds/test.mp3"
// });

experiment.get("blocks").at(0).get("trialObjects").create({
    subModelTypeAttribute: "KeyboardTrialObject",
    duration: 3000,
    delay: 3000,
    name: "keyboard"
});

experimentView = new PsychoCoffee.ExperimentView({model: experiment});

});