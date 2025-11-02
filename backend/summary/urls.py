from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardViewSet
from .metrics import revenue, top_products, peak_hours, compare

router = DefaultRouter()
router.register(r"dashboards", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("", include(router.urls)),
    path("revenue/", revenue, name="revenue"),
    path("top-products/", top_products, name="top-products"),
    path("peak-hours/", peak_hours, name="peak-hours"),
    path("compare/", compare, name="compare"),
]