
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
        dbConnect();
        console.log("\n");
        connection.query("select * from products", (req,res) =>{
            if(err) throw err;
            console.table(res);
            inquirer.prompt({
                type: "input",
                message: "Please enter the ID of the item that you would like to buy:",
                name: "itemID"
            },{
                type: "input",
                message: "How many of this item would you like to buy:",
                name: "itemQuantity"
            }).then(answers =>{
                connection.query("select * from products where item_id = ?"), (req,res) =>{
                    if(res.item_quantity === 0){
                        console.log("We're sorry, but the item you requested is out of stock");
                        dbClose();
                        mainFunc();
                    }else{
                        
                    }
                };
            });
        });
        dbClose();
        mainFunc();
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

mainFunc();