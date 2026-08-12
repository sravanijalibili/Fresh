from rest_framework import serializers

from accounts.serializers import AddressSerializer

from .models import Order, OrderItem

# ============================================================
# ORDER ITEM
# ============================================================


class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(source="product.name", read_only=True)

    product_image = serializers.ImageField(source="product.image", read_only=True)

    class Meta:

        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
        ]


# ============================================================
# CUSTOMER ORDER SERIALIZER
# ============================================================


class OrderSerializer(serializers.ModelSerializer):

    address = AddressSerializer(read_only=True)

    items = OrderItemSerializer(many=True, read_only=True)

    customer_name = serializers.CharField(source="user.username", read_only=True)

    customer_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "customer_email",
            "address",
            "payment_method",
            "status",
            "total_amount",
            "created_at",
            "items",
        ]


# ============================================================
# ADMIN ORDER SERIALIZER
# ============================================================


class AdminOrderSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="user.username", read_only=True)

    customer_email = serializers.EmailField(source="user.email", read_only=True)

    address = AddressSerializer(read_only=True)

    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:

        model = Order

        fields = [
            "id",
            "customer_name",
            "customer_email",
            "address",
            "payment_method",
            "status",
            "total_amount",
            "created_at",
            "items",
        ]
