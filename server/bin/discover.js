/* eslint-disable quotes, comma-dangle, max-len */
"use strict";
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const log = console.log;
const logErr = console.error;

let outputPath = path.resolve(__dirname, "../../common/models");
let modelConfigPath = path.resolve(__dirname, "../model-config.json");
let modelConfig = require(modelConfigPath);
let jsBase = path.resolve(__dirname, "base.js");
let tables = {};

// select connector from datasources.json
const datasources = require(path.resolve(__dirname, "../datasources.json")).mysqlSED;
const loopback = require("loopback");
const ds = loopback.createDataSource("mysqlSED", datasources);

// discover all tables from schema database
ds.discoverModelDefinitions({schema: "SED", all: true}, (err, models) => {
  if (err) {
    end(err);
    return;
  }
  _.forEach(models, (model) => {
    tables[model.name] = {modelName: "", tableName: model.name, processed: false};
    ds.discoverSchemas(model.name, {all: true, relations: true}, createModel);
  });
});

let end = (err) => {
  let code = 0;
  if (err) code = -1;
  process.exit(code);
};

let checkListTables = () => {
  for (let i in tables) {
    let table = tables[i];
    if (table.processed == false) return false;
  }
  return true;
};

let createModel = (err, schemas) => {
  if (err) {
    logErr(err);
    return;
  }
  // the models are generated
  for (let i in schemas) {
    let schema = schemas[i];
    let outputJsonModel = outputPath + "/" + schema.name + ".json";
    let outputJsModel = outputPath + "/" + schema.name + ".js";
    let tableName = schema.options.mysql.table;
    tables[tableName].processed = true;
    tables[tableName].modelName = schema.name;
    schema.plural = _.lowerCase(schema.name);
    schema.plural = _.replace(schema.plural, " ", "-");

    if (!fs.existsSync(outputJsonModel))
      fs.writeFile(outputJsonModel, JSON.stringify(schema, null, 2), (err) => {
        if (err) logErr(err);
      });

    if (!fs.existsSync(outputJsModel))
      fs.copyFile(jsBase, outputJsModel, (err) => {
        if (err) logErr(err);
      });
    log("model create: " + outputJsonModel);
  }

  if (checkListTables()) {
    // I write the model-config.json
    for (let i in tables) {
      let table = tables[i];
      modelConfig[table.modelName] = {
        dataSource: "mysqldbSED",
        public: true,
        options: {
          remoting: {
            sharedMethods: {
              "*": true
            }
          }
        }
      };
    }
    fs.writeFile(modelConfigPath, JSON.stringify(modelConfig, null, 2), (err) => {
      if (err) {
        logErr(err);
        end(true);
      }
      log("SUCCESSFULLY COMPLETED!!");
      end();
    });
  }
};
