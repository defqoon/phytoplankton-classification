import {Component, OnInit} from '@angular/core';
import {IrisService} from "./iris.service";
import {
    Iris,
    ProbabilityPrediction,
    SVCParameters,
    SVCResult,
    uploadresults
} from "./types";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public svcParameters: SVCParameters = new SVCParameters();
    public svcResult: SVCResult;
    public iris: Iris = new Iris();
    public probabilityPredictions: ProbabilityPrediction[];
    public selectedFile: File;
    public uploadr: uploadresults;
    public stepsModel = [];

    // graph styling
    public colorScheme = {
        domain: ['#1a242c', '#e81746', '#e67303', '#FF0000', '#6FFF00']
    };

    constructor(private irisService: IrisService) {
    }

    ngOnInit() {
    }

    public trainmodel() {
        this.irisService.trainModel(this.svcParameters).subscribe((svcResult) => {
            this.svcResult = svcResult;
        });
    }

    public predictIris() {
        this.irisService.predictIris(this.iris).subscribe((probabilityPredictions) => {
            this.probabilityPredictions = probabilityPredictions;
        });
    }

    // TODO @Thomas added this
    public onFileChanged(event) {
        var files = event.target.files; //FileList object
        for (var i = 0; i < files.length; i++) {
             var file = files[i];
             this.irisService.sendImage(file);
         }
    }

    public imageIsLoaded = function(e){
        this.apply(function() {
            this.stepsModel.push(e.target.result);
        });
    }

}
