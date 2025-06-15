// src/api/mockApi.js
import { v4 as uuidv4 } from 'uuid';
import { mockRekeningen, mockFacturen, mockTransacties, mockParties } from './mockData';

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