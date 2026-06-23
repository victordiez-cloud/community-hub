import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../services/api';

export const fetchEvents = createAsyncThunk(
    'events/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();
            if (params.q) query.set('q', params.q);
            if (params.type) query.set('type', params.type);
            if (params.price_type) query.set('price_type', params.price_type);
            if (params.category_id) query.set('category_id', params.category_id);
            const qs = query.toString();
            return await apiCall(`/events/index.php${qs ? '?' + qs : ''}`);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchEventDetail = createAsyncThunk(
    'events/fetchDetail',
    async (id, { rejectWithValue }) => {
        try {
            return await apiCall(`/events/show.php?id=${id}`);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'events/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await apiCall('/categories/index.php');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCategory = createAsyncThunk(
    'events/createCategory',
    async (name, { rejectWithValue }) => {
        try {
            return await apiCall('/categories/store.php', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerForEvent = createAsyncThunk(
    'events/register',
    async ({ eventId, paymentMethod }, { rejectWithValue }) => {
        try {
            return await apiCall('/events/register.php', {
                method: 'POST',
                body: JSON.stringify({ event_id: eventId, payment_method: paymentMethod }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const sendEventMessage = createAsyncThunk(
    'events/sendMessage',
    async ({ eventId, message }, { rejectWithValue }) => {
        try {
            return await apiCall('/events/message.php', {
                method: 'POST',
                body: JSON.stringify({ event_id: eventId, message }),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createEvent = createAsyncThunk(
    'events/create',
    async (eventData, { rejectWithValue }) => {
        try {
            return await apiCall('/events/store.php', {
                method: 'POST',
                body: JSON.stringify(eventData),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        items: [],
        currentEvent: null,
        categories: [],
        loading: false,
        detailLoading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearEventsError: (state) => { state.error = null; },
        clearEventsSuccess: (state) => { state.successMessage = null; },
        clearCurrentEvent: (state) => { state.currentEvent = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.events || action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEventDetail.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(fetchEventDetail.fulfilled, (state, action) => {
                state.detailLoading = false;
                const payload = action.payload;
                const eventData = payload.event || payload;
                // L'API peut renvoyer { event: {...}, messages: [...] } ou { event: { messages: [...] } }
                if (payload.messages && !eventData.messages) {
                    eventData.messages = payload.messages;
                }
                state.currentEvent = eventData;
            })
            .addCase(fetchEventDetail.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.categories || action.payload;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Catégorie créée avec succès.';
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerForEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerForEvent.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Inscription confirmée !';
            })
            .addCase(registerForEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendEventMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendEventMessage.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Message envoyé avec succès.';
            })
            .addCase(sendEventMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEvent.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Événement créé avec succès.';
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearEventsError, clearEventsSuccess, clearCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
