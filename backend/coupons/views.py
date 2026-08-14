from decimal import Decimal

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Coupon
from .serializers import CouponSerializer


class CouponListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()

        coupons = Coupon.objects.filter(
            is_active=True,
            valid_from__lte=now,
            valid_until__gte=now,
        ).order_by("-created_at")

        serializer = CouponSerializer(coupons, many=True)

        return Response(serializer.data)


class ApplyCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get("code", "").strip().upper()
        order_amount = request.data.get("order_amount")

        if not code:
            return Response(
                {"error": "Please enter a coupon code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order_amount is None:
            return Response(
                {"error": "Order amount is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order_amount = Decimal(str(order_amount))
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid order amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()

        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response(
                {"error": "Invalid coupon code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not coupon.is_active:
            return Response(
                {"error": "This coupon is currently inactive."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if now < coupon.valid_from:
            return Response(
                {"error": "This coupon is not active yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if now > coupon.valid_until:
            return Response(
                {"error": "This coupon has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order_amount < coupon.minimum_order_amount:
            return Response(
                {
                    "error": (
                        f"Minimum order amount is "
                        f"₹{coupon.minimum_order_amount}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if coupon.discount_type == "PERCENTAGE":
            discount = (
                order_amount * coupon.discount_value
            ) / Decimal("100")

            if coupon.maximum_discount is not None:
                discount = min(
                    discount,
                    coupon.maximum_discount,
                )
        else:
            discount = coupon.discount_value

        discount = min(discount, order_amount)

        final_amount = order_amount - discount

        return Response(
            {
                "message": "Coupon applied successfully.",
                "coupon": CouponSerializer(coupon).data,
                "discount": discount,
                "final_amount": final_amount,
            },
            status=status.HTTP_200_OK,
        )
