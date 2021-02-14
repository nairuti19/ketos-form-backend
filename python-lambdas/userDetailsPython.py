import boto3
import json
import os


def lambda_handler(message, context):

    if 'id' not in message:
        return {}
    
    params = {
    'userId': {'S': message['id']},
    'FirstName': {'S': message['firstname']},
    'LastName': {'S': message['lastname']},
    'Email': {'S': message['email']},
    'Complaint': {'S': message['complaint']},
    }
    
    client = boto3.client('dynamodb')
    response = client.put_item(TableName = 'users-table-dev', Item = params)
    print('User added to table, done')
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('User Details Stored!')
    }
