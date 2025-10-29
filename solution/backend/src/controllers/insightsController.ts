import { Request, Response } from "express";
import prisma from "../config/database";
import { parseDateRange } from "./metricsController";

export const getInsights = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, channelId, storeId } = req.query;
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

    const [salesData, topProducts, channelsData, timeDistribution] =
      await Promise.all([
        prisma.sale.aggregate({
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
        }),
        prisma.productSale.groupBy({
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
          take: 5,
        }),
        prisma.sale.groupBy({
          by: ["channelId"],
          where: whereClause,
          _sum: {
            totalAmount: true,
          },
          _count: {
            id: true,
          },
          orderBy: {
            _sum: {
              totalAmount: "desc",
            },
          },
        }),
        prisma.sale.findMany({
          where: whereClause,
          select: {
            createdAt: true,
          },
        }),
      ]);

    const insights: any[] = [];

    const totalRevenue = Number(salesData._sum.totalAmount || 0);
    const totalOrders = salesData._count.id;
    const avgTicket = Number(salesData._avg.totalAmount || 0);

    insights.push({
      type: "summary",
      icon: "📊",
      title: "Visão Geral de Desempenho",
      description: `Foram gerados ${totalOrders.toLocaleString()} pedidos totalizando R$ ${totalRevenue.toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2 }
      )} com ticket médio de R$ ${avgTicket.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}.`,
      priority: "high",
    });

    if (topProducts.length > 0) {
      const topProduct = topProducts[0];
      const productDetails = await prisma.product.findUnique({
        where: { id: topProduct.productId },
        include: { category: true },
      });

      insights.push({
        type: "top_product",
        icon: "🏆",
        title: "Produto Mais Vendido",
        description: `"${productDetails?.name}" é seu produto estrela com ${
          topProduct._sum.quantity
        } unidades vendidas, gerando R$ ${Number(
          topProduct._sum.totalPrice || 0
        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em receita.`,
        priority: "high",
        data: {
          productName: productDetails?.name,
          quantity: topProduct._sum.quantity,
          revenue: Number(topProduct._sum.totalPrice || 0),
        },
      });
    }

    if (channelsData.length > 1) {
      const topChannel = channelsData[0];
      const channelDetails = await prisma.channel.findUnique({
        where: { id: topChannel.channelId },
      });

      const channelPercentage = (
        (Number(topChannel._sum.totalAmount || 0) / totalRevenue) *
        100
      ).toFixed(1);

      insights.push({
        type: "channel_performance",
        icon: "📱",
        title: "Canal de Vendas Líder",
        description: `${
          channelDetails?.name
        } é seu canal líder, responsável por ${channelPercentage}% da receita total (R$ ${Number(
          topChannel._sum.totalAmount || 0
        ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}).`,
        priority: "high",
        data: {
          channelName: channelDetails?.name,
          percentage: channelPercentage,
          revenue: Number(topChannel._sum.totalAmount || 0),
        },
      });
    }

    const hourDistribution: { [hour: number]: number } = {};
    timeDistribution.forEach((sale) => {
      const hour = new Date(sale.createdAt).getHours();
      hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    if (peakHours.length > 0) {
      const peakHoursStr = peakHours
        .map((h) => `${h}:00-${h + 1}:00`)
        .join(", ");

      insights.push({
        type: "peak_hours",
        icon: "⏰",
        title: "Horários de Pico",
        description: `Seus horários mais movimentados são ${peakHoursStr}. Considere otimizar alocação de pessoal e estoque durante esses períodos.`,
        priority: "medium",
        data: {
          peakHours,
          orderCounts: peakHours.map((h) => hourDistribution[h]),
        },
      });
    }

    if (avgTicket > 0) {
      const lowTicketThreshold = avgTicket * 0.7;
      const highTicketThreshold = avgTicket * 1.3;

      if (avgTicket < 50) {
        insights.push({
          type: "opportunity",
          icon: "💡",
          title: "Oportunidade de Upsell",
          description: `Ticket médio é R$ ${avgTicket.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}. Considere ofertas de combo ou produtos complementares para aumentar o valor do pedido.`,
          priority: "medium",
        });
      }
    }

    if (totalOrders > 100) {
      const daysInPeriod = Math.ceil(
        (dateRange.end.getTime() - dateRange.start.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const ordersPerDay = totalOrders / daysInPeriod;

      insights.push({
        type: "growth",
        icon: "📈",
        title: "Volume de Vendas",
        description: `Média de ${ordersPerDay.toFixed(1)} pedidos por dia. ${
          ordersPerDay > 50
            ? "Excelente velocidade de vendas!"
            : ordersPerDay > 20
            ? "Bom desempenho constante."
            : "Considere iniciativas de marketing para aumentar as vendas."
        }`,
        priority: "low",
      });
    }

    if (topProducts.length >= 3) {
      const top3Revenue = topProducts
        .slice(0, 3)
        .reduce((sum, p) => sum + Number(p._sum.totalPrice || 0), 0);
      const top3Percentage = ((top3Revenue / totalRevenue) * 100).toFixed(1);

      if (parseFloat(top3Percentage) > 60) {
        insights.push({
          type: "risk",
          icon: "⚠️",
          title: "Concentração de Receita",
          description: `Os 3 principais produtos representam ${top3Percentage}% da receita. Considere diversificar seu mix de produtos para reduzir a dependência.`,
          priority: "medium",
        });
      }
    }

    res.json({
      insights,
      generatedAt: new Date().toISOString(),
      period: {
        start: dateRange.start,
        end: dateRange.end,
      },
    });
  } catch (error) {
    console.error("Insights generation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
