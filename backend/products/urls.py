from django.urls import path

from .views import (
    AdminCategoryDetail,
    AdminCategoryListCreate,
    AdminProductDetail,
    AdminProductListCreate,
    CategoryList,
    ProductCreate,
    ProductDelete,
    ProductDetail,
    ProductList,
    ProductListAll,
    ProductUpdate,
)

urlpatterns = [
    # =====================================================
    # PUBLIC CATEGORY
    # =====================================================
    path(
        "categories/",
        CategoryList.as_view(),
        name="categories",
    ),
    # =====================================================
    # PUBLIC PRODUCTS
    # =====================================================
    path(
        "products/<int:category_id>/",
        ProductList.as_view(),
        name="products-by-category",
    ),
    path(
        "products/",
        ProductListAll.as_view(),
        name="all-products",
    ),
    path(
        "productDetails/<int:pk>/",
        ProductDetail.as_view(),
        name="product-detail",
    ),
    # =====================================================
    # ADMIN PRODUCTS
    # =====================================================
    path(
        "admin/products/",
        AdminProductListCreate.as_view(),
        name="admin-products",
    ),
    path(
        "admin/products/<int:pk>/",
        AdminProductDetail.as_view(),
        name="admin-product-detail",
    ),
    path(
        "admin/products/create/",
        ProductCreate.as_view(),
        name="admin-product-create",
    ),
    path(
        "admin/products/<int:pk>/update/",
        ProductUpdate.as_view(),
        name="admin-product-update",
    ),
    path(
        "admin/products/<int:pk>/delete/",
        ProductDelete.as_view(),
        name="admin-product-delete",
    ),
    # =====================================================
    # ADMIN CATEGORIES
    # =====================================================
    path(
        "admin/categories/",
        AdminCategoryListCreate.as_view(),
        name="admin-categories",
    ),
    path(
        "admin/categories/<int:pk>/",
        AdminCategoryDetail.as_view(),
        name="admin-category-detail",
    ),
]
