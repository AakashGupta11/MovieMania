# MovieMania

Movie Mania is Movie web app for movie lovers in which we can see information about different movie like their cast, release date and also a brief about the plot of the movies. We can search and also see similar movies for the selected movie. We can also maintain a database in which we can store movies as Wishlist and watched list and we can remove data from the same. For a new user there is a registration page and for existing user they can simply enter with login credentials. This movie web app will be based on serverless architecture, the front end is developed in Angular and deployed on S3 bucket and backend API will be deployed on lambda AWS services. There will be several lambdas functions which will serve the purpose of API, which will communicate with our AWS DynamoDB service. The API gateway will act as a routing orchestrator that will route to different APIs. Some other movie APIs will be use to fetch movie information which user will request.