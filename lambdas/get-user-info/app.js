// DynamoDB Connection
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

// DynamoDB Tables
const leavesTable = process.env.leavesTable;
const userinfoTable = process.env.userinfoTable;

// getUserInfo
const getUserInfo = async (userInfo) => {
  var params = {
    TableName: userinfoTable,
    Key: { email: userInfo },
  };
  const res = await ddb.get(params).promise();
  return res.Item;
};

// getPendingRequests
const getPendingRequests = async () => {
  var params = {
    TableName: leavesTable,
  };
  const res = await ddb.scan(params).promise();
  return res.Items;
};

exports.lambdaHandler = async (event, context) => {
  console.log(event);
  event = JSON.parse(event.body);
  try {
    let response;
    response = await getUserInfo(event.email);
    response.pendingRequests = await getPendingRequests();
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify(err),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }
};
