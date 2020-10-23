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

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "pk";
const partitionKeyType = "S";
const sortKeyName = "sk";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/users/:id/groups";
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

app.get("/users/:id/groups", function(request, response) {
  const userId = `user_${request.params.id}`;
  const groupId = `group_${request.query.groupId}`;

  for (let i = 0; i < request.params.id.length; i++) {
    if (typeof i !== "number") {
      response.json({
        statusCode: 400,
        error: "Bad request",
      });
      return;
    }
  }

  if (request.query.groupId) {
    var params = {
      TableName: tableName,
      Key: {
        pk: userId,
        sk: groupId,
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
  } else {
    var params = {
      TableName: tableName,
      KeyConditionExpression: "pk = :pk AND begins_with ( sk , :sk )",
      ExpressionAttributeValues: {
        ":pk": userId,
        ":sk": "group_",
      },
    };

    dynamodb.query(params, (error, result) => {
      if (error) {
        response.statusCode = 500;
        response.json({ error: "Could not load items: " + err.message });
      } else {
        if (result.Items) {
          if (result.Items.length < 1) {
            response.statusCode = 404;
            response.json({
              error:
                "Not found: User does not exist or is not a member of any groups",
            });
          } else {
            response.json(result.Items);
          }
        } else {
          response.json(result);
        }
      }
    });
  }
});

app.post("/users/:id/groups", function(request, response) {
  const userId = `user_${request.params.id}`;
  const groupId = `group_${request.query.groupId}`;
  request.body.pk = userId;
  request.body.sk = groupId;

  if (request.body.name === undefined) {
    let params = {
      TableName: tableName,
      Key: {
        pk: userId,
        sk: groupId,
      },
      UpdateExpression: "set wishlist = :wishlist",
      ExpressionAttributeValues: {
        ":wishlist": request.body.wishlist,
      },
      ReturnValues: "UPDATED_NEW",
    };

    dynamodb.update(params, (error, result) => {
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
  } else {
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
          body: JSON.stringify(result.Item),
        });
      }
    });
  }
});

app.delete("/users/:id/groups", function(request, response) {
  const userId = `user_${request.params.id}`;
  const groupId = `group_${request.query.groupId}`;
  request.body.pk = userId;
  request.body.sk = groupId;

  let params = {
    TableName: tableName,
    Key: request.body,
  };

  dynamodb.delete(params, function(error, result) {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({
        statusCode: 200,
        url: request.url,
      });
    }
  });
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
