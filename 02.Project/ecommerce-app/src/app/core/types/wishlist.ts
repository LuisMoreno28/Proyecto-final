import { z } from 'zod';
import { cartProductSchema, wishlistProductSchema } from './Products';
import { userSchema } from './User';

export const wishListItemSchema = z.object({
  product: wishlistProductSchema,
  addedAt: z.string().optional(),
});

export const wishListSchema = z.object({
  _id: z.string(),
  user: z.string(),
  products: z.array(wishListItemSchema),
});

export const wishListArraySchema = z.array(wishListSchema);

export type WishList = z.infer<typeof wishListSchema>;
