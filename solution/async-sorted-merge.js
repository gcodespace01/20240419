"use strict";
const Utils = require("./utils");

// Print all entries, across all of the *async* sources, in chronological order.
async function asyncSortedMerge(logSources, printer) {
  let first = [];
  const utils = new Utils();

  for (let i = 0; i < logSources.length; i++) {
    let pop = await logSources[i].popAsync();
    first.push( {
      date: pop.date,
      msg: pop.msg,
      sourceIndex: i,
    })
  }

  utils.sort(first);

  while (first.length > 0) {

    let entry = first[0];
    printer.print(entry);
    first.shift();

    let pop = await logSources[entry.sourceIndex].popAsync();
    if (pop === false) {
      continue;
    }

    utils.insert({
      date: pop.date,
      msg: pop.msg,
      sourceIndex: entry.sourceIndex,
    }, first);
  }

  printer.done();
}

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {

    asyncSortedMerge(logSources, printer);

    resolve(console.log("Sync sort complete."));
  }); // new Promise

};
