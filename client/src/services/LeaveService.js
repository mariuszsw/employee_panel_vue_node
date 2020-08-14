import Api from '@/services/Api';

class LeaveService {
    delete(leaveId) {
        return Api.delete(`leaves/${leaveId}`);
    }

    save(leave) {
        if (leave.id) {
            return Api.put(`leaves/${leave.id}`, leave);
        } else {
            return Api.post(`leaves`, leave);
        }
    }
}

export default new LeaveService();
