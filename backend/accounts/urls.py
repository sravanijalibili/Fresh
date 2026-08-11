from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    AddressView,
    AddressDetailView,
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

]