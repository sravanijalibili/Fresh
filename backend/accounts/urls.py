from django.urls import path

from .views import (
    AddressDetailView,
    AddressView,
    AdminCustomerDetailView,
    AdminCustomerListView,
    LoginView,
    ProfileView,
    RegisterView,
)

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
    path(
        "addresses/",
        AddressView.as_view(),
        name="addresses",
    ),
    path(
        "addresses/<int:pk>/",
        AddressDetailView.as_view(),
        name="address-detail",
    ),
    path(
        "admin/customers/",
        AdminCustomerListView.as_view(),
        name="admin-customers",
    ),
    path(
        "admin/customers/<int:pk>/",
        AdminCustomerDetailView.as_view(),
        name="admin-customer-detail",
    ),
]
