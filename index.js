const fs = require('fs');

const getNutrient = (foodNutrients, name) => {
  return foodNutrients.filter((el) => el.nutrient.name === name)[0];
};

const getNutritionValue = (foodNutrients, nutrient_name, fallback_name) => {
  let nutrient = getNutrient(foodNutrients, nutrient_name);

  try {
    return nutrient.amount;
  } catch {
    nutrient = getNutrient(foodNutrients, fallback_name);
    if (!nutrient) return undefined;
    return nutrient.amount;
  }
};

const getFatValue = (foodNutrients) => {
  return getNutritionValue(
    foodNutrients,
    'Total fat (NLEA)',
    'Total lipid (fat)'
  );
};

const getCarbValue = (foodNutrients) => {
  return getNutritionValue(
    foodNutrients,
    'Carbohydrate, by difference',
    'Carbohydrate, by summation'
  );
};

const getProteinValue = (foodNutrients) => {
  return getNutritionValue(foodNutrients, 'Protein', '');
};

const getEnergyValue = (foodNutrients) => {
  return getNutritionValue(foodNutrients, 'Energy', '');
};

const parseFoodDataCentral = () => {
  // Get data from JSON file
  const filePath = 'FoodData_Central_foundation_food_json_2022-04-28.json';

  let rawdata = fs.readFileSync(filePath);
  let foodData = JSON.parse(rawdata);

  // Return a mapped array with relevant data
  return foodData.FoundationFoods.map((food) => {
    const nutrients = food.foodNutrients;

    return {
      data: {
        ingredient_name: food.description,
        carbohydrates: getCarbValue(nutrients),
        protein: getProteinValue(nutrients),
        fat: getFatValue(nutrients),
        kcal: getEnergyValue(nutrients),
      },
    };
  });
};

const foodData = parseFoodDataCentral();

fs.writeFile(
  'parsedFood.json',
  JSON.stringify(foodData, null, 2),
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);
