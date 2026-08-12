from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Reset Django admin password"

    def handle(self, *args, **options):

        User = get_user_model()

        username = "SravaniJ"
        new_password = "Sravani@364"

        self.stdout.write("========== DJANGO USERS ==========")

        for user in User.objects.all():
            self.stdout.write(
                f"Username: {user.username} | "
                f"Email: {user.email} | "
                f"Staff: {user.is_staff} | "
                f"Superuser: {user.is_superuser} | "
                f"Active: {user.is_active}"
            )

        self.stdout.write("==================================")

        try:
            user = User.objects.get(username=username)

            user.set_password(new_password)
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"PASSWORD RESET SUCCESSFULLY: {username}"
                )
            )

        except User.DoesNotExist:

            self.stdout.write(
                self.style.ERROR(
                    f"USER NOT FOUND: {username}"
                )
            )