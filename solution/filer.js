const fs = require('fs');
const Datastore = require('nedb')

module.exports =
class Filer {
    constructor(filePath) {
        this.file = filePath + '.txt';
        fs.rmSync(this.file, {force: true});
        //this.db = {};
        this.db = new Datastore({filename: filePath + '.db', autoload: true});
    }

    append(data) {

        this.db.insert(data);

        // Write to file
        fs.appendFile(this.file, JSON.stringify(data) + "\n", (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        //console.log('File created and data written successfully.');
        });

    }

    pop() {
        let ret = {}
        //this.db.loadDatabase();
        console.log("before db.find");
        this.db.find({}).sort({date: 1}).exec(function (err, docs) {
            ret = docs.pop();
        })
        console.log("after db.find");
        //console.log(ret);
        return ret;
    }
}
