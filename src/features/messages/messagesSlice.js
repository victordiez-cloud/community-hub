import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../services/api';

export const fetchMessages = createAsyncThunk(
    'messages/fetchAll',
    async (type = 'received', { rejectWithValue }) => {
        try {
            const endpoint = type === 'sent'
                ? '/messages/index.php?type=sent'
                : '/messages/index.php';
            return await apiCall(endpoint);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/send',
    async ({ receiverId, message }, { rejectWithValue }) => {
        try {
            return await apiCall('/messages/send.php', {
                method: 'POST',
                body: JSON.stringify({ receiver_id: receiverId, message }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessagesError: (state) => { state.error = null; },
        clearMessagesSuccess: (state) => { state.successMessage = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages || action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Message envoyé avec succès.';
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessagesError, clearMessagesSuccess } = messagesSlice.actions;
export default messagesSlice.reducer;
