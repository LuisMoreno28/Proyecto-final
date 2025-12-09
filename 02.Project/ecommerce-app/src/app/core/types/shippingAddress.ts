import { z } from 'zod';

export const AddressTypeSchema = z.enum(['home', 'work', 'other']);

export const ShippingAddressSchema = z.object({
  _id: z.string(),
  user: z.string(),

  name: z.string().min(2).max(100),

  address: z.string().min(5).max(200),

  city: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),

  state: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),

  postalCode: z
    .string()
    .min(4)
    .max(6)
    .regex(/^\d+$/),

  country: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .default('México'),

  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s()]+$/),

  isDefault: z.boolean().default(false),

  addressType: AddressTypeSchema.default('home'),
});

export const ShippingAddressArraySchema = z.array(ShippingAddressSchema);

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

// CREATE → igual que payment method (omit obligatorio)
export const CreateShippingAddressSchema = ShippingAddressSchema.omit({
  _id: true,
  user: true,
});
export type CreateShippingAddress = z.infer<typeof CreateShippingAddressSchema>;

// UPDATE → igual que payment method (partial + required _id)
export const UpdateShippingAddressSchema = ShippingAddressSchema.partial().required({
  _id: true,
});
export type UpdateShippingAddress = z.infer<typeof UpdateShippingAddressSchema>;
