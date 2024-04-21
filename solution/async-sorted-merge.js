"use strict";

// Print all entries, across all of the *async* sources, in chronological order.
async function asyncSortedMerge(logSources, printer) {
  let first = [];

  for (let i = 0; i < logSources.length; i++) {
    let pop = await logSources[i].popAsync();
    first.push( {
      date: pop.date,
      msg: pop.msg,
      sourceIndex: i,
    })
  }

  while (first.length > 0) {
    first.sort((a, b) => {
      return a.date - b.date
    })

    let entry = first[0];
    printer.print(entry);
    first.shift();

    let pop = await logSources[entry.sourceIndex].popAsync();
    if (pop === false) {
      continue;
    }

    first.push( {
      date: pop.date,
      msg: pop.msg,
      sourceIndex: entry.sourceIndex,
    })
  }

  printer.done();
}

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {

    asyncSortedMerge(logSources, printer);

    resolve(console.log("Sync sort complete."));
  }); // new Promise

};
