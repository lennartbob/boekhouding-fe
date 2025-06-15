// src/api/mockData.js
import { v4 as uuidv4 } from 'uuid';

// Helper to create dates
const pastDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

// --- Parties ---
export let mockParties = [
    // ... (same data as before)
    { id: uuidv4(), name: 'Coolblue B.V.', adres: 'Weena 664, Rotterdam', type: 'creditor', iban: 'NL65RABO0123456789' },
    { id: uuidv4(), name: 'Your Next Agency', adres: 'Keizersgracht 123, Amsterdam', type: 'debtor', iban: 'NL23INGB0987654321' },
    { id: uuidv4(), name: 'KPN', adres: 'Maanplein 55, Den Haag', type: 'creditor', iban: 'NL11ABNA0112233445' },
    { id: uuidv4(), name: 'Stripe Inc.', adres: '510 Townsend Street, San Francisco', type: 'creditor', iban: 'IE59AIBK93115212345678' },
    { id: uuidv4(), name: 'Big Tech Corp', adres: 'Singel 456, Amsterdam', type: 'debtor', iban: 'NL44INGB0223344556' },
];

// --- Rekeningen ---
export let mockRekeningen = [
    // ... (same data as before)
    { id: uuidv4(), name: 'ING Zakelijk', iban: 'NL50INGB0001234567', saldo: 15230.50, currency: 'EUR' },
    { id: uuidv4(), name: 'Rabobank Spaar', iban: 'NL70RABO0007654321', saldo: 8900.00, currency: 'EUR' },
];

// --- Transactions ---
export let mockTransacties = [
    // ... (same data as before)
    { id: uuidv4(), bedrag: 1200.00, btw: 0.21, omscrhijving: 'Project "Website Relaunch"', type: 'INCOME', status: 'PAID', datum: pastDate(10), rekening_id: mockRekeningen[0].id, party_id: mockParties[1].id },
    { id: uuidv4(), bedrag: 89.99, btw: 0.21, omscrhijving: 'Nieuwe monitor', type: 'EXPENSE', status: 'PAID', datum: pastDate(15), rekening_id: mockRekeningen[0].id, party_id: mockParties[0].id },
    { id: uuidv4(), bedrag: 55.00, btw: 0.21, omscrhijving: 'Internet en bellen', type: 'EXPENSE', status: 'PAID', datum: pastDate(20), rekening_id: mockRekeningen[0].id, party_id: mockParties[2].id },
    { id: uuidv4(), bedrag: 5000.00, btw: 0, omscrhijving: 'Overboeking naar spaarrekening', type: 'TRANSFER', status: 'PAID', datum: pastDate(5), rekening_id: mockRekeningen[0].id, party_id: null },
    { id: uuidv4(), bedrag: 2500.00, btw: 0.21, omscrhijving: 'Consultancy Q1', type: 'INCOME', status: 'PAID', datum: pastDate(40), rekening_id: mockRekeningen[0].id, party_id: mockParties[4].id },
    { id: uuidv4(), bedrag: 29.00, btw: 0, omscrhijving: 'Stripe transactiekosten', type: 'EXPENSE', status: 'PAID', datum: pastDate(11), rekening_id: mockRekeningen[0].id, party_id: mockParties[3].id },
    { id: uuidv4(), bedrag: 3100.00, btw: 0.21, omscrhijving: 'Marketing Campagne', type: 'INCOME', status: 'IN_PROGRESS', datum: pastDate(2), rekening_id: mockRekeningen[0].id, party_id: mockParties[1].id },
];

// --- Facturen ---
export let mockFacturen = [
    { id: uuidv4(), factuur_nr: 'F2024-001', save_path: '/invoices/F2024-001.pdf', datum: pastDate(10), type: 'verkoop', transaction_id: mockTransacties[0].id },
    { id: uuidv4(), factuur_nr: 'CB-98765', save_path: '/invoices/CB-98765.pdf', datum: pastDate(15), type: 'inkoop', transaction_id: mockTransacties[1].id },
    // A facture without a connected transaction
    { id: uuidv4(), factuur_nr: 'INV-2024-010', save_path: '/invoices/INV-2024-010.pdf', datum: pastDate(25), type: 'inkoop', transaction_id: null },
    { id: uuidv4(), factuur_nr: 'F2024-002', save_path: '/invoices/F2024-002.pdf', datum: pastDate(40), type: 'verkoop', transaction_id: mockTransacties[4].id },
    { id: uuidv4(), factuur_nr: 'F2024-003', save_path: '/invoices/F2024-003.pdf', datum: pastDate(2), type: 'verkoop', transaction_id: mockTransacties[6].id },
];

export let mockUser = {
        name: 'Jane Doe',
        email: 'jane.doe@fintechcorp.com',
        avatarUrl: 'https://placehold.co/100x100/94a3b8/FFFFFF/png?text=JD'
    }

export let mockOrg = {
        name: 'FinTech Corp',
        logoUrl: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=FC'
    }