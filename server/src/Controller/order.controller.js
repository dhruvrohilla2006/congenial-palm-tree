import Order from "../Model/order.model.js";
import Food from "../Model/food.model.js";

// export const createOrder = async (request, response) => {
//   try {
//     const { totalAmt, items } = request.body;
//     const userId = request.userId;

//     // console.log("User Id \t" + userId);
//     // console.log("Total Amount \t" + totalAmt);
//     // console.log("Order Items \t" + typeof items);
//     // console.log(items);

//     if (!totalAmt || !items[0]) {
//       return response.status(400).json({
//         message: "All Fields Are Required",
//         success: false,
//       });
//     }

//     // console.log("Items \t" + items[]);
//     let orderid = items.map((item) => item.food);

//     // console.log(typeof orderid);
//     // console.log(orderid);

//     let orderitemsDetaitls = await Promise.all([
//       orderid.map((item) => Food.findById(item).select(" name price _id ")),
//     ]);
//     let realTotal = 0;

//     console.log(typeof orderitemsDetaitls);

//     realTotal += items.map((item) => {
//       let quantity = item.quantity;
//       let recipe = orderitemsDetaitls.find(
//         (item) => item._id.toString() === item.food,
//       );
//       return quantity * recipe.price;
//     });

//     // console.log("Real Total \t" + realTotal);
//     // console.log("Total Amount \t" + totalAmt);
//     // console.log("Order Items Details \t" + orderitemsDetaitls);
//     // console.log("Order Items \t" + items);

//     if (realTotal !== totalAmt) {
//       return response.status(400).json({
//         message: "Total Amount Mismatch",
//         success: false,
//       });
//     }

//     // const newOrder = new Order();
//     // newOrder.user = userId;
//   } catch (error) {
//     console.log("Error at createOrder api \t" + error);
//     return response.status(500).json({
//       message: "Server Error",
//       success: false,
//     });
//   }
// };

export const createOrder = async (request, response) => {
  try {
    const { totalAmt, items } = request.body;
    const userId = request.userId;

    if (!totalAmt || !items || items.length === 0) {
      return response.status(400).json({
        message: "All Fields Are Required",
        success: false,
      });
    }

    // 1. Get all food IDs
    const foodIds = items.map((item) => item.food);

    // 2. Correct Promise.all usage
    const foodDetails = await Promise.all(
      foodIds.map((id) => Food.findById(id).select("name price _id")),
    );

    // console.log( typeof foodDetails);
    // 3. Calculate total using reduce
    const realTotal = items.reduce((acc, item) => {
      const foodDoc = foodDetails.find(
        (f) => f && f._id.toString() === item.food.toString(),
      );

      if (!foodDoc) throw new Error(`Food item ${item.food} not found`);

      return acc + foodDoc.price * item.quantity;
    }, 0);

    // 4. Comparison (Using a small margin for decimal safety)
    if (Math.abs(realTotal - totalAmt) > 0.01) {
      return response.status(400).json({
        message: "Total Amount Mismatch",
        success: false,
        realTotal, // useful for debugging
      });
    }

    // Proceed to save order...
    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount: realTotal,
    });

    return response
      .status(201)
      .json({ success: true, message: "Order created", orderId: newOrder._id });
  } catch (error) {
    console.error("Error at createOrder api:", error);
    return response.status(500).json({
      message: error.message || "Server Error",
      success: false,
    });
  }
};

export const getMyOrders = async (request, response) => {
  try {
    const userId = request.userId;
    // const orders = await Order.find({ user: userId }).populate(
    //   "user items.food",
    //   "name price -_id",
    // );
    const orders = await Order.find({ user: userId }).populate([
      { path: "user", select: "email name -_id" },
      { path: "items.food", select: "name price -_id" },
    ]);
    return response.status(200).json({
      message: "Orders retrieved successfully",
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Error at getOrders api \t" + error);
    return response.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
