from datetime import datetime, timedelta
from django.db.models import Sum, Count, F, FloatField, ExpressionWrapper
from django.db.models.functions import TruncHour, TruncDate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from summary.models import Sale, ProductSale

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revenue(request):
    """
    ?start=YYYY-MM-DD&end=YYYY-MM-DD
    Returns gross and net revenue for the period.
    """
    start = request.query_params.get("start")
    end   = request.query_params.get("end")
    qs = Sale.objects.filter(created_at__date__range=(start, end))

    gross = qs.aggregate(gross=Sum("total_amount"))["gross"] or 0
    # net = gross - descontos - taxas (exemplo simples)
    net = qs.aggregate(net=Sum(ExpressionWrapper(
        F("total_amount") - F("total_discount") - F("service_tax_fee"),
        output_field=FloatField()
    ))["net"] or 0)

    return Response({
        "period": f"{start} → {end}",
        "gross": float(gross),
        "net": float(net),
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def top_products(request):
    """
    ?limit=10&start=…&end=…
    Returns list of products ordered by quantity sold.
    """
    limit = int(request.query_params.get("limit", 10))
    start = request.query_params.get("start")
    end   = request.query_params.get("end")

    qs = (
        ProductSale.objects
        .filter(sale__created_at__date__range=(start, end))
        .values("product_id", "product__name")
        .annotate(
            qty=Sum("quantity"),
            revenue=Sum(F("total_price"))
        )
        .order_by("-qty")[:limit]
    )
    data = [
        {
            "id": item["product_id"],
            "name": item["product__name"],
            "quantity": item["qty"],
            "revenue": float(item["revenue"]),
        }
        for item in qs
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def peak_hours(request):
    """
    ?start=…&end=… (date range)
    Returns quantity of sales per hour of the day (0‑23) aggregated over the range.
    """
    start = request.query_params.get("start")
    end   = request.query_params.get("end")

    qs = (
        Sale.objects
        .filter(created_at__date__range=(start, end))
        .annotate(hour=TruncHour("created_at"))
        .values("hour")
        .annotate(count=Count("id"))
        .order_by("hour")
    )
    # Normaliza para 0‑23 (algumas horas podem ficar ausentes)
    result = {h: 0 for h in range(24)}
    for row in qs:
        hour = row["hour"].hour
        result[hour] = row["count"]
    return Response([{"hour": h, "count": result[h]} for h in range(24)])

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def compare(request):
    """
    ?metric=revenue&start1=…&end1=…&start2=…&end2=…
    Returns the two values and the percentual difference.
    """
    metric   = request.query_params.get("metric", "revenue")
    start1   = request.query_params.get("start1")
    end1     = request.query_params.get("end1")
    start2   = request.query_params.get("start2")
    end2     = request.query_params.get("end2")

    # Função helper simples (apenas para revenue por enquanto)
    def period_sum(s, e):
        qs = Sale.objects.filter(created_at__date__range=(s, e))
        return qs.aggregate(total=Sum("total_amount"))["total"] or 0

    v1 = period_sum(start1, end1)
    v2 = period_sum(start2, end2)
    diff = ((v2 - v1) / v1 * 100) if v1 else 0

    return Response({
        "metric": metric,
        "period1": {"start": start1, "end": end1, "value": float(v1)},
        "period2": {"start": start2, "end": end2, "value": float(v2)},
        "diff_percent": round(diff, 2),
    })
