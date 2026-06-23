import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../services/api';

export const fetchContacts = createAsyncThunk(
    'contacts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await apiCall('/contacts/index.php');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'contacts/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            return await apiCall('/users/index.php');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendContactRequest = createAsyncThunk(
    'contacts/sendRequest',
    async (receiverId, { rejectWithValue }) => {
        try {
            return await apiCall('/contacts/store.php', {
                method: 'POST',
                body: JSON.stringify({ receiver_id: receiverId }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const acceptContactRequest = createAsyncThunk(
    'contacts/acceptRequest',
    async (contactId, { rejectWithValue }) => {
        try {
            return await apiCall('/contacts/accept.php', {
                method: 'POST',
                body: JSON.stringify({ contact_id: contactId }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],
        users: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearContactsError: (state) => { state.error = null; },
        clearContactsSuccess: (state) => { state.successMessage = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload.contacts || action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload.users || action.payload;
            })
            .addCase(sendContactRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendContactRequest.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Demande de contact envoyée.';
            })
            .addCase(sendContactRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(acceptContactRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptContactRequest.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Contact accepté.';
            })
            .addCase(acceptContactRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearContactsError, clearContactsSuccess } = contactsSlice.actions;
export default contactsSlice.reducer;
