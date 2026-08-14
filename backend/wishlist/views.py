from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Wishlist
from products.models import Product


class WishlistView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist_items = Wishlist.objects.filter(
            user=request.user
        ).select_related("product")

        data = []

        for item in wishlist_items:
            data.append(
                {
                    "id": item.id,
                    "product": item.product.id,
                    "product_name": item.product.name,
                    "product_image": item.product.image.url
                    if item.product.image
                    else None,
                    "quantity": item.product.quantity,
                    "price": str(item.product.price),
                }
            )

        return Response(data)

    def post(self, request):

        product_id = request.data.get("product")

        if not product_id:
            return Response(
                {"error": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product = Product.objects.get(id=product_id)

        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product,
        )

        if not created:
            return Response(
                {"message": "Product is already in your wishlist."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Product added to wishlist.",
                "id": wishlist_item.id,
                "product": product.id,
            },
            status=status.HTTP_201_CREATED,
        )


class WishlistDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        try:
            wishlist_item = Wishlist.objects.get(
                id=pk,
                user=request.user,
            )

        except Wishlist.DoesNotExist:
            return Response(
                {"error": "Wishlist item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        wishlist_item.delete()

        return Response(
            {"message": "Product removed from wishlist."},
            status=status.HTTP_200_OK,
        )