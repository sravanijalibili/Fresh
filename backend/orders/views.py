from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address
from products.models import Product

from .models import Order, OrderItem
from .serializers import AdminOrderSerializer, OrderSerializer


# ============================================================
# CUSTOMER - PLACE ORDER
# ============================================================


class PlaceOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        address_id = request.data.get("address")
        payment_method = request.data.get("payment_method")
        items = request.data.get("items", [])

        # ====================================================
        # VALIDATE CART
        # ====================================================

        if not items:
            return Response(
                {"error": "Cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ====================================================
        # VALIDATE ADDRESS
        # ====================================================

        try:
            address = Address.objects.get(
                id=address_id,
                user=request.user,
            )

        except Address.DoesNotExist:
            return Response(
                {"error": "Invalid delivery address."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ====================================================
        # VALIDATE PAYMENT METHOD
        # ====================================================

        valid_payment_methods = ["COD", "ONLINE"]

        if payment_method not in valid_payment_methods:
            return Response(
                {"error": "Invalid payment method."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ====================================================
        # LOCK PRODUCTS
        # ====================================================

        product_ids = []

        for item in items:

            product_id = item.get("product")

            if not product_id:
                return Response(
                    {"error": "Invalid product information."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            product_ids.append(product_id)

        products = {
            product.id: product
            for product in Product.objects.select_for_update().filter(
                id__in=product_ids
            )
        }

        # ====================================================
        # VALIDATE PRODUCTS AND STOCK
        # ====================================================

        validated_items = []

        subtotal = Decimal("0.00")

        for item in items:

            product_id = item.get("product")
            quantity = item.get("quantity")

            # ------------------------------------------------
            # PRODUCT EXISTS
            # ------------------------------------------------

            if product_id not in products:
                return Response(
                    {
                        "error": (
                            f"Product {product_id} "
                            "does not exist."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            product = products[product_id]

            # ------------------------------------------------
            # VALIDATE QUANTITY
            # ------------------------------------------------

            try:
                quantity = int(quantity)

            except (TypeError, ValueError):
                return Response(
                    {
                        "error": (
                            f"Invalid quantity for "
                            f"{product.name}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if quantity <= 0:
                return Response(
                    {
                        "error": (
                            f"Quantity for {product.name} "
                            "must be greater than zero."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ------------------------------------------------
            # CHECK STOCK
            # ------------------------------------------------

            if product.stock < quantity:
                return Response(
                    {
                        "error": (
                            f"Only {product.stock} "
                            f"unit(s) of {product.name} "
                            "are available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ------------------------------------------------
            # CALCULATE SUBTOTAL
            # ------------------------------------------------

            item_total = product.price * quantity

            subtotal += item_total

            validated_items.append(
                {
                    "product": product,
                    "quantity": quantity,
                }
            )

        # ====================================================
        # DELIVERY CHARGE
        # ====================================================

        if subtotal >= Decimal("199.00"):
            delivery_charge = Decimal("0.00")
        else:
            delivery_charge = Decimal("30.00")

        # ====================================================
        # PLATFORM FEE
        # ====================================================

        platform_fee = Decimal("5.00")

        # ====================================================
        # FINAL TOTAL
        # ====================================================

        total = (
            subtotal
            + delivery_charge
            + platform_fee
        )

        # ====================================================
        # CREATE ORDER
        # ====================================================

        order = Order.objects.create(
            user=request.user,
            address=address,
            payment_method=payment_method,
            total_amount=total,
        )

        # ====================================================
        # CREATE ORDER ITEMS + REDUCE STOCK
        # ====================================================

        for item in validated_items:

            product = item["product"]
            quantity = item["quantity"]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )

            product.stock -= quantity
            product.save(update_fields=["stock"])

        # ====================================================
        # RESPONSE
        # ====================================================

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
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
            many=True,
        )

        return Response(serializer.data)


# ============================================================
# CUSTOMER - ORDER DETAIL
# ============================================================


class OrderDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            order = Order.objects.get(
                id=pk,
                user=request.user,
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrderSerializer(order)

        return Response(serializer.data)


# ============================================================
# CUSTOMER - CANCEL ORDER
# ============================================================


class CancelOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request, pk):

        try:
            order = Order.objects.select_for_update().get(
                id=pk,
                user=request.user,
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status == "Delivered":
            return Response(
                {
                    "error": (
                        "Delivered order cannot be cancelled."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.status == "Cancelled":
            return Response(
                {
                    "error": "Order is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ====================================================
        # RESTORE STOCK
        # ====================================================

        for order_item in order.items.select_related("product"):

            product = Product.objects.select_for_update().get(
                id=order_item.product_id
            )

            product.stock += order_item.quantity

            product.save(
                update_fields=["stock"]
            )

        order.status = "Cancelled"

        order.save(
            update_fields=["status"]
        )

        return Response(
            {
                "message": "Order cancelled successfully."
            }
        )


# ============================================================
# ADMIN - ALL ORDERS
# ============================================================


class AdminOrderListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        orders = Order.objects.all().order_by("-created_at")

        serializer = AdminOrderSerializer(
            orders,
            many=True,
        )

        return Response(serializer.data)


# ============================================================
# ADMIN - ORDER DETAIL
# ============================================================


class AdminOrderDetailView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request, pk):

        try:
            order = Order.objects.get(id=pk)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminOrderSerializer(order)

        return Response(serializer.data)


# ============================================================
# ADMIN - UPDATE ORDER STATUS
# ============================================================


class AdminOrderStatusUpdateView(APIView):

    permission_classes = [IsAdminUser]

    def patch(self, request, pk):

        try:
            order = Order.objects.get(id=pk)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get("status")

        valid_statuses = [
            choice[0]
            for choice in Order.STATUS_CHOICES
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    "error": "Invalid order status.",
                    "valid_statuses": valid_statuses,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status

        order.save(
            update_fields=["status"]
        )

        serializer = AdminOrderSerializer(order)

        return Response(
            {
                "message": (
                    "Order status updated successfully."
                ),
                "order": serializer.data,
            }
        )
