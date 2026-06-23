import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../services/api';

export const goPremium = createAsyncThunk(
    'payments/goPremium',
    async (paymentData, { rejectWithValue }) => {
        try {
            return await apiCall('/payments/premium.php', {
                method: 'POST',
                body: JSON.stringify(paymentData),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(goPremium.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(goPremium.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(goPremium.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
