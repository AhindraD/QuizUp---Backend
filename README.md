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
  - `POST /restaurants/add`: 
  
  - `GET /restaurants/all`: 
  
  - `GET /restaurants/:id`: 
  
  - `POST /restuarants/:id/add-dish`: 
  
  - `GET /restaurants/:id/orders`: Get all orders of a restaurant, should be able to filter by passing `?status=pending` etc. (shows all if no filter query passed)
  
  - `GET /restaurants/:id/revenue?start_date=2022-09-08`: Get revenue of a restaurant for given time range. `end_date` default would be `today`'s date
  
- Other
  - `POST /orders/add`: 
  - `GET /orders/:id`: 
  - `POST /orders/:id/update?status=<pending/completed/cancelled>`: Change status of any order by passing the argument in query

  <br>
  <br>
  <br>
![all requests](https://github.com/AhindraD/UberEats-Backend/blob/master/images/allRequests.PNG?raw=true)
## Tech Stack and Notes
- ExpressJS
- MongoDB
- Postman for API testing.
