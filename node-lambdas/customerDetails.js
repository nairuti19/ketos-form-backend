"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const id = requestBody.id;
  const email = requestBody.email;
  const complaint = requestBody.complaint;
  const firstname = requestBody.firstname;
  const lastname = requestBody.lastname;

  if (
    typeof email !== "string" ||
    typeof complaint !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string"
  ) {
    callback(
      new Error("Couldn't submit candidate because of validation errors.")
    );
    return;
  }

  submitCandidate(candidateInfo(email, firstname, lastname, complaint, id))
    .then((res) => {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers":
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        body: JSON.stringify({
          message: `Sucessfully submitted candidate with email ${email}`,
          candidateId: res.id,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers":
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        body: JSON.stringify({
          message: `Unable to submit candidate with email ${email}`,
        }),
      });
    });
};

const submitCandidate = (candidate) => {
  const candidateInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: candidate,
  };
  return dynamoDb
    .put(candidateInfo)
    .promise()
    .then((res) => candidate);
};

const candidateInfo = (email, firstname, lastname, complaint, id) => {
  const timestamp = new Date().getTime();
  return {
    id: id,
    email: email,
    firstname: firstname,
    lastname: lastname,
    complaint: complaint,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};
