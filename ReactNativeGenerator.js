var cmd=require('node-cmd');
var fs  = require("fs");
var projects = "projects_path";

module.exports = {
    initProject: function(projectName){
        return initProject(projectName);
    },
    generate: function(projectName, buttonName) {
        return generateButton(projectName, buttonName);
    },
    build: function(projectName){
        return assembleRelease(projectName);
    },
    main: function(){
        return main();
    }
}


function main()
{
    console.log("main");
}

function generateButton(projectName, buttonName)
{

    console.log(projectName);
    console.log(buttonName);

    var inViewStructure = false;
    var previousLine = "";
    var content = "";

    fs.readFileSync('./' + projects + '/' +projectName+'/index.android.js').toString().split('\n').forEach(function (line) {
        
        if(previousLine.indexOf("<View") > -1) {
            inViewStructure = true;
        }

        if(line.indexOf("</View>") > -1) {
            
            inViewStructure = false;
            line = "<Button onPress={() => {console.log(\"ceva\") }} title=\"" + buttonName + "\" />" + "\r\n" + line;

        }

        previousLine = line;

        if(content === "")
        {
            content += "import {Button} from 'react-native';"
        }

        content += line + "\r\n";
    });


    fs.writeFileSync('./' + projects + '/' +projectName+'/index.android.js', content.toString() + "\n");
    console.log("Generated a new Button");
}


function getFileContent(srcPath, callback) { 
    fs.readFile(srcPath, 'utf8', function (err, data) {
        if (err) throw err;
        callback(data);
        }
    );
}

function copyFileContent(savPath, srcPath) { 
    getFileContent(srcPath, function(data) {

        fs.writeFile (savPath, data, function(err) {
            if (err) throw err;
            console.log('complete');
        });
    });
}

function assembleRelease(projectName)
{
    console.log("Start building...");
    cmd.get(
        'cd ' + projects + '/' + projectName + '/' + 'android && gradlew assembleRelease',
        function(err, data, stderr){
            console.log('Received output',data)
        }
    );
    
}

function initProject(projectName){

    console.log("initProject " + projectName + " from reactNativeGenerator...");
    cmd.get(
        'cd ' + projects + ' && react-native init ' + projectName.toString(),
        function(err, data, stderr){
            console.log('Received output',data)
        }
    );
    console.log("initProject from reactNativeGenerator...");
}

function generate(control)
{


    cmd.get(
        'react-native init ReactMadnessProject',
        function(err, data, stderr){
            console.log('Received output',data);
        }
    );

    return control;
}



