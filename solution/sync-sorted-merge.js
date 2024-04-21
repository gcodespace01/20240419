"use strict";

const date = require("Faker/lib/date");
const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {

  const first = [];
  for (let i = 0; i < logSources.length; i++) {
    let entry = logSources[i].pop();
    first.push( {
      date: entry.date,
      msg: entry.msg,
      sourceIndex: i,
    }
    );
  }

  while (first.length > 0) {
    first.sort((a, b) => {
      return a.date - b.date
    })

    let entry = first[0];
    printer.print(entry);
    first.shift();

    let pop = logSources[entry.sourceIndex].pop();
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

  return console.log("Sync sort complete.");
};
