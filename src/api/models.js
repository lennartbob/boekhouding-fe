// src/api/models.js
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const CurrencyEnumSchema = z.enum(["EUR"]);
export const PartyTypeSchema = z.enum(["creditor", "debtor"]);
export const FactuurTypeSchema = z.enum(["verkoop", "inkoop"]);
export const TransactieTypeEnumSchema = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);
export const TransactieStatusSchema = z.enum(["IN_PROGRESS", "PAID"]);

export const UserSchema = z.object({
    id: z.string().uuid(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
});

export const OrganizationSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    logo_path: z.string(),
    kvk_nr: z.string(),
    btw_nr: z.string(),
});

export const RekeningSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    iban: z.string(),
    saldo: z.number(),
    currency: CurrencyEnumSchema,
});

export const PartySchema = z.object({
    name: z.string(),
    adres: z.string(),
    type: PartyTypeSchema,
    iban: z.string(),
    id: z.string().uuid().default(() => uuidv4()),
});

export const FactuurSchema = z.object({
    id: z.string().uuid(),
    factuur_nr: z.string(),
    save_path: z.string(),
    datum: z.date(),
    type: FactuurTypeSchema,
    transaction_id: z.string().uuid(),
});

export const TransactieSchema = z.object({
    id: z.string().uuid(),
    bedrag: z.number(),
    btw: z.number()
          .min(0)
          .max(1)
          .refine(val => [0, 0.09, 0.21].includes(val), {
              message: "BTW must be 0, 0.09, or 0.21",
          }),
    omscrhijving: z.string(),
    type: TransactieTypeEnumSchema,
    status: TransactieStatusSchema,
    datum: z.date(),
});