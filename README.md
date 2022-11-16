# QuizUp---Backend
## Fetch URL: https://kahoot.up.railway.app/
### Postman Collection JSON (API testing purpose) : https://github.com/AhindraD/QuizUp---Backend/blob/master/QuizUp.postman_collection.json
### Postman Screen-Shots : 
<br>

# Endpoints

These are minimum endpoints needed, feel free to be more creative and add more endpoints if it improves the flow.
- Auth
  - `POST /auth/signup`  
  - `POST /auth/login`
  - `POST /auth/token`
  
- Quiz
  - `POST /quiz/add`: 
  
  - `POST /quiz/edit/:quizID`: 
  
  - `GET /quiz/all`: 
  
  - `GET /quiz/:quizID`: 
  
  - `DELETE /quiz/delete/:quizID
  
- Subject
  - `POST /subject/add`: 
  - `GET /subject/all`: 
  - `GET /subject/:subID`: 
  - `DELETE /subject/delete/:subID

  <br>
  <br>
  <br>
![all requests](https://github.com/AhindraD/QuizUp---Backend/blob/master/Routes/snap-api.PNG?raw=true)
## Tech Stack and Notes
- ExpressJS
- MongoDB
- Postman for API testing.
