/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require("aws-sdk");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var bodyParser = require("body-parser");
var express = require("express");

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let indexName = "sk-pk-index-prod";
let tableName = "undercoverElfTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "pk";
const partitionKeyType = "S";
const sortKeyName = "sk";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/draw-groups";
const UNAUTH = "UNAUTH";
const hashKeyPath = "/:" + partitionKeyName;
const sortKeyPath = hasSortKey ? "/:" + sortKeyName : "";
// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
};

app.get("/draw-groups", function(request, response) {
  if (request.query.id.length < 36 || !request.query.id) {
    response.json({ statusCode: 400, error: "Invalid group ID" });
    return;
  }

  const groupId = `group_${request.query.id}`;

  let params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: "sk = :sk AND begins_with ( pk , :pk )",
    ExpressionAttributeValues: {
      ":sk": groupId,
      ":pk": "user_",
    },
  };

  dynamodb.query(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      const stringifiedResponse = JSON.stringify(result.Items);

      if (stringifiedResponse === "[]") {
        response.json({ statusCode: 404, error: "Group not found" });
        return;
      }

      response.json({
        statusCode: 200,
        url: request.url,
        body: result.Items,
      });
    }
  });
});

// All methods other than GET - error handling
const invalidMethods = ["delete", "post", "patch", "head", "put"];

invalidMethods.forEach((method) => {
  app[method]("/draw-names", function(request, response) {
    response.json({ statusCode: 405, error: "Method not allowed" });
  });
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
