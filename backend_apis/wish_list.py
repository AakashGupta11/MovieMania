import json
import boto3
import logging


def generate_response(status_code, movies, message=None):
    logging.info("generate response started")
    response = {
        'status': '',
        'body': {
            'movies': ''
        }
    }
    response['status'] = status_code
    response['body']['movies'] = movies
    response['body']['message'] = message
    logging.info("generate response ended")
    return response


def find_user_record(movie_users_table, email):
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



def lambda_handler(event, context):
    logging.info("event: {}".format(event))
    
    try:
        dynamodb = boto3.resource('dynamodb')
        movie_users_table = dynamodb.Table('MovieUsers')
        
        email = event['email']

        user = find_user_record(movie_users_table, email)
        logging.error("user.get('Item'): {}".format(user))
        if user.get('Item') is None:
            response = generate_response(400, None, 'User does not exist')
        else:
            response = generate_response(200, user.get('Item').get('wishedMovies'))
            
    except Exception as e:
        logging.error(str(e))
        response = generate_response(500, None, 'Internal server error')
        
        
    return response