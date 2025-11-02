from rest_framework import serializers
from .models import Dashboard

class QuestionSerializer(serializers.Serializer):
    """
    Apenas valida o payload que chega do cliente.
    Exemplo de payload esperado:
    {
        "question": "Quantas pizzas foram vendidas na última semana?"
    }
    """
    question = serializers.CharField(max_length=500)

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = ("id", "name", "layout", "created_at", "updated_at")
        read_only_fields = ("id", "owner", "created_at", "updated_at")