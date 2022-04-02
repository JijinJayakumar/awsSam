const moment = require("moment");
const { nanoid } = require("nanoid");
const AWS = require("./config/aws");
const {
  successResponse,
  errorResponse,
  errorHandler,
} = require("./services/response");


// const dynamodb = new AWS.DynamoDB();
// const dynamodbDocClient = new AWS.DynamoDB.DocumentClient();
let response;

exports.s3Handler = async (event, context) => {
  console.log("length", event.Records?.length);
  const s3data = event.Records?.length > 0 ? event.Records[0]?.s3 : {};
  console.log(s3data);
  response = successResponse({
    response: s3data,
    message: "S3 Handler",
  });

  return response;
};

