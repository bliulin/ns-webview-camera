import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCustomerMappingOutputModel } from '~/app/core/models/user-profile';
import { APP_CONFIG } from '~/app/core/environment';

const registerNewCustomerApiUrl = 'Private/registernewcustomer';

const removeCustomerApiUrl = 'Private/deletecustomer';

export class CompanyApiService {
    constructor(private httpClient: HttpClient) {}

    public requestNewCustomer(customerNUID: string): Observable<UserCustomerMappingOutputModel> {
        return this.httpClient.post<UserCustomerMappingOutputModel>(
            `${APP_CONFIG.baseUrl}${registerNewCustomerApiUrl}`,
            { customerNUID: customerNUID }
        );
    }

    public removeCustomer(customerId: string): any {
        return this.httpClient.request('delete', `${APP_CONFIG.baseUrl}${removeCustomerApiUrl}`, {
            body: { customerId: customerId }
        });
    }
}
