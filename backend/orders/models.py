from django.contrib.auth.models import User
from django.db import models

from products.models import Product


class Order(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Packed", "Packed"),
        ("Out for Delivery", "Out for Delivery"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    PAYMENT_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("ONLINE", "Online Payment"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")

    address = models.ForeignKey(
        "accounts.Address", on_delete=models.SET_NULL, null=True
    )

    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_CHOICES, default="COD"
    )

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"


class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.product.name
