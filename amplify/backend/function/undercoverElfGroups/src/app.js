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
let indexName = "sk-pk-index";
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

// ME //
app.get("/groups", function(request, response) {
  const groupId = `group_${request.query.id}`;

  if (typeof request.query.id === "undefined" || !request.query.id) {
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
      if (!result.Item) {
        response.json({ statusCode: 404, error: "Group does not exist" });
      } else {
        response.json({
          statusCode: 200,
          url: request.url,
          body: result.Item,
        });
      }
    }
  });
});

app.post("/groups", async function(request, response) {
  const { newGroupInfo, updatedGroupArray } = request.body;
  const groupId = newGroupInfo.pk;

  newGroupInfo.pk = `group_${groupId}`;
  newGroupInfo.sk = "meta";
  newGroupInfo.closed = 0;

  const { pk, exchange, groupName } = newGroupInfo;
  const { name } = newGroupInfo.members[0];

  let params = {
    TableName: tableName,
    Item: newGroupInfo,
  };

  let newUserGroupParams = {
    TableName: tableName,
    Item: {
      pk: newGroupInfo.members[0].pk,
      sk: pk,
      admin: 1,
      closed: 0,
      exchange,
      groupName,
      name,
      wishlist: [],
    },
  };

  let updateUserGroupArrayParams = {
    TableName: tableName,
    Key: {
      pk: newGroupInfo.members[0].pk,
      sk: "profile",
    },
    UpdateExpression: "set groups = :g",
    ExpressionAttributeValues: {
      ":g": updatedGroupArray,
    },
  };

  try {
    await dynamodb.put(params).promise();
    await dynamodb.put(newUserGroupParams).promise();
    await dynamodb.update(updateUserGroupArrayParams).promise();

    response.json({
      statusCode: 200,
      url: request.url,
    });
  } catch (error) {
    response.json({ statusCode: 500, error: error.message });
  }
});

app.patch("/groups", async function(request, response) {
  const groupId = request.query.id;
  const {
    groupInfoToUpdate,
    updateNameOrExchange,
    localStateGroups,
    userId,
  } = request.body;

  // IF CHANGING NAME, NEED TO CHANGE THE GROUPS ARRAY IN USER PROFILE

  if (groupId.length < 1) {
    response.json({
      statusCode: 400,
      error: "Bad request - must specify valid group to delete",
    });
  }

  let paramsUpdateGroupInfo = {
    TableName: tableName,
    Key: {
      pk: `group_${groupId}`,
      sk: "meta",
    },
    ConditionExpression: "attribute_exists(pk)",
    UpdateExpression: "set groupName  = :gn, exchange = :exchange, budget = :b",
    ExpressionAttributeValues: {
      ":gn": groupInfoToUpdate.groupName,
      ":exchange": groupInfoToUpdate.exchange,
      ":b": groupInfoToUpdate.budget,
    },
    ReturnValues: "UPDATED_NEW",
  };

  let paramsGetUsersInGroup = {
    TableName: tableName,
    Key: {
      pk: `group_${groupId}`,
      sk: "meta",
    },
  };

  let paramsUpdateUserGroup = {
    TableName: tableName,
    Key: {},
    ConditionExpression: "attribute_exists(pk)",
    UpdateExpression: "set groupName = :gn, exchange = :exchange",
    ExpressionAttributeValues: {
      ":gn": groupInfoToUpdate.groupName,
      ":exchange": groupInfoToUpdate.exchange,
    },
    ReturnValues: "ALL_NEW",
  };

  let updateUserProfileParams = {
    TableName: tableName,
    Key: {
      pk: userId,
      sk: "profile",
    },
    UpdateExpression: "set groups = :g",
    ExpressionAttributeValues: {
      ":g": localStateGroups,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    // call first func updateGroupInfo
    const updatedGroup = await dynamodb.update(paramsUpdateGroupInfo).promise();

    // if updating name or exchange date, need to go through user groups. Don't if only updating budget. Only need to update group info
    if (updateNameOrExchange) {
      // get members
      const members = await dynamodb.get(paramsGetUsersInGroup).promise();
      // call second fun updateUserGroups - map through the array and make calls
      const memberIds = members.Item.members.map((member) => {
        return member.pk;
      });

      //wait for DynamoDB to update each user item with the group name and exchange date
      const updatedUserGroups = await Promise.all(
        memberIds.map((id) => {
          paramsUpdateUserGroup.Key.pk = id;
          paramsUpdateUserGroup.Key.sk = `group_${groupId}`;
          const updatedUserGroup = dynamodb
            .update(paramsUpdateUserGroup)
            .promise();
          return updatedUserGroup;
        })
      );

      // update the group name inside the array in user profile

      await dynamodb.update(updateUserProfileParams).promise();

      // send updated user group items with exchange date and groupName updated
      response.json({ statusCode: 200, body: updatedUserGroups });
    } else {
      response.json({ statusCode: 200, body: updatedGroup });
    }
  } catch (err) {
    if (err.message === "The conditional request failed") {
      response.json({
        statusCode: 404,
        error: "Not found: Group does not exist",
      });
      return;
    } else {
      response.json({ statusCode: 500, error: err.message });
    }
  }
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
