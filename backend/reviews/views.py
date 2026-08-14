from django.db.models import Avg

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import OrderItem

from .models import Review
from .serializers import ReviewSerializer


# ============================================================
# PRODUCT REVIEWS
# ============================================================


class ProductReviewListView(APIView):

    def get(self, request, product_id):

        reviews = (
            Review.objects
            .filter(product_id=product_id)
            .select_related("user")
            .order_by("-created_at")
        )

        serializer = ReviewSerializer(
            reviews,
            many=True,
        )

        return Response(serializer.data)


# ============================================================
# CREATE REVIEW
# ============================================================


class CreateReviewView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):

        rating = request.data.get("rating")
        comment = request.data.get("comment", "").strip()

        # ----------------------------------------------------
        # VALIDATE RATING
        # ----------------------------------------------------

        try:
            rating = int(rating)
        except (TypeError, ValueError):

            return Response(
                {"error": "Please provide a valid rating."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rating < 1 or rating > 5:

            return Response(
                {"error": "Rating must be between 1 and 5."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CHECK WHETHER CUSTOMER PURCHASED PRODUCT
        # ----------------------------------------------------

        purchased = OrderItem.objects.filter(
            product_id=product_id,
            order__user=request.user,
            order__status="Delivered",
        ).exists()

        if not purchased:

            return Response(
                {
                    "error": (
                        "You can review this product only "
                        "after purchasing and receiving it."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # ----------------------------------------------------
        # CHECK EXISTING REVIEW
        # ----------------------------------------------------

        existing_review = Review.objects.filter(
            product_id=product_id,
            user=request.user,
        ).first()

        if existing_review:

            return Response(
                {
                    "error": (
                        "You have already reviewed this product."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CREATE REVIEW
        # ----------------------------------------------------

        review = Review.objects.create(
            product_id=product_id,
            user=request.user,
            rating=rating,
            comment=comment,
        )

        serializer = ReviewSerializer(review)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# UPDATE / DELETE OWN REVIEW
# ============================================================


class MyReviewDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):

        review = Review.objects.filter(
            product_id=product_id,
            user=request.user,
        ).first()

        if not review:

            return Response(
                {"review": None},
                status=status.HTTP_200_OK,
            )

        serializer = ReviewSerializer(review)

        return Response(serializer.data)

    def patch(self, request, product_id):

        try:

            review = Review.objects.get(
                product_id=product_id,
                user=request.user,
            )

        except Review.DoesNotExist:

            return Response(
                {"error": "Review not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        rating = request.data.get("rating")

        if rating is not None:

            try:
                rating = int(rating)
            except (TypeError, ValueError):

                return Response(
                    {"error": "Please provide a valid rating."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if rating < 1 or rating > 5:

                return Response(
                    {"error": "Rating must be between 1 and 5."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            review.rating = rating

        if "comment" in request.data:

            review.comment = str(
                request.data.get("comment", "")
            ).strip()

        review.save()

        serializer = ReviewSerializer(review)

        return Response(serializer.data)

    def delete(self, request, product_id):

        try:

            review = Review.objects.get(
                product_id=product_id,
                user=request.user,
            )

        except Review.DoesNotExist:

            return Response(
                {"error": "Review not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        review.delete()

        return Response(
            {"message": "Review deleted successfully."},
            status=status.HTTP_200_OK,
        )


# ============================================================
# PRODUCT RATING SUMMARY
# ============================================================


class ProductRatingView(APIView):

    def get(self, request, product_id):

        reviews = Review.objects.filter(
            product_id=product_id
        )

        rating_data = reviews.aggregate(
            average_rating=Avg("rating"),
        )

        average_rating = rating_data["average_rating"]

        if average_rating is None:
            average_rating = 0

        return Response(
            {
                "average_rating": round(
                    float(average_rating),
                    1,
                ),
                "review_count": reviews.count(),
            }
        )