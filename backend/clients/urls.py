from django.urls import path
from clients import views


urlpatterns = [
    path('', views.ClientsList.as_view(), name='client-list'),
    path('<int:pk>/', views.ClientsDetail.as_view(), name='client-detail')
]
