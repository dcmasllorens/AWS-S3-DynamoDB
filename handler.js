'use strict';

const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();

aws.config.update({ region: 'eu-west-3' });

module.exports.lambda = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  var today = new Date();

  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  console.log("CreationDate: " + creationDate)
  console.log("ObjectName: " + key)

  const params = {
    "TableName": 's3-data',
    "Item": {
      "ObjectName": { "S": key },
      "CreationDate": { "S": creationDate }
    }
  };

  console.log("Params: " + params.Item)

  try {
    var result = await dynamodb.putItem(params).promise();
    console.log("Item entered successfully:", result);
    statusCode: 200
  } catch (err) {
    console.log(err);
    statusCode: 400
  }
};
