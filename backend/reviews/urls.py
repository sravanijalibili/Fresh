from django.urls import path

from .views import (
    CreateReviewView,
    MyReviewDetailView,
    ProductRatingView,
    ProductReviewListView,
)

urlpatterns = [
    # ============================================================
    # PRODUCT REVIEWS
    # ============================================================

    path(
        "product/<int:product_id>/",
        ProductReviewListView.as_view(),
        name="product-reviews",
    ),

    # ============================================================
    # CREATE REVIEW
    # ============================================================

    path(
        "product/<int:product_id>/create/",
        CreateReviewView.as_view(),
        name="create-review",
    ),

    # ============================================================
    # MY REVIEW
    # ============================================================

    path(
        "product/<int:product_id>/my/",
        MyReviewDetailView.as_view(),
        name="my-review",
    ),

    # ============================================================
    # RATING SUMMARY
    # ============================================================

    path(
        "product/<int:product_id>/rating/",
        ProductRatingView.as_view(),
        name="product-rating",
    ),
]