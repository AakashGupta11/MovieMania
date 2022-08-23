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


def add_movie_to_wishlist(movie_users_table, email, movie_info):
    response = movie_users_table.update_item(
            Key={
            'email': email
        },
        UpdateExpression="set watchedMovies = list_append(watchedMovies, :val)",
        ExpressionAttributeValues={
            ':val': [movie_info]
        },
        ReturnValues="UPDATED_NEW"
    )
    return response


def lambda_handler(event, context):
    logging.info("event: {}".format(event))
    
    try:
        dynamodb = boto3.resource('dynamodb')
        movie_users_table = dynamodb.Table('MovieUsers')
        
        email = event['email']
        movie_info = {
            "runtime": event['runtime'],
            "posterPath": event['poster_path'],
            "movieId": event['id'],
            "title": event['title'],
            "overview": event['overview']
        }
        user = is_user_exists(movie_users_table, email)
        logging.error("user.get('Item'): {}".format(user))
        if user.get('Item') is None:
            response = generate_response(400, 'User does not exist')
        else:
            add_movie_response = add_movie_to_wishlist(movie_users_table, email, movie_info)
            response = generate_response(201, 'Movie info is added to wishlist')
            
    except Exception as e:
        logging.error(str(e))
        response = generate_response(500, 'Internal server error')
        
        
    return response