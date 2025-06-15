// src/api/mockApi.js
import { v4 as uuidv4 } from 'uuid';
import { mockRekeningen, mockFacturen, mockTransacties, mockParties, mockOrg, mockUser } from './mockData';

// Simulate network delay
const apiCall = (data, delay = 300) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Deep copy to prevent unexpected mutations and simulate fresh data from an API
            resolve(JSON.parse(JSON.stringify(data))); 
        }, delay);
    });
};

// --- REKENINGEN ---
export const getRekeningen = () => apiCall(mockRekeningen);
export const getRekeningById = (id) => apiCall(mockRekeningen.find(r => r.id === id));
export const addRekening = (rekeningData) => {
    const newRekening = { ...rekeningData, id: uuidv4(), currency: 'EUR' };
    mockRekeningen.push(newRekening);
    return apiCall(newRekening);
};

// --- FACTUREN ---
export const getFacturen = () => apiCall(mockFacturen);
export const getFactuurByTransactionId = (transactionId) => apiCall(mockFacturen.find(f => f.transaction_id === transactionId));
export const deleteFactuur = (factuurId) => {
    mockFacturen = mockFacturen.filter(f => f.id !== factuurId);
    return apiCall({ success: true });
};


export const deleteRekening = (rekeningId) => {
    const transactionsExist = mockTransacties.some(t => t.rekening_id === rekeningId);
    if (transactionsExist) {
        return apiCall({ success: false, message: 'Rekening has transactions and cannot be deleted.' }, 100);
    }
    const initialLength = mockRekeningen.length;
    mockRekeningen = mockRekeningen.filter(r => r.id !== rekeningId);
    const success = mockRekeningen.length < initialLength;
    return apiCall({ success });
};

export const connectFactuurToTransaction = (factuurId, transactionId) => {
    const factuur = mockFacturen.find(f => f.id === factuurId);
    if (factuur) {
        factuur.transaction_id = transactionId;
    }
    return apiCall(factuur);
};

// --- PARTIES ---
export const getParties = () => apiCall(mockParties);
export const getPartyById = (id) => apiCall(mockParties.find(p => p.id === id));
export const addParty = (partyData) => {
    const newParty = { ...partyData, id: uuidv4() };
    mockParties.push(newParty);
    return apiCall(newParty);
};


// --- TRANSACTIONS ---
export const getTransactions = ({ rekeningId = null, partyId = null } = {}) => {
    let transactions = mockTransacties;
    if (rekeningId) {
        transactions = transactions.filter(t => t.rekening_id === rekeningId);
    }
    if (partyId) {
        transactions = transactions.filter(t => t.party_id === partyId);
    }
    // Return all if no filter
    return apiCall(transactions);
};
export const getTransactionById = (id) => apiCall(mockTransacties.find(t => t.id === id));
export const setTransactionStatus = (transactionId, status) => {
    const transaction = mockTransacties.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = status;
        return apiCall(transaction);
    }
    return apiCall(null, 404);
};
export const deleteTransaction = (transactionId) => {
    const initialLength = mockTransacties.length;
    mockTransacties = mockTransacties.filter(t => t.id !== transactionId);

    // Also disconnect any factuur linked to this transaction
    const linkedFactuur = mockFacturen.find(f => f.transaction_id === transactionId);
    if (linkedFactuur) {
        linkedFactuur.transaction_id = null;
    }
    
    const success = mockTransacties.length < initialLength;
    return apiCall({ success });
};

export const getOrganization = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockOrg);
        }, 300); // Simulate network delay
    });
};

export const getUser = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockUser);
        }, 300); // Simulate network delay
    });
};