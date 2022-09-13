# QuizUp---Backend
## Fetch URL: https://uber.up.railway.app/
### Postman Collection JSON (API testing purpose) : https://github.com/AhindraD/UberEats-Backend/blob/master/UberEats.postman_collection.json
### Postman Screen-Shots : https://github.com/AhindraD/UberEats-Backend/tree/master/images
<br>

# Endpoints

These are minimum endpoints needed, feel free to be more creative and add more endpoints if it improves the flow.
- Auth
  - `POST /auth/signup`  
  - `POST /auth/login`
  - `POST /auth/token`
  
- Restaurants 
  - `POST /restaurants/add`: Creates new restaurant
  
  - `GET /restaurants/all`: List all restaurants
  
  - `GET /restaurants/:id`: Details of restaurants with all dishes offered
  
  - `POST /restuarants/:id/add-dish`: Add new dish for a restaurant
  
  - `GET /restaurants/:id/orders`: Get all orders of a restaurant, should be able to filter by passing `?status=pending` etc. (shows all if no filter query passed)
  
  - `GET /restaurants/:id/revenue?start_date=2022-09-08`: Get revenue of a restaurant for given time range. `end_date` default would be `today`'s date
  
- Orders
  - `POST /orders/add`: Create new order
  - `GET /orders/:id`: Get details of any order
  - `POST /orders/:id/update?status=<pending/completed/cancelled>`: Change status of any order by passing the argument in query

  <br>
  <br>
  <br>
![all requests](https://github.com/AhindraD/UberEats-Backend/blob/master/images/allRequests.PNG?raw=true)
## Tech Stack and Notes
- ExpressJS
- MongoDB
- Postman for API testing.
