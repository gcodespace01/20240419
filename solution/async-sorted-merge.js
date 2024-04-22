"use strict";
const Utils = require("./utils");

// Print all entries, across all of the *async* sources, in chronological order.
async function asyncSortedMerge(logSources, printer) {
  let first = [];
  const utils = new Utils();

  let promises = [];

  for (let i = 0; i < logSources.length; i++) {
    let promise = logSources[i].popAsync();
    promise.then(entry => {
      first.push( {
        date: entry.date,
        msg: entry.msg,
        sourceIndex: i,
      })
    });
    promises.push(promise);
  }

  await Promise.all(promises).then(() => {
    utils.sort(first);
  })

  while (first.length > 0) {

    let entry = first.shift();
    printer.print(entry);

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

    resolve(console.log("Async sort complete."));
  }); // new Promise

};
