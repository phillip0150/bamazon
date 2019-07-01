var inquirer = require('inquirer');
var connection = require("./server.js");

//function that sees if that item is in stock
//takes in the amount the user wants (stockNumber) and the item (theItem)
function enoughInStock(stockNumber, theItem){
  //connection to call sql command
  connection.query("SELECT price, product_name, stock_quantity FROM items WHERE item_id = "+parseInt(theItem), function (err, res) {
    if (err) throw err;
    //the current stock quantity
    var oldStockQuantity = parseInt(res[0].stock_quantity);
    //the price of the item
    var thePrice = parseInt(res[0].price);
    //if the users quantity number is greater than the current stock quantity
    //we tell the user that we do not have enough and to enter another quantity number
    //from there, call another prompt and recall the current function (enoughInStock)
    if(stockNumber > res[0].stock_quantity){
      console.log("Sorry, we do not have enough! Please select another quantity number. If you want to quit the program press CTRL+C");
      inquirer.prompt([
        {
          type: "input",
          name: "quanity",
          message: "How much would you like?",
  
        }
      ]).then(function (response) {
        //calling en
        enoughInStock(response.quanity, theItem);
        
      });
    }
    //else, we know there is enough in stock
    else {
      //setting the new stock amount of that item
      var newStock = oldStockQuantity - parseInt(stockNumber);
      //the total of what the user owes
      var total = thePrice*parseInt(stockNumber);
      //calling another query to update the item stock quantity
      connection.query("UPDATE items SET stock_quantity="+newStock+" WHERE item_id="+theItem, function (err, res) {
        // console.log(res);
        if (err) throw err;
        console.log("Thanks! Your total is $"+ total+ ". Taking you back to the home screen! If you want to quit the program press CTRL+C\n");
        //calling selectItem() [restarting program]
        selectItem();
      });
    

    }
  });
  
}

//this function checks to see if the item exists
//takes a itemID
function seeIfItemExist(itemID) {
  //calling a sql command
  connection.query("SELECT item_id FROM items WHERE item_id = "+parseInt(itemID), function (err, res) {
    if (err) throw err;
    //if res.length ===0, we know that we did not find that item
    //display error message
    if(res.length === 0){
      console.log("\n---------------------------------------------");
      console.log("-----------------ERROR-----------------------");
      console.log("---------------------------------------------");
      console.log("Sorry, Item doesn't exist. Restarting program");
      console.log("---------------------------------------------");
      console.log("---------------------------------------------");
      console.log("---------------------------------------------\n");
      selectItem();
    }
    //else, we know we found an item, call prompts
    else{
      inquirer.prompt([
        {
          type: "input",
          name: "quanity",
          message: "How much would you like?",
  
        }
      ]).then(function (response) {
        //once we get a response, we see if we have enough in stock
        enoughInStock(response.quanity, itemID);
        
      });
    }
    
  });

}

function selectItem() {
  //calling sql command to display all items
  connection.query("SELECT * FROM items", function (err, res) {
    // console.log(res);
    if (err) throw err;
    //showing the list of the products
    //using for loop to display items
    console.log("\nHere is a list of our products!\n");
    console.log("-------------------------------");
    for(var i in res){
      console.log(`Product ID: ${res[i].item_id}`);
      console.log(`Product Name: ${res[i].product_name}`);
      console.log(`Department: ${res[i].department_name}`);
      console.log(`Price: ${res[i].price}`);
      console.log(`Quantity: ${res[i].stock_quantity}`);
      console.log("-------------------------------\n");

    }
    //using prompt to ask using to enter the id number of the product they want to buy
    inquirer.prompt([
      {
        type: "input",
        name: "idNumber",
        message: "Please slected the ID number of the item you would like to purchase",

      }
    ]).then(function (response) {
      //check to see if item exist
      seeIfItemExist(response.idNumber);
      
    });
  });
  
}

//calling selectItem
selectItem();

