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


def find_all_wishlist_movies(movie_users_table, email):
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


def find_delete_movie_index(movid_id, movie_list):
    index = -1
    for i in len(movie_list):
        if movie_list[i]['movie_id'] == movie_id:
            index = i
            break
    return index
            


def delete_movie(movie_users_table, email, movie_id):
    user_details = find_all_wishlist_movies(movie_users_table, email)
    wish_list = user_details.get('Item').get('wishedMovies')
    index = find_delete_movie_index(movid_id, wish_list)
    
    delete_query = "REMOVE wishedMovies[%d]" % (index)
    movie_users_table.update_item(
       Key={
                'email': email
            },
            UpdateExpression = delete_query
    )
    logging.info("user details ended")


def lambda_handler(event, context):
    logging.info("event: {}".format(event))
    
    try:
        dynamodb = boto3.resource('dynamodb')
        movie_users_table = dynamodb.Table('MovieUsers')
        
        email = event['headers']['email']
        movid_id = event['movie_id']
        
        user = is_user_exists(movie_users_table, user_info['email'])
        logging.error("user.get('Item'): {}".format(user))
        if user.get('Item') is None:
            response = generate_response(400, 'User does not exist')
        else:
            
            response = generate_response(200, 'Movie is successufully deleted')
            
    except Exception as e:
        logging.error(str(e))
        response = generate_response(500, 'Internal server error')
        
        
    return response