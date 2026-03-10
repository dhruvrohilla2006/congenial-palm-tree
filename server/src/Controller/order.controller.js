import Order from "../Model/order.model.js";
import Food from "../Model/food.model.js";

export const createOrder = async (request, response) => {
  try {
    const { totalAmt, items } = request.body;
    const userId = request.userId;

    console.log("User Id \t" + userId);
    console.log("Total Amount \t" + totalAmt);
    console.log("Order Items \t" + typeof items);
    console.log(items);

    if (!totalAmt || !items[0]) {
      return response.status(400).json({
        message: "All Fields Are Required",
        success: false,
      });
    }

    // console.log("Items \t" + items[]);
    let orderid = items.map((item) => item.food);

    // console.log(typeof orderid);
    // console.log(orderid);

    let orderitemsDetaitls = await Promise.all(
      orderid.map((item) => Food.findById(item).select(" name price _id ")),
    );
    let realTotal = 0;

    console.table(typeof orderitemsDetaitls);

    realTotal += items.map((item) => {
      let quantity = item.quantity;
      let recipe = orderitemsDetaitls.find(
        (item) => item._id.toString() === item.food,
      );
      return quantity * recipe.price;
    });

    console.log("Real Total \t" + realTotal);
    console.log("Total Amount \t" + totalAmt);
    console.log("Order Items Details \t" + orderitemsDetaitls);
    console.log("Order Items \t" + items);

    if (realTotal !== totalAmt) {
      return response.status(400).json({
        message: "Total Amount Mismatch",
        success: false,
      });
    }

    // const newOrder = new Order();
    // newOrder.user = userId;
  } catch (error) {
    console.log("Error at createOrder api \t" + error);
    return response.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
