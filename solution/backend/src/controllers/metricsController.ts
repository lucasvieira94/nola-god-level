import { Request, Response } from "express";
import prisma from "../config/database";
import { Prisma } from "@prisma/client";

interface DateRange {
  start: Date;
  end: Date;
}

export const parseDateRange = (
  startDate?: string,
  endDate?: string
): DateRange => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  return { start, end };
};

export const getOverview = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, channelId, storeId } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);
    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const currentSales = await prisma.sale.aggregate({
      where: whereClause,
      _sum: {
        totalAmount: true,
        totalDiscount: true,
        deliveryFee: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
        productionSeconds: true,
        deliverySeconds: true,
      },
    });

    const periodDuration = dateRange.end.getTime() - dateRange.start.getTime();
    const previousStart = new Date(dateRange.start.getTime() - periodDuration);
    const previousEnd = new Date(dateRange.start);

    const previousSales = await prisma.sale.aggregate({
      where: {
        ...whereClause,
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRevenue = Number(currentSales._sum.totalAmount || 0);
    const totalOrders = currentSales._count.id;
    const averageTicket = Number(currentSales._avg.totalAmount || 0);
    const totalDiscount = Number(currentSales._sum.totalDiscount || 0);
    const averageProductionTime = Math.round(
      currentSales._avg.productionSeconds || 0
    );
    const averageDeliveryTime = Math.round(
      currentSales._avg.deliverySeconds || 0
    );

    const previousRevenue = Number(previousSales._sum.totalAmount || 0);
    const previousOrders = previousSales._count.id;

    const revenueGrowth =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
    const ordersGrowth =
      previousOrders > 0
        ? ((totalOrders - previousOrders) / previousOrders) * 100
        : 0;

    res.json({
      currentPeriod: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      metrics: {
        totalRevenue,
        totalOrders,
        averageTicket,
        totalDiscount,
        averageProductionTime, // in seconds
        averageDeliveryTime, // in seconds
      },
      growth: {
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Overview error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, channelId, storeId, limit = "10" } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);
    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const topProducts = await prisma.productSale.groupBy({
      by: ["productId"],
      where: {
        sale: whereClause,
      },
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          totalPrice: "desc",
        },
      },
      take: parseInt(limit as string),
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            category: true,
          },
        });

        return {
          productId: item.productId,
          productName: product?.name || "Unknown",
          categoryName: product?.category?.name || "Unknown",
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: Number(item._sum.totalPrice || 0),
        };
      })
    );

    res.json(productsWithDetails);
  } catch (error) {
    console.error("Top products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSalesByChannel = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, storeId } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const salesByChannel = await prisma.sale.groupBy({
      by: ["channelId"],
      where: whereClause,
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    const channelsWithDetails = await Promise.all(
      salesByChannel.map(async (item) => {
        const channel = await prisma.channel.findUnique({
          where: { id: item.channelId },
        });

        return {
          channelId: item.channelId,
          channelName: channel?.name || "Unknown",
          channelType: channel?.type || "Unknown",
          totalRevenue: Number(item._sum.totalAmount || 0),
          totalOrders: item._count.id,
          averageTicket: Number(item._avg.totalAmount || 0),
        };
      })
    );

    res.json(channelsWithDetails);
  } catch (error) {
    console.error("Sales by channel error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSalesByStore = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, channelId } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);

    const salesByStore = await prisma.sale.groupBy({
      by: ["storeId"],
      where: whereClause,
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    const storesWithDetails = await Promise.all(
      salesByStore.map(async (item) => {
        const store = await prisma.store.findUnique({
          where: { id: item.storeId },
        });

        return {
          storeId: item.storeId,
          storeName: store?.name || "Unknown",
          city: store?.city || "Unknown",
          totalRevenue: Number(item._sum.totalAmount || 0),
          totalOrders: item._count.id,
          averageTicket: Number(item._avg.totalAmount || 0),
        };
      })
    );

    res.json(storesWithDetails);
  } catch (error) {
    console.error("Sales by store error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHourlyHeatmap = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, channelId, storeId } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);
    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const sales = await prisma.sale.findMany({
      where: whereClause,
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    // Group by hour and day of week
    const heatmap: {
      [key: string]: { [key: number]: { orders: number; revenue: number } };
    } = {};
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    sales.forEach((sale) => {
      const hour = sale.createdAt.getHours();
      const dayOfWeek = daysOfWeek[sale.createdAt.getDay()];

      if (!heatmap[dayOfWeek]) {
        heatmap[dayOfWeek] = {};
      }

      if (!heatmap[dayOfWeek][hour]) {
        heatmap[dayOfWeek][hour] = { orders: 0, revenue: 0 };
      }

      heatmap[dayOfWeek][hour].orders += 1;
      heatmap[dayOfWeek][hour].revenue += Number(sale.totalAmount);
    });

    const heatmapArray = Object.entries(heatmap).map(([day, hours]) => ({
      day,
      hours: Object.entries(hours).map(([hour, data]) => ({
        hour: parseInt(hour),
        orders: data.orders,
        revenue: Math.round(data.revenue * 100) / 100,
      })),
    }));

    res.json(heatmapArray);
  } catch (error) {
    console.error("Heatmap error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTimeSeries = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      channelId,
      storeId,
      groupBy = "day",
    } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);
    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const sales = await prisma.sale.findMany({
      where: whereClause,
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const timeSeries: { [key: string]: { orders: number; revenue: number } } =
      {};

    sales.forEach((sale) => {
      let key: string;
      const date = sale.createdAt;

      if (groupBy === "hour") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:00`;
      } else if (groupBy === "day") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      } else if (groupBy === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${String(
          weekStart.getMonth() + 1
        ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
      } else {
        // month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }

      if (!timeSeries[key]) {
        timeSeries[key] = { orders: 0, revenue: 0 };
      }

      timeSeries[key].orders += 1;
      timeSeries[key].revenue += Number(sale.totalAmount);
    });

    const timeSeriesArray = Object.entries(timeSeries)
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: Math.round(data.revenue * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(timeSeriesArray);
  } catch (error) {
    console.error("Time series error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, channelId, storeId } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: Prisma.SaleWhereInput = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);
    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const productSales = await prisma.productSale.findMany({
      where: {
        sale: whereClause,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const categoriesMap: {
      [key: number]: { name: string; quantity: number; revenue: number };
    } = {};

    productSales.forEach((ps) => {
      const categoryId = ps.product.categoryId || 0;
      const categoryName = ps.product.category?.name || "Uncategorized";

      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          name: categoryName,
          quantity: 0,
          revenue: 0,
        };
      }

      categoriesMap[categoryId].quantity += ps.quantity;
      categoriesMap[categoryId].revenue += ps.totalPrice;
    });

    const categoriesArray = Object.values(categoriesMap)
      .map((cat) => ({
        ...cat,
        revenue: Math.round(cat.revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json(categoriesArray);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFilters = async (req: Request, res: Response) => {
  try {
    const [channels, stores, categories] = await Promise.all([
      prisma.channel.findMany({
        select: {
          id: true,
          name: true,
          type: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.store.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.category.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    res.json({
      channels,
      stores,
      categories,
    });
  } catch (error) {
    console.error("Filters error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const exportToCSV = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      channelId,
      storeId,
      limit = "1000",
    } = req.query;
    const dateRange = parseDateRange(startDate as string, endDate as string);

    const whereClause: any = {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      saleStatusDesc: "COMPLETED",
    };

    if (channelId) whereClause.channelId = parseInt(channelId as string);
    if (storeId) whereClause.storeId = parseInt(storeId as string);

    const sales = await prisma.sale.findMany({
      where: whereClause,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        channel: true,
        store: true,
        customer: true,
        productSales: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const csvRows: string[] = [];
    csvRows.push(
      [
        "Sale ID",
        "Date",
        "Time",
        "Channel",
        "Store",
        "Customer",
        "Product",
        "Category",
        "Quantity",
        "Unit Price",
        "Total Price",
        "Discount",
        "Delivery Fee",
        "Total Amount",
        "Production Time (min)",
        "Delivery Time (min)",
        "Status",
      ].join(",")
    );

    sales.forEach((sale) => {
      const saleDate = new Date(sale.createdAt);
      const dateStr = saleDate.toISOString().split("T")[0];
      const timeStr = saleDate.toTimeString().split(" ")[0];
      const prodTime = sale.productionSeconds
        ? Math.round(sale.productionSeconds / 60)
        : 0;
      const deliveryTime = sale.deliverySeconds
        ? Math.round(sale.deliverySeconds / 60)
        : 0;

      sale.productSales.forEach((ps) => {
        const row = [
          sale.id,
          dateStr,
          timeStr,
          `"${sale.channel?.name || "Unknown"}"`,
          `"${sale.store?.name || "Unknown"}"`,
          `"${sale.customerName || "Unknown"}"`,
          `"${ps.product?.name || "Unknown"}"`,
          `"${ps.product?.category?.name || "Unknown"}"`,
          ps.quantity,
          ps.basePrice.toString(),
          ps.totalPrice.toString(),
          sale.totalDiscount?.toString() || "0",
          sale.deliveryFee?.toString() || "0",
          sale.totalAmount.toString(),
          prodTime,
          deliveryTime,
          sale.saleStatusDesc || "COMPLETED",
        ].join(",");
        csvRows.push(row);
      });
    });

    const csvContent = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="sales-export-${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
