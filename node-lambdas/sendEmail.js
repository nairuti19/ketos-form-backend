const AWS = require("aws-sdk");

exports.handler = function (event, context, callback) {
  AWS.config.update({ region: "us-east-2" });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .button {
            background-color: #3879B6;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
        }
        </style>
      </head>
      <body>
        <p>Hi,</p>
        <p>You are recieveing because you are the admin for customer support. </p>
      <a href="#" class="button">Reply to customer</a>
      </body>
    </html>
  `;

  // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: ["jeeth.sellamuthu@ketos.co"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Customer Support Complaint Received",
      },
    },
    Source: "From Nairuti<nairuti96@gmail.com>",
  };

  // Create the promise and SES service object
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  sendPromise
    .then((res) => {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers":
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
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
      });
    });
};
