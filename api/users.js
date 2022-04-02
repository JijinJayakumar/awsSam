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

exports.getAllUsers = async (event, context) => {
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
      message: "Users fetched successfully",
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
exports.CreateUser = async (event, context) => {
  const jsonBody = JSON.parse(event.body);
  const itemData = {
    user_id: nanoid(8),
    created_at: moment().toISOString(),
    email: jsonBody.email ,
    password: jsonBody.password,
    name: jsonBody.name,
    department: jsonBody.department,
  };
  try {
    const data = await dynamodbDocClient
      .put({
        TableName: "users",
        Item: itemData,
      })
      .promise();
    response = successResponse({
      response: data,
      message: "User created successfully",
    });
  } catch (error) {
    response = errorResponse({
      response: error,
      message: "Error creating user",
    });
  }

  return response;
};
exports.DeleteUser = async (event, context) => {
  let userid = event.pathParameters.id;
  try {
    const creratedAtSortKey = await getCreatedAt(userid).catch(errorHandler);
    await dynamodbDocClient
      .delete({
        TableName: "users",
        Key: {
          user_id: userid,
          created_at: creratedAtSortKey,
        },
      })
      .promise();
    response = successResponse({
      response: "",
      message: "User deleted successfully",
    });
  } catch (error) {
    response = errorResponse({
      response: error,
      message: "Error deleting user",
    });
  }

  return response;
};
exports.UpdateUser = async (event, context) => {
  const jsonBody = JSON.parse(event.body);
  const userId = event.pathParameters.id;
  try {
    const creratedAtSortKey = await getCreatedAt(userId).catch(errorHandler);

    const data = await dynamodbDocClient
      .update({
        TableName: "users",
        Key: {
          user_id: userId,
          created_at: creratedAtSortKey,
        },
        UpdateExpression: "set #n =:n, department=:d",
        ExpressionAttributeNames: {
          "#n": "name",
        },
        ExpressionAttributeValues: {
          ":n": jsonBody.name,
          ":d": jsonBody.department,
        },
      })
      .promise();

    response = successResponse({
      response: data,
      message: "User updated successfully",
    });
  } catch (error) {
    response = errorResponse({
      response: error,
      message: "Error updating user",
    });
  }
  return response;
};

const getCreatedAt = async (id) => {
  try {
    const data = await dynamodbDocClient
      .scan({
        TableName: "users",
        FilterExpression: "user_id = :id",
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
      .promise();
    return data?.Items[0] ? data?.Items[0]?.created_at : null;
  } catch (error) {
    console.log(error);
    throw new Error("Unable to fetch given data");
  }
};
