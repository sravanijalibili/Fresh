from rest_framework import serializers

from .models import Category, Product

from django.db.models import Avg

class ProductSerializer(serializers.ModelSerializer):


    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    category_id = serializers.IntegerField(
        source="category.id",
        read_only=True,
    )

    image = serializers.SerializerMethodField()

    discount_percentage = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    class Meta:
        model = Product

        fields = [
            "id",
            "category",
            "category_id",
            "category_name",
            "name",
            "quantity",
            "price",
            "original_price",
            "discount_percentage",
            "average_rating",
            "review_count",
            "stock",
            "image",
        ]
        read_only_fields = [
            "id",
            "category_id",
            "category_name",
            "discount_percentage",
            "image",
        ]

    def get_image(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.image.url
            )

        return obj.image.url

    def get_discount_percentage(self, obj):

        if (
            obj.original_price is not None
            and obj.original_price > obj.price
        ):
            discount = (
                (obj.original_price - obj.price)
                / obj.original_price
            ) * 100

            return round(discount)

        return 0

    
    def get_average_rating(self, obj):
        result = obj.reviews.aggregate(
            average=Avg("rating")
        )

        return round(
            float(result["average"] or 0),
            1,
        )


    def get_review_count(self, obj):
        return obj.reviews.count()


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
            return request.build_absolute_uri(
                obj.image.url
            )

        return obj.image.url
