"use strict";
const Utils = require("./utils");

const date = require("Faker/lib/date");
const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {

  const first = [];
  const utils = new Utils();

  for (let i = 0; i < logSources.length; i++) {
    let entry = logSources[i].pop();
    first.push( {
      date: entry.date,
      msg: entry.msg,
      sourceIndex: i,
    }
    );
  }
  utils.sort(first)

  while (first.length > 0) {

    let entry = first.shift();
    printer.print(entry);

    let pop = logSources[entry.sourceIndex].pop();
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

  return console.log("Sync sort complete.");
};
