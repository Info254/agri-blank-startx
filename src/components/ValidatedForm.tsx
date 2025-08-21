import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ValidatedFormProps {
  onSubmit: (values: Record<string, any>) => Promise<{ data: any; error: any }>;
  fields: Array<{ name: string; label: string; type?: string; required?: boolean }>;
  initialValues?: Record<string, any>;
  submitLabel?: string;
}

const ValidatedForm: React.FC<ValidatedFormProps> = ({ onSubmit, fields, initialValues = {}, submitLabel = 'Submit' }) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await onSubmit(values);
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Submitted successfully.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block mb-1 font-medium" htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            value={values[field.name] || ''}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
            disabled={loading}
          />
          {errors[field.name] && <div className="text-red-500 text-xs mt-1">{errors[field.name]}</div>}
        </div>
      ))}
      <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : submitLabel}</Button>
    </form>
  );
};

export default ValidatedForm;
