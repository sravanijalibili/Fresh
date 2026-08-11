from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
)
from rest_framework import status

from products.models import Product
from accounts.models import Address

from .models import Order, OrderItem

from .serializers import (
    OrderSerializer,
    AdminOrderSerializer,
)


# ============================================================
# CUSTOMER - PLACE ORDER
# ============================================================

class PlaceOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        address_id = request.data.get("address")
        payment_method = request.data.get("payment_method")
        items = request.data.get("items", [])

        if not items:

            return Response(
                {
                    "error": "Cart is empty"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            address = Address.objects.get(
                id=address_id,
                user=request.user
            )

        except Address.DoesNotExist:

            return Response(
                {
                    "error": "Invalid Address"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        total = Decimal("0.00")

        order = Order.objects.create(
            user=request.user,
            address=address,
            payment_method=payment_method,
            total_amount=0,
        )

        for item in items:

            try:

                product = Product.objects.get(
                    id=item["product"]
                )

            except Product.DoesNotExist:

                order.delete()

                return Response(
                    {
                        "error":
                        f"Product {item['product']} does not exist."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            quantity = int(
                item["quantity"]
            )

            if quantity <= 0:

                order.delete()

                return Response(
                    {
                        "error":
                        "Product quantity must be greater than zero."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )

            total += (
                product.price * quantity
            )

        order.total_amount = total

        order.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# ============================================================
# CUSTOMER - ORDER LIST
# ============================================================

class OrderListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )


# ============================================================
# CUSTOMER - ORDER DETAIL
# ============================================================

class OrderDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:

            order = Order.objects.get(
                id=pk,
                user=request.user
            )

        except Order.DoesNotExist:

            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(
            order
        )

        return Response(
            serializer.data
        )


# ============================================================
# CUSTOMER - CANCEL ORDER
# ============================================================

class CancelOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:

            order = Order.objects.get(
                id=pk,
                user=request.user
            )

        except Order.DoesNotExist:

            return Response(
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status == "Delivered":

            return Response(
                {
                    "error":
                    "Delivered order cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.status == "Cancelled":

            return Response(
                {
                    "error":
                    "Order is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "Cancelled"

        order.save()

        return Response(
            {
                "message":
                "Order Cancelled"
            }
        )


# ============================================================
# ADMIN - ALL ORDERS
# ============================================================

class AdminOrderListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        orders = Order.objects.all().order_by(
            "-created_at"
        )

        serializer = AdminOrderSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data
        )


# ============================================================
# ADMIN - ORDER DETAIL
# ============================================================

class AdminOrderDetailView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request, pk):

        try:

            order = Order.objects.get(
                id=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdminOrderSerializer(
            order
        )

        return Response(
            serializer.data
        )


# ============================================================
# ADMIN - UPDATE ORDER STATUS
# ============================================================

class AdminOrderStatusUpdateView(APIView):

    permission_classes = [IsAdminUser]

    def patch(self, request, pk):

        try:

            order = Order.objects.get(
                id=pk
            )

        except Order.DoesNotExist:

            return Response(
                {
                    "error": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get(
            "status"
        )

        valid_statuses = [
            choice[0]
            for choice in Order.STATUS_CHOICES
        ]

        if new_status not in valid_statuses:

            return Response(
                {
                    "error":
                    "Invalid order status.",

                    "valid_statuses":
                    valid_statuses,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status

        order.save()

        serializer = AdminOrderSerializer(
            order
        )

        return Response(
            {
                "message":
                "Order status updated successfully.",

                "order":
                serializer.data,
            }
        )