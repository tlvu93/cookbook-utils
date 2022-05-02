const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

// Get Data from JSON file
const filePath = 'parsedFood.json';
let rawdata = fs.readFileSync(filePath);
let foodData = JSON.parse(rawdata);

// Config for request
const config = {
  headers: {
    Authorization: `Bearer ${process.env.Authorization}`,
  },
};

// Map through all data and send a request for each
foodData.forEach((food) => {
  axios
    .post(
      'https://wbs-cookbook-backend.herokuapp.com/api/ingredients',
      food,
      config
    )
    .then((response) => {
      console.log(response);
    });
});
