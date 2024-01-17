import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class UrlConstants {
    baseURL = environment.baseUrl;

    googleTokenVerify = 'google_token/'
}