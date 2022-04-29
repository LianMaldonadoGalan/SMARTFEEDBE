/* eslint-disable no-undef */
import knexfile from "../knexfile";
import Pino from 'pino'

const logger = Pino()

const pg = knexfile

export async function algoMenu(data) {
    const infoNeeded = ['meals_qty', 'goal', 'is_vegeterian', 'weight', 'height', 'birth_date', 'physical_activity', 'sex']
    const updated_at = new Date().toISOString()
    // get user data
    const userInfo = await pg.select('*').from('user_data').where({id_user: data});

    // check if user data is complete
    const userDataComplete = infoNeeded.every(info => userInfo[0][info] !== null && userInfo[0][info] !== '')
    if(!userDataComplete) {
        logger.error('user data is not complete');
        return { error: 'user data is not complete' };
    }
    const menu = await createMenu(userInfo[0])
    
    // update menu to user_pref
    const updateMenu = await pg("user_pref").returning(['id_user_pref', 'id_user', 'id_user', 'menu_json', 'created_at', 'updated_at'])
    .where({id_user: data})
    .update({
        menu_json: JSON.stringify(menu),
        updated_at
    });
    let response
    if(updateMenu.length > 0) {
        response = { msg: 'menu updated', data: updateMenu[0] };
        logger.info({response}, 'menu updated')
    }
    else{
        response = { msg: 'menu not updated' };
        logger.error({response}, 'menu not updated')
    }
    
    return response
}

function tbm(weight, height, age, sex) {
    let tbm = 0
    if (sex === 'M')
        tbm = 66 + (13.7 * weight) + (5 * height) - (6.75 * age)
    else
        tbm = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)

    return tbm
}

function finalCalories(userInfo) {
    const {
        weight,
        height,
        birth_date: birthDate,
        sex,
        physical_activity: physicalActivity
    } = userInfo

    const age = calculateAgeByBirthDate(birthDate.toISOString())
    
    const tbmValue = tbm(weight, height, age, sex)

    let activityValue = 1.2

    if (physicalActivity === '1') {
        activityValue = 1.2
    } else if (physicalActivity === '2') {
        activityValue = 1.375
    } else if (physicalActivity === '3') {
        activityValue = 1.55
    } else if (physicalActivity === '4') {
        activityValue = 1.72
    } else if (physicalActivity === '5') {
        activityValue = 1.9
    }

    return Math.floor(tbmValue * activityValue)
}

async function createMenu(userInfo) {
    const {
        meals_qty: mealQty,
        goal,
        is_vegeterian: isVegetarian
    } = userInfo
    const isVeggie = isVegetarian === 'T' ? 'V' : 'C'
    let types

    const mealCaloriePercent = 1 / mealQty

    const eachWeekDay = {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {}
    }

    const finalCaloriesValue = finalCalories(userInfo)

    let totalCalories = finalCaloriesValue
    // 1 = lower weight, 2 = maintain weight, 3 = higher weight
    if (goal === '1') {
        totalCalories = finalCaloriesValue - 300
    } else if (goal === '2') {
        totalCalories = finalCaloriesValue
    } else if (goal === '3') {
        totalCalories = finalCaloriesValue + 300
    }
    if (mealQty === 2) {
        types = ['desayuno', 'comida']
    } else if (mealQty === 3) {
        types = ['desayuno', 'comida', 'cena']
    } else if (mealQty === 4) {
        types = ['desayuno', 'almuerzo', 'comida', 'cena']
    } else if (mealQty === 5) {
        types = ['desayuno', 'almuerzo', 'comida', 'merienda', 'cena']
    }
    const minCalories = totalCalories * mealCaloriePercent - 200
    const maxCalories = totalCalories * mealCaloriePercent + 200

    const allMeals = await pg.select('*').from('meals').whereBetween('meal_calories', [minCalories, maxCalories]).where({
        meal_type: isVeggie
    })

    Object.keys(eachWeekDay).forEach(day => {
        types.forEach(meal => {
            const mealsFiltered = allMeals.filter(m => m.meal_main_type.toUpperCase() === meal.toUpperCase()).map(i => i.id_meal)
            if(mealsFiltered.length > 0) {
                const randomMeals = pickRandomMeals(mealsFiltered)
                eachWeekDay[day][meal] = [...randomMeals]
            }
            else{
                eachWeekDay[day][meal] = [...mealsFiltered]
            }  
        })
    })
    return eachWeekDay
}

function calculateAgeByBirthDate(birthDate) {
    // birthDate = '1990-01-01'
    const birthDateArray = birthDate.split('-')
    const birthYear = birthDateArray[0]
    const birthMonth = birthDateArray[1]
    const birthDay = birthDateArray[2]

    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1
    const currentDay = today.getDate()

    let age = currentYear - birthYear

    if (currentMonth < birthMonth) {
        age--
    }

    if (birthMonth === currentMonth && currentDay < birthDay) {
        age--
    }

    return age
}

function pickRandomMeals(meals) {
    // get three random meals from meals array and return id_meal
    // const randomMealsPicked = []
    const randomMealsId = []
    
    // if(meals.length < 3)
    //     return meals
    const randomNumber = Math.floor(Math.random() * meals.length)
    randomMealsId.push(meals[randomNumber])
    // for(let i = 0; i < 3; i++) {
    //     const randomNumber = Math.floor(Math.random() * meals.length)
    //     if(randomMealsPicked.includes(randomNumber)) {
    //         i--
    //         continue
    //     }
    //     randomMealsPicked.push(randomNumber)
    //     randomMealsId.push(meals[randomNumber])
    // }
    return randomMealsId
}