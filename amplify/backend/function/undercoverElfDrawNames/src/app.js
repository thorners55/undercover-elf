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

app.patch("/draw-names", async function(request, response) {
  if (request.query.id.length < 36 || !request.query.id) {
    response.json({
      statusCode: 400,
      error: "Invalid group ID",
    });
    return;
  }

  const groupId = `group_${request.query.id}`;
  const drawGroupsResponse = request.body;

  let params = {
    TableName: tableName,
    Key: {
      pk: "",
      sk: groupId,
    },
    UpdateExpression: "set buyingForName = :bf, buyingForUserId = :bfuid",
    ReturnValues: "ALL_NEW",
  };

  let closeGroupParams = {
    TableName: tableName,
    Key: {
      pk: groupId,
      sk: "meta",
    },
    UpdateExpression: "set closed = :closed",
    ExpressionAttributeValues: {
      ":closed": 1,
    },
  };

  let postedResponse = [];

  for (let i = 0; i < drawGroupsResponse.length; i++) {
    params.Key.pk = drawGroupsResponse[i].pk;
    params.ExpressionAttributeValues = {
      ":bf": drawGroupsResponse[i].buyingForName,
      ":bfuid": drawGroupsResponse[i].buyingForUserId,
    };
    try {
      const update = await dynamodb.update(params).promise();
      let buyFor = update.Attributes;
      buyFor.name = drawGroupsResponse[i].name;
      buyFor.id = drawGroupsResponse[i].pk;
      postedResponse.push(buyFor);
      if (i === drawGroupsResponse.length - 1) {
        await dynamodb.update(closeGroupParams).promise();
        response.json({ statusCode: 200, body: postedResponse });
        return;
      }
      continue;
    } catch (err) {
      response.json({
        statusCode: 500,
        error: err.message + " - names not drawn! Please try again!",
      });
    }
  }
});

// All methods other than PATCH - error handling
const invalidMethods = ["delete", "post", "get", "head", "put"];

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
