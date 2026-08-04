from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from products.models import Product
from accounts.models import Address

from .models import Order, OrderItem
from .serializers import OrderSerializer


class PlaceOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        address_id = request.data.get("address")
        payment_method = request.data.get("payment_method")
        items = request.data.get("items", [])

        if not items:
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            address = Address.objects.get(
                id=address_id,
                user=request.user
            )
        except Address.DoesNotExist:
            return Response(
                {"error": "Invalid Address"},
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

            product = Product.objects.get(id=item["product"])

            quantity = item["quantity"]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )

            total += product.price * quantity

        order.total_amount = total
        order.save()

        serializer = OrderSerializer(order)

        return Response(serializer.data)



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

        return Response(serializer.data)


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

        serializer = OrderSerializer(order)

        return Response(serializer.data)



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

        order.status = "Cancelled"

        order.save()

        return Response(
            {
                "message":
                "Order Cancelled"
            }
        )