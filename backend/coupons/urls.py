from django.urls import path

from .views import ApplyCouponView, CouponListView


urlpatterns = [
    path("", CouponListView.as_view(), name="coupon-list"),
    path("apply/", ApplyCouponView.as_view(), name="coupon-apply"),
]