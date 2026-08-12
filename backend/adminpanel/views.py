from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address
from orders.models import Order
from products.models import Product

from .permissions import IsAdminUser


class DashboardView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        data = {
            "products": Product.objects.count(),
            "customers": User.objects.filter(is_staff=False).count(),
            "orders": Order.objects.count(),
            "addresses": Address.objects.count(),
            "pending_orders": Order.objects.filter(status="Pending").count(),
            "delivered_orders": Order.objects.filter(status="Delivered").count(),
            "cancelled_orders": Order.objects.filter(status="Cancelled").count(),
        }

        return Response(data)
