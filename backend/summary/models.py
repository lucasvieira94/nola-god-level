from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Dashboard(models.Model):
    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="dashboards")
    name        = models.CharField(max_length=120)
    layout      = models.JSONField()          
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        unique_together = ("owner", "name")

    def __str__(self):
        return f"{self.name} – {self.owner.username}"
