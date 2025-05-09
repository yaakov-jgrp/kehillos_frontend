import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaEye, FaSpinner } from 'react-icons/fa';
import pdfService from '../../../services/pdf';

const ClientPdfPanel = ({ clientId }) => {
  const { t } = useTranslation();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPdfs();
  }, [clientId]);

  const loadPdfs = async () => {
    try {
      const response = await pdfService.getClientPdfs(clientId);
      setPdfs(response.data);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdfId) => {
    try {
      const response = await pdfService.downloadPdf(clientId, pdfId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${clientId}-${pdfId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleView = async (pdfId) => {
    try {
      const response = await pdfService.downloadPdf(clientId, pdfId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error viewing PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('pdfs.pdfList')}</h2>
      {pdfs.length === 0 ? (
        <p className="text-gray-500">{t('pdfs.pdfNo')}</p>
      ) : (
        <div className="grid gap-4">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{pdf.name}</h3>
                <p className="text-sm text-gray-500">
                  {t('pdfs.pdfCreated')}: {new Date(pdf.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(pdf.id)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title={t('common.view')}
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDownload(pdf.id)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title={t('common.download')}
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientPdfPanel;