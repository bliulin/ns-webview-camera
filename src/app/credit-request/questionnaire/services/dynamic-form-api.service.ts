import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_CONFIG } from "~/app/core/environment";
import { DynamicFormModel } from "~/app/credit-request/models/dynamicFormModel";
import { DynamicFormOutputModel } from "~/app/credit-request/models/dynamicFormOutputModel";

@Injectable()
export class DynamicFormApiService {

    private _urlSubmitForm: string = '/Private/submitdynamicform';

    public constructor(private httpClient: HttpClient) {}

    public submitForm(formData: DynamicFormModel): Observable<any> {
        const url = APP_CONFIG.baseUrl + this._urlSubmitForm;
        return this.httpClient.post(url, formData);
    }

    public getDynamicForm(dynamicFormId: string): Observable<DynamicFormOutputModel> {
        //const url = APP_CONFIG.baseUrl + 'Private/dynamicform';
        const url = `${APP_CONFIG.baseUrl}Private/dynamicform?dynamicFormId=${dynamicFormId}`;
        return this.httpClient.get(url);//
    }
}
