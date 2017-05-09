var cmd=require('node-cmd');
var reactProjectName = 'ReactMadnessProject';

module.exports = {
    initProject: function(){
        return initProject();
    },
    generate: function(control) {
        return generate(control);
    },
    build: function(){
        return assembleRelease();
    },
    main: function(){
        return main();
    }

}


function main()
{
    console.log("main");


    



}


function assembleRelease()
{
    console.log("Start building...");
    cmd.get(
        'cd ReactMadnessProject/android && gradlew assembleRelease',
        function(err, data, stderr){
            console.log('Received output',data)
        }
    );
}

function initProject(){
    cmd.get(
        'react-native init ReactMadnessProject',
        function(err, data, stderr){
            console.log('Received output',data)
        }
    );
}

function generate(control)
{
    cmd.get(
        'react-native init ReactMadnessProject',
        function(err, data, stderr){
            console.log('Received output',data)
        }
    );

    return control;
}



