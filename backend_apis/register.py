import json
import boto3
import logging


def generate_response(status_code, message):
    logging.info("generate response started")
    response = {
        'status': '',
        'body': {
            'message': ''
        }
    }
    response['status'] = status_code
    response['body']['message'] = message
    logging.info("generate response ended")
    return response


def is_user_exists(movie_users_table, email):
    logging.info("user exists started")
    response = movie_users_table.get_item(
                        Key={
                        'email': email
                    }
                )
    logging.info("user exists ended")
    print(response)
    logging.info("response: {}".format(response))
    return response


def save_user_details(movie_users_table, user_info):
    logging.info("save user started")
    movie_users_table.put_item(
       Item={
           'email': user_info['email'],
           'userInfo': user_info,
           'watchedMovies': [],
           'wishedMovies': []
       }
    )
    logging.info("user details ended")


def lambda_handler(event, context):
    logging.info("event: {}".format(event))
    
    try:
        dynamodb = boto3.resource('dynamodb')
        movie_users_table = dynamodb.Table('MovieUsers')
        
        user_info = {
            "username": event['username'],
            "email": event['email'],
            "password": event['password'],
            "contact": event['contact']
        }
        user = is_user_exists(movie_users_table, user_info['email'])
        logging.error("user.get('Item'): {}".format(user))
        if user.get('Item') is None:
            save_user_details(movie_users_table, user_info)
            response = generate_response(201, 'User is successfully saved')
        else:
            response = generate_response(400, 'User with given email already exists')
            
    except Exception as e:
        logging.error(str(e))
        response = generate_response(500, 'Internal server error')
        
        
    return response