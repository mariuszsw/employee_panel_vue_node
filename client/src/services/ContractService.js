import Api from '@/services/Api';

class ContractService {
    delete(contractId) {
        return Api.delete(`contracts/${contractId}`);
    }

    save(contract) {
        if (contract.id) {
            return Api.put(`contracts/${contract.id}`, contract);
        } else {
            return Api.post(`contracts`, contract);
        }
    }
}

export default new ContractService();
