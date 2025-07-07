import React, { useState, useRef, useCallback, useMemo } from "react";
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
  Building2,
  Upload,
  X,
  Globe,
  Mail,
  Image,
  Hash,
  MapPin,
} from "lucide-react";
import { Translations } from "@/lib/i18n";
import { Company } from "@/hooks/use-optimized-tia-app";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  selectedCompany: Company | null;
  setSelectedCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  t: Translations;
}

// Country data - a comprehensive list of countries
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function CompanyModal({
  isOpen,
  onClose,
  companies,
  setCompanies,
  selectedCompany,
  setSelectedCompany,
  t,
}: CompanyModalProps) {
  // Get the single company or create a default one
  const company = companies.length > 0 ? companies[0] : null;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(() => ({
    name: company?.name || "",
    email: company?.email || "",
    website: company?.website || "",
    taxId: company?.taxId || "",
    country: company?.country || "",
  }));

  // Initialize logo preview when modal opens
  React.useEffect(() => {
    if (isOpen && company?.logo) {
      setLogoPreview(company.logo);
    } else if (isOpen && !company?.logo) {
      setLogoPreview("");
    }
  }, [isOpen, company?.logo]);

  // Reset form when company changes
  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        email: company.email,
        website: company.website,
        taxId: company.taxId,
        country: company.country,
      });
    }
  }, [company]);

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

    if (company) {
      // Update existing company
      const updatedCompany: Company = {
        ...company,
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim(),
        taxId: formData.taxId.trim(),
        country: formData.country,
        logo: logoUrl,
        updatedDate: now,
      };

      setCompanies([updatedCompany]);
      setSelectedCompany(updatedCompany);
    } else {
      // Create new company
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim(),
        taxId: formData.taxId.trim(),
        country: formData.country,
        logo: logoUrl,
        createdDate: now,
        updatedDate: now,
      };

      setCompanies([newCompany]);
      setSelectedCompany(newCompany);
    }

    setLogoFile(null);
    onClose();
  }, [
    formData,
    company,
    logoPreview,
    setCompanies,
    setSelectedCompany,
    onClose,
  ]);

  const isFormValid = formData.name.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-90vh overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t.companyManagement}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="company-form-field">
            <Label className="company-form-label">{t.companyLogo}</Label>
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
              <Label htmlFor="companyName" className="company-form-label">
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
              <Label htmlFor="companyEmail" className="company-form-label">
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

            <div className="company-form-field">
              <Label htmlFor="companyWebsite" className="company-form-label">
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

            <div className="company-form-field">
              <Label htmlFor="taxId" className="company-form-label">
                {t.taxId}
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      taxId: e.target.value,
                    }))
                  }
                  placeholder={t.taxId}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="company-form-field md:col-span-2">
              <Label htmlFor="country" className="company-form-label">
                {t.country}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: value,
                    }))
                  }
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder={t.selectCountry} />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={handleSaveCompany}
              disabled={!isFormValid}
              className="flex items-center gap-2"
            >
              {t.save}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
