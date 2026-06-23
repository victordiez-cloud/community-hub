import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import paymentReducer from '../features/payments/paymentSlice';
import skillReducer from '../features/skills/skillSlice';
import contactsReducer from '../features/contacts/contactsSlice';
import messagesReducer from '../features/messages/messagesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        payments: paymentReducer,
        skills: skillReducer,
        contacts: contactsReducer,
        messages: messagesReducer,
    },
});
