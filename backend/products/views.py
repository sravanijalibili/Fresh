from rest_framework import generics
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .models import Product
from .serializers import ProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated,IsAdminUser

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


    