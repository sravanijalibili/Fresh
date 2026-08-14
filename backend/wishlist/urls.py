from django.urls import path

from .views import WishlistDetailView, WishlistView

urlpatterns = [
    path("", WishlistView.as_view(), name="wishlist"),
    path("<int:pk>/", WishlistDetailView.as_view(), name="wishlist-detail"),
]