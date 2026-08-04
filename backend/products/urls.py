from django.urls import path
from .views import AdminProductDetail, AdminProductListCreate, CategoryList, ProductDetail, ProductList,ProductListAll
from .views import (
    ProductCreate,
    ProductUpdate,
    ProductDelete,
)
urlpatterns = [
    path("categories/", CategoryList.as_view()),
    path("products/<int:category_id>/", ProductList.as_view()),
    path("products/", ProductListAll.as_view()),
    path("productDetails/<int:pk>/",ProductDetail.as_view()),
    path(
        "admin/products/",
        AdminProductListCreate.as_view()
    ),

    path(
        "admin/products/<int:pk>/",
        AdminProductDetail.as_view()
    ),
    path(
    "admin/products/create/",
    ProductCreate.as_view(),
),

path(
    "admin/products/<int:pk>/update/",
    ProductUpdate.as_view(),
),

path(
    "admin/products/<int:pk>/delete/",
    ProductDelete.as_view(),
),
         
]