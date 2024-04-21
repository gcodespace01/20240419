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

    async pop() {
        var ret = null;

        let p1 = new Promise((resolve, reject) => {
            this.db.find({}).sort({date: 1}).limit(1).exec( (err, docs) =>{
                this.db.remove({_id: docs[0]._id}, {multi: true}, (err, docs) =>{
                    resolve(docs);
                })
                resolve(docs);
            })
        })

        ret = await p1;

        console.log("p1.ret="+JSON.stringify(ret));

        let p2 = new Promise((resolve, reject) => {
            this.db.remove({}, {multi: true}, (err, docs) =>{
                resolve(docs);
            })
        })

        console.log("p2.ret="+JSON.stringify(ret));

        return ret;
    }
}
