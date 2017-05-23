var cmd=require('node-cmd');
var fs  = require("fs");

module.exports = {
    initProject: function(projectName){
        return initProject(projectName);
    },
    generate: function(control) {
        return generate(projectName, control);
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

function generateButton(projectName, buttonName)
{
    var inViewStructure = false;
    var previousLine = "";
    var content = "";


    fs.readFileSync('./'+projectName+'/index.android.js').toString().split('\n').forEach(function (line) {
        

        if(previousLine.indexOf("<View") > -1) {
            inViewStructure = true;
        }

        if(line.indexOf("</View>") > -1) {
            
            inViewStructure = false;
            line = "<Button onPress={() => {console.log(\"ceva\") }} title=\"Learn More\" />" + "\r\n" + line;

        }

        previousLine = line;

        if(content === "")
        {
            content += "import {Button} from 'react-native';"
        }

        content += line + "\r\n";
    });


    fs.writeFileSync("./"+projectName+"/index.android.js", content.toString() + "\n");

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

function initProject(projectName){
    cmd.get(
        'react-native init ' + projectName.toString(),
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
            console.log('Received output',data);
        }
    );

    return control;
}



