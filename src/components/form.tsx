import { useEffect, useMemo, useState } from "react";

export type ContactFormMode = "create" | "view";

export interface ContactFormValues {
  id?: number;
  name: string;
  phone: string;
}

type ContactEditableField = Exclude<keyof ContactFormValues, "id">;
type FormErrors = Partial<Record<ContactEditableField, string>>;

interface FormProps {
  initialData?: ContactFormValues;
  mode?: ContactFormMode;
  variant?: "page" | "modal";
  title?: string;
  description?: string;
  onSubmit: (values: ContactFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const defaultValues: ContactFormValues = { name: "", phone: "" };

const ContactForm = ({
  initialData,
  mode = "create",
  variant = "page",
  title,
  description,
  onSubmit,
  onCancel,
}: FormProps) => {
  const [formData, setFormData] = useState<ContactFormValues>(initialData ?? defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isEditMode, setIsEditMode] = useState(mode === "create");

  useEffect(() => {
    setFormData(initialData ?? defaultValues);
    setErrors({});
    setSubmitStatus("idle");
    setIsEditMode(mode === "create");
  }, [initialData, mode]);

  const isReadOnly = mode === "view" && !isEditMode;
  const heading = useMemo(() => {
    if (title) return title;
    if (mode === "view") return isEditMode ? "Edit Contact" : "View Contact";
    if (mode === "create") return "Create Contact";
    return "Contact Details";
  }, [mode, title]);

  const subHeading = description ?? "We'd love to hear from you";

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must be less than 50 characters";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return "Phone number is required";
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone;
  };

  const handleChange = (field: ContactEditableField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setSubmitStatus("idle");
  };

  const handleCancel = () => {
    setFormData(initialData ?? defaultValues);
    setErrors({});
    setSubmitStatus("idle");
    if (mode === "view" && isEditMode) {
      setIsEditMode(false);
      return;
    }
    onCancel();
  };

  const handlePrimaryButtonClick = () => {
    if (mode === "view" && !isEditMode) {
      setIsEditMode(true);
      return;
    }
    handleCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      handleCancel();
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await Promise.resolve(onSubmit(formData));
      setSubmitStatus("success");
      if (mode === "view") {
        setIsEditMode(false);
      }
      if (variant === "page" && mode === "create") {
        setFormData(defaultValues);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const header = (
    <div className={`${variant === "modal" ? "text-left" : "text-center"} mb-8`}>
      <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
        {heading}
      </h1>
      {subHeading && <p className="text-slate-500">{subHeading}</p>}
    </div>
  );

  const formCard = (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 rounded-2xl shadow-2xl shadow-blue-100 border border-slate-200 p-8 space-y-6 backdrop-blur-sm"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter your name"
          className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none ${
            errors.name
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
          disabled={isSubmitting && !isReadOnly}
          readOnly={isReadOnly}
        />
        {errors.name && (
          <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
          className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none ${
            errors.phone
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          }`}
          disabled={isSubmitting && !isReadOnly}
          readOnly={isReadOnly}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 flex items-center gap-1 animate-fade-in">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>

      {submitStatus === "success" && variant === "page" && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-sm flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Form submitted successfully!
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Something went wrong. Please try again.
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrimaryButtonClick}
          className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
        >
          {mode === "view" && !isEditMode ? "Edit" : "Cancel"}
        </button>
        {(mode === "create" || isEditMode) && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : mode === "create" ? (
              "Create"
            ) : (
              "Save"
            )}
          </button>
        )}
      </div>
    </form>
  );

  if (variant === "modal") {
    return (
      <div className="w-full">
        {header}
        {formCard}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <div className="w-full max-w-md">
        {header}
        {formCard}
        <p className="text-center text-slate-500 text-sm mt-6">Your information is secure and never shared</p>
      </div>
    </div>
  );
};

export default ContactForm;
