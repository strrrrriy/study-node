import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
    private toketKey = 'token';
    public userName$ = new BehaviorSubject<string>(this.getUserName())
    constructor(private http:HttpClient, private router: Router){ }
    public getUserName(): string {
      return "";
    }
}
