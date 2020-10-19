import ContractService from '@/services/ContractService';
import UserContractsService from '@/services/UserContractsService';

export default {
    namespaced: true,
    state: {
        contracts: [],
        selectedItem: null
    },
    mutations: {
        setContracts(state, contracts) {
            state.contracts = contracts;
        },

        deleteContract(state, contractId) {
            const index = state.contracts.findIndex((contract) => contract.id === contractId);

            state.contracts.splice(index, 1);
        },

        updateContract(state, editedContract) {
            const index = state.contracts.findIndex((contract) => contract.id === editedContract.id);
            if (~index) {
                state.contracts.splice(index, 1, editedContract);
            }
        },

        addContract(state, contract) {
            state.contracts.push(contract);
        }
    },
    actions: {
        async removeContract({ commit }, contractId) {
            await ContractService.delete(contractId.id);

            commit('deleteContract', contractId.id);
        },

        async getContracts({ commit }, userId) {
            const { data } = await UserContractsService.index(userId);

            commit('setContracts', data);

            return data;
        },

        async saveContract({ commit }, selectedItem) {
            if (selectedItem.id) {
                await ContractService.save(selectedItem);

                commit('updateContract', selectedItem);
            } else {
                const { data } = await ContractService.save(selectedItem);

                commit('addContract', data);
            }
        }
    },

    getters: {
        getContracts(state) {
            return state.contracts;
        }
    }
};
