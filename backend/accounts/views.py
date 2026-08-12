from django.contrib.auth.models import User
from django.db.models import Count, Sum
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Address, UserProfile
from .serializers import (
    AddressSerializer,
    AdminCustomerSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)

# =========================================================
# REGISTER
# =========================================================


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "User registered successfully",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        # Normal users are not admins
                        "is_staff": user.is_staff,
                        "is_superuser": user.is_superuser,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================================
# LOGIN
# =========================================================


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        # IMPORTANT
                        # This tells React whether this is an admin
                        "is_staff": user.is_staff,
                        "is_superuser": user.is_superuser,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


# =========================================================
# PROFILE
# =========================================================


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        profile, created = UserProfile.objects.get_or_create(user=request.user)

        serializer = UserProfileSerializer(profile)

        return Response(serializer.data)

    def put(self, request):

        profile, created = UserProfile.objects.get_or_create(user=request.user)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# ADDRESSES
# =========================================================


class AddressView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        addresses = Address.objects.filter(user=request.user)

        serializer = AddressSerializer(addresses, many=True)

        return Response(serializer.data)

    def post(self, request):

        serializer = AddressSerializer(data=request.data)

        if serializer.is_valid():

            if serializer.validated_data.get("is_default"):

                Address.objects.filter(user=request.user, is_default=True).update(
                    is_default=False
                )

            serializer.save(user=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# ADDRESS DETAIL
# =========================================================


class AddressDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):

        return Address.objects.get(pk=pk, user=user)

    def put(self, request, pk):

        address = self.get_object(pk, request.user)

        serializer = AddressSerializer(address, data=request.data)

        if serializer.is_valid():

            if serializer.validated_data.get("is_default"):

                Address.objects.filter(user=request.user, is_default=True).exclude(
                    pk=pk
                ).update(is_default=False)

            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):

        address = self.get_object(pk, request.user)

        address.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCustomerListView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        customers = (
            User.objects.filter(is_staff=False)
            .annotate(
                order_count=Count("orders", distinct=True),
                total_spent=Sum("orders__total_amount"),
            )
            .order_by("-date_joined")
        )

        serializer = AdminCustomerSerializer(customers, many=True)

        return Response(serializer.data)


# =========================================================
# ADMIN - CUSTOMER DETAIL
# =========================================================


class AdminCustomerDetailView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request, pk):

        try:
            customer = (
                User.objects.filter(id=pk, is_staff=False)
                .annotate(
                    order_count=Count("orders", distinct=True),
                    total_spent=Sum("orders__total_amount"),
                )
                .first()
            )

            if not customer:
                return Response(
                    {"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND
                )

            serializer = AdminCustomerSerializer(customer)

            # Get customer's addresses
            addresses = Address.objects.filter(user=customer)

            address_serializer = AddressSerializer(addresses, many=True)

            # Get customer's orders
            from orders.models import Order
            from orders.serializers import OrderSerializer

            orders = Order.objects.filter(user=customer).order_by("-created_at")

            order_serializer = OrderSerializer(orders, many=True)

            return Response(
                {
                    "customer": serializer.data,
                    "addresses": address_serializer.data,
                    "orders": order_serializer.data,
                }
            )

        except Exception as e:

            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
