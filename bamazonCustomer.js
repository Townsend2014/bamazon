var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // My username
    user: "root",

    // My password
    password: "1105",

    // SQL database name
    database: "bamazon"
});

// Create a connection with MYSQL server and database

connection.connect(function(err) {
    if (err) throw err;
    connection.query("Select * From products", function(err, result, fields){
        if (err) throw err;
        // prints the table for user to view 
        console.table(result);
        // run the userSearch function after the connection is made to prompt the user
        userSearch();
    })
});

console.log("Welcome to My Store Bamazon!");
function userSearch(){
    inquirer
    // prompt users with the following message
        .prompt({
            name: "id",
            type: "input",
            message: "What is the ID of the product that you would like to buy?",
        }) // user provides product id
        .then(function(answer){
            // prints out user's id selection
            console.log(answer.id);
            userQty(answer.id);
        });
}

function userQty(id){
    inquirer
    // prompt users with the following message
        .prompt({
            name: "qty",
            type: "input",
            message: "How many would you like to buy?",
        }) // user provides quantity
        .then(function(answer){
            // prints out user's answer
            console.log("Your request: " + answer.qty);
            // grab product by id
            connection.query("Select * from products where ? ",
            [
                {
                    item_id: id
                }
            ], function(err, data) {
                console.log("Quantity Available: " + data[0].stock_quantity);
                if (answer.qty <= data[0].stock_quantity) {
                    console.log("You can proceed with your order");
                    // Once the customer has placed the order, take user's input and compare to see if store has enough product to meet the customer's request. Go into mysql database to compare if stock >= user's input
                    // If it's true that stock is greater to or equal to user's input do the following in mysql:
                    // Once update complete, show customer the total cost of their purchase.
                    console.log("You're total is " + answer.qty * data[0].price)
                    // Create order by Updating mysql
                    "Update products SET? WHERE?", 
                    [
                        {
                            stock_quantity: stock_quantity - answer.qty
                        },
                        {
                            item_id
                        }
                    ]
                } else {

                    // If not, alert user `Insufficient quantity!`, then ask user if they would like to buy something else? Recall userSearch function 
                    console.log("There's insufficient quantity! I will bring you back to the product table");
                    userSearch();
                }
            });

        }); 
}


 




  