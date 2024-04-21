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
                resolve(docs);
            })
        })

        ret = await p1;

        let p2 = new Promise((resolve, reject) => {
            this.db.remove({_id: ret[0]._id}, {}, (err, docs) =>{
                resolve(docs);
            })
        })

        ret = await p2;

        return ret;
    }
}
