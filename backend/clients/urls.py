from django.urls import path
from clients import views


urlpatterns = [
    path('', views.ClientsList.as_view(), name='client-list'),
    path('export/', views.ClientsExportData.as_view(), name='export_data'),
    path('import/', views.ClientsImportData.as_view(), name='import_data'),
    path('<int:pk>/', views.ClientsDetail.as_view(), name='client-detail'),
]
