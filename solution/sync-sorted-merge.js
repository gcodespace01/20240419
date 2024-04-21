"use strict";
const Utils = require("./utils");
const Filer = require("./filer")

const date = require("Faker/lib/date");
const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {

  const filer = new Filer("log")

  const first = [];
  const utils = new Utils();

  for (let i = 0; i < logSources.length; i++) {
    let entry = logSources[i].pop();
    let data = {
      date: entry.date,
      msg: entry.msg,
      sourceIndex: i,
    }
    filer.append(data);
    first.push(data);
  }
  utils.sort(first)

  while (first.length > 0) {

    let entry = first[0];
    //printer.print(entry);
    first.shift();

    filer.pop();

    let pop = logSources[entry.sourceIndex].pop();
    if (pop === false) {
      continue;
    }

    let data = {
      date: pop.date,
      msg: pop.msg,
      sourceIndex: entry.sourceIndex,
    };
    filer.append(data);
    utils.insert(data, first);
  }

  printer.done();

  return console.log("Sync sort complete.");
};
