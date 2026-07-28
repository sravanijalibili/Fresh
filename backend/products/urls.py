from django.urls import path
from .views import CategoryList, ProductList

urlpatterns = [
    path("categories/", CategoryList.as_view()),
    path("products/<int:category_id>/", ProductList.as_view()),
]