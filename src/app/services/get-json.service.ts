import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GetJsonService {
  constructor(private http: HttpClient) {
    }

  public getJSON(): Observable<any> {
      return this.http.get("../assets/newsFile.json")
                .catch(this.handleError);
}

private handleError (error: any) {
// In some advance version we can include a remote logging of errors
const errMsg = (error.message) ? error.message :
error.status ? `${error.status} - ${error.statusText}` : 'Server error';
 console.error(errMsg); // Right now we are logging to console itself
  return Observable.throw(errMsg);
  }
}

