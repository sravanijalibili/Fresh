from django.urls import path

from .views import (
    PlaceOrderView,
    OrderListView,
    OrderDetailView,
    CancelOrderView,
)

urlpatterns = [

    path(
        "place/",
        PlaceOrderView.as_view(),
    ),

    path(
        "",
        OrderListView.as_view(),
    ),

    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
    ),

    path(
        "<int:pk>/cancel/",
        CancelOrderView.as_view(),
    ),
]