import UserLeavesService from '@/services/UserLeavesService.js';
import LeaveService from '@/services/LeaveService.js';

export default {
    namespaced: true,
    state: {
        leaves: []
    },
    mutations: {
        setLeaves(state, leaves) {
            state.leaves = leaves;
        },
        deleteLeave(state, leaveId) {
            const index = state.leaves.findIndex((leave) => leave.id === leaveId);

            state.leaves.splice(index, 1);
        },
        updateLeave(state, editedLeave) {
            const index = state.leaves.findIndex((leave) => leave.id === editedLeave.id);

            if (~index) {
                state.leaves.splice(index, 1, editedLeave);
            }
        },

        addLeave(state, leave) {
            state.leaves.push(leave);
        }
    },
    actions: {
        async removeLeave({ commit }, leaveId) {
            await LeaveService.delete(leaveId.id);

            commit('deleteLeave', leaveId.id);
        },

        async getLeaves({ commit }, id) {
            const { data } = await UserLeavesService.index(id);

            commit('setLeaves', data);

            this.leaves = data;

            return data;
        },

        async saveLeave({ commit }, selectedItem) {
            if (selectedItem.id) {
                await LeaveService.save(selectedItem);

                commit('updateLeave', selectedItem);
            } else {
                const { data } = await LeaveService.save(selectedItem);

                commit('addLeave', selectedItem);
            }
        }
    },

    getters: {}
};
