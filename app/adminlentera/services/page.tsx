'use client';

import { useState, useEffect } from 'react';
import { getServices, saveService, deleteService, Service, getServiceBenefits, saveServiceBenefit, deleteServiceBenefit, ServiceBenefit } from '@/lib/db';
import AdminLayout from '@/components/AdminLayout';
import BenefitManager from '@/components/admin/services/BenefitManager';
import ServiceForm from '@/components/admin/services/ServiceForm';
import ServiceList from '@/components/admin/services/ServiceList';
import { useModal } from '@/components/admin/ModalContext';

export default function ServicesAdmin() {
  const { showAlert, showConfirm } = useModal();
  const [services, setServices] = useState<Service[]>([]);
  const [benefits, setBenefits] = useState<ServiceBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});

  const [activeServiceForBenefits, setActiveServiceForBenefits] = useState<Service | null>(null);
  const [isEditingBenefit, setIsEditingBenefit] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState<Partial<ServiceBenefit>>({});
  const [featuresText, setFeaturesText] = useState('');
  async function loadServices() {
    const sData = await getServices();
    setServices(sData);
    const bData = await getServiceBenefits();
    setBenefits(bData);
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService.name || !currentService.slug) return;

    const newService: Service = {
      id: currentService.id || `srv-${Date.now()}`,
      name: currentService.name,
      slug: currentService.slug,
      subtitle: currentService.subtitle || '',
      description: currentService.description || '',
      video_url: currentService.video_url || '',
      image_url: currentService.image_url || '',
      is_active: currentService.is_active ?? true,
    };

    const updated = await saveService(newService);
    setServices(updated);
    setIsEditing(false);
    setCurrentService({});
  };

  const handleDeleteService = async (id: string) => {
    if (await showConfirm('Yakin ingin menghapus layanan ini? Semua benefit di dalamnya juga akan terhapus.')) {
      const updated = await deleteService(id);
      setServices(updated);
    }
  };

  const startEditService = (service?: Service) => {
    if (service) {
      setCurrentService(service);
    } else {
      setCurrentService({ is_active: true });
    }
    setIsEditing(true);
  };

  const startManageBenefits = (service: Service) => {
    setActiveServiceForBenefits(service);
    setIsEditingBenefit(false);
  };

  const startEditBenefit = (benefit?: ServiceBenefit) => {
    if (benefit) {
      setCurrentBenefit(benefit);
      setFeaturesText(benefit.features.join('\n'));
    } else {
      setCurrentBenefit({ is_active: true, order: 0 });
      setFeaturesText('');
    }
    setIsEditingBenefit(true);
  };

  const handleSaveBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeServiceForBenefits || !currentBenefit.name) return;

    const newBenefit: ServiceBenefit = {
      id: currentBenefit.id || `ben-${Date.now()}`,
      service_id: activeServiceForBenefits.id,
      name: currentBenefit.name,
      description: currentBenefit.description || '',
      features: featuresText.split('\n').map(f => f.trim()).filter(f => f.length > 0),
      is_active: currentBenefit.is_active ?? true,
      order: currentBenefit.order || 0
    };

    const updated = await saveServiceBenefit(newBenefit);
    setBenefits(updated);
    setIsEditingBenefit(false);
    setCurrentBenefit({});
  };

  const handleDeleteBenefit = async (id: string) => {
    if (await showConfirm('Yakin ingin menghapus benefit/sub-layanan ini?')) {
      const updated = await deleteServiceBenefit(id);
      setBenefits(updated);
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Loading services...</div></AdminLayout>;

  if (activeServiceForBenefits) {
    return (
      <AdminLayout>
        <BenefitManager 
          activeService={activeServiceForBenefits}
          benefits={benefits}
          isEditingBenefit={isEditingBenefit}
          currentBenefit={currentBenefit}
          featuresText={featuresText}
          startEditBenefit={startEditBenefit}
          setIsEditingBenefit={setIsEditingBenefit}
          setCurrentBenefit={setCurrentBenefit}
          setFeaturesText={setFeaturesText}
          handleSaveBenefit={handleSaveBenefit}
          handleDeleteBenefit={handleDeleteBenefit}
          setActiveService={setActiveServiceForBenefits}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ServiceList 
          services={services}
          startEditService={startEditService}
          startManageBenefits={startManageBenefits}
          handleDeleteService={handleDeleteService}
        />
        {isEditing && (
          <ServiceForm 
            currentService={currentService}
            setCurrentService={setCurrentService}
            handleSaveService={handleSaveService}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </AdminLayout>
  );
}
