const moment = require("moment");
const { nanoid } = require("nanoid");
const AWS = require("./config/aws");
const {
  successResponse,
  errorResponse,
  errorHandler,
} = require("./services/response");


// const dynamodb = new AWS.DynamoDB();
const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();
let response;

exports.loginUser = async (event, context) => {
  try {
    const data = await dynamodbDocClient
      .scan({
        TableName: "users",
        ProjectionExpression: "user_id, #name, department,email",
        ExpressionAttributeNames: {
          "#name": "name",
        },
      })
      .promise();
    response = successResponse({
      response: data,
      message: "Users login successfully",
    });
  } catch (error) {
    response = errorResponse({
      response: error,
      message: "Error fetching users",
    });
  }
    console.log("SUCESSS-----------------------------");

  return response;
};

