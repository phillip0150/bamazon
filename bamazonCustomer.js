var inquirer = require('inquirer');
var connection = require("./server.js");


function enoughtInStock(stockNumber, theItem){
  connection.query("SELECT price, product_name, stock_quantity FROM items WHERE item_id = "+parseInt(theItem), function (err, res) {
    if (err) throw err;
    var oldStockQuantity = parseInt(res[0].stock_quantity);
    var thePrice = parseInt(res[0].price);
    if(stockNumber > res[0].stock_quantity){
      console.log("Sorry, we do not have enough! Please select another quantity number. If you want to quit the program press CTRL+C");
      inquirer.prompt([
        {
          type: "input",
          name: "quanity",
          message: "How much would you like?",
  
        }
      ]).then(function (response) {
        enoughtInStock(response.quanity, theItem);
        
      });
    }
    else {

      var newStock = oldStockQuantity - parseInt(stockNumber);
      var total = thePrice*parseInt(stockNumber);
      connection.query("UPDATE items SET stock_quantity="+newStock+" WHERE item_id="+theItem, function (err, res) {
        // console.log(res);
        if (err) throw err;
        console.log("Thanks! Your total is $"+ total+ ". Taking you back to the home screen! If you want to quit the program press CTRL+C\n");
        selectBidItem();
      });
    

    }
  });
  
}

function seeIfItemExist(itemID) {
  connection.query("SELECT item_id FROM items WHERE item_id = "+parseInt(itemID), function (err, res) {
    if (err) throw err;
    if(res.length === 0){
      console.log("\n---------------------------------------------");
      console.log("-----------------ERROR-----------------------");
      console.log("---------------------------------------------");
      console.log("Sorry, Item doesn't exist. Restarting program");
      console.log("---------------------------------------------");
      console.log("---------------------------------------------");
      console.log("---------------------------------------------\n");
      selectBidItem();
    }
    else{
      inquirer.prompt([
        {
          type: "input",
          name: "quanity",
          message: "How much would you like?",
  
        }
      ]).then(function (response) {
        enoughtInStock(response.quanity, itemID);
        
      });
    }
    
  });

}

function selectBidItem() {
  //grab items available to bid on.
  connection.query("SELECT * FROM items", function (err, res) {
    // console.log(res);
    if (err) throw err;
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
    inquirer.prompt([
      {
        type: "input",
        name: "idNumber",
        message: "Please slected the ID number of the item you would like to purchase",

      }
    ]).then(function (response) {
      seeIfItemExist(response.idNumber);
      
    });
  });
  
}

selectBidItem();



