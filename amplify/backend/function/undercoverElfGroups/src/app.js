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

let tableName = "undercoverElfTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

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

// ME //
app.get("/groups", function(request, response) {
  console.log(request.query.id, "<---- REQUEST");
  const groupId = `group_${request.query.id}`;

  if (typeof request.query.id === "undefined") {
    response.json({
      statusCode: 404,
      error: "Not found: Request requires a query with group ID",
    });
    return;
  }

  let params = {
    TableName: tableName,
    Key: {
      pk: groupId,
      sk: "meta",
    },
  };

  dynamodb.get(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({
        statusCode: 200,
        url: request.url,
        body: JSON.stringify(result.Item),
      });
    }
  });
});

app.post("/groups", function(request, response) {
  const groupId = request.body.pk;

  request.body.pk = `group_${request.body.pk}`;
  request.body.sk = "meta";
  request.body.closed = 0;

  let params = {
    TableName: tableName,
    Item: request.body,
  };

  dynamodb.put(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({
        statusCode: 200,
        url: request.url,
        body: {
          admin: request.body.admin,
          group: groupId,
        },
      });
    }
  });
});

app.patch("/groups", function(request, response) {
  const groupId = request.query.id;

  if (groupId.length < 1) {
    response.json({
      statusCode: 400,
      error: "Bad request - must specify valid group to delete",
    });
  }

  let params = {
    TableName: tableName,
    Key: {
      pk: `group_${groupId}`,
      sk: "meta",
    },
    KeyConditionExpression: "#n = :n",
    ConditionExpression: "attribute_exists(pk)",
    ExpressionAttributeNames: {
      "#n": "name",
    },
    UpdateExpression: "set #n = :n, exchange = :exchange",
    ExpressionAttributeValues: {
      ":n": request.body.name,
      ":exchange": request.body.exchange,
    },
    ReturnValues: "UPDATED_NEW",
  };

  dynamodb.update(params, (error, result) => {
    if (error) {
      if (error.message === "The conditional request failed") {
        response.json({
          statusCode: 404,
          error: "Not found: Group does not exist",
        });
        return;
      }
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({
        statusCode: 200,
        url: request.url,
        body: JSON.stringify(result.Item),
      });
    }
  });
});

app.delete("/groups", function(request, response) {
  response.json({ statusCode: 405, error: "Method not allowed" });
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
