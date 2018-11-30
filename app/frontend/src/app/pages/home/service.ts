import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {
    Iris,
    ProbabilityPrediction,
    SVCParameters,
    SVCResult,
    uploadresults,
    test
} from "./types";

const SERVER_URL: string = 'api/';

@Injectable()
export class Service {

    constructor(private http: Http) {
    }

    public async predict(urls: any){
        return await this.http.post(`${SERVER_URL}predict`, urls).map((res) => res.json()).toPromise();
    }
    public async loadModel(modelType: any){
        console.log(modelType)
        return await this.http.post(`${SERVER_URL}load_model`, modelType).map((res) => res.json()).toPromise();
    }
}


