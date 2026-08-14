from decimal import Decimal

from rest_framework import serializers

from .models import Category, Product


class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    image = serializers.SerializerMethodField()

    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product

        fields = "__all__"

    def get_image(self, obj):

        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url

    def get_discount_percentage(self, obj):

        if not obj.original_price:
            return 0

        if obj.original_price <= obj.price:
            return 0

        discount = (
            (obj.original_price - obj.price)
            / obj.original_price
        ) * Decimal("100")

        return round(float(discount))


class CategorySerializer(serializers.ModelSerializer):

    products = ProductSerializer(
        many=True,
        read_only=True,
    )

    image = serializers.SerializerMethodField()

    class Meta:
        model = Category

        fields = "__all__"

    def get_image(self, obj):

        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url