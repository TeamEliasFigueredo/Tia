import React, { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Building2,
  Edit3,
  Trash2,
  Upload,
  X,
  Globe,
  Mail,
  Image,
} from "lucide-react";
import { Translations } from "@/lib/i18n";
import { Company } from "@/hooks/use-optimized-tia-app";
import { cn } from "@/lib/utils";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  selectedCompany: Company | null;
  setSelectedCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  t: Translations;
}

export default function CompanyModal({
  isOpen,
  onClose,
  companies,
  setCompanies,
  selectedCompany,
  setSelectedCompany,
  t,
}: CompanyModalProps) {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
  });

  const handleCreateNew = useCallback(() => {
    setIsCreating(true);
    setEditingCompany(null);
    setFormData({ name: "", email: "", website: "" });
    setLogoFile(null);
    setLogoPreview("");
  }, []);

  const handleEditCompany = useCallback((company: Company) => {
    setEditingCompany(company);
    setIsCreating(false);
    setFormData({
      name: company.name,
      email: company.email,
      website: company.website,
    });
    setLogoFile(null);
    setLogoPreview(company.logo || "");
  }, []);

  const handleDeleteCompany = useCallback(
    (companyId: string) => {
      if (confirm(t.confirmDelete)) {
        setCompanies((prev) => prev.filter((c) => c.id !== companyId));
        if (selectedCompany?.id === companyId) {
          setSelectedCompany(null);
        }
      }
    },
    [setCompanies, selectedCompany, setSelectedCompany, t.confirmDelete],
  );

  const handleLogoUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSaveCompany = useCallback(() => {
    if (!formData.name.trim()) return;

    const now = new Date().toISOString();
    const logoUrl = logoPreview || undefined;

    if (isCreating) {
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim(),
        logo: logoUrl,
        createdDate: now,
        updatedDate: now,
      };

      setCompanies((prev) => [...prev, newCompany]);

      // Auto-select the first company created
      if (companies.length === 0) {
        setSelectedCompany(newCompany);
      }
    } else if (editingCompany) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id
            ? {
                ...c,
                name: formData.name.trim(),
                email: formData.email.trim(),
                website: formData.website.trim(),
                logo: logoUrl,
                updatedDate: now,
              }
            : c,
        ),
      );

      // Update selected company if it's the one being edited
      if (selectedCompany?.id === editingCompany.id) {
        setSelectedCompany({
          ...editingCompany,
          name: formData.name.trim(),
          email: formData.email.trim(),
          website: formData.website.trim(),
          logo: logoUrl,
          updatedDate: now,
        });
      }
    }

    setIsCreating(false);
    setEditingCompany(null);
    setFormData({ name: "", email: "", website: "" });
    setLogoFile(null);
    setLogoPreview("");
  }, [
    formData,
    isCreating,
    editingCompany,
    logoPreview,
    setCompanies,
    companies.length,
    setSelectedCompany,
    selectedCompany,
  ]);

  const handleCancel = useCallback(() => {
    setIsCreating(false);
    setEditingCompany(null);
    setFormData({ name: "", email: "", website: "" });
    setLogoFile(null);
    setLogoPreview("");
  }, []);

  const handleSelectCompany = useCallback(
    (company: Company) => {
      setSelectedCompany(company);
    },
    [setSelectedCompany],
  );

  const isFormValid = formData.name.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl-responsive max-h-90vh overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t.companyManagement}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t.companyProfile}</h3>
              <Button
                onClick={handleCreateNew}
                className="flex items-center gap-2"
                disabled={isCreating || editingCompany !== null}
              >
                <Plus className="h-4 w-4" />
                {t.createNewCompany}
              </Button>
            </div>

            <div className="space-y-3 max-h-400 overflow-y-auto">
              {companies.length === 0 ? (
                <div className="company-empty-state">
                  <Building2 className="company-empty-icon" />
                  <h4 className="company-empty-title">{t.noCompanySelected}</h4>
                  <p className="company-empty-description">
                    {t.selectCompanyToView}
                  </p>
                </div>
              ) : (
                companies.map((company) => (
                  <div
                    key={company.id}
                    className={cn(
                      "company-card cursor-pointer",
                      selectedCompany?.id === company.id &&
                        "ring-2 ring-blue-500 dark:ring-blue-400",
                    )}
                    onClick={() => handleSelectCompany(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="company-header-logo"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {company.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {company.email}
                          </p>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {company.website}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="company-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCompany(company);
                          }}
                          disabled={isCreating || editingCompany !== null}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompany(company.id);
                          }}
                          disabled={isCreating || editingCompany !== null}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Company Form */}
          <div className="space-y-4">
            {(isCreating || editingCompany) && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {isCreating ? t.createCompany : t.editCompany}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div className="company-form-field">
                    <Label className="company-form-label">
                      {t.companyLogo}
                    </Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="company-logo-container"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="company-logo-preview"
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">
                              {t.uploadLogo}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {logoPreview ? t.changeLogo : t.uploadLogo}
                        </Button>
                        {logoPreview && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveLogo}
                          >
                            <X className="h-4 w-4 mr-2" />
                            {t.removeLogo}
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="company-form-grid">
                    <div className="company-form-field">
                      <Label
                        htmlFor="companyName"
                        className="company-form-label"
                      >
                        {t.companyName} *
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder={t.companyName}
                        required
                      />
                    </div>

                    <div className="company-form-field">
                      <Label
                        htmlFor="companyEmail"
                        className="company-form-label"
                      >
                        {t.companyEmail}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="companyEmail"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder={t.companyEmail}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="company-form-field md:col-span-2">
                      <Label
                        htmlFor="companyWebsite"
                        className="company-form-label"
                      >
                        {t.companyWebsite}
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="companyWebsite"
                          type="url"
                          value={formData.website}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          placeholder="https://example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      onClick={handleSaveCompany}
                      disabled={!isFormValid}
                      className="flex items-center gap-2"
                    >
                      {isCreating ? t.createCompany : t.updateCompany}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {!isCreating && !editingCompany && (
              <div className="company-empty-state">
                <Plus className="company-empty-icon" />
                <h4 className="company-empty-title">{t.createNewCompany}</h4>
                <p className="company-empty-description">
                  Create a new company profile to get started.
                </p>
                <Button onClick={handleCreateNew} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.createCompany}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
