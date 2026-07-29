from django.urls import path
from .views import CategoryList, ProductList,ProductListAll

urlpatterns = [
    path("categories/", CategoryList.as_view()),
    path("products/<int:category_id>/", ProductList.as_view()),
    path("products/", ProductListAll.as_view()),
]