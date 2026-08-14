from django.db.models import Avg
from rest_framework import status , generics
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from orders.models import Order
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.permissions import AllowAny

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_id = self.kwargs["category_id"]
        return Product.objects.filter(category_id=category_id)


class ProductListAll(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class AdminProductListCreate(generics.ListCreateAPIView):

    queryset = Product.objects.all().order_by("id")

    serializer_class = ProductSerializer

    permission_classes = [IsAdminUser]

    parser_classes = [MultiPartParser, FormParser]


class AdminProductDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()

    serializer_class = ProductSerializer

    permission_classes = [IsAdminUser]

    parser_classes = [MultiPartParser, FormParser]


class ProductCreate(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class ProductUpdate(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class ProductDelete(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class AdminCategoryListCreate(generics.ListCreateAPIView):

    queryset = Category.objects.all().order_by("id")

    serializer_class = CategorySerializer

    permission_classes = [IsAdminUser]

    parser_classes = [MultiPartParser, FormParser]


class AdminCategoryDetail(generics.RetrieveUpdateDestroyAPIView):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [IsAdminUser]

    parser_classes = [MultiPartParser, FormParser]


# ============================================================
# RELATED PRODUCTS
# ============================================================


class RelatedProductsView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, product_id):

        try:
            product = Product.objects.select_related(
                "category"
            ).get(id=product_id)

        except Product.DoesNotExist:

            return Response(
                {"error": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        related_products = (
            Product.objects
            .filter(category=product.category)
            .exclude(id=product.id)
            .select_related("category")
            .order_by("id")[:8]
        )

        serializer = ProductSerializer(
            related_products,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)