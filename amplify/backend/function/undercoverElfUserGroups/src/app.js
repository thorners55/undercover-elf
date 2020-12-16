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

app.get("/users/:id/groups", function(request, response) {
  // if there is a request query, it is fetching the user wishlist
  if (request.query.wishlist) {
    const userId = request.params.id;
    const groupId = request.query.groupId;

    let params = {
      TableName: tableName,
      Key: {
        pk: userId,
        sk: groupId,
      },
      AttributesToGet: ["wishlist", "name", "groupName"],
    };

    dynamodb.get(params, function(error, result) {
      if (error) {
        response.json({ statusCode: 500, error: error.message });
      } else if (!result.Item) {
        response.json({ statusCode: 404, error: "User or group not found" });
      } else {
        response.json({ statusCode: 200, body: result.Item });
      }
    });
  } else {
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
          if (!result.Item) {
            response.json({
              statusCode: 404,
              error: "User or group not found",
            });
          } else {
            response.json({
              statusCode: 200,
              url: request.url,
              body: result.Item,
            });
          }
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
          response.json(result.Items);
        }
      });
    }
  }
});

app.post("/users/:id/groups", async function(request, response) {
  const userId = request.params.id;
  const groupId = request.query.groupId;
  request.body.userInfo.pk = `user_${userId}`;
  request.body.userInfo.sk = `group_${groupId}`;

  if (request.body.userInfo.name === undefined || !userId || !groupId) {
    // not sure if need this part - think I got confused using .post instead of .patch for updating wishlist. Leaving it here just in case.
    if (request.query.groupId.length < 1) {
      response.json({ statusCode: 405, error: "Method not allowed" });
      return;
    } else if (!userId || !group) {
      response.json({ statusCode: 400, error: "Bad request" });
    }
  } else {
    let params = {
      TableName: tableName,
      Item: request.body.userInfo,
    };

    let groupParams = {
      TableName: tableName,
      Key: {
        pk: `group_${request.query.groupId}`,
        sk: "meta",
      },
      UpdateExpression: "set members = :m",
      ExpressionAttributeValues: {
        ":m": request.body.newMembers,
      },
      ReturnValues: "ALL_NEW",
    };

    let updateUserGroupArrayParams = {
      TableName: tableName,
      Key: {
        pk: request.body.userInfo.pk,
        sk: "profile",
      },
      UpdateExpression: "set groups = :g",
      ExpressionAttributeValues: {
        ":g": request.body.updatedGroupArray,
      },
    };

    try {
      // adds an item for the user in group, e.g. pk: user_id, sk: group_id
      await dynamodb.put(params).promise();

      // add group info to user profile ("groups")
      // { admin: 0, groupId, groupName}
      await dynamodb.update(updateUserGroupArrayParams).promise();

      // updates group metadata to include the new user in its members array/info
      const result = await dynamodb.update(groupParams).promise();

      response.json({
        statusCode: 200,
        url: request.url,
        body: result.Attributes,
      });
    } catch (error) {
      response.json({ statusCode: 500, error: error.message });
    }
  }
});

app.patch("/users/:id/groups", function(request, response) {
  const userId = request.params.id;
  const groupId = request.query.groupId;

  if (!userId || !groupId) {
    response.json({ statusCode: 400, error: "Missing user or group ID" });
  } else {
    let params = {
      TableName: tableName,
      Key: {
        pk: userId,
        sk: groupId,
      },
      UpdateExpression: "set wishlist = :wishlist",
      ExpressionAttributeValues: {
        ":wishlist": request.body,
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
          body: result.Item,
        });
      }
    });
  }
});

app.delete("/users/:id/groups", async function(request, response) {
  const userId = `user_${request.params.id}`;
  const groupId = `group_${request.query.groupId}`;

  const { memberRemoved, groupRemoved } = request.body;

  if (request.query.groupId.length < 1) {
    response.json({ statusCode: 405, error: "Method not allowed" });
    return;
  }

  let params = {
    TableName: tableName,
    Key: {
      pk: userId,
      sk: groupId,
    },
  };

  let removeUserFromGroupParams = {
    TableName: tableName,
    Key: {
      pk: groupId,
      sk: "meta",
    },
    UpdateExpression: "set members = :m",
    ExpressionAttributeValues: {
      ":m": memberRemoved,
    },
    ReturnValues: "ALL_NEW",
  };

  let removeGroupFromUserProfile = {
    TableName: tableName,
    Key: {
      pk: userId,
      sk: "profile",
    },
    UpdateExpression: "set groups = :g",
    ExpressionAttributeValues: {
      ":g": groupRemoved,
    },
  };

  try {
    // delete the user group entry
    await dynamodb.delete(params).promise();

    // remove the member from the array of members in the group meta item
    await dynamodb.update(removeUserFromGroupParams).promise();

    // remove group array index from user profile by updating user profile group attribute
    await dynamodb.update(removeGroupFromUserProfile).promise();

    response.json({
      statusCode: 204,
      url: request.url,
    });
  } catch (error) {
    response.json({ statusCode: 500, error: error.message });
  }
});

app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
