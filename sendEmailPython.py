import boto3
import json
from botocore.exceptions import ClientError
 

def lambda_handler(event, context):
    send_email()
    return{
        'statusCode': 200, 
        'body': json.dumps('Email sent!') 
    }
   
def send_email():
    SENDER = "ketos-no-reply <nairuti96@gmail.com>"
    RECIPIENT = "jeeth.sellamuthu@ketos.co"
    AWS_REGION = "us-east-2"
    
    SUBJECT = "Customer Support Complaint Received"
    
    BODY_HTML = """<html>
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
    </html> """            
    
    CHARSET = "UTF-8"
    
    client = boto3.client('ses',region_name=AWS_REGION)
    
    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )

    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:")
        print(response['MessageId'])