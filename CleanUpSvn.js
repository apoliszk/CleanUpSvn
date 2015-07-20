var args = process.argv;
var rootPath = args[2];
if (!rootPath) {
    console.log('Add a parameter as the root path.\nEg.\n        node CleanUpSvn.js D:/TestDirectory');
    return;
}

var rmFolderName = ".svn";

var fs = require('fs');
var os = require("os");
var isWindowsPlatform = os.platform().indexOf('win') == 0;

cleanUpSvn(rootPath);

function cleanUpSvn(path) {
    if (!fs.existsSync(path)) {
        console.log('File path does not exist, please check the path.');
        return;
    }
    var files = fs.readdirSync(path);
    var subPath;
    files.forEach(function (name) {
        subPath = path + '/' + name;
        if (fs.statSync(subPath).isDirectory()) {
            if (name == rmFolderName) {
                console.log('rmdir ' + subPath);
                rmdir(subPath);
            } else {
                cleanUpSvn(subPath);
            }
        }
    });
}

function rmdir(path) {
    var files = fs.readdirSync(path);
    var subPath;
    files.forEach(function (name) {
        subPath = path + '/' + name;
        if (fs.statSync(subPath).isDirectory()) {
            rmdir(subPath);
        } else {
            if (isWindowsPlatform) {
                fs.chmodSync(subPath, 666);
            }
            fs.unlinkSync(subPath);
        }
    });
    if (isWindowsPlatform) {
        fs.chmodSync(path, 666);
    }
    fs.rmdirSync(path);
}