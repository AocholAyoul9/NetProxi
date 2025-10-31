export interface Booking {
        id: string;
        clientId: string,
        clientName: string,
        serviceId: string,
        serviceName: string,
        companyId: string,
        companyName: string,
        startTime: Date,
        endTime: Date,
        address: string,
        price: number,
        status: string,
        assignedEmployeeId: string,
        assignedEmployeeName: string,

}