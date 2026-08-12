from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Reset Django admin password"

    def handle(self, *args, **options):

        User = get_user_model()

        username = "SravaniJ"
        new_password = "Sravani@364"

        try:
            user = User.objects.get(username=username)

            user.set_password(new_password)
            user.is_staff = True
            user.is_superuser = True
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Password reset successfully for user: {username}"
                )
            )

        except User.DoesNotExist:

            self.stdout.write(
                self.style.ERROR(
                    f"User '{username}' does not exist."
                )
            )