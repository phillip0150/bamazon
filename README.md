# bamazon

Wish you could do your amazon shopping on the Command Line? Well now you can with bamazon! 


[Link to app](https://github.com/phillip0150/bamazon)

## Technologies

bamazon was written with `javascript`, `node.js`, `mysql`, `inquirer`, `dotenv`.



## How to use

### Challenge 1
[Video of app in action (google drive link)](https://drive.google.com/file/d/1Glp6JPhKHKMyvj-3-RLevV9trhKNIyOy/view)


You will need to install inquirer, dotenv, and mysql packages in the same folder as your program.

```bash
  npm install mysql
  npm install inquirer
  npm install dotenv
```

To run the program, you need to open your computer's terminal and enter the follow command:

```bash
  node bamazonCustomer.js
```

From there, you are presented with a list of items from bamazon.


![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/1.png?raw=true)



### Buying on bamazon

To buy an item, type in the correct product ID:
```bash
  ? Please slected the ID number of the item you would like to purchase 4
```

![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/3.png?raw=true)

Once you enter a product ID, you are asked to enter the amount you want to purchase:
```bash
  ? Please slected the ID number of the item you would like to purchase 4
  ? How much would you like? 20
```
After entering an amount, you are presented with a total and taken back to the home screen.

![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/7.png?raw=true)

The program updates the product with the new stock quantity.


### Exiting Program

To exit the program at anytime, press `CTRL+C` on your keyboard

![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/6.png?raw=true)


### Error handling

#### Product ID

If the user enters a ID that doesn't exist, a message appears to the user.

![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/2.png?raw=true)

Once the message appears, the program restarts and the user is prompt to enter a product ID

#### Quantity

If the user enters a quantity number that is greater than the stock number of an item, the user will be asked to enter a new amount.


![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/4.png?raw=true)



## Organization

### Functions

This program uses three functions `selectItem()`, `seeIfItemExist(itemID)`, and `enoughInStock(stockNumber, theItem)`.

#### selecItem() Function

This function is called in the begining of the progam. It calls a sql command to display all items. From there, the function prompts the user to enter the product ID. We use the function seeIfItemExist to see if the item they entered in exits.
```javascript
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
```

#### seeIfItemExist(itemID) Function

This function checks to see if an item exists. The function takes a itemID that is used in the sql command. If `res.length === 0`, we know that the sql command returned nothing. From there, the function tells the program to display a error message and restarts the program by calling `selectItem();`

```javascript
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
```

#### enoughInStock(stockNumber, theItem) Function

This function sees if bamazon has enough in stock. The function takes a stockNumber (what the user entered in) and theItem (id of the product). The functions makes a sql call to get the current price, product name, and stock quantity of theItem. from there, we see if the stockNumber is greater than the stock quantity. If it is we tell the user to enter a new amount, then we recall the function. If the stockNumber is not greater than the stock quantity, the functions updates the product with the new stock quantity and displays the user the total. 

```javascript 
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
```


## My role
Application developer

