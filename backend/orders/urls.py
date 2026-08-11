from django.urls import path

from .views import (
    PlaceOrderView,
    OrderListView,
    OrderDetailView,
    CancelOrderView,

    AdminOrderListView,
    AdminOrderDetailView,
    AdminOrderStatusUpdateView,
)


urlpatterns = [

    # ========================================================
    # CUSTOMER ORDERS
    # ========================================================

    path(
        "place/",
        PlaceOrderView.as_view(),
        name="place-order",
    ),

    path(
        "",
        OrderListView.as_view(),
        name="order-list",
    ),

    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail",
    ),

    path(
        "<int:pk>/cancel/",
        CancelOrderView.as_view(),
        name="cancel-order",
    ),


    # ========================================================
    # ADMIN ORDERS
    # ========================================================

    path(
        "admin/",
        AdminOrderListView.as_view(),
        name="admin-order-list",
    ),

    path(
        "admin/<int:pk>/",
        AdminOrderDetailView.as_view(),
        name="admin-order-detail",
    ),

    path(
        "admin/<int:pk>/status/",
        AdminOrderStatusUpdateView.as_view(),
        name="admin-order-status",
    ),

]