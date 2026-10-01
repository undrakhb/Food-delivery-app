import { FoodOrder } from "../../schemas/food-order.js";

const PAGE_SIZE = 12;

// Statuses sort alphabetically, so "-status" lists PENDING first.
// _id breaks ties, so an order never shows up on two pages.
const SORTS = {
  "-date": { created_at: -1, _id: -1 },
  date: { created_at: 1, _id: 1 },
  "-status": { status: -1, created_at: -1, _id: -1 },
  status: { status: 1, created_at: -1, _id: -1 },
};

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Admin: every order, filtered by date range and split into pages.
export const listFoodOrdersController = async (request, response) => {
  try {
    const { from, to, sort = "-date" } = request.query;
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);

    if (!SORTS[sort]) {
      return response.status(400).json({ message: "invalid sort" });
    }

    const filter = {};
    if (from || to) {
      const fromDate = from ? parseDate(from) : null;
      const toDate = to ? parseDate(to) : null;
      if ((from && !fromDate) || (to && !toDate)) {
        return response.status(400).json({ message: "invalid date" });
      }
      filter.created_at = {};
      if (fromDate) filter.created_at.$gte = fromDate;
      if (toDate) filter.created_at.$lte = toDate;
    }

    // Only the food name: images are large base64 strings, and the admin
    // page already has them from the food list.
    const [foodOrders, total] = await Promise.all([
      FoodOrder.find(filter)
        .sort(SORTS[sort])
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .populate("user", "email")
        .populate("foodOrderItems.food", "name"),
      FoodOrder.countDocuments(filter),
    ]);

    response
      .status(200)
      .json({ message: "orders", foodOrders, total, page, pageSize: PAGE_SIZE });
  } catch (err) {
    console.error("listFoodOrdersController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};
