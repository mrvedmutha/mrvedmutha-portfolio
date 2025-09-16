"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkButton } from "@/components/home/ui/buttons";
import * as LucideIcons from "lucide-react";
import { IService } from "@/types/admin/pages/service.types";

interface ServiceModalProps {
  service: IService | null;
  isOpen: boolean;
  onClose: () => void;
}

function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  if (!service) return null;

  const IconComponent = (LucideIcons as any)[service.icon.lucideName];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {IconComponent && (
              <div className="p-2 border-2 border-brand-green rounded-lg">
                <IconComponent className="w-6 h-6 text-brand-green" />
              </div>
            )}
            {service.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-600 leading-relaxed max-h-40 overflow-y-auto">
              {service.description}
            </p>
          </div>
          {service.tags && service.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, index) => (
                  <span
                    key={`${tag.name}-${index}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("https://mrvedmutha.com/api/v1/admin/services");
        const data = await response.json();
        if (data.success && data.data?.data) {
          // Sort by creation date (latest first)
          const sortedServices = data.data.data.sort(
            (a: IService, b: IService) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          setServices(sortedServices);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleLearnMore = (service: IService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const truncateDescription = (text: string, lines: number = 2) => {
    const words = text.split(" ");
    const wordsPerLine = 12; // Approximate words per line
    const maxWords = lines * wordsPerLine;

    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="py-16 px-6 max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Skeleton className="w-8 h-0.5" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="w-8 h-0.5" />
              </div>
              <Skeleton className="h-12 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-full border border-[#cecece] bg-[#f5f5f5]">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex justify-start">
                      <Skeleton className="w-14 h-14 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-12 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-brand-yellow"></div>
              <span className="text-gray-600 font-medium">Services</span>
              <div className="w-8 h-0.5 bg-brand-yellow"></div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-brand-yellow italic">All Services</span>
              <span className="text-black"> I Provide</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore the complete range of services I offer to help bring your ideas to life.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = (LucideIcons as any)[service.icon.lucideName];

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-[#cecece] bg-[#f5f5f5]">
                    <CardContent className="p-6 space-y-6">
                      {/* Service Icon */}
                      <div className="flex justify-start">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                          {IconComponent && (
                            <IconComponent className="w-8 h-8 text-brand-green" />
                          )}
                        </div>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-xl font-bold text-black">
                        {service.name}
                      </h3>

                      {/* Service Description (2 lines only) */}
                      <p className="text-gray-600 leading-relaxed line-clamp-2">
                        {truncateDescription(service.description)}
                      </p>

                      {/* Tags */}
                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {service.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={`${tag.name}-${tagIndex}`}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {service.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{service.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Learn More Link */}
                      <div className="pt-2">
                        <LinkButton
                          onClick={() => handleLearnMore(service)}
                          size="sm"
                        >
                          Learn More
                        </LinkButton>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* No Services State */}
          {!loading && services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}