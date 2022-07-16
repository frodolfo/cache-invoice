# Frontend take home assignment

As part of our application process, we'd like to see some code you develop so we can have a conversation around it. 
Your mission, should you choose to accept it, is to spend about 2 hours and create a single page app (SPA).

We’re looking for code that is clean, readable, performant, and maintainable. We are most interested in problem solving skills and seeing how you tackle technical challenges that our common in our daily work.

## Requirements (in priority order)
  
We would like you to create a simple invoicing app with the following features:

 - [ ] Create a new invoice. Required fields w/ example:
```
  "customer_email": "john@test.com",
  "customer_name": "John Daly",
  "description": "For services rendered",
  "due_date": "2022-02-10",
  "status": "draft","approved","sent", paid"
  "total": 35000
``` 
 - [ ] Add 1 or many line items to the invoice. Line items may include a breakdown of each thing being invoiced for with an amount
 - [ ] The ability to edit an invoice if its still in draft
 - [ ] The ability to approve an invoice and send it out via email (email doesnt need to be actually sent, simulated is okay)
 - [ ] View a list of invoices by status 

Your backend can be anything, and does not have to work. If you would like to use a mocked-out interface, that is fine (even static data in code is ok).

#### Bonus features (always in priority order)

 - [ ] Persist data to storage 
 - [ ] send the email
 - [ ] View late invoices, or even better, alert when an invoice is late
 - [ ] Persist and display event history for an invoice. (ex: created, updated, approved, sent etc...)

## Tech Stack

You should use the following tools:

 - React
 - Typescript

## Getting Started

1. Clone this repo

2. In the project directory, run:

### `npm install`

3. Then run

### `npm start`

If you have any questions, ask away!

To complete your homework, please fork this repo and commit your work to your fork. When you are ready for us to look at it, give us access to your fork so we can review and run it.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
