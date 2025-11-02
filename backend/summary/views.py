import os 
import openai
from datetime import datetime, timedelta

from django.db import connection
from rest_framework import status, views, viewsets, permissions
from .models import Dashboard
from .serializers import DashboardSerializer
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from .serializers import QuestionSerializer

openai.api_key = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

class SummaryView(views.APIView):
    @swagger_auto_schema(request_body=QuestionSerializer, 
                         responses={200: "Resumo da pergunta", 400: "Bad Request"})
    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"]

        prompt = (
            "Resuma a seguinte do cliente em até duas frases curtas, claras e objetivas. Mantendo o tom profissional e sem perder a intenção original da pergunta:\n\n"
            f"{question}"
        )

        try:
            resp = openai.ChatCompletion.create(
                model=OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=150,
            )
            summary = resp.choices[0].message.content.strip()
        except Exception as e:
            return Response(
                {"error": "Erro ao gerar o resumo.", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        
        return Response({"question": question, "summary": summary}, status=status.HTTP_200_OK)
    

class DashboardView(views.APIView):
    """
    Retorna um pequeno conjunto de métricas que podem ser usados para montar um dashboard no front-end.

    - total_stores: quantas lojas (stores) existem no banco.
    - total_customers: clientes cadastrados.
    - total_sales_last_30_days: vendas nos últimos 30 dias.
    - total_sales-amount_last_30_days: valor total bruto das vendas nos últimos 30 dias.
    - top_5_products: lista dos 5 produtos mais vendidos (id, nome, quantidade)
    """

    @swagger_auto_schema(responses={200: "Métricas do dashboard"})
    def get(self, request):
        with connection.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM stores;")
            total_stores = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM customers;")
            total_customers = cur.fetchone()[0]

            cur.execute("""
                SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
                FROM sales
                WHERE sale_date >= %s;
                """ ,
                (datetime.now() - timedelta(days=30))
            ) 
            total_sales_last_30_days, total_sales_amount_last_30_days = cur.fetchone()

            cur.execute("""
                SELECT p.id, p.name, SUM(si.quantity) AS qty_sold
                FROM products_sales ps
                JOIN products p ON ps.product_id = p.id
                GROUP BY p.id, p.name
                ORDER BY qty_sold DESC
                LIMIT 5;
            """)
            top_5_products = [
                {"id": row[0], "name": row[1], "quantity_sold": row[2]}
                for row in cur.fetchall()
            ]

            payload = {
                "total_stores": total_stores,
                "total_customers": total_customers,
                "total_sales_last_30_days": total_sales_last_30_days,
                "total_sales_amount_last_30_days": float(total_sales_amount_last_30_days),
                "top_5_products": top_5_products,
            }

        return Response(payload, status=status.HTTP_200_OK)
    
class DashboardViewSet(viewsets.ModelViewSet):
    """
    CRUD de dashboards personalizados.
    O usuário só pode manipular os seus próprios dashboards.
    """
    serializer_class = DashboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Dashboard.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)