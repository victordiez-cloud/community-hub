import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../services/api';

export const fetchMySkills = createAsyncThunk(
    'skills/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            return await apiCall('/skills/index.php');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createSkill = createAsyncThunk(
    'skills/create',
    async (skillData, { rejectWithValue }) => {
        try {
            return await apiCall('/skills/store.php', {
                method: 'POST',
                body: JSON.stringify(skillData),
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const skillSlice = createSlice({
    name: 'skills',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSkillError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMySkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMySkills.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.skills || action.payload;
            })
            .addCase(fetchMySkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSkill.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSkillError } = skillSlice.actions;
export default skillSlice.reducer;
