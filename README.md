# Small group frontend

This is a the frontend portion of code for my smallgroup app. This frontend app is built using Javascript. This app is made for a user to submit bible study topics. This app has the following features:

* Utilizes JSON Web Tokens and localStorage to store encrypted user information client-side.
* Performs fetch requests to Rails API backend using postgreSQL database.
* Rails API outputs ActiveRecord objects via JSON serializer.
* Uses object oriented Javascript classes to encapsulate behavior which results in separation of concerns design pattern.
* Implements Quill rich text editor to allow users to submit photos and videos along with blog.

The bible study topics can be revised via rich text format via [Quill editor](https://quilljs.com/). A user can post the bible topic, add bible passages, and add comments to bible topics. For the frontend, this contains the classes that mirror the models for the backend for the user, topics, comments, and passages. This app uses CORS to communicate to the front end. Also, the authenticity of the posts are verified with JSON web tokens. The output of the JSON uses JSON fast API to serialize the data that is fetched. For a demo of this app, [go here](https://smallgroups.netlify.app). A video walkthrough can be found in [youtube](https://www.youtube.com/watch?v=gzb9VecaUb0). 

[![small group](http://img.youtube.com/vi/gzb9VecaUb0/0.jpg)](http://www.youtube.com/watch?v=gzb9VecaUb0)

The code for the backend of this app can be found at [my github link](https://github.com/ting682/smallgroup-backend). If there are comments or questions, please email me [here](mailto:tchung682@gmail.com)