
// global vars

const inquirer = require("inquirer");
const colors = require("colors");
const dotenv = require("dotenv");
const mysql = require("mysql");
let connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Ph@nt0m93",
    database: process.env.DB_NAME || "bamazon"
});

// database functions

let dbConnect = () => {
    connection.connect((err) =>{
        if(err) throw err;
        console.log("Connected to database on thread " + connection.threadId + "\n");
        mainFunc();
    });
};

//db close
let dbClose = () => {
    connection.end((err) =>{
        if(err) throw err;
        console.log("Connection closed on thread " + connection.threadId + "\n");
    });
};

// main functions

let mainFunc = () => {
    console.log("===BAmazon Main Menu===\n");
        inquirer.prompt({
            type: "list",
            choices: ["Buy Item", "Manager Access", "Supervisor Access", "Exit"],
            message: "Hello, welcome to BAmazon what would you like to do today?:",
            name: "mainMenu"
        }).then(answers =>{
            switch(answers.mainMenu){
                case "Buy Item":
                    buyItem();
                    break;
                case "Manager Access":
                    managerAccess();
                    break;
                case "Supervisor Access":
                    supervisorAccess();
                    break;
                case "Exit":
                    exit();
                    break;
                default:
                    console.log("Sorry the input received was not valid, please try again.");
                    console.log(answers.mainMenu);
                    mainFunc();
                    break;
            };
        });
    };

    let buyItem = (err) =>{
        // dbConnect();
        connection.query("select * from products", (err,res) =>{
            if(err) throw err;
            console.log("\n");
            console.table(res);
            inquirer.prompt([{
                type: "input",
                message: "Please enter the ID of the item that you would like to buy:",
                // code breaks here and db closes
                name: "itemID"
            },{
                type: "input",
                message: "How many of this item would you like to buy:",
                name: "itemQuantity"
            }]).then(productAnswers =>{
                console.log("random string");
                connection.query("select * from products where item_id = ? ",productAnswers.itemID, (err,res) =>{
                    if(err) throw err;
                    console.log(res);
                    if(res.item_quantity === 0){
                        console.log("We're sorry, but the item you requested is out of stock");
                        dbClose();
                        mainFunc();
                    }else{
                        console.table(res);
                        inquirer.prompt({
                            type: "confirm",
                            message: "Are you sure you would like to complete this transaction?",
                            name: "purchaseAnswer"
                        }).then(answers => {
                            if(answers.purchaseAnswer === true){
                                console.log("Item purchased, thank you for your business.");
                                let transactionResult = currentitemquantity - productAnswers.itemQuantity;
                                connection.query("update products set item_quantity = ? where item_id = ?"), [transactionResult, productAnswers.itemID];
                                connection.query("select * from products where item_id = ?"), [productAnswers.itemID];
                                console.table(res);
                                dbClose();
                                mainFunc();
                            }else{
                                console.log("Transaction canceled, have a nice day.");
                                dbClose();
                                mainFunc();
                            };
                        });
                    };
                });
            }).catch(err => console.log(err));
        });
        // dbClose();
        // mainFunc();
    };


    let exit = () => {
        inquirer.prompt({
            type: "confirm",
            message: "Are you sure you want to exit BAmazon?",
            name: "exitPrompt"
        }).then(answers =>{
            if(answers.exitPrompt === true){
                console.log("Thank you for using BAmazon, have a nice day.\n");
                exit[0];
            }else{
                mainFunc();
            };
        });
    };

// code to run program

// mainFunc();
dbConnect();